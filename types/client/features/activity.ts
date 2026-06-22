import type {
	AttendanceComplexSearchItem,
	EnrollmentResponse,
	ProjectResponse,
} from "@/types/api";
import type { BadgeTone } from "@/types/client";

export type ActivityTab = "enrollments" | "attendances";

export interface ActivityEnrollmentCardProps {
	projectName: string;
	statusLabel: string;
	statusTone: BadgeTone;
	helperText: string;
	metaLabel: string;
	ctaLabel: string;
	onPress: () => void;
}

export interface ActivityAttendanceCardProps {
	projectName: string;
	statusLabel: string;
	statusTone: BadgeTone;
	durationLabel: string;
	helperText: string;
	dateLabel: string;
	validatorLabel: string;
	onPress: () => void;
}

export interface ActivitySummarySectionProps {
	activeCount: string;
	pendingCount: string;
	attendanceCount: string;
	focusTitle: string;
	focusDescription: string;
	chipLabels: string[];
}

export interface ActivitySegmentedControlProps {
	activeTab: ActivityTab;
	onTabChange: (tab: ActivityTab) => void;
}

export interface ActivityEnrollmentItem {
	enrollment: EnrollmentResponse;
	project: ProjectResponse | null;
}

export interface ActivityAttendanceItem {
	attendance: AttendanceComplexSearchItem;
	project: ProjectResponse | null;
}
