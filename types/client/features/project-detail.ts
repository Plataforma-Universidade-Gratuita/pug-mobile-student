import type { BadgeTone } from "../components/primitives/display/badge";

export interface ProjectOverviewCardProps {
	title: string;
	description: string;
	statusLabel: string;
	statusTone: BadgeTone;
	activeParticipantsValue: string;
	pendingEnrollmentsValue: string;
	maxParticipantsValue: string;
	completedHoursValue: string;
	offeredHoursValue: string;
	progressRatio: number;
	progressValueLabel: string;
}

export interface ProjectEntityCardProps {
	entityName: string;
	addressValue: string | null;
	cnpjValue: string;
	cityValue: string;
	createdByValue: string;
}

export interface ManageEnrollmentSheetProps {
	visible: boolean;
	projectName: string;
	isBusy: boolean;
	onDismiss: () => void;
	onExitProject: () => void;
}
