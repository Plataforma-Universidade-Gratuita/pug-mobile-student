/*
 * Copyright (c) 2026 Mateus Fernandes and Plataforma Universidade Gratuita.
 * All rights reserved.
 *
 * This source code is proprietary and confidential. Unauthorized use,
 * copying, modification, distribution, or deployment is prohibited.
 */

export const DISCOVERABLE_PROJECT_STATUSES = [
	"IN_PROGRESS",
	"PLANNED",
	"ON_HOLD",
] as const;

export const DISCOVER_EXCLUDED_ENROLLMENT_STATUSES = [
	"PENDING",
	"APPROVED",
	"ON_HOLD",
] as const;

export const DISCOVER_PROJECT_STATUS_ORDER = {
	IN_PROGRESS: 0,
	PLANNED: 1,
	ON_HOLD: 2,
	COMPLETED: 3,
	CANCELED: 4,
} as const;
