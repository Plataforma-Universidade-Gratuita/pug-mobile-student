import { StyleSheet } from "react-native";

import type { AppResolvedTheme } from "@/types/client";

export function createStyles(theme: AppResolvedTheme) {
	return StyleSheet.create({
		screen: {
			flex: 1,
		},
		content: {
			paddingHorizontal: theme.layout.screenPadding,
			paddingTop: theme.space[3],
			paddingBottom: theme.space[5],
			alignItems: "center",
		},
		shell: {
			width: "100%",
			maxWidth: theme.layout.contentMaxWidth,
			gap: theme.space[4],
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
