import React, { useEffect, useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { SlidersHorizontal } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import * as api from "@/api";
import { BrandScreenHeader, HeaderActionButton } from "@/components";
import { Badge, Label } from "@/components/primitives";
import { useCurrentFormerStudentStore, useThemeStore } from "@/stores";
import { createPrimitiveSurfaceStyleSpec } from "@/styles";
import type { ProjectResponse } from "@/types/api";
import type {
	ActivityAttendanceItem,
	ActivityEnrollmentItem,
	ActivityTab,
} from "@/types/client";

import {
	ActivityAttendanceCard,
	ActivityEnrollmentCard,
	ActivitySegmentedControl,
	ActivitySummarySection,
} from "./activity-sections";
import { createStyles } from "./styles";
import {
	buildActivitySummaryCopy,
	countActiveEnrollments,
	countPendingEnrollments,
	resolveAttendanceStatusTone,
	resolveEnrollmentStatusTone,
	resolveProjectName,
	sortActivityAttendanceItems,
	sortActivityEnrollmentItems,
} from "./utils";

export function ActivityScreen() {
	const { t } = useTranslation();
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const theme = useThemeStore(state => state.theme);
	const spec = useMemo(() => createPrimitiveSurfaceStyleSpec(theme), [theme]);
	const styles = useMemo(() => createStyles(theme, spec), [spec, theme]);
	const [activeTab, setActiveTab] = useState<ActivityTab>("enrollments");
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
	const enrollmentsQuery = api.project.enrollments.useMyEnrollmentsQuery(
		isCurrentFormerStudentLoaded,
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

	const projectIds = useMemo(() => {
		const ids = new Set<string>();

		for (const enrollment of enrollmentsQuery.data ?? []) {
			ids.add(enrollment.projectId);
		}

		for (const attendance of attendancesQuery.data ?? []) {
			ids.add(attendance.project.id);
		}

		return [...ids];
	}, [attendancesQuery.data, enrollmentsQuery.data]);

	const projectsQuery = useQuery({
		queryKey: [
			"project",
			"project",
			"list",
			"activity",
			projectIds.join(","),
		] as const,
		queryFn: () => api.project.projects.list(projectIds),
		enabled: projectIds.length > 0,
	});

	const projectsById = useMemo(() => {
		const map = new Map<string, ProjectResponse>();

		for (const project of projectsQuery.data ?? []) {
			map.set(project.id, project);
		}

		return map;
	}, [projectsQuery.data]);

	const enrollmentItems = useMemo(() => {
		return (enrollmentsQuery.data ?? [])
			.map<ActivityEnrollmentItem>(enrollment => ({
				enrollment,
				project: projectsById.get(enrollment.projectId) ?? null,
			}))
			.sort(sortActivityEnrollmentItems);
	}, [enrollmentsQuery.data, projectsById]);

	const attendanceItems = useMemo(() => {
		return (attendancesQuery.data ?? [])
			.map<ActivityAttendanceItem>(attendance => ({
				attendance,
				project: projectsById.get(attendance.project.id) ?? null,
			}))
			.sort(sortActivityAttendanceItems);
	}, [attendancesQuery.data, projectsById]);

	const activeCount = countActiveEnrollments(enrollmentsQuery.data ?? []);
	const pendingCount = countPendingEnrollments(enrollmentsQuery.data ?? []);
	const attendanceCount = (attendancesQuery.data ?? []).length;
	const summaryCopy = buildActivitySummaryCopy({
		activeCount,
		pendingCount,
		attendanceCount,
		tab: activeTab,
		t,
	});
	const hasQueryError =
		currentFormerStudentError != null ||
		enrollmentsQuery.error != null ||
		attendancesQuery.error != null ||
		projectsQuery.error != null;
	const isInitialLoading =
		(!isCurrentFormerStudentLoaded && isCurrentFormerStudentLoading) ||
		enrollmentsQuery.isLoading ||
		attendancesQuery.isLoading;
	const isRefreshing =
		enrollmentsQuery.isRefetching ||
		attendancesQuery.isRefetching ||
		projectsQuery.isRefetching;
	const visibleEnrollmentItems = enrollmentItems;
	const visibleAttendanceItems = attendanceItems;
	const contentBottomPadding =
		theme.space[8] + theme.space[4] + Math.max(insets.bottom, theme.space[4]);
	const stateCopy = hasQueryError
		? {
				title: t("activity.states.errorTitle"),
				description: t("activity.states.errorDescription"),
				badgeTone: "danger" as const,
			}
		: isInitialLoading
			? {
					title: t("activity.states.loadingTitle"),
					description: t("activity.states.loadingDescription"),
					badgeTone: "neutral" as const,
				}
			: activeTab === "enrollments" && visibleEnrollmentItems.length === 0
				? {
						title: t("activity.states.emptyEnrollmentsTitle"),
						description: t("activity.states.emptyEnrollmentsDescription"),
						badgeTone: "neutral" as const,
					}
				: activeTab === "attendances" && visibleAttendanceItems.length === 0
					? {
							title: t("activity.states.emptyAttendancesTitle"),
							description: t("activity.states.emptyAttendancesDescription"),
							badgeTone: "neutral" as const,
						}
					: null;

	return (
		<View style={[styles.screen, { backgroundColor: spec.screenBackground }]}>
			<BrandScreenHeader
				title={t("activity.title")}
				rightAccessory={
					<HeaderActionButton
						accessibilityLabel={t("activity.actions.filters")}
						disabled
						icon={SlidersHorizontal}
					/>
				}
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

							void enrollmentsQuery.refetch();
							void attendancesQuery.refetch();
							if (projectIds.length > 0) {
								void projectsQuery.refetch();
							}
						}}
						tintColor={theme.colors.brand}
					/>
				}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.shell}>
					<ActivitySummarySection
						activeCount={String(activeCount)}
						attendanceCount={String(attendanceCount)}
						chipLabels={summaryCopy.chips}
						focusDescription={summaryCopy.description}
						focusTitle={summaryCopy.title}
						pendingCount={String(pendingCount)}
					/>

					<ActivitySegmentedControl
						activeTab={activeTab}
						onTabChange={setActiveTab}
					/>

					{stateCopy ? (
						<View
							style={[
								styles.stateCard,
								{
									backgroundColor: spec.panelBackground,
									borderColor: spec.panelBorder,
								},
							]}
						>
							<Badge
								style={styles.stateBadge}
								tone={stateCopy.badgeTone}
								variant="primary"
							>
								{t("activity.states.badge")}
							</Badge>
							<View style={styles.stateBody}>
								<Label role="field">{stateCopy.title}</Label>
								<Label role="helper">{stateCopy.description}</Label>
							</View>
						</View>
					) : (
						<View style={styles.activityList}>
							<View style={styles.sectionHeader}>
								<Label
									role="field"
									style={styles.sectionTitle}
								>
									{activeTab === "enrollments"
										? t("activity.sections.enrollments")
										: t("activity.sections.attendances")}
								</Label>
								<Label role="helper">
									{activeTab === "enrollments"
										? t("activity.sections.enrollmentsHelper")
										: t("activity.sections.attendancesHelper")}
								</Label>
							</View>

							{activeTab === "enrollments"
								? visibleEnrollmentItems.map(item => (
										<ActivityEnrollmentCard
											key={`${item.enrollment.projectId}-${item.enrollment.formerStudentId}`}
											ctaLabel={t("activity.actions.open")}
											helperText={t("activity.enrollment.helper", {
												status: item.enrollment.status.statusFormatted,
											})}
											metaLabel={
												item.project?.entity.name ??
												t("activity.values.projectFallback")
											}
											onPress={() => {
												router.push(
													`/discover/projects/${item.enrollment.projectId}`,
												);
											}}
											projectName={resolveProjectName(
												item.project,
												t("activity.values.projectFallback"),
											)}
											statusLabel={item.enrollment.status.statusFormatted}
											statusTone={resolveEnrollmentStatusTone(
												item.enrollment.status.status,
											)}
										/>
									))
								: visibleAttendanceItems.map(item => (
										<ActivityAttendanceCard
											key={item.attendance.id}
											dateLabel={
												item.attendance.attendanceInfo.auditInfo
													.createdAtFormatted
											}
											durationLabel={t("activity.attendance.duration", {
												count: item.attendance.qrValidationInfo.duration,
											})}
											helperText={t("activity.attendance.helper", {
												status: item.attendance.status.statusFormatted,
											})}
											onPress={() => {
												router.push(
													`/discover/projects/${item.attendance.project.id}`,
												);
											}}
											projectName={resolveProjectName(
												item.project,
												t("activity.values.projectFallback"),
											)}
											statusLabel={item.attendance.status.statusFormatted}
											statusTone={resolveAttendanceStatusTone(
												item.attendance.status.status,
											)}
											validatorLabel={
												item.attendance.attendanceInfo.validatedAt
													? t("activity.attendance.validated")
													: t("activity.attendance.waiting")
											}
										/>
									))}
						</View>
					)}
				</View>
			</ScrollView>
		</View>
	);
}
