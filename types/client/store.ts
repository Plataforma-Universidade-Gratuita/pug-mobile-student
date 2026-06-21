import type { LoginRequest, TokenResponse } from "@/types/api";

import type { PugJwtPayload, StoredSessionTokens } from "./auth";
import type { AppLang } from "./context";
import type { AppResolvedTheme, AppTheme, ResolvedThemeMode } from "./theme";

export interface AuthStoreState {
	isAuthenticated: boolean;
	isBootstrapping: boolean;
	isMutatingSession: boolean;
	requiresCredentialSetup: boolean;
	accessToken: string | null;
	refreshToken: string | null;
	sessionPayload: PugJwtPayload | null;
	bootstrapSession: () => Promise<boolean>;
	refreshSession: () => Promise<TokenResponse>;
	signIn: (credentials: LoginRequest) => Promise<TokenResponse>;
	signOut: () => Promise<void>;
	signOutAll: () => Promise<void>;
	setSession: (tokens: StoredSessionTokens, payload: PugJwtPayload) => void;
	setRequiresCredentialSetup: (value: boolean) => void;
	clearSessionState: () => void;
}

export interface ThemeStoreState {
	mode: AppTheme;
	systemMode: ResolvedThemeMode;
	resolvedMode: ResolvedThemeMode;
	theme: AppResolvedTheme;
	isHydrated: boolean;
	hydrateTheme: () => Promise<void>;
	setMode: (mode: AppTheme) => Promise<void>;
	setSystemMode: (mode: ResolvedThemeMode) => void;
}

export interface LocaleStoreState {
	language: AppLang;
	isHydrated: boolean;
	hydrateLanguage: () => Promise<void>;
	setLanguage: (language: AppLang) => Promise<void>;
}
