import type { BadgeTone } from "../components/primitives/display/badge";

export interface ProjectDetailScreenProps {
	titleOverride?: string;
}

export interface ProjectDetailHeaderActionsProps {
	canApply: boolean;
	canManage: boolean;
	disabled: boolean;
	onApply: () => void;
	onManage: () => void;
}

export interface ProjectDetailAttendanceActionProps {
	onPress: () => void;
}

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

export interface ApplyEnrollmentSheetProps {
	visible: boolean;
	projectName: string;
	isBusy: boolean;
	onApply: () => void;
	onDismiss: () => void;
}

export interface ProjectDetailStateCardProps {
	badgeLabel: string;
	description: string;
	title: string;
	tone: NonNullable<BadgeTone>;
}

export interface ProjectDetailContentProps {
	activeParticipantsValue: string;
	addressValue: string | null;
	cityValue: string;
	cnpjValue: string;
	completedHoursValue: string;
	completionPercentLabel: string;
	completionRatio: number;
	createdByValue: string;
	entityName: string;
	maxParticipantsValue: string;
	offeredHoursValue: string;
	pendingEnrollmentsValue: string;
	project: {
		description: string;
		name: string;
		status: { statusFormatted: string };
	};
	statusTone: BadgeTone;
}
