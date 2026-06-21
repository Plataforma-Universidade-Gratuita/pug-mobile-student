import { StyleSheet } from "react-native";

import type {
	AppResolvedTheme,
	PrimitiveSurfaceStyleSpec,
} from "@/types/client";

export function createStyles(
	theme: AppResolvedTheme,
	spec: PrimitiveSurfaceStyleSpec,
) {
	return StyleSheet.create({
		screen: {
			flex: 1,
			backgroundColor: spec.screenBackground,
		},
		content: {
			paddingHorizontal: theme.layout.screenPadding,
			paddingTop: theme.space[5],
		},
		shell: {
			gap: theme.space[4],
		},
		summaryCard: {
			gap: theme.space[3],
			padding: spec.panelPadding,
			borderWidth: 1,
			borderRadius: spec.panelRadius,
			...theme.shadow.sm,
		},
		summaryTop: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			gap: theme.space[2],
		},
		summaryCopy: {
			gap: theme.space[1],
		},
		summaryTitle: {
			fontSize: theme.type.lg,
			lineHeight: theme.type.lg * theme.lineHeight.tight,
		},
		projectList: {
			gap: theme.space[3],
		},
		stateCard: {
			gap: theme.space[2],
			padding: spec.panelPadding,
			borderWidth: 1,
			borderRadius: spec.panelRadius,
			...theme.shadow.sm,
		},
		stateBadge: {
			alignSelf: "flex-start",
		},
		stateBody: {
			gap: theme.space[1],
		},
	});
}
