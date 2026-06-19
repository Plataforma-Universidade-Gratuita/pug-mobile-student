import * as api from "@/api";

const { ApiError } = api;

export function validateCredentialPassword(value: string) {
	const normalizedValue = value.trim();

	if (!normalizedValue) {
		return "Password is required.";
	}

	if (normalizedValue.length < 8) {
		return "Password must have at least 8 characters.";
	}

	return null;
}

export function validateCredentialConfirmation(
	password: string,
	confirmation: string,
) {
	if (!confirmation.trim()) {
		return "Confirm your password.";
	}

	if (password.trim() !== confirmation.trim()) {
		return "Passwords do not match.";
	}

	return null;
}

export function resolveWireCredentialsErrorMessage(error: unknown) {
	if (error instanceof ApiError) {
		return error.message;
	}

	if (error instanceof Error && error.message) {
		return error.message;
	}

	return "Unable to finish setup right now. Try again in a moment.";
}
