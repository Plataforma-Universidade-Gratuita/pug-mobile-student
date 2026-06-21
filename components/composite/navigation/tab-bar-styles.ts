import { StyleSheet } from "react-native";

import type { AppResolvedTheme } from "@/types/client";

export function createTabBarStyles(
	theme: AppResolvedTheme,
	bottomInset: number,
) {
	const bottomPadding = Math.max(bottomInset - theme.space[3], 4);

	return StyleSheet.create({
		container: {
			backgroundColor: theme.colors.surface1,
			overflow: "visible",
			paddingBottom: bottomPadding,
			paddingHorizontal: 5,
			paddingTop: 7.5,
			position: "relative",
		},
		topEdge: {
			backgroundColor: theme.colors.tabSeparator,
			height: 1,
			left: 0,
			position: "absolute",
			right: 0,
			top: 0,
			...(theme.mode === "dark"
				? {
						shadowColor: theme.colors.overlay,
						shadowOpacity: 0.32,
						shadowRadius: 28,
						shadowOffset: { width: 0, height: -14 },
						elevation: 0,
					}
				: {
						shadowColor: theme.colors.text,
						shadowOpacity: 0.06,
						shadowRadius: 24,
						shadowOffset: { width: 0, height: -12 },
						elevation: 0,
					}),
		},
		rail: {
			alignItems: "center",
			alignSelf: "center",
			flexDirection: "row",
			gap: 6,
			justifyContent: "center",
			maxWidth: 316,
			width: "100%",
			zIndex: 1,
		},
		item: {
			alignItems: "center",
			borderRadius: 16,
			flex: 1,
			justifyContent: "center",
			maxWidth: 74,
			minHeight: 44,
			paddingHorizontal: 4,
			paddingVertical: 10,
		},
		itemActive: {
			backgroundColor: theme.colors.tabBgActive,
		},
		itemPressed: {
			backgroundColor: theme.colors.tabBgPressed,
		},
		iconSlot: {
			alignItems: "center",
			height: 24,
			justifyContent: "center",
			width: 24,
		},
	});
}