import React, { useEffect, useMemo } from "react";

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

import { DISCOVERABLE_PROJECT_STATUSES } from "./constants";
import { DiscoverProjectCard } from "./project-card";
import { createStyles } from "./styles";
import {
	getProjectAvailableSeats,
	getProjectRemainingHours,
	resolveDiscoverProjectStatusTone,
	resolveDiscoverQueryStateCopy,
	sortDiscoverProjects,
} from "./utils";

export function DiscoverScreen() {
	const { t } = useTranslation();
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const theme = useThemeStore(state => state.theme);
	const spec = useMemo(() => createPrimitiveSurfaceStyleSpec(theme), [theme]);
	const styles = useMemo(() => createStyles(theme, spec), [spec, theme]);
	const currentCourse = useCurrentFormerStudentStore(
		state => state.currentCourse,
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
	const areaOfExpertise = currentCourse?.areaOfExpertise ?? null;
	const areaOfExpertiseId = areaOfExpertise?.id ?? null;
	const projectFilters = useMemo(
		() => ({
			name: "",
			entityIds: [],
			description: "",
			createdByIds: [],
			statuses: [...DISCOVERABLE_PROJECT_STATUSES],
			maxOfferedHours: "",
			minOfferedHours: "",
			dateFrom: "",
			dateTo: "",
			areaOfExpertiseIds: areaOfExpertiseId ? [areaOfExpertiseId] : [],
			availability: true,
		}),
		[areaOfExpertiseId],
	);
	const projectsQuery = api.project.projects.useProjectsSearchQuery(
		0,
		100,
		projectFilters,
		areaOfExpertise !== null,
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

	const discoverableProjects = useMemo(
		() => [...(projectsQuery.data?.content ?? [])].sort(sortDiscoverProjects),
		[projectsQuery.data?.content],
	);

	const stateCopy = resolveDiscoverQueryStateCopy(t, {
		hasProfileError: currentFormerStudentError !== null,
		hasProjectError: projectsQuery.error != null,
		isProfileLoading:
			!isCurrentFormerStudentLoaded && isCurrentFormerStudentLoading,
		isProjectsLoading: projectsQuery.isLoading,
		hasAreaOfExpertise: areaOfExpertise !== null,
		projectCount: discoverableProjects.length,
	});

	const contentBottomPadding =
		theme.space[8] + theme.space[4] + Math.max(insets.bottom, theme.space[4]);
	const summaryCountLabel =
		areaOfExpertise !== null && stateCopy === null
			? t("discover.summary.count", {
					count: discoverableProjects.length,
				})
			: null;

	return (
		<View style={styles.screen}>
			<BrandScreenHeader
				title={t("discover.title")}
				rightAccessory={
					<HeaderActionButton
						accessibilityLabel={t("discover.actions.filters")}
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
						refreshing={projectsQuery.isRefetching}
						onRefresh={() => {
							if (!isCurrentFormerStudentLoaded) {
								void loadCurrentFormerStudentContext();
							}

							if (areaOfExpertise !== null) {
								void projectsQuery.refetch();
							}
						}}
						tintColor={theme.colors.brand}
					/>
				}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.shell}>
					<View style={styles.summarySection}>
						<View style={styles.summaryTop}>
							<Badge
								tone="brand"
								variant="primary"
							>
								{t("discover.badge")}
							</Badge>

							{summaryCountLabel ? (
								<Badge
									tone="neutral"
									variant="secondary"
								>
									{summaryCountLabel}
								</Badge>
							) : null}
						</View>

						<View style={styles.summaryCopy}>
							<Label
								role="field"
								style={styles.summaryTitle}
							>
								{areaOfExpertise?.name ?? t("discover.summary.fallbackArea")}
							</Label>
							<Label role="helper">{t("discover.summary.description")}</Label>
						</View>
					</View>

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
								{t("discover.states.badge")}
							</Badge>

							<View style={styles.stateBody}>
								<Label role="field">{stateCopy.title}</Label>
								<Label role="helper">{stateCopy.description}</Label>
							</View>
						</View>
					) : (
						<View style={styles.resultsSection}>
							<View style={styles.resultsHeader}>
								<Label
									role="field"
									style={styles.resultsTitle}
								>
									{t("discover.resultsTitle")}
								</Label>
							</View>

							<View style={styles.projectList}>
								{discoverableProjects.map(project => {
									const remainingHours = getProjectRemainingHours(project);
									const availableSeats = getProjectAvailableSeats(project);
									const maxParticipants = project.projectInfo.maxParticipants;
									const entityMeta = project.entity.name;
									const hoursLabel =
										remainingHours == null
											? t("discover.card.hoursFallback")
											: t("discover.card.hoursValue", {
													count: remainingHours,
												});
									const seatsLabel =
										maxParticipants == null
											? t("discover.card.seatsUnlimited")
											: availableSeats == null
												? t("discover.card.seatsOpen")
												: t("discover.card.seatsValue", {
														count: availableSeats,
													});

									return (
										<DiscoverProjectCard
											key={project.id}
											description={project.description}
											entityMeta={entityMeta}
											hoursLabel={hoursLabel}
											onPress={() => {
												router.push(`/discover/projects/${project.id}`);
											}}
											seatsLabel={seatsLabel}
											statusLabel={project.status.statusFormatted}
											statusTone={resolveDiscoverProjectStatusTone(
												project.status.status,
											)}
											title={project.name}
										/>
									);
								})}
							</View>
						</View>
					)}
				</View>
			</ScrollView>
		</View>
	);
}
