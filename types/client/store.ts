import type { LoginRequest } from "@/types/api";

import type { PugJwtPayload, StoredSessionTokens } from "./auth";

export interface AuthStoreState {
	isAuthenticated: boolean;
	isBootstrapping: boolean;
	isMutatingSession: boolean;
	accessToken: string | null;
	refreshToken: string | null;
	sessionPayload: PugJwtPayload | null;
	bootstrapSession: () => Promise<boolean>;
	signIn: (credentials: LoginRequest) => Promise<void>;
	signOut: () => Promise<void>;
	setSession: (tokens: StoredSessionTokens, payload: PugJwtPayload) => void;
	clearSessionState: () => void;
}
