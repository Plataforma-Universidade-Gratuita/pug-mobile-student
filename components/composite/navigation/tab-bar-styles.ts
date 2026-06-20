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
			overflow: "hidden",
			paddingBottom: bottomPadding,
			paddingHorizontal: 5,
			paddingTop: 7.5,
			position: "relative",
			...(theme.mode === "dark"
				? {
						shadowColor: theme.colors.overlay,
						shadowOpacity: 0.18,
						shadowRadius: 16,
						shadowOffset: { width: 0, height: -8 },
						elevation: 10,
					}
				: {
						shadowColor: theme.colors.text,
						shadowOpacity: 0.04,
						shadowRadius: 14,
						shadowOffset: { width: 0, height: -6 },
						elevation: 4,
					}),
		},
		fadeStrong: {
			backgroundColor: theme.colors.surfaceHighlight,
			height: 6,
			left: 0,
			opacity: theme.mode === "dark" ? 0.9 : 0.7,
			position: "absolute",
			right: 0,
			top: 0,
		},
		fadeMid: {
			backgroundColor: theme.colors.surfaceHighlight,
			height: 14,
			left: 0,
			opacity: theme.mode === "dark" ? 0.38 : 0.28,
			position: "absolute",
			right: 0,
			top: 6,
		},
		fadeSoft: {
			backgroundColor: theme.colors.surfaceHighlight,
			height: 22,
			left: 0,
			opacity: theme.mode === "dark" ? 0.14 : 0.1,
			position: "absolute",
			right: 0,
			top: 20,
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
			gap: 5,
			justifyContent: "center",
			maxWidth: 74,
			minHeight: 50,
			paddingHorizontal: 4,
			paddingVertical: 7,
		},
		itemActive: {
			backgroundColor: theme.colors.tabBgActive,
		},
		itemPressed: {
			backgroundColor: theme.colors.tabBgPressed,
		},
		iconSlot: {
			alignItems: "center",
			height: 20,
			justifyContent: "center",
			width: 20,
		},
		label: {
			fontFamily: theme.font.sans,
			fontSize: 11,
			fontWeight: theme.weight.medium,
			letterSpacing: 0.35,
			lineHeight: 14,
		},
		labelActive: {
			fontWeight: theme.weight.semibold,
		},
	});
}
