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
		},
		content: {
			paddingHorizontal: theme.layout.screenPadding,
			paddingTop: theme.space[5],
			paddingBottom: theme.space[8] + 88,
			alignItems: "center",
		},
		shell: {
			width: "100%",
			maxWidth: theme.layout.contentMaxWidth,
			gap: theme.space[4],
		},
		identityCard: {
			gap: theme.space[4],
			padding: spec.panelPadding,
			borderWidth: 1,
			borderRadius: spec.panelRadius,
			...theme.shadow.md,
		},
		identityTop: {
			flexDirection: "row",
			alignItems: "flex-start",
			gap: theme.space[3],
		},
		identityCopy: {
			flex: 1,
			gap: theme.space[2],
		},
		identityBadge: {
			alignSelf: "flex-start",
		},
		identityName: {
			fontSize: theme.type.xxl,
			lineHeight: theme.type.xxl * theme.lineHeight.tight,
		},
		avatarBadge: {
			width: 72,
			height: 72,
			borderRadius: theme.radius.xl,
			borderWidth: 1,
			alignItems: "center",
			justifyContent: "center",
		},
		avatarText: {
			fontSize: theme.type.lg,
			lineHeight: theme.type.lg * theme.lineHeight.tight,
		},
		section: {
			gap: theme.space[3],
			padding: spec.panelPadding,
			borderWidth: 1,
			borderRadius: theme.radius.xl,
			...theme.shadow.sm,
		},
		sectionHeader: {
			gap: theme.space[1],
		},
		rows: {
			gap: theme.space[1],
		},
		row: {
			flexDirection: "row",
			alignItems: "flex-start",
			justifyContent: "space-between",
			gap: theme.space[3],
			paddingVertical: theme.space[3],
		},
		rowDivider: {
			borderTopWidth: 1,
		},
		rowCopy: {
			flex: 1,
			gap: theme.space[1],
		},
		rowValue: {
			fontSize: theme.type.md,
			lineHeight: theme.type.md * theme.lineHeight.normal,
		},
		rowAccessory: {
			alignItems: "flex-end",
			justifyContent: "center",
		},
		selector: {
			flexDirection: "row",
			alignItems: "center",
			alignSelf: "flex-start",
			gap: theme.space[1],
			padding: 4,
			borderWidth: 1,
			borderRadius: theme.radius.circle,
		},
		selectorOption: {
			minWidth: 78,
			height: 36,
			paddingHorizontal: theme.space[3],
			borderRadius: theme.radius.circle,
			alignItems: "center",
			justifyContent: "center",
		},
		selectorOptionCompact: {
			minWidth: 84,
		},
		logoutTrigger: {
			minHeight: 54,
			paddingHorizontal: theme.space[4],
			borderRadius: theme.radius.lg,
			alignItems: "center",
			justifyContent: "center",
			...theme.shadow.sm,
		},
		sheetContent: {
			gap: theme.space[4],
		},
		sheetHeader: {
			gap: theme.space[1],
		},
		sheetOptions: {
			gap: theme.space[2],
		},
		logoutOption: {
			gap: theme.space[1],
			padding: theme.space[4],
			borderWidth: 1,
			borderRadius: theme.radius.xl,
		},
		logoutOptionCopy: {
			flex: 1,
			gap: theme.space[1],
		},
	});
}
