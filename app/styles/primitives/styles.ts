import type {
	AppResolvedTheme,
	PrimitiveFormStyleSpec,
	PrimitiveSurfaceStyleSpec,
} from "@/types/client";

export function createPrimitiveSurfaceStyleSpec(
	theme: AppResolvedTheme,
): PrimitiveSurfaceStyleSpec {
	const isDark = theme.mode === "dark";

	return {
		screenBackground: theme.colors.surface1,
		screenGlow: isDark
			? "rgba(175, 78, 93, 0.16)"
			: "rgba(155, 34, 52, 0.1)",
		panelBackground: isDark
			? "rgba(23, 19, 27, 0.96)"
			: "rgba(255, 255, 255, 0.92)",
		panelBorder: isDark ? "rgba(255, 255, 255, 0.08)" : theme.colors.border2,
		panelRadius: theme.surface.panelRadius,
		panelPadding: theme.surface.panelPadding,
	};
}

export function createPrimitiveFormStyleSpec(
	theme: AppResolvedTheme,
): PrimitiveFormStyleSpec {
	const isDark = theme.mode === "dark";

	return {
		formMaxWidth: theme.form.formMaxWidth,
		headerGap: theme.form.headerGap,
		formGap: theme.form.formGap,
		fieldGap: theme.form.fieldGap,
		titleSize: theme.type.xxxl,
		titleLineHeight: theme.type.xxxl * 1.05,
		subtitleSize: theme.type.md,
		subtitleLineHeight: theme.type.md * theme.lineHeight.normal,
		labelText: theme.colors.muted,
		helperText: theme.colors.muted,
		inputBackground: isDark ? "rgba(255, 255, 255, 0.04)" : theme.colors.surface3,
		inputBorder: isDark ? "rgba(255, 255, 255, 0.08)" : theme.colors.border2,
		inputText: theme.colors.text,
		inputPlaceholder: isDark ? "#96939d" : "#7a7f88",
		inputRadius: theme.form.controlRadius,
		inputHeight: theme.form.controlHeight,
		buttonHeight: theme.form.buttonHeight,
		buttonRadius: theme.form.controlRadius,
		buttonShadowColor: theme.colors.brand,
		buttonShadowOpacity: isDark ? 0.34 : 0.22,
		textActionColor: isDark ? "#f2d0d6" : theme.colors.brand,
		badgeHeight: theme.form.badgeHeight,
		badgeBackground: isDark
			? "rgba(175, 78, 93, 0.12)"
			: "rgba(155, 34, 52, 0.1)",
		badgeText: isDark ? "#f1d1d7" : theme.colors.brand,
	};
}
