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
			flex: 1,
			paddingHorizontal: theme.layout.screenPadding,
			paddingVertical: theme.space[6],
		},
		shell: {
			flex: 1,
			justifyContent: "center",
			gap: theme.space[5],
		},
		badge: {
			alignSelf: "flex-start",
		},
		header: {
			gap: theme.form.headerGap,
		},
	});
}
