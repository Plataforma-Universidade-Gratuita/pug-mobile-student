import { z } from "zod";

import type { AuthenticatedApiRequestOptions, ApiSessionProvider } from "@/types/client";

import {
	authFetch as authFetchInternal,
	authVoid as authVoidInternal,
	clearApiSession,
	configureApiSessionProvider,
	getApiSessionProvider,
} from "./utils";

export async function authFetch<TSchema extends z.ZodTypeAny>(
	path: string,
	schema: TSchema,
	options: AuthenticatedApiRequestOptions = {},
): Promise<z.infer<TSchema>> {
	return authFetchInternal(path, schema, options);
}

export async function authVoid(
	path: string,
	options: AuthenticatedApiRequestOptions = {},
): Promise<void> {
	return authVoidInternal(path, options);
}

export {
	clearApiSession,
	configureApiSessionProvider,
	getApiSessionProvider,
};


