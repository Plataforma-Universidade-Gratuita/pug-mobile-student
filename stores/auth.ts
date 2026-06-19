import { create } from "zustand";

import * as api from "@/api";
import type { TokenResponse } from "@/types/api";
import type { AuthStoreState, StoredSessionTokens } from "@/types/client";
import { validateStudentToken } from "@/utils";

const {
	clearApiSession,
	configureApiSessionProvider,
	getApiSessionProvider,
	identity,
} = api;
const { auth: authApi } = identity;

function buildSessionState(tokens: StoredSessionTokens) {
	const validation = validateStudentToken(tokens.accessToken);

	if (!validation.isValid || !validation.payload) {
		return null;
	}

	return {
		accessToken: tokens.accessToken,
		refreshToken: tokens.refreshToken,
		sessionPayload: validation.payload,
		isAuthenticated: true,
	};
}

function toStoredSessionTokens(tokens: TokenResponse): StoredSessionTokens {
	return {
		accessToken: tokens.token,
		refreshToken: tokens.refreshToken,
	};
}

const baseSessionProvider = getApiSessionProvider();

let bootstrapPromise: Promise<boolean> | null = null;

export const useAuthStore = create<AuthStoreState>((set, get) => ({
	isAuthenticated: false,
	isBootstrapping: false,
	isMutatingSession: false,
	accessToken: null,
	refreshToken: null,
	sessionPayload: null,

	setSession: (tokens, payload) => {
		set({
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken,
			sessionPayload: payload,
			isAuthenticated: true,
		});
	},

	clearSessionState: () => {
		set({
			accessToken: null,
			refreshToken: null,
			sessionPayload: null,
			isAuthenticated: false,
		});
	},

	bootstrapSession: async () => {
		if (bootstrapPromise) {
			return bootstrapPromise;
		}

		bootstrapPromise = (async () => {
			set({ isBootstrapping: true });

			try {
				const [accessToken, refreshToken] = await Promise.all([
					baseSessionProvider.getAccessToken(),
					baseSessionProvider.getRefreshToken(),
				]);

				if (!accessToken || !refreshToken) {
					get().clearSessionState();
					return false;
				}

				const validStoredSession = buildSessionState({
					accessToken,
					refreshToken,
				});

				if (validStoredSession) {
					set(validStoredSession);
					return true;
				}

				const refreshedTokens = await authApi.refresh({ refreshToken });
				const refreshedSession = buildSessionState(
					toStoredSessionTokens(refreshedTokens),
				);

				if (!refreshedSession) {
					await clearApiSession();
					get().clearSessionState();
					return false;
				}

				await baseSessionProvider.persistSession(refreshedTokens);
				set(refreshedSession);
				return true;
			} catch {
				await clearApiSession();
				get().clearSessionState();
				return false;
			} finally {
				set({ isBootstrapping: false });
				bootstrapPromise = null;
			}
		})();

		return bootstrapPromise;
	},

	signIn: async credentials => {
		set({ isMutatingSession: true });

		try {
			const tokens = await authApi.login(credentials);
			const validation = validateStudentToken(tokens.token);

			if (!validation.isValid || !validation.payload) {
				await clearApiSession();
				get().clearSessionState();
				throw new Error("Received a non-student token during sign-in.");
			}

			await baseSessionProvider.persistSession(tokens);
			get().setSession(toStoredSessionTokens(tokens), validation.payload);
		} finally {
			set({ isMutatingSession: false });
		}
	},

	signOut: async () => {
		set({ isMutatingSession: true });

		try {
			const refreshToken =
				get().refreshToken ?? (await baseSessionProvider.getRefreshToken());

			if (refreshToken) {
				try {
					await authApi.logout({ refreshToken });
				} catch {
					// Local session clearing still needs to complete even if the remote logout fails.
				}
			}

			await clearApiSession();
			get().clearSessionState();
		} finally {
			set({ isMutatingSession: false });
		}
	},
}));

configureApiSessionProvider({
	...baseSessionProvider,
	clearSession: async () => {
		await baseSessionProvider.clearSession();
		useAuthStore.getState().clearSessionState();
	},
	onSessionInvalidated: async () => {
		await baseSessionProvider.onSessionInvalidated();
		useAuthStore.getState().clearSessionState();
	},
	persistSession: async tokens => {
		await baseSessionProvider.persistSession(tokens);

		const validation = validateStudentToken(tokens.token);
		if (!validation.isValid || !validation.payload) {
			return;
		}

		useAuthStore
			.getState()
			.setSession(toStoredSessionTokens(tokens), validation.payload);
	},
});
