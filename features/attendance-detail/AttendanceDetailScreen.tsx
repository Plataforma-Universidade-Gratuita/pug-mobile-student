import React, { useEffect, useMemo } from "react";

import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import * as api from "@/api";
import { AppBackButton, BrandScreenHeader } from "@/components";
import { Badge, Button, Label } from "@/components/primitives";
import { useCurrentFormerStudentStore, useThemeStore } from "@/stores";
import { createPrimitiveSurfaceStyleSpec } from "@/styles";

import { resolveAttendanceStatusTone } from "../activity/utils";
import { createStyles } from "./styles";

export function AttendanceDetailScreen() {
	const { t } = useTranslation();
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const theme = useThemeStore(state => state.theme);
	const spec = useMemo(() => createPrimitiveSurfaceStyleSpec(theme), [theme]);
	const styles = useMemo(() => createStyles(theme, spec), [spec, theme]);
	const params = useLocalSearchParams<{ id?: string | string[] }>();
	const attendanceId =
		typeof params.id === "string" && params.id.trim() ? params.id : null;
	const currentFormerStudent = useCurrentFormerStudentStore(
		state => state.currentFormerStudent,
	);
	const isCurrentFormerStudentLoading = useCurrentFormerStudentStore(
		state => state.isLoading,
	);
	const isCurrentFormerStudentLoaded = useCurrentFormerStudentStore(
		state => state.isLoaded,
	);
	const currentFormerStudentError = useCurrentFormerStudentStore(
		state => state.error,
	);
	const loadCurrentFormerStudentContext = useCurrentFormerStudentStore(
		state => state.loadCurrentFormerStudentContext,
	);
	const attendancesQuery =
		api.project.attendances.useAttendancesByFormerStudentQuery(
			currentFormerStudent?.accountId ?? null,
		);

	useEffect(() => {
		if (!isCurrentFormerStudentLoaded && !isCurrentFormerStudentLoading) {
			void loadCurrentFormerStudentContext();
		}
	}, [
		isCurrentFormerStudentLoaded,
		isCurrentFormerStudentLoading,
		loadCurrentFormerStudentContext,
	]);

	const attendance = useMemo(
		() =>
			(attendancesQuery.data ?? []).find(item => item.id === attendanceId) ??
			null,
		[attendanceId, attendancesQuery.data],
	);
	const contentBottomPadding =
		theme.space[8] + theme.space[4] + Math.max(insets.bottom, theme.space[4]);
	const hasQueryError =
		currentFormerStudentError != null || attendancesQuery.error != null;
	const isInitialLoading =
		attendanceId === null ||
		(!isCurrentFormerStudentLoaded && isCurrentFormerStudentLoading) ||
		attendancesQuery.isLoading;
	const isRefreshing = attendancesQuery.isRefetching;

	return (
		<View style={[styles.screen, { backgroundColor: spec.screenBackground }]}>
			<BrandScreenHeader
				title={t("activity.attendanceDetail.title")}
				leftAccessory={<AppBackButton />}
			/>

			<ScrollView
				contentContainerStyle={[
					styles.content,
					{ paddingBottom: contentBottomPadding },
				]}
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={() => {
							if (!isCurrentFormerStudentLoaded) {
								void loadCurrentFormerStudentContext();
							}

							void attendancesQuery.refetch();
						}}
						tintColor={theme.colors.brand}
					/>
				}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.shell}>
					{hasQueryError ? (
						<View
							style={[
								styles.card,
								{
									backgroundColor: spec.panelBackground,
									borderColor: spec.panelBorder,
								},
							]}
						>
							<Badge
								style={styles.stateBadge}
								tone="danger"
								variant="primary"
							>
								{t("activity.states.badge")}
							</Badge>
							<View style={styles.stateBody}>
								<Label role="field">
									{t("activity.attendanceDetail.states.errorTitle")}
								</Label>
								<Label role="helper">
									{t("activity.attendanceDetail.states.errorDescription")}
								</Label>
							</View>
						</View>
					) : isInitialLoading ? (
						<View
							style={[
								styles.card,
								{
									backgroundColor: spec.panelBackground,
									borderColor: spec.panelBorder,
								},
							]}
						>
							<Badge
								style={styles.stateBadge}
								tone="neutral"
								variant="primary"
							>
								{t("activity.states.badge")}
							</Badge>
							<View style={styles.stateBody}>
								<Label role="field">
									{t("activity.attendanceDetail.states.loadingTitle")}
								</Label>
								<Label role="helper">
									{t("activity.attendanceDetail.states.loadingDescription")}
								</Label>
							</View>
						</View>
					) : attendance ? (
						<>
							<View
								style={[
									styles.card,
									{
										backgroundColor: spec.panelBackground,
										borderColor: spec.panelBorder,
									},
								]}
							>
								<View style={styles.heroMetaRow}>
									<Badge
										tone={resolveAttendanceStatusTone(attendance.status.status)}
										variant="primary"
									>
										{attendance.status.statusFormatted}
									</Badge>
									<Label role="helper">
										{t("activity.attendance.duration", {
											count: attendance.qrValidationInfo.duration,
										})}
									</Label>
								</View>
								<View style={styles.heroCopy}>
									<Label
										role="title"
										style={styles.heroTitle}
									>
										{attendance.project.name}
									</Label>
									<Label role="helper">
										{t("activity.attendanceDetail.subtitle")}
									</Label>
								</View>
							</View>

							<View style={styles.metricGrid}>
								{[
									[
										t("activity.attendanceDetail.metrics.createdAt"),
										attendance.attendanceInfo.auditInfo.createdAtFormatted,
									],
									[
										t("activity.attendanceDetail.metrics.validatedAt"),
										attendance.attendanceInfo.validatedAtFormatted ||
											t("activity.attendance.waiting"),
									],
									[
										t("activity.attendanceDetail.metrics.validator"),
										attendance.validator?.name ||
											t("activity.attendanceDetail.values.notValidated"),
									],
								].map(([label, value]) => (
									<View
										key={String(label)}
										style={[
											styles.metricCard,
											{
												backgroundColor: spec.panelBackground,
												borderColor: spec.panelBorder,
											},
										]}
									>
										<Label role="helper">{label}</Label>
										<Label
											role="field"
											style={styles.metricValue}
										>
											{value}
										</Label>
									</View>
								))}
							</View>

							<View
								style={[
									styles.card,
									{
										backgroundColor: spec.panelBackground,
										borderColor: spec.panelBorder,
									},
								]}
							>
								<View style={styles.section}>
									<Label
										role="field"
										style={styles.sectionTitle}
									>
										{t("activity.attendanceDetail.sections.validation")}
									</Label>
									<View style={styles.rowGroup}>
										<View style={styles.row}>
											<Label role="helper">
												{t("activity.attendanceDetail.fields.validationCode")}
											</Label>
											<Label role="field">
												{attendance.qrValidationInfo.qrValidationHash}
											</Label>
										</View>
										<View style={styles.row}>
											<Label role="helper">
												{t("activity.attendanceDetail.fields.student")}
											</Label>
											<Label role="field">
												{attendance.student.account.name}
											</Label>
										</View>
										<View style={styles.row}>
											<Label role="helper">
												{t("activity.attendanceDetail.fields.registration")}
											</Label>
											<Label role="field">
												{attendance.student.academicRegistration}
											</Label>
										</View>
									</View>
								</View>
							</View>

							<View style={styles.actions}>
								<Button
									onPress={() => {
										router.push(`/attendance/qr/${attendance.id}`);
									}}
								>
									{t("activity.attendanceDetail.actions.showQr")}
								</Button>
								<Button
									variant="secondary"
									onPress={() => {
										router.push(`/discover/projects/${attendance.project.id}`);
									}}
								>
									{t("activity.attendanceDetail.actions.openProject")}
								</Button>
							</View>
						</>
					) : (
						<View
							style={[
								styles.card,
								{
									backgroundColor: spec.panelBackground,
									borderColor: spec.panelBorder,
								},
							]}
						>
							<Badge
								style={styles.stateBadge}
								tone="warning"
								variant="primary"
							>
								{t("activity.states.badge")}
							</Badge>
							<View style={styles.stateBody}>
								<Label role="field">
									{t("activity.attendanceDetail.states.missingTitle")}
								</Label>
								<Label role="helper">
									{t("activity.attendanceDetail.states.missingDescription")}
								</Label>
							</View>
						</View>
					)}
				</View>
			</ScrollView>
		</View>
	);
}
