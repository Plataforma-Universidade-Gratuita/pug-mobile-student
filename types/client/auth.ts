export interface PugJwtPayload {
	upn: string;
	groups: ("ADMIN" | "PARTNER" | "FORMER_STUDENT")[];
	accountId: string;
	userId: string;
	iat: number;
	exp: number;
}

export interface StudentTokenValidationResult {
	isValid: boolean;
	payload?: PugJwtPayload;
}

export interface StoredSessionTokens {
	accessToken: string;
	refreshToken: string;
}
