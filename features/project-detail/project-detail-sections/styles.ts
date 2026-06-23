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
		card: {
			borderRadius: theme.radius.xl,
			borderWidth: 1,
			paddingHorizontal: theme.space[4],
			paddingVertical: theme.space[4],
			gap: theme.space[4],
		},
		cardHeader: {
			gap: theme.space[3],
		},
		titleRow: {
			flexDirection: "row",
			alignItems: "flex-start",
			gap: theme.space[2],
		},
		titleCopy: {
			flex: 1,
			gap: theme.space[1],
		},
		title: {
			fontSize: theme.type.lg,
			lineHeight: theme.type.lg * theme.lineHeight.tight,
		},
		metricsGrid: {
			flexDirection: "row",
			flexWrap: "wrap",
			gap: theme.space[2],
		},
		metricCard: {
			flexBasis: "48%",
			flexGrow: 1,
			minWidth: 0,
			borderRadius: theme.radius.lg,
			borderWidth: 1,
			paddingHorizontal: theme.space[3],
			paddingVertical: theme.space[3],
			gap: theme.space[1],
		},
		metricValue: {
			color: theme.colors.text,
		},
		progressBlock: {
			gap: theme.space[2],
		},
		progressHeader: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			gap: theme.space[3],
		},
		progressTrack: {
			height: 10,
			borderRadius: theme.radius.circle,
			overflow: "hidden",
			backgroundColor: theme.colors.surface3,
			borderWidth: 1,
			borderColor: spec.panelBorder,
		},
		progressFill: {
			height: "100%",
			borderRadius: theme.radius.circle,
			backgroundColor: theme.colors.brand,
		},
		sectionTitle: {
			color: theme.colors.text,
		},
		entityRows: {
			gap: theme.space[3],
		},
		entityRow: {
			gap: theme.space[1],
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
		sheetOption: {
			gap: theme.space[1],
			minHeight: 80,
			justifyContent: "center",
			paddingHorizontal: theme.space[4],
			paddingVertical: theme.space[4],
			borderRadius: theme.radius.xl,
			borderWidth: 1,
		},
		sheetOptionCopy: {
			gap: theme.space[1],
		},
		sheetDangerTitle: {
			color: theme.colors.danger,
		},
	});
}
