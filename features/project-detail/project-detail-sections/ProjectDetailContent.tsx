import React from "react";

import { View } from "react-native";

import { ProjectEntityCard } from "./ProjectEntityCard";
import { ProjectOverviewCard } from "./ProjectOverviewCard";

import type { ProjectDetailContentProps } from "@/types/client";

export function ProjectDetailContent(props: ProjectDetailContentProps) {
	return (
		<>
			<ProjectOverviewCard
				activeParticipantsValue={props.activeParticipantsValue}
				completedHoursValue={props.completedHoursValue}
				description={props.project.description}
				maxParticipantsValue={props.maxParticipantsValue}
				offeredHoursValue={props.offeredHoursValue}
				pendingEnrollmentsValue={props.pendingEnrollmentsValue}
				progressRatio={props.completionRatio}
				progressValueLabel={props.completionPercentLabel}
				statusLabel={props.project.status.statusFormatted}
				statusTone={props.statusTone}
				title={props.project.name}
			/>
			<ProjectEntityCard
				addressValue={props.addressValue}
				cityValue={props.cityValue}
				cnpjValue={props.cnpjValue}
				createdByValue={props.createdByValue}
				entityName={props.entityName}
			/>
		</>
	);
}
