import { create } from "zustand";

import * as api from "@/api";
import { AuthRoutes } from "@/mock";
import type { TokenResponse } from "@/types/api";
import type { AuthStoreState, StoredSessionTokens } from "@/types/client";
import { validateFormerStudentToken } from "@/utils";

const { clearApiSession, configureApiSessionProvider, getApiSessionProvider } =
	api;

function buildSessionState(
	tokens: StoredSessionTokens,
	requiresCredentialSetup: boolean,
) {
	const validation = validateFormerStudentToken(tokens.accessToken);

	if (!validation.isValid || !validation.payload) {
		return null;
	}

	return {
		accessToken: tokens.accessToken,
		refreshToken: tokens.refreshToken,
		sessionPayload: validation.payload,
		isAuthenticated: true,
		requiresCredentialSetup,
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
	requiresCredentialSetup: false,
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

	setRequiresCredentialSetup: value => {
		set({ requiresCredentialSetup: value });
	},

	clearSessionState: () => {
		set({
			accessToken: null,
			refreshToken: null,
			sessionPayload: null,
			isAuthenticated: false,
			requiresCredentialSetup: false,
		});
	},

	bootstrapSession: async () => {
		if (bootstrapPromise) {
			return bootstrapPromise;
		}

		bootstrapPromise = (async () => {
			set({ isBootstrapping: true });

			try {
				const [accessToken, refreshToken, requiresCredentialSetup] =
					await Promise.all([
						baseSessionProvider.getAccessToken(),
						baseSessionProvider.getRefreshToken(),
						baseSessionProvider.getRequiresCredentialSetup(),
					]);

				if (!accessToken || !refreshToken) {
					get().clearSessionState();
					return false;
				}

				const validStoredSession = buildSessionState(
					{
						accessToken,
						refreshToken,
					},
					requiresCredentialSetup ?? false,
				);

				if (validStoredSession && requiresCredentialSetup !== null) {
					set(validStoredSession);
					return true;
				}

				const refreshedTokens = await AuthRoutes.refresh({ refreshToken });
				const refreshedSession = buildSessionState(
					toStoredSessionTokens(refreshedTokens),
					!refreshedTokens.passwordWired,
				);

				if (!refreshedSession) {
					await clearApiSession();
					get().clearSessionState();
					return false;
				}

				await baseSessionProvider.persistSession(refreshedTokens);
				set(refreshedSession);
				get().setRequiresCredentialSetup(!refreshedTokens.passwordWired);
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
			const tokens = await AuthRoutes.login(credentials);
			const validation = validateFormerStudentToken(tokens.token);

			if (!validation.isValid || !validation.payload) {
				await clearApiSession();
				get().clearSessionState();
				throw new Error("Received a non-former-student token during sign-in.");
			}

			await baseSessionProvider.persistSession(tokens);
			get().setSession(toStoredSessionTokens(tokens), validation.payload);
			get().setRequiresCredentialSetup(!tokens.passwordWired);
			return tokens;
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
					await AuthRoutes.logout({ refreshToken });
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

		const validation = validateFormerStudentToken(tokens.token);
		if (!validation.isValid || !validation.payload) {
			return;
		}

		useAuthStore
			.getState()
			.setSession(toStoredSessionTokens(tokens), validation.payload);
		useAuthStore.getState().setRequiresCredentialSetup(!tokens.passwordWired);
	},
});
