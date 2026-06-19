import * as api from "@/api";

const { ApiError } = api;

export function validateCredentialPassword(value: string) {
	return validateCredentialPasswordWithMessages(value, {
		required: "Password is required.",
		minLength: "Password must have at least 8 characters.",
	});
}

export function validateCredentialPasswordWithMessages(
	value: string,
	messages: { required: string; minLength: string },
) {
	const normalizedValue = value.trim();

	if (!normalizedValue) {
		return messages.required;
	}

	if (normalizedValue.length < 8) {
		return messages.minLength;
	}

	return null;
}

export function validateCredentialConfirmation(
	password: string,
	confirmation: string,
) {
	return validateCredentialConfirmationWithMessages(password, confirmation, {
		required: "Confirm your password.",
		mismatch: "Passwords do not match.",
	});
}

export function validateCredentialConfirmationWithMessages(
	password: string,
	confirmation: string,
	messages: { required: string; mismatch: string },
) {
	if (!confirmation.trim()) {
		return messages.required;
	}

	if (password.trim() !== confirmation.trim()) {
		return messages.mismatch;
	}

	return null;
}

export function resolveWireCredentialsErrorMessage(error: unknown) {
	return resolveWireCredentialsErrorMessageWithFallback(
		error,
		"Unable to finish setup right now. Try again in a moment.",
	);
}

export function resolveWireCredentialsErrorMessageWithFallback(
	error: unknown,
	fallback: string,
) {
	if (error instanceof ApiError) {
		return error.message;
	}

	if (error instanceof Error && error.message) {
		return error.message;
	}

	return fallback;
}
