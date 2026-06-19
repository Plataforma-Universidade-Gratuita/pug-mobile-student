import i18n from "i18next";
import { z } from "zod";

import { DEFAULT_LANG } from "@/constants";
import { createApiSuccessEnvelopeSchema } from "@/schemas/api";
import type {
	ApiRequestOptions,
	PrimitiveHeaderValue,
} from "@/types/client";

import { API_BASE_URL, JSON_HEADERS } from "./constants";
import { ApiError, parseApiErrorResponse } from "./errors";

function normalizeHeaders(headers?: HeadersInit): Record<string, string> {
	if (!headers) {
		return {};
	}

	if (headers instanceof Headers) {
		return Object.fromEntries(headers.entries());
	}

	if (Array.isArray(headers)) {
		return Object.fromEntries(headers);
	}

	return Object.fromEntries(
		Object.entries(headers)
			.filter(([, value]) => value != null)
			.map(([key, value]) => [key, String(value as PrimitiveHeaderValue)]),
	);
}

export function qs(params: Record<string, string | undefined | null>): string {
	const entries = Object.entries(params).filter(
		(entry): entry is [string, string] => entry[1] != null && entry[1] !== "",
	);
	if (entries.length === 0) return "";
	return "?" + new URLSearchParams(entries).toString();
}

export function resolveApiLocale(explicitLocale?: string): string {
	return explicitLocale ?? i18n.resolvedLanguage ?? i18n.language ?? DEFAULT_LANG;
}

export function buildApiUrl(path: string): string {
	if (/^https?:\/\//.test(path)) {
		return path;
	}

	return `${API_BASE_URL}${path}`;
}

export function buildApiHeaders(options: {
	headers?: HeadersInit;
	locale?: string;
	authToken?: string | null;
} = {}): Record<string, string> {
	const headers = {
		...JSON_HEADERS,
		...normalizeHeaders(options.headers),
	};
	const locale = resolveApiLocale(options.locale);
	if (locale) {
		headers["Accept-Language"] = locale;
	}
	if (options.authToken) {
		headers.Authorization = `Bearer ${options.authToken}`;
	}
	return headers;
}

export async function executeApiRequest(
	path: string,
	options: ApiRequestOptions = {},
): Promise<Response> {
	const response = await fetch(buildApiUrl(path), {
		...options,
		headers: buildApiHeaders(options),
	});

	if (!response.ok) {
		return parseApiErrorResponse(response);
	}

	return response;
}

export async function parseApiData<T extends z.ZodTypeAny>(
	response: Response,
	schema: T,
): Promise<z.infer<T>> {
	const json = await response.json();
	const envelope = createApiSuccessEnvelopeSchema(schema).parse(json) as {
		data: z.infer<T>;
	};
	return envelope.data;
}

export async function parseApiVoid(response: Response): Promise<void> {
	if (response.status === 204) {
		return;
	}

	const text = await response.text();
	if (!text.trim()) {
		return;
	}

	try {
		const json = JSON.parse(text) as unknown;
		const envelopeResult = createApiSuccessEnvelopeSchema(z.unknown()).safeParse(json);
		if (envelopeResult.success) {
			return;
		}
	} catch {
		// Ignore unexpected success bodies for void requests.
	}
}

export async function apiFetch<T extends z.ZodTypeAny>(
	path: string,
	schema: T,
	options: ApiRequestOptions = {},
): Promise<z.infer<T>> {
	const response = await executeApiRequest(path, options);
	return parseApiData(response, schema);
}

export async function apiVoid(
	path: string,
	options: ApiRequestOptions = {},
): Promise<void> {
	const response = await executeApiRequest(path, options);
	await parseApiVoid(response);
}

export { ApiError };
export const zfetch = apiFetch;
export const zvoid = apiVoid;


