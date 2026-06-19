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
			paddingHorizontal: theme.layout.screenPadding,
			paddingVertical: theme.space[6],
			justifyContent: "center",
		},
		panel: {
			width: "100%",
			maxWidth: theme.layout.contentMaxWidth,
			alignSelf: "center",
			gap: theme.space[5],
			padding: spec.panelPadding,
			borderWidth: 1,
			borderColor: spec.panelBorder,
			borderRadius: spec.panelRadius,
			backgroundColor: spec.panelBackground,
			...theme.shadow.lg,
		},
		header: {
			gap: theme.space[2],
		},
		actions: {
			gap: theme.space[3],
		},
	});
}
