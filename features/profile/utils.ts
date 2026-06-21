import { PROFILE_AVATAR_FALLBACK } from "./constants";

export function getInitials(name: string | null | undefined) {
	if (!name) {
		return PROFILE_AVATAR_FALLBACK;
	}

	const segments = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);

	if (segments.length === 0) {
		return PROFILE_AVATAR_FALLBACK;
	}

	return segments.map(segment => segment[0]?.toUpperCase() ?? "").join("");
}

export function resolveProfileFieldValue(
	value: string | null | undefined,
	isPending: boolean,
	loadingLabel: string,
	unavailableLabel: string,
) {
	if (value && value.trim().length > 0) {
		return value.trim();
	}

	return isPending ? loadingLabel : unavailableLabel;
}
