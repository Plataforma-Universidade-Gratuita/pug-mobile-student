import type { ChipProps } from "react-native-paper";

import type {
	AppResolvedTheme,
	PrimitiveBadgeProps,
	PrimitiveFormStyleSpec,
} from "@/types/client";

export function resolveBadgeMode(
	variant: NonNullable<PrimitiveBadgeProps["variant"]>,
): NonNullable<ChipProps["mode"]> {
	return variant === "secondary" ? "outlined" : "flat";
}

export function resolveBadgeColors(
	tone: NonNullable<PrimitiveBadgeProps["tone"]>,
	variant: NonNullable<PrimitiveBadgeProps["variant"]>,
	theme: AppResolvedTheme,
	spec: PrimitiveFormStyleSpec,
) {
	const palette = {
		neutral: {
			primaryBackground: theme.colors.surface3,
			primaryText: theme.colors.text,
			secondaryBorder: theme.colors.border2,
			secondaryText: theme.colors.muted,
		},
		brand: {
			primaryBackground: spec.badgeBackground,
			primaryText: spec.badgeText,
			secondaryBorder: theme.colors.brand,
			secondaryText: theme.colors.brand,
		},
		success: {
			primaryBackground:
				theme.mode === "dark"
					? "rgba(70, 167, 88, 0.18)"
					: "rgba(70, 167, 88, 0.12)",
			primaryText: theme.colors.success,
			secondaryBorder: theme.colors.success,
			secondaryText: theme.colors.success,
		},
		info: {
			primaryBackground:
				theme.mode === "dark"
					? "rgba(0, 144, 255, 0.18)"
					: "rgba(0, 144, 255, 0.12)",
			primaryText: theme.colors.info,
			secondaryBorder: theme.colors.info,
			secondaryText: theme.colors.info,
		},
		warning: {
			primaryBackground:
				theme.mode === "dark"
					? "rgba(255, 197, 61, 0.18)"
					: "rgba(255, 197, 61, 0.16)",
			primaryText: theme.mode === "dark" ? "#f6d98f" : "#8a6200",
			secondaryBorder: theme.colors.warning,
			secondaryText: theme.mode === "dark" ? "#f6d98f" : "#8a6200",
		},
		danger: {
			primaryBackground:
				theme.mode === "dark"
					? "rgba(229, 72, 77, 0.18)"
					: "rgba(229, 72, 77, 0.12)",
			primaryText: theme.colors.danger,
			secondaryBorder: theme.colors.danger,
			secondaryText: theme.colors.danger,
		},
	} as const;

	const selected = palette[tone];

	if (variant === "secondary") {
		return {
			backgroundColor: "transparent",
			borderColor: selected.secondaryBorder,
			textColor: selected.secondaryText,
		};
	}

	return {
		backgroundColor: selected.primaryBackground,
		borderColor: "transparent",
		textColor: selected.primaryText,
	};
}
