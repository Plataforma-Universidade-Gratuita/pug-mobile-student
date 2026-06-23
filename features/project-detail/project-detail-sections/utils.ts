import type { AppResolvedTheme, PrimitiveSurfaceStyleSpec } from "@/types/client";
import { withAlpha } from "@/utils";

export function createExitProjectOptionStyle(
	theme: AppResolvedTheme,
	isBusy: boolean,
	pressed: boolean,
) {
	return {
		backgroundColor: pressed
			? withAlpha(theme.colors.danger, theme.mode === "dark" ? 0.24 : 0.18)
			: withAlpha(theme.colors.danger, theme.mode === "dark" ? 0.16 : 0.12),
		borderColor: withAlpha(
			theme.colors.danger,
			theme.mode === "dark" ? 0.28 : 0.2,
		),
		opacity: isBusy ? 0.6 : 1,
	};
}

export function createCloseSheetOptionStyle(
	theme: AppResolvedTheme,
	spec: PrimitiveSurfaceStyleSpec,
	isBusy: boolean,
	pressed: boolean,
) {
	return {
		backgroundColor: pressed
			? withAlpha(theme.colors.text, theme.mode === "dark" ? 0.08 : 0.04)
			: theme.colors.surface3,
		borderColor: spec.panelBorder,
		opacity: isBusy ? 0.6 : 1,
	};
}
