import type { LoginRequest } from "@/types/api";
import type { PugJwtPayload, StoredSessionTokens } from "@/types/client/auth";
import type {
	AppResolvedTheme,
	AppTheme,
	ResolvedThemeMode,
} from "@/types/client/theme";

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
