import React, { useMemo } from "react";

import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

import { Badge, Label } from "@/components/primitives";
import { useThemeStore } from "@/stores";
import { createPrimitiveSurfaceStyleSpec } from "@/styles";
import type {
	ActivityAttendanceCardProps,
	ActivityEnrollmentCardProps,
	ActivitySegmentedControlProps,
	ActivitySummarySectionProps,
	ActivityTab,
} from "@/types/client";

import { createStyles } from "../styles";

function SummaryChip({ label }: { label: string }) {
	return (
		<Badge
			tone="brand"
			variant="secondary"
		>
			{label}
		</Badge>
	);
}

export function ActivitySegmentedControl({
	activeTab,
	onTabChange,
}: ActivitySegmentedControlProps) {
	const { t } = useTranslation();
	const theme = useThemeStore(state => state.theme);
	const spec = useMemo(() => createPrimitiveSurfaceStyleSpec(theme), [theme]);
	const styles = useMemo(() => createStyles(theme, spec), [spec, theme]);

	function renderOption(tab: ActivityTab, label: string) {
		const isActive = activeTab === tab;

		return (
			<Pressable
				key={tab}
				onPress={() => {
					onTabChange(tab);
				}}
				style={[
					styles.segmentButton,
					{
						backgroundColor: isActive ? theme.colors.brand : "transparent",
					},
				]}
			>
				<Label
					align="center"
					role="helper"
					style={[
						styles.segmentLabel,
						{
							color: isActive ? theme.colors.chromeFg : theme.colors.muted,
						},
					]}
				>
					{label}
				</Label>
			</Pressable>
		);
	}

	return (
		<View
			style={[
				styles.segmented,
				{
					backgroundColor: theme.colors.surface2,
					borderColor: spec.panelBorder,
				},
			]}
		>
			{renderOption("enrollments", t("activity.segments.enrollments"))}
			{renderOption("attendances", t("activity.segments.attendances"))}
		</View>
	);
}

export function ActivitySummarySection({
	activeCount,
	pendingCount,
	attendanceCount,
	focusTitle,
	focusDescription,
	chipLabels,
}: ActivitySummarySectionProps) {
	const { t } = useTranslation();
	const theme = useThemeStore(state => state.theme);
	const spec = useMemo(() => createPrimitiveSurfaceStyleSpec(theme), [theme]);
	const styles = useMemo(() => createStyles(theme, spec), [spec, theme]);

	return (
		<View style={styles.summarySection}>
			<View style={styles.summaryStrip}>
				{[
					[t("activity.summary.active"), activeCount],
					[t("activity.summary.pending"), pendingCount],
					[t("activity.summary.attendances"), attendanceCount],
				].map(([label, value]) => (
					<View
						key={String(label)}
						style={[
							styles.summaryCard,
							{
								backgroundColor: spec.panelBackground,
								borderColor: spec.panelBorder,
							},
						]}
					>
						<Label role="helper">{label}</Label>
						<Label
							role="title"
							style={styles.summaryValue}
						>
							{value}
						</Label>
					</View>
				))}
			</View>

			<View style={styles.focusCard}>
				<Label
					role="field"
					style={styles.focusTitle}
				>
					{focusTitle}
				</Label>
				<Label role="helper">{focusDescription}</Label>
				<View style={styles.chipRow}>
					{chipLabels.map(label => (
						<SummaryChip
							key={label}
							label={label}
						/>
					))}
				</View>
			</View>
		</View>
	);
}

export function ActivityEnrollmentCard({
	projectName,
	statusLabel,
	statusTone,
	helperText,
	metaLabel,
	ctaLabel,
	onPress,
}: ActivityEnrollmentCardProps) {
	const theme = useThemeStore(state => state.theme);
	const spec = useMemo(() => createPrimitiveSurfaceStyleSpec(theme), [theme]);
	const styles = useMemo(() => createStyles(theme, spec), [spec, theme]);

	return (
		<Pressable onPress={onPress}>
			{({ pressed }) => (
				<View
					style={[
						styles.card,
						{
							backgroundColor: pressed
								? theme.colors.surface2
								: spec.panelBackground,
							borderColor: spec.panelBorder,
						},
					]}
				>
					<View style={styles.cardHead}>
						<View style={styles.cardCopy}>
							<View style={styles.cardMetaRow}>
								<Badge
									tone={statusTone}
									variant="primary"
								>
									{statusLabel}
								</Badge>
								<Label role="helper">{metaLabel}</Label>
							</View>
							<Label
								role="field"
								style={styles.cardTitle}
							>
								{projectName}
							</Label>
							<Label role="helper">{helperText}</Label>
						</View>
						<Label
							role="field"
							style={[styles.ctaText, { color: theme.colors.brand }]}
						>
							{ctaLabel}
						</Label>
					</View>
				</View>
			)}
		</Pressable>
	);
}

export function ActivityAttendanceCard({
	projectName,
	statusLabel,
	statusTone,
	durationLabel,
	helperText,
	dateLabel,
	validatorLabel,
	ctaLabel,
	onPress,
}: ActivityAttendanceCardProps) {
	const theme = useThemeStore(state => state.theme);
	const spec = useMemo(() => createPrimitiveSurfaceStyleSpec(theme), [theme]);
	const styles = useMemo(() => createStyles(theme, spec), [spec, theme]);

	return (
		<Pressable onPress={onPress}>
			{({ pressed }) => (
				<View
					style={[
						styles.card,
						{
							backgroundColor: pressed
								? theme.colors.surface2
								: spec.panelBackground,
							borderColor: spec.panelBorder,
						},
					]}
				>
					<View style={styles.cardHead}>
						<View style={styles.cardCopy}>
							<View style={styles.cardMetaRow}>
								<Badge
									tone={statusTone}
									variant="primary"
								>
									{statusLabel}
								</Badge>
								<Label role="helper">{durationLabel}</Label>
							</View>
							<Label
								role="field"
								style={styles.cardTitle}
							>
								{projectName}
							</Label>
							<Label role="helper">{helperText}</Label>
						</View>
						<Label
							role="field"
							style={[styles.ctaText, { color: theme.colors.brand }]}
						>
							{ctaLabel}
						</Label>
					</View>

					<View style={styles.pillRow}>
						<Badge
							tone="neutral"
							variant="secondary"
						>
							{dateLabel}
						</Badge>
						<Badge
							tone="neutral"
							variant="secondary"
						>
							{validatorLabel}
						</Badge>
					</View>
				</View>
			)}
		</Pressable>
	);
}
export * from "./ActivityListSection";
export * from "./ActivityStateCard";
