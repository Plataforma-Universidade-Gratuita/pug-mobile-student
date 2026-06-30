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
	canApply,
	canCreateAttendance,
	canManage,
	cityValue,
	cnpjValue,
	completedHoursValue,
	completionPercentLabel,
	completionRatio,
	disabled,
	entityName,
	maxParticipantsValue,
	offeredHoursValue,
	onApply,
	onManage,
	project,
	staffItems,
	staffStateLabel,
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
				canApply={canApply}
				canManage={canManage}
				cityValue={cityValue}
				cnpjValue={cnpjValue}
				completedHoursValue={completedHoursValue}
				completionPercentLabel={completionPercentLabel}
				completionRatio={completionRatio}
				disabled={disabled}
				entityName={entityName}
				maxParticipantsValue={maxParticipantsValue}
				offeredHoursValue={offeredHoursValue}
				onApply={onApply}
				onManage={onManage}
				project={project}
				staffItems={staffItems}
				staffStateLabel={staffStateLabel}
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
