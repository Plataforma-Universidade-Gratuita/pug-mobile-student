import React from "react";

import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import type { ProjectDetailResolvedContentProps } from "@/types/client";

import {
	ProjectDetailAttendanceAction,
	ProjectDetailContent,
	ProjectDetailStateCard,
} from "./project-detail-sections";
import { resolveProjectDetailStatusTone } from "./utils";

export function ProjectDetailResolvedContent({
	activeParticipantsValue,
	addressValue,
	canCreateAttendance,
	cityValue,
	cnpjValue,
	completedHoursValue,
	completionPercentLabel,
	completionRatio,
	createdByValue,
	entityName,
	maxParticipantsValue,
	offeredHoursValue,
	pendingEnrollmentsValue,
	project,
}: ProjectDetailResolvedContentProps) {
	const { t } = useTranslation();
	const router = useRouter();

	if (!project) {
		return (
			<ProjectDetailStateCard
				badgeLabel={t("projectDetail.states.badge")}
				description={t("projectDetail.states.missingDescription")}
				title={t("projectDetail.states.missingTitle")}
				tone="warning"
			/>
		);
	}

	return (
		<>
			<ProjectDetailContent
				activeParticipantsValue={activeParticipantsValue}
				addressValue={addressValue}
				cityValue={cityValue}
				cnpjValue={cnpjValue}
				completedHoursValue={completedHoursValue}
				completionPercentLabel={completionPercentLabel}
				completionRatio={completionRatio}
				createdByValue={createdByValue}
				entityName={entityName}
				maxParticipantsValue={maxParticipantsValue}
				offeredHoursValue={offeredHoursValue}
				pendingEnrollmentsValue={pendingEnrollmentsValue}
				project={project}
				statusTone={resolveProjectDetailStatusTone(project.status.status)}
			/>
			{canCreateAttendance ? (
				<ProjectDetailAttendanceAction
					onPress={() => {
						router.push({
							pathname: "/attendance/new",
							params: { projectId: project.id },
						});
					}}
				/>
			) : null}
		</>
	);
}
