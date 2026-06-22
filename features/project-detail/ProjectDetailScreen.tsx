import React, { useEffect, useMemo, useState } from "react";

import { useLocalSearchParams } from "expo-router";
import { Plus, Settings2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import * as api from "@/api";
import {
	AppBackButton,
	BrandScreenHeader,
	HeaderActionButton,
} from "@/components";
import { Badge, Label } from "@/components/primitives";
import { useCurrentFormerStudentStore, useThemeStore } from "@/stores";
import { createPrimitiveSurfaceStyleSpec } from "@/styles";

import {
	ManageEnrollmentSheet,
	ProjectEntityCard,
	ProjectOverviewCard,
} from "./project-detail-sections";
import { createStyles } from "./styles";
import {
	canManageEnrollment,
	countActiveParticipants,
	countPendingEnrollments,
	getProjectCompletionRatio,
	resolveOptionalNumberText,
	resolveOptionalText,
	resolveProjectDetailStatusTone,
} from "./utils";

export function ProjectDetailScreen() {
	const { t } = useTranslation();
	const insets = useSafeAreaInsets();
	const theme = useThemeStore(state => state.theme);
	const spec = useMemo(() => createPrimitiveSurfaceStyleSpec(theme), [theme]);
	const styles = useMemo(() => createStyles(theme), [theme]);
	const [isManageSheetVisible, setIsManageSheetVisible] = useState(false);
	const params = useLocalSearchParams<{ id?: string | string[] }>();
	const projectId =
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
	const projectQuery = api.project.projects.useProjectDetailQuery(projectId);
	const project = projectQuery.data ?? null;
	const entityId = project?.entity.id ?? null;
	const entityQuery = api.partner.entities.useEntityDetailQuery(entityId);
	const entity = entityQuery.data ?? null;
	const cityId = entity?.cityId ?? null;
	const cityQuery = api.geo.cities.useCityDetailQuery(cityId);
	const enrollmentsQuery =
		api.project.enrollments.useProjectEnrollmentsQuery(projectId);
	const myEnrollmentQuery =
		api.project.enrollments.useMyEnrollmentDetailQuery(projectId);
	const createEnrollmentMutation =
		api.project.enrollments.useCreateEnrollmentMutation();
	const updateMyEnrollmentMutation =
		api.project.enrollments.useMyEnrollmentStatusMutation();

	useEffect(() => {
		if (!isCurrentFormerStudentLoaded && !isCurrentFormerStudentLoading) {
			void loadCurrentFormerStudentContext();
		}
	}, [
		isCurrentFormerStudentLoaded,
		isCurrentFormerStudentLoading,
		loadCurrentFormerStudentContext,
	]);

	const enrollments = enrollmentsQuery.data ?? [];
	const activeParticipantsValue =
		enrollmentsQuery.isLoading && enrollmentsQuery.data == null
			? t("projectDetail.values.loading")
			: String(countActiveParticipants(enrollments));
	const pendingEnrollmentsValue =
		enrollmentsQuery.isLoading && enrollmentsQuery.data == null
			? t("projectDetail.values.loading")
			: String(countPendingEnrollments(enrollments));
	const completedHours = project?.projectInfo.completedHours ?? null;
	const offeredHours = project?.projectInfo.offeredHours ?? null;
	const completionRatio = getProjectCompletionRatio(
		completedHours,
		offeredHours,
	);
	const completionPercentLabel = t("projectDetail.metrics.progressValue", {
		value: Math.round(completionRatio * 100),
	});
	const maxParticipantsValue = resolveOptionalNumberText(
		project?.projectInfo.maxParticipants ?? null,
		t("projectDetail.values.unlimited"),
	);
	const completedHoursValue = resolveOptionalNumberText(
		completedHours,
		t("projectDetail.values.unavailable"),
	);
	const offeredHoursValue = resolveOptionalNumberText(
		offeredHours,
		t("projectDetail.values.unavailable"),
	);
	const cityValue =
		cityQuery.isLoading && cityId !== null
			? t("projectDetail.values.loading")
			: resolveOptionalText(
					cityQuery.data?.name,
					t("projectDetail.values.unavailable"),
				);
	const createdByValue = resolveOptionalText(
		project?.projectInfo.createdBy.name,
		t("projectDetail.values.unavailable"),
	);
	const entityName = resolveOptionalText(
		entity?.name,
		t("projectDetail.values.unavailable"),
	);
	const addressValue = entity?.address.trim() ? entity.address : null;
	const cnpjValue = resolveOptionalText(
		entity?.cnpjFormatted ?? entity?.cnpj,
		t("projectDetail.values.unavailable"),
	);
	const myEnrollment = myEnrollmentQuery.data;
	const myEnrollmentStatus = myEnrollment?.status.status;
	const canManage = canManageEnrollment(myEnrollmentStatus);
	const canApply =
		projectId !== null &&
		currentFormerStudent !== null &&
		myEnrollment === null &&
		!myEnrollmentQuery.isLoading;
	const isMutatingEnrollment =
		createEnrollmentMutation.isPending || updateMyEnrollmentMutation.isPending;
	const hasQueryError =
		projectQuery.error != null ||
		entityQuery.error != null ||
		cityQuery.error != null ||
		enrollmentsQuery.error != null ||
		myEnrollmentQuery.error != null ||
		currentFormerStudentError != null;
	const isInitialLoading =
		projectId === null ||
		(projectQuery.isLoading && projectQuery.data == null) ||
		(!isCurrentFormerStudentLoaded && isCurrentFormerStudentLoading);
	const isRefreshing =
		projectQuery.isRefetching ||
		entityQuery.isRefetching ||
		cityQuery.isRefetching ||
		enrollmentsQuery.isRefetching ||
		myEnrollmentQuery.isRefetching;
	const contentBottomPadding =
		theme.space[8] + theme.space[4] + Math.max(insets.bottom, theme.space[4]);

	const rightAccessory = canManage ? (
		<HeaderActionButton
			accessibilityLabel={t("projectDetail.actions.manage")}
			disabled={isMutatingEnrollment}
			icon={Settings2}
			onPress={() => {
				setIsManageSheetVisible(true);
			}}
		/>
	) : canApply ? (
		<HeaderActionButton
			accessibilityLabel={t("projectDetail.actions.apply")}
			disabled={isMutatingEnrollment}
			icon={Plus}
			onPress={() => {
				if (!projectId || !currentFormerStudent) {
					return;
				}

				void createEnrollmentMutation.mutateAsync({
					projectId,
				});
			}}
		/>
	) : null;

	return (
		<View style={[styles.screen, { backgroundColor: spec.screenBackground }]}>
			<BrandScreenHeader
				title={t("projectDetail.title")}
				leftAccessory={<AppBackButton />}
				rightAccessory={rightAccessory}
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

							if (projectId !== null) {
								void projectQuery.refetch();
								void enrollmentsQuery.refetch();
								void myEnrollmentQuery.refetch();
							}

							if (entityId !== null) {
								void entityQuery.refetch();
							}

							if (cityId !== null) {
								void cityQuery.refetch();
							}
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
								styles.stateCard,
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
								{t("projectDetail.states.badge")}
							</Badge>

							<View style={styles.stateBody}>
								<Label role="field">
									{t("projectDetail.states.errorTitle")}
								</Label>
								<Label role="helper">
									{t("projectDetail.states.errorDescription")}
								</Label>
							</View>
						</View>
					) : isInitialLoading ? (
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
								tone="neutral"
								variant="primary"
							>
								{t("projectDetail.states.badge")}
							</Badge>

							<View style={styles.stateBody}>
								<Label role="field">
									{t("projectDetail.states.loadingTitle")}
								</Label>
								<Label role="helper">
									{t("projectDetail.states.loadingDescription")}
								</Label>
							</View>
						</View>
					) : project ? (
						<>
							<ProjectOverviewCard
								activeParticipantsValue={activeParticipantsValue}
								completedHoursValue={completedHoursValue}
								description={project.description}
								maxParticipantsValue={maxParticipantsValue}
								offeredHoursValue={offeredHoursValue}
								pendingEnrollmentsValue={pendingEnrollmentsValue}
								progressRatio={completionRatio}
								progressValueLabel={completionPercentLabel}
								statusLabel={project.status.statusFormatted}
								statusTone={resolveProjectDetailStatusTone(
									project.status.status,
								)}
								title={project.name}
							/>

							<ProjectEntityCard
								addressValue={addressValue}
								cityValue={cityValue}
								cnpjValue={cnpjValue}
								createdByValue={createdByValue}
								entityName={entityName}
							/>
						</>
					) : (
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
								tone="warning"
								variant="primary"
							>
								{t("projectDetail.states.badge")}
							</Badge>

							<View style={styles.stateBody}>
								<Label role="field">
									{t("projectDetail.states.missingTitle")}
								</Label>
								<Label role="helper">
									{t("projectDetail.states.missingDescription")}
								</Label>
							</View>
						</View>
					)}
				</View>
			</ScrollView>

			{project ? (
				<ManageEnrollmentSheet
					isBusy={isMutatingEnrollment}
					onDismiss={() => {
						setIsManageSheetVisible(false);
					}}
					onExitProject={() => {
						if (!projectId) {
							return;
						}

						void updateMyEnrollmentMutation
							.mutateAsync({
								projectId,
								status: "EXITED",
							})
							.then(() => {
								setIsManageSheetVisible(false);
							});
					}}
					projectName={project.name}
					visible={isManageSheetVisible}
				/>
			) : null}
		</View>
	);
}
