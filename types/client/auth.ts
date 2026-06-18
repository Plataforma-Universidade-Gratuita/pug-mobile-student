export interface PugJwtPayload {
	upn: string;
	groups: ("ADMIN" | "PARTNER" | "FORMER_STUDENT" | "STAFF" | "STUDENT")[];
	accountId: string;
	userId: string;
	iat: number;
	exp: number;
}

export interface AdminTokenValidationResult {
	isValid: boolean;
	payload?: PugJwtPayload;
}

export interface StudentTokenValidationResult {
	isValid: boolean;
	payload?: PugJwtPayload;
}

export interface StoredSessionTokens {
	accessToken: string;
	refreshToken: string;
}

export interface LoginFormValues {
	email: string;
	password: string | null;
}

export interface WireCredentialsFormValues {
	email: string;
	password: string | null;
	confirmPassword: string;
}
