/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */
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
		scroll: {
			width: "100%",
		},
		content: {
			gap: theme.space[4],
			paddingBottom: theme.space[2],
		},
		section: {
			gap: theme.space[3],
		},
		sectionDivider: {
			borderTopWidth: 1,
			paddingTop: theme.space[4],
		},
		sectionHeader: {
			gap: theme.space[1],
		},
		optionGroup: {
			flexDirection: "row",
			flexWrap: "wrap",
			gap: theme.space[2],
		},
		optionChip: {
			paddingHorizontal: theme.space[3],
			paddingVertical: theme.space[2],
			borderRadius: theme.radius.circle,
			borderWidth: 1,
		},
		footerActions: {
			flexDirection: "row",
			gap: theme.space[2],
		},
		footerAction: {
			flex: 1,
		},
	});
}
