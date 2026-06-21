import { StyleSheet } from "react-native";

import type { AppResolvedTheme } from "@/types/client";

export function createStyles(theme: AppResolvedTheme) {
	return StyleSheet.create({
		header: {
			gap: theme.space[3],
		},
		headerRow: {
			flexDirection: "row",
			alignItems: "center",
			gap: theme.space[3],
		},
		headerCopy: {
			flex: 1,
			gap: theme.space[1],
		},
		rightAccessory: {
			alignItems: "flex-end",
			justifyContent: "center",
		},
		actionButton: {
			width: 40,
			height: 40,
			alignItems: "center",
			justifyContent: "center",
			borderWidth: 1,
		},
		brandHeader: {
			paddingHorizontal: theme.layout.screenPadding,
			paddingBottom: theme.space[2],
		},
		brandHeaderRow: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			gap: theme.space[3],
		},
		brandHeaderSlot: {
			width: 40,
			height: 40,
			alignItems: "center",
			justifyContent: "center",
		},
		brandHeaderCenter: {
			flex: 1,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			gap: theme.space[3],
		},
		brandLogoFrame: {
			width: 32,
			height: 32,
			borderRadius: 11,
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: theme.colors.surface2,
			overflow: "hidden",
			shadowColor: theme.colors.brand,
			shadowOffset: {
				width: 0,
				height: 0,
			},
			shadowOpacity: theme.mode === "dark" ? 0.2 : 0.12,
			shadowRadius: 12,
			elevation: 4,
		},
		brandLogoImage: {
			width: 34,
			height: 34,
			borderRadius: 11,
		},
		brandHeaderTitle: {
			fontSize: theme.type.lg,
			lineHeight: theme.type.lg * theme.lineHeight.tight,
			fontWeight: theme.weight.semibold,
		},
	});
}
