import React from "react";

import type { ProjectDetailContentProps } from "@/types/client";

import { ProjectDetailBottomCta } from "./ProjectDetailBottomCta";
import { ProjectEntityCard } from "./ProjectEntityCard";
import { ProjectOverviewCard } from "./ProjectOverviewCard";

export function ProjectDetailContent(props: ProjectDetailContentProps) {
	return (
		<>
			<ProjectOverviewCard
				activeParticipantsValue={props.activeParticipantsValue}
				completedHoursValue={props.completedHoursValue}
				description={props.project.description}
				maxParticipantsValue={props.maxParticipantsValue}
				offeredHoursValue={props.offeredHoursValue}
				progressRatio={props.completionRatio}
				progressValueLabel={props.completionPercentLabel}
				statusLabel={props.project.status.statusFormatted}
				statusTone={props.statusTone}
				title={props.project.name}
			/>
			<ProjectDetailBottomCta
				canApply={props.canApply}
				canManage={props.canManage}
				disabled={props.disabled}
				onApply={props.onApply}
				onManage={props.onManage}
			/>
			<ProjectEntityCard
				addressValue={props.addressValue}
				cityValue={props.cityValue}
				cnpjValue={props.cnpjValue}
				entityName={props.entityName}
				staffItems={props.staffItems}
				staffStateLabel={props.staffStateLabel}
			/>
		</>
	);
}
