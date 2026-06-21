import { StyleSheet } from "react-native";

import type {
	AppResolvedTheme,
	PrimitiveSurfaceStyleSpec,
} from "@/types/client";

export function createSectionStyles(
	theme: AppResolvedTheme,
	spec: PrimitiveSurfaceStyleSpec,
) {
	return StyleSheet.create({
		card: {
			gap: theme.space[3],
			padding: spec.panelPadding,
			borderWidth: 1,
			borderRadius: theme.radius.xl,
			...theme.shadow.sm,
		},
		sectionCard: {
			paddingBottom: theme.space[4],
		},
		identityCard: {
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
		avatarLogo: {
			width: 72,
			height: 72,
			borderRadius: 18,
		},
		sectionHeader: {
			gap: theme.space[1],
		},
		rows: {
			gap: theme.space[1],
		},
		rowsBottomTrim: {
			marginBottom: -theme.space[1],
		},
		row: {
			flexDirection: "row",
			alignItems: "flex-end",
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
			alignSelf: "stretch",
			width: "100%",
			gap: theme.space[1],
			padding: 4,
			borderWidth: 1,
			borderRadius: theme.radius.circle,
		},
		selectorOption: {
			flexBasis: 0,
			flexGrow: 1,
			flexShrink: 1,
			minWidth: 0,
			height: 36,
			paddingHorizontal: theme.space[3],
			borderRadius: theme.radius.circle,
			alignItems: "center",
			justifyContent: "center",
		},
		selectorOptionCompact: {},
		logoutSection: {
			marginTop: theme.space[4],
			paddingTop: theme.space[3],
			borderTopWidth: 1,
		},
		logoutTrigger: {
			minHeight: 54,
			paddingHorizontal: theme.space[4],
			borderRadius: theme.radius.lg,
			alignItems: "center",
			justifyContent: "center",
			...theme.shadow.sm,
		},
	});
}