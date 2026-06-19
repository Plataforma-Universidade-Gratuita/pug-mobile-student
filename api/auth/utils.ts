import { Platform } from "react-native";
import { z } from "zod";
import { ACCESS_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from "@/constants";
import { RefreshRequestSchema, TokenResponseSchema } from "@/schemas/api";
import type { TokenResponse } from "@/types/api";
import type {
	ApiSessionProvider,
	AuthenticatedApiRequestOptions,
} from "@/types/client";

import {
    API_ROUTE_BASES,
    parseApiErrorResponse,
    apiFetch,
    buildApiHeaders,
    buildApiUrl,
    parseApiData,
    parseApiVoid,
    resolveApiLocale, }
from "@/api";
import { SECURE_STORE_MODULE_NAME } from "./constants";

type SecureStoreModule = {
	getItemAsync(key: string): Promise<string | null>;
	setItemAsync(key: string, value: string): Promise<void>;
	deleteItemAsync(key: string): Promise<void>;
};

const memoryStorage = new Map<string, string>();

async function getSecureStore(): Promise<SecureStoreModule | null> {
	if (Platform.OS === "web") {
		return null;
	}

	try {
		const module = await import(SECURE_STORE_MODULE_NAME);
		const secureStore = "default" in module ? module.default : module;

		if (
			secureStore &&
			typeof secureStore.getItemAsync === "function" &&
			typeof secureStore.setItemAsync === "function" &&
			typeof secureStore.deleteItemAsync === "function"
		) {
			return secureStore as SecureStoreModule;
		}
	} catch {
		// Ignore secure store availability failures and fall back.
	}

	return null;
}

function hasWebStorage() {
	return (
		typeof window !== "undefined" && typeof window.localStorage !== "undefined"
	);
}

async function getStoredValue(key: string): Promise<string | null> {
	const secureStore = await getSecureStore();
	if (secureStore) {
		return secureStore.getItemAsync(key);
	}

	if (hasWebStorage()) {
		return window.localStorage.getItem(key);
	}

	return memoryStorage.get(key) ?? null;
}

async function setStoredValue(key: string, value: string): Promise<void> {
	const secureStore = await getSecureStore();
	if (secureStore) {
		await secureStore.setItemAsync(key, value);
		return;
	}

	if (hasWebStorage()) {
		window.localStorage.setItem(key, value);
		return;
	}

	memoryStorage.set(key, value);
}

async function removeStoredValue(key: string): Promise<void> {
	const secureStore = await getSecureStore();
	if (secureStore) {
		await secureStore.deleteItemAsync(key);
		return;
	}

	if (hasWebStorage()) {
		window.localStorage.removeItem(key);
		return;
	}

	memoryStorage.delete(key);
}

function createDefaultSessionProvider(): ApiSessionProvider {
	return {
		getAccessToken: () => getStoredValue(ACCESS_TOKEN_STORAGE_KEY),
		getRefreshToken: () => getStoredValue(REFRESH_TOKEN_STORAGE_KEY),
		persistSession: async tokens => {
			await Promise.all([
				setStoredValue(ACCESS_TOKEN_STORAGE_KEY, tokens.token),
				setStoredValue(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken),
			]);
		},
		clearSession: async () => {
			await Promise.all([
				removeStoredValue(ACCESS_TOKEN_STORAGE_KEY),
				removeStoredValue(REFRESH_TOKEN_STORAGE_KEY),
			]);
		},
		onSessionInvalidated: () => undefined,
	};
}

let sessionProvider: ApiSessionProvider = createDefaultSessionProvider();
let refreshPromise: Promise<TokenResponse | null> | null = null;

export function configureApiSessionProvider(provider: ApiSessionProvider | null) {
	sessionProvider = provider ?? createDefaultSessionProvider();
}

export function getApiSessionProvider() {
	return sessionProvider;
}

async function invalidateSession() {
	await sessionProvider.clearSession();
	await sessionProvider.onSessionInvalidated();
}

async function refreshSession(): Promise<TokenResponse | null> {
	if (refreshPromise) {
		return refreshPromise;
	}

	refreshPromise = (async () => {
		const refreshToken = await sessionProvider.getRefreshToken();
		if (!refreshToken) {
			await invalidateSession();
			return null;
		}

		try {
			const tokens = await apiFetch(
				`${API_ROUTE_BASES.identity.auth}/refresh`,
				TokenResponseSchema,
				{
					method: "POST",
					body: JSON.stringify(
						RefreshRequestSchema.parse({ refreshToken }),
					),
				},
			);
			await sessionProvider.persistSession(tokens);
			return tokens;
		} catch {
			await invalidateSession();
			return null;
		} finally {
			refreshPromise = null;
		}
	})();

	return refreshPromise;
}

async function requestWithAuthRetry(
	path: string,
	options: AuthenticatedApiRequestOptions = {},
): Promise<Response> {
	const accessToken = await sessionProvider.getAccessToken();
	const firstRequestHeaders = buildApiHeaders({
		...(options.headers ? { headers: options.headers } : {}),
		...(options.locale ? { locale: resolveApiLocale(options.locale) } : {}),
		...(accessToken ? { authToken: accessToken } : {}),
	});
	const firstResponse = await fetch(buildApiUrl(path), {
		...options,
		headers: firstRequestHeaders,
	});

	if (firstResponse.ok) {
		return firstResponse;
	}

	if (
		options.skipAuthRetry ||
		(firstResponse.status !== 401 && firstResponse.status !== 403)
	) {
		return parseApiErrorResponse(firstResponse);
	}

	const refreshedTokens = await refreshSession();
	if (!refreshedTokens?.token) {
		return parseApiErrorResponse(firstResponse);
	}

	const retryRequestHeaders = buildApiHeaders({
		...(options.headers ? { headers: options.headers } : {}),
		...(options.locale ? { locale: resolveApiLocale(options.locale) } : {}),
		authToken: refreshedTokens.token,
	});
	const retryResponse = await fetch(buildApiUrl(path), {
		...options,
		headers: retryRequestHeaders,
	});

	if (!retryResponse.ok) {
		return parseApiErrorResponse(retryResponse);
	}

	return retryResponse;
}

export async function authFetch<TSchema extends z.ZodTypeAny>(
	path: string,
	schema: TSchema,
	options: AuthenticatedApiRequestOptions = {},
): Promise<z.infer<TSchema>> {
	const response = await requestWithAuthRetry(path, options);
	return parseApiData(response, schema);
}

export async function authVoid(
	path: string,
	options: AuthenticatedApiRequestOptions = {},
): Promise<void> {
	const response = await requestWithAuthRetry(path, options);
	await parseApiVoid(response);
}

export async function clearApiSession() {
	await sessionProvider.clearSession();
}

