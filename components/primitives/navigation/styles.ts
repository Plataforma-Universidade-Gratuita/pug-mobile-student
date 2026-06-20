import { StyleSheet } from "react-native";

import type { AppResolvedTheme, PrimitiveSurfaceStyleSpec } from "@/types/client";

export function createStyles(
	theme: AppResolvedTheme,
	spec: PrimitiveSurfaceStyleSpec,
) {
	return StyleSheet.create({
		sheetModal: {
			flex: 1,
			justifyContent: "flex-end",
			margin: 0,
			padding: theme.space[4],
		},
		sheetSurface: {
			gap: theme.space[4],
			padding: spec.panelPadding,
			borderWidth: 1,
			borderRadius: spec.panelRadius,
			...theme.shadow.lg,
		},
		sheetHeader: {
			gap: theme.space[1],
		},
		sheetFooter: {
			marginTop: theme.space[2],
		},
		modalScreen: {
			flex: 1,
		},
		modalContent: {
			flex: 1,
			paddingHorizontal: theme.layout.screenPadding,
			paddingTop: theme.space[6],
			paddingBottom: theme.space[5],
			gap: theme.space[5],
		},
		modalHeaderRow: {
			flexDirection: "row",
			alignItems: "flex-start",
			gap: theme.space[3],
		},
		modalHeaderCopy: {
			flex: 1,
			gap: theme.space[1],
		},
		modalActionSlot: {
			minWidth: 40,
			alignItems: "flex-end",
		},
		modalBody: {
			flex: 1,
		},
		modalFooter: {
			paddingHorizontal: theme.layout.screenPadding,
			paddingBottom: theme.space[6],
		},
	});
}
