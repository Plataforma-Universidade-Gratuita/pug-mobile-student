import type { StyleProp, TextStyle, ViewStyle } from "react-native";

import type { EnrollmentResponse, ProjectResponse } from "@/types/api";

export interface NewAttendanceFormValues {
	projectId: string;
	duration: string;
}

export interface NewAttendanceProjectOption {
	projectId: string;
	projectName: string;
	entityName: string;
	project: ProjectResponse;
	enrollment: EnrollmentResponse;
}

export interface NewAttendanceStateCardProps {
	badgeLabel: string;
	description: string;
	title: string;
	tone: "danger" | "neutral" | "warning";
}

export interface NewAttendanceProjectOptionCardProps {
	disabled: boolean;
	entityName: string;
	isLocked: boolean;
	isSelected: boolean;
	onPress: () => void;
	projectName: string;
}

export interface NewAttendanceProjectSectionStyles {
	errorText: StyleProp<TextStyle>;
	projectOptionList: StyleProp<ViewStyle>;
	section: StyleProp<ViewStyle>;
	sectionHeader: StyleProp<ViewStyle>;
}

export interface NewAttendanceProjectSectionProps {
	clearServerError: () => void;
	errorMessage: string | undefined;
	isProjectLocked: boolean;
	isSubmitting: boolean;
	onSelectProject: (projectId: string) => void;
	options: NewAttendanceProjectOption[];
	selectedProjectId: string;
	styles: NewAttendanceProjectSectionStyles;
}
