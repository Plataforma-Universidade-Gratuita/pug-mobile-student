import { jwtDecode } from "jwt-decode";

import { API_ROUTE_BASES, USE_INTERNAL_MOCK } from "@/api/constants";
import { AuthRoutes } from "@/mock";
import { TokenResponseSchema } from "@/schemas/api";
import type {
	CredentialsRequest,
	LoginRequest,
	LogoutRequest,
	RefreshRequest,
	TokenResponse,
} from "@/types/api";
import type { PugJwtPayload } from "@/types/client";
import { apiFetch, authVoid, getApiSessionProvider } from "@/api/utils";

async function getCurrentAccountId(): Promise<string> {
	const accessToken = await getApiSessionProvider().getAccessToken();

	if (!accessToken) {
		throw new Error("Missing access token.");
	}

	try {
		const payload = jwtDecode<PugJwtPayload>(accessToken);

		if (!payload.accountId) {
			throw new Error("Missing accountId.");
		}

		return payload.accountId;
	} catch {
		throw new Error("Unable to resolve current account.");
	}
}

export async function login(body: LoginRequest): Promise<TokenResponse> {
	if (USE_INTERNAL_MOCK) {
		return AuthRoutes.login(body);
	}

	return apiFetch(
		`${API_ROUTE_BASES.identity.auth}/login`,
		TokenResponseSchema,
		{
			method: "POST",
			body: JSON.stringify(body),
		},
	);
}

export async function refresh(body: RefreshRequest): Promise<TokenResponse> {
	if (USE_INTERNAL_MOCK) {
		return AuthRoutes.refresh(body);
	}

	return apiFetch(
		`${API_ROUTE_BASES.identity.auth}/refresh`,
		TokenResponseSchema,
		{
			method: "POST",
			body: JSON.stringify(body),
		},
	);
}

export async function logout(body?: LogoutRequest): Promise<void> {
	if (USE_INTERNAL_MOCK) {
		await AuthRoutes.logout(body);
		return;
	}

	return authVoid(
		`${API_ROUTE_BASES.identity.auth}/logout`,
		body
			? {
					method: "POST",
					body: JSON.stringify(body),
				}
			: { method: "POST" },
	);
}

export async function logoutAll(): Promise<void> {
	if (USE_INTERNAL_MOCK) {
		const accountId = await getCurrentAccountId();
		await AuthRoutes.logoutAll(accountId);
		return;
	}

	return authVoid(`${API_ROUTE_BASES.identity.auth}/logout-all`, {
		method: "POST",
	});
}

export async function wireCredentials(body: CredentialsRequest): Promise<void> {
	if (USE_INTERNAL_MOCK) {
		const accountId = await getCurrentAccountId();
		await AuthRoutes.wireCredentials(accountId, body);
		return;
	}

	return authVoid(`${API_ROUTE_BASES.identity.auth}/wire-credentials`, {
		method: "POST",
		body: JSON.stringify(body),
	});
}
