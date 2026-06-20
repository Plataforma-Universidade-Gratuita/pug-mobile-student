import { StyleSheet } from "react-native";

import type { AppResolvedTheme } from "@/types/client";

export function createTabBarStyles(
	theme: AppResolvedTheme,
	bottomInset: number,
) {
	const bottomPadding = Math.max(bottomInset, theme.space[2]);

	return StyleSheet.create({
		container: {
			backgroundColor: theme.colors.surface1,
			borderTopColor: theme.colors.border2,
			borderTopWidth: 1,
			paddingBottom: bottomPadding,
			paddingHorizontal: theme.space[4],
			paddingTop: theme.space[2],
			...theme.shadow.sm,
		},
		rail: {
			alignItems: "center",
			alignSelf: "center",
			flexDirection: "row",
			gap: theme.space[2],
			justifyContent: "center",
			maxWidth: 360,
			width: "100%",
		},
		item: {
			alignItems: "center",
			borderRadius: theme.radius.md,
			flex: 1,
			justifyContent: "center",
			maxWidth: 80,
			paddingHorizontal: theme.space[2],
			paddingVertical: theme.space[1],
		},
		itemActive: {
			backgroundColor: theme.colors.surface2,
		},
		itemPressed: {
			backgroundColor: theme.colors.surface3,
		},
		iconSlot: {
			alignItems: "center",
			height: 22,
			justifyContent: "center",
			width: 22,
		},
		label: {
			fontFamily: theme.font.sans,
			fontSize: theme.type.xs,
			fontWeight: theme.weight.medium,
			lineHeight: theme.type.xs * theme.lineHeight.normal,
		},
		labelActive: {
			fontWeight: theme.weight.semibold,
		},
	});
}
