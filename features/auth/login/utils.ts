import { ApiError } from "@/api";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeLoginEmail(value: string) {
	return value.trim().toLowerCase();
}

export function normalizeLoginPassword(value: string) {
	const normalizedValue = value.trim();

	return normalizedValue.length > 0 ? normalizedValue : null;
}

export function validateLoginEmail(value: string) {
	return validateLoginEmailWithMessages(value, {
		required: "Email is required.",
		invalid: "Enter a valid email address.",
	});
}

export function validateLoginEmailWithMessages(
	value: string,
	messages: { required: string; invalid: string },
) {
	const normalizedValue = normalizeLoginEmail(value);

	if (!normalizedValue) {
		return messages.required;
	}

	if (!EMAIL_PATTERN.test(normalizedValue)) {
		return messages.invalid;
	}

	return null;
}

export function resolveLoginErrorMessage(error: unknown) {
	return resolveLoginErrorMessageWithMessages(error, {
		invalidCredentials: "Email or password is incorrect.",
		fallback: "Unable to sign in right now. Try again in a moment.",
	});
}

export function resolveLoginErrorMessageWithMessages(
	error: unknown,
	messages: { invalidCredentials: string; fallback: string },
) {
	if (error instanceof ApiError) {
		if (error.status === 401) {
			return messages.invalidCredentials;
		}

		return error.message;
	}

	if (error instanceof Error && error.message) {
		return error.message;
	}

	return messages.fallback;
}
