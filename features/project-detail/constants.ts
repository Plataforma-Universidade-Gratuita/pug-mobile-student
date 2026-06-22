import type { EnrollmentStatus } from "@/types/api";

export const MANAGEABLE_ENROLLMENT_STATUSES: EnrollmentStatus[] = ["APPROVED"];

export const ACTIVE_PARTICIPANT_STATUSES: EnrollmentStatus[] = [
	"APPROVED",
	"ON_HOLD",
];

export const PENDING_ENROLLMENT_STATUS = "PENDING" as const;
