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
	const normalizedValue = normalizeLoginEmail(value);

	if (!normalizedValue) {
		return "Email is required.";
	}

	if (!EMAIL_PATTERN.test(normalizedValue)) {
		return "Enter a valid email address.";
	}

	return null;
}

export function resolveLoginErrorMessage(error: unknown) {
	if (error instanceof ApiError) {
		if (error.status === 401) {
			return "Email or password is incorrect.";
		}

		return error.message;
	}

	if (error instanceof Error && error.message) {
		return error.message;
	}

	return "Unable to sign in right now. Try again in a moment.";
}
