import {
    AccountComplexSearchFilters,
    EntityComplexSearchFilters, ProjectComplexSearchFilters,
    SearchDateBoundary, StaffComplexSearchFilters,
    UserComplexSearchFilters
} from "@/types/client";
import {
    AttendanceComplexSearchRequest, AttendanceStatus, EnrollmentComplexSearchRequest, EnrollmentStatus,
    EntityComplexSearchRequest, ProjectComplexSearchRequest,
    StaffComplexSearchRequest,
    UserComplexSearchRequest
} from "@/types/api";

export function buildAccountComplexSearchRequest(
    filters: AccountComplexSearchFilters,
) {
    const normalizedName = filters.name.trim();
    const normalizedCpf = normalizeCpfSearch(filters.cpf.trim());
    const normalizedEmail = filters.email.trim();
    const normalizedDateFrom = toSearchDateOffsetDateTime(
        filters.dateFrom.trim(),
        "start",
    );
    const normalizedDateTo = toSearchDateOffsetDateTime(
        filters.dateTo.trim(),
        "end",
    );
    const normalizedAccountTypes = filters.accountTypes.filter(
        (accountType): accountType is Exclude<typeof accountType, ""> =>
            accountType.length > 0,
    );

    return {
        name: normalizedName || undefined,
        cpf: normalizedCpf || undefined,
        email: normalizedEmail || undefined,
        accountTypes:
            normalizedAccountTypes.length > 0 ? normalizedAccountTypes : undefined,
        dateFrom: normalizedDateFrom,
        dateTo: normalizedDateTo,
        activeOnly: filters.activeOnly,
    };
}

function normalizeCpfSearch(value: string) {
    return value.replace(/\D+/g, "");
}

export function toSearchDateOffsetDateTime(
    value: string,
    boundary: SearchDateBoundary,
) {
    const timestamp = getSearchDateBoundaryTimestamp(value, boundary);

    if (timestamp === null) {
        return undefined;
    }

    return new Date(timestamp).toISOString();
}

export function getSearchDateBoundaryTimestamp(
    value: string,
    boundary: SearchDateBoundary,
) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    setBoundaryHours(date, boundary);
    return date.getTime();
}

function setBoundaryHours(date: Date, boundary: SearchDateBoundary) {
    if (boundary === "start") {
        date.setHours(0, 0, 0, 0);
        return;
    }

    date.setHours(23, 59, 59, 999);
}

export function buildUserComplexSearchRequest(
    filters: UserComplexSearchFilters,
): UserComplexSearchRequest {
    const normalizedName = filters.name.trim();
    const normalizedCpf = normalizeCpfSearch(filters.cpf.trim());
    const normalizedDateFrom = toSearchDateOffsetDateTime(
        filters.dateFrom.trim(),
        "start",
    );
    const normalizedDateTo = toSearchDateOffsetDateTime(
        filters.dateTo.trim(),
        "end",
    );

    return {
        name: normalizedName || undefined,
        cpf: normalizedCpf || undefined,
        dateFrom: normalizedDateFrom,
        dateTo: normalizedDateTo,
    };
}

export function buildEntityComplexSearchRequest(
    filters: EntityComplexSearchFilters,
): EntityComplexSearchRequest {
    return {
        ...(filters.cityIdsFilter.length > 0
            ? { cityIds: filters.cityIdsFilter }
            : {}),
        ...(filters.dateFrom
            ? { dateFrom: toSearchDateOffsetDateTime(filters.dateFrom, "start") }
            : {}),
        ...(filters.dateTo
            ? { dateTo: toSearchDateOffsetDateTime(filters.dateTo, "end") }
            : {}),
    };
}

export function buildStaffComplexSearchRequest(
    filters: StaffComplexSearchFilters,
): StaffComplexSearchRequest {
    const normalizedName = filters.name.trim();
    const normalizedCpf = normalizeCpfSearch(filters.cpf.trim());
    const normalizedEmail = filters.email.trim();
    const normalizedDateFrom = toSearchDateOffsetDateTime(
        filters.dateFrom.trim(),
        "start",
    );
    const normalizedDateTo = toSearchDateOffsetDateTime(
        filters.dateTo.trim(),
        "end",
    );

    return {
        name: normalizedName || undefined,
        cpf: normalizedCpf || undefined,
        email: normalizedEmail || undefined,
        entityIds: filters.entityIds.length > 0 ? filters.entityIds : undefined,
        dateFrom: normalizedDateFrom,
        dateTo: normalizedDateTo,
        activeOnly: filters.activeOnly,
    };
}

export function buildAttendanceComplexSearchRequest(filters: {
    projectIds: string[];
    formerStudentIds: string[];
    statuses: AttendanceStatus[];
    validatedByIds: string[];
    durationFrom: string;
    durationTo: string;
    dateFrom: string;
    dateTo: string;
}): AttendanceComplexSearchRequest {
    return {
        projectIds: filters.projectIds.length > 0 ? filters.projectIds : undefined,
        formerStudentIds:
            filters.formerStudentIds.length > 0
                ? filters.formerStudentIds
                : undefined,
        statuses: filters.statuses.length > 0 ? filters.statuses : undefined,
        validatedByIds:
            filters.validatedByIds.length > 0 ? filters.validatedByIds : undefined,
        durationFrom: filters.durationFrom.trim()
            ? Number(filters.durationFrom)
            : undefined,
        durationTo: filters.durationTo.trim()
            ? Number(filters.durationTo)
            : undefined,
        dateFrom: toSearchDateOffsetDateTime(filters.dateFrom, "start"),
        dateTo: toSearchDateOffsetDateTime(filters.dateTo, "end"),
    };
}

export function buildEnrollmentComplexSearchRequest(filters: {
    projectIds: string[];
    formerStudentIds: string[];
    statuses: EnrollmentStatus[];
    dateFrom: string;
    dateTo: string;
    periodFrom: string;
    periodTo: string;
}): EnrollmentComplexSearchRequest {
    return {
        projectIds: filters.projectIds.length > 0 ? filters.projectIds : undefined,
        formerStudentIds:
            filters.formerStudentIds.length > 0
                ? filters.formerStudentIds
                : undefined,
        statuses: filters.statuses.length > 0 ? filters.statuses : undefined,
        dateFrom: toSearchDateOffsetDateTime(filters.dateFrom, "start"),
        dateTo: toSearchDateOffsetDateTime(filters.dateTo, "end"),
        periodFrom: filters.periodFrom || undefined,
        periodTo: filters.periodTo || undefined,
    };
}

export function buildProjectComplexSearchRequest(
    filters: ProjectComplexSearchFilters,
): ProjectComplexSearchRequest {
    return {
        name: filters.name.trim() || undefined,
        entityIds: filters.entityIds.length > 0 ? filters.entityIds : undefined,
        description: filters.description.trim() || undefined,
        createdByIds:
            filters.createdByIds.length > 0 ? filters.createdByIds : undefined,
        statuses: filters.statuses.length > 0 ? filters.statuses : undefined,
        maxOfferedHours: parseOptionalPositiveNumber(filters.maxOfferedHours),
        minOfferedHours: parseOptionalPositiveNumber(filters.minOfferedHours),
        dateFrom: toSearchDateOffsetDateTime(filters.dateFrom, "start"),
        dateTo: toSearchDateOffsetDateTime(filters.dateTo, "end"),
    };
}

function parseOptionalPositiveNumber(value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
        return undefined;
    }

    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed) || parsed < 0) {
        return undefined;
    }

    return parsed;
}