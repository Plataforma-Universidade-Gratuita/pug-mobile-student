import type { TokenResponse } from "@/types/api";

export interface ApiSessionProvider {
	getAccessToken(): Promise<string | null>;
	getRefreshToken(): Promise<string | null>;
	persistSession(tokens: TokenResponse): Promise<void>;
	clearSession(): Promise<void>;
	onSessionInvalidated(): Promise<void> | void;
}

export interface AuthenticatedApiRequestOptions
	extends Omit<RequestInit, "headers"> {
	headers?: HeadersInit;
	locale?: string;
	skipAuthRetry?: boolean;
}
