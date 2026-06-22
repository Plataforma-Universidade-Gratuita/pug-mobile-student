import type { TFunction } from "i18next";

import type {
	AttendanceStatus,
	EnrollmentResponse,
	EnrollmentStatus,
	ProjectResponse,
} from "@/types/api";
import type {
	ActivityAttendanceItem,
	ActivityEnrollmentItem,
	ActivityTab,
	BadgeTone,
} from "@/types/client";

import {
	ACTIVE_ENROLLMENT_STATUSES,
	ATTENDANCE_STATUS_ORDER,
	PENDING_ENROLLMENT_STATUS,
} from "./constants";

const activeEnrollmentStatusSet = new Set<EnrollmentStatus>(
	ACTIVE_ENROLLMENT_STATUSES,
);

export function countActiveEnrollments(enrollments: EnrollmentResponse[]) {
	return enrollments.filter(enrollment =>
		activeEnrollmentStatusSet.has(enrollment.status.status),
	).length;
}

export function countPendingEnrollments(enrollments: EnrollmentResponse[]) {
	return enrollments.filter(
		enrollment => enrollment.status.status === PENDING_ENROLLMENT_STATUS,
	).length;
}

export function sortActivityEnrollmentItems(
	left: ActivityEnrollmentItem,
	right: ActivityEnrollmentItem,
) {
	return (left.project?.name ?? "").localeCompare(right.project?.name ?? "");
}

export function sortActivityAttendanceItems(
	left: ActivityAttendanceItem,
	right: ActivityAttendanceItem,
) {
	const leftOrder = ATTENDANCE_STATUS_ORDER[left.attendance.status.status];
	const rightOrder = ATTENDANCE_STATUS_ORDER[right.attendance.status.status];

	if (leftOrder !== rightOrder) {
		return leftOrder - rightOrder;
	}

	const leftDate = left.attendance.attendanceInfo.auditInfo.createdAt ?? "";
	const rightDate = right.attendance.attendanceInfo.auditInfo.createdAt ?? "";

	return rightDate.localeCompare(leftDate);
}

export function resolveEnrollmentStatusTone(
	status: EnrollmentStatus,
): BadgeTone {
	if (status === "APPROVED") {
		return "success";
	}

	if (status === "ON_HOLD") {
		return "warning";
	}

	if (status === "PENDING") {
		return "info";
	}

	if (status === "COMPLETED") {
		return "brand";
	}

	if (status === "REJECTED" || status === "CANCELED" || status === "REMOVED") {
		return "danger";
	}

	return "neutral";
}

export function resolveAttendanceStatusTone(
	status: AttendanceStatus,
): BadgeTone {
	if (status === "PRESENT") {
		return "success";
	}

	if (status === "WAITING") {
		return "warning";
	}

	if (status === "ABSENT") {
		return "danger";
	}

	return "neutral";
}

export function buildActivitySummaryCopy(options: {
	activeCount: number;
	pendingCount: number;
	attendanceCount: number;
	tab: ActivityTab;
	t: TFunction;
}) {
	if (options.tab === "attendances") {
		return {
			title: options.t("activity.focus.attendancesTitle", {
				count: options.attendanceCount,
			}),
			description: options.t("activity.focus.attendancesDescription"),
			chips: [
				options.t("activity.chips.waiting"),
				options.t("activity.chips.recent"),
			],
		};
	}

	if (options.pendingCount > 0) {
		return {
			title: options.t("activity.focus.pendingTitle", {
				count: options.pendingCount,
			}),
			description: options.t("activity.focus.pendingDescription"),
			chips: [
				options.t("activity.chips.active"),
				options.t("activity.chips.pending"),
			],
		};
	}

	return {
		title: options.t("activity.focus.activeTitle", {
			count: options.activeCount,
		}),
		description: options.t("activity.focus.activeDescription"),
		chips: [
			options.t("activity.chips.active"),
			options.t("activity.chips.needsAttendance"),
		],
	};
}

export function resolveProjectName(
	project: ProjectResponse | null,
	fallback: string,
) {
	return project?.name ?? fallback;
}
