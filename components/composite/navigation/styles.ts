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
			position: "relative",
			zIndex: 2,
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
			alignItems: "center",
			justifyContent: "center",
		},
		brandHeaderTitle: {
			fontSize: theme.type.lg,
			lineHeight: theme.type.lg * theme.lineHeight.tight,
			fontWeight: theme.weight.semibold,
		},
		headerEdge: {
			backgroundColor: theme.colors.tabSeparator,
			bottom: 0,
			height: 1,
			left: 0,
			position: "absolute",
			right: 0,
			...(theme.mode === "dark"
				? {
						shadowColor: theme.colors.overlay,
						shadowOpacity: 0.22,
						shadowRadius: 18,
						shadowOffset: { width: 0, height: 10 },
						elevation: 3,
					}
				: {
						shadowColor: theme.colors.text,
						shadowOpacity: 0.05,
						shadowRadius: 14,
						shadowOffset: { width: 0, height: 8 },
						elevation: 1,
					}),
		},
	});
}