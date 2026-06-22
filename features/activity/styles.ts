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
		segmented: {
			flexDirection: "row",
			gap: theme.space[2],
			padding: theme.space[1],
			borderRadius: theme.radius.circle,
			borderWidth: 1,
		},
		segmentButton: {
			flex: 1,
			alignItems: "center",
			justifyContent: "center",
			paddingHorizontal: theme.space[3],
			paddingVertical: theme.space[3],
			borderRadius: theme.radius.circle,
		},
		segmentLabel: {
			fontSize: theme.type.xs,
			fontWeight: theme.weight.bold,
			letterSpacing: 0,
			textTransform: "uppercase",
		},
		summarySection: {
			gap: theme.space[3],
		},
		summaryStrip: {
			flexDirection: "row",
			gap: theme.space[2],
		},
		summaryCard: {
			flex: 1,
			borderRadius: theme.radius.xl,
			borderWidth: 1,
			paddingHorizontal: theme.space[3],
			paddingVertical: theme.space[3],
			gap: theme.space[1],
		},
		summaryValue: {
			color: theme.colors.text,
		},
		focusCard: {
			gap: theme.space[2],
		},
		focusTitle: {
			color: theme.colors.text,
		},
		chipRow: {
			flexDirection: "row",
			flexWrap: "wrap",
			gap: theme.space[2],
		},
		stateCard: {
			borderRadius: theme.radius.xl,
			borderWidth: 1,
			paddingHorizontal: theme.space[4],
			paddingVertical: theme.space[4],
			gap: theme.space[3],
		},
		stateBadge: {
			alignSelf: "flex-start",
		},
		stateBody: {
			gap: theme.space[1],
		},
		sectionHeader: {
			gap: theme.space[1],
		},
		sectionTitle: {
			color: theme.colors.text,
		},
		activityList: {
			gap: theme.space[3],
		},
		card: {
			borderRadius: theme.radius.xl,
			borderWidth: 1,
			paddingHorizontal: theme.space[4],
			paddingVertical: theme.space[4],
			gap: theme.space[3],
		},
		cardHead: {
			flexDirection: "row",
			alignItems: "flex-start",
			justifyContent: "space-between",
			gap: theme.space[3],
		},
		cardCopy: {
			flex: 1,
			gap: theme.space[1],
		},
		cardMetaRow: {
			flexDirection: "row",
			flexWrap: "wrap",
			alignItems: "center",
			gap: theme.space[2],
		},
		cardTitle: {
			color: theme.colors.text,
		},
		ctaText: {
			fontWeight: theme.weight.semibold,
		},
		pillRow: {
			flexDirection: "row",
			flexWrap: "wrap",
			gap: theme.space[2],
		},
	});
}
