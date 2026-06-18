import type { ReactNode } from "react";
import type { Dispatch, SetStateAction } from "react";

export type ServicePageSizeOption = 25 | 50 | 100 | "all";

export interface ServicePagePaginationEntry {
	page: number;
	size: ServicePageSizeOption;
}

export interface UseServicePagePaginationOptions {
	key: string;
	totalPages?: number;
	defaultPage?: number;
	defaultSize?: ServicePageSizeOption;
}

export interface UseServicePagePaginationResult {
	currentPage: number;
	pageSize: ServicePageSizeOption;
	isAll: boolean;
	backendPage: number | null;
	backendSize: number | null;
	totalPages: number;
	canGoToPreviousPage: boolean;
	canGoToNextPage: boolean;
	setCurrentPage: (page: number) => void;
	setPageSize: (size: ServicePageSizeOption) => void;
	resetPage: () => void;
	goToFirstPage: () => void;
	goToPreviousPage: () => void;
	goToNextPage: () => void;
	goToLastPage: () => void;
}

export interface UseServicePageEditorStateOptions<TMode extends string> {
	createMode: TMode;
	defaultMode: TMode;
}

export interface ServicePageEditorState<
	TMode extends string,
	TId extends string = string,
> {
	editorId: TId | null;
	editorMode: TMode;
	isOpen: boolean;
	openCreate: () => void;
	openEditor: (id: TId, mode: TMode) => void;
	closeEditor: () => void;
	handleOpenChange: (open: boolean) => void;
	clearIfMatches: (id: TId) => void;
}

export interface ActivatableRecordPendingStatus<TRecord> {
	active: boolean;
	record: TRecord;
}

export interface ActivatableRecordMutationLike<TVariables> {
	mutate: (
		variables: TVariables,
		options: {
			onSuccess: () => void;
			onError: (error: unknown) => void;
		},
	) => void;
}

export interface UseActivatableRecordActionsOptions<
	TRecord,
	TStatusVariables,
	TDeleteVariables,
> {
	deleteMutation: ActivatableRecordMutationLike<TDeleteVariables>;
	getDeleteErrorToastContent: (
		error: unknown,
		record: TRecord,
	) => {
		title: ReactNode;
		description?: ReactNode;
	};
	getDeleteSuccessToastContent: (record: TRecord) => {
		title: ReactNode;
		description?: ReactNode;
	};
	getDeleteUndoToastContent: (record: TRecord) => {
		key: string;
		title: ReactNode;
		description: ReactNode;
		undoLabel: ReactNode;
	};
	getDeleteVariables: (record: TRecord) => TDeleteVariables;
	getStatusErrorToastContent: (
		error: unknown,
		record: TRecord,
		active: boolean,
	) => {
		title: ReactNode;
		description?: ReactNode;
	};
	getStatusSuccessToastContent: (
		record: TRecord,
		active: boolean,
	) => {
		title: ReactNode;
		description?: ReactNode;
	};
	getStatusVariables: (record: TRecord, active: boolean) => TStatusVariables;
	onDeleteSuccess?: (record: TRecord) => void;
	statusMutation: ActivatableRecordMutationLike<TStatusVariables>;
}

export interface UseActivatableRecordActionsResult<TRecord> {
	confirmDelete: () => void;
	confirmStatusChange: () => void;
	pendingDeleteRecord: TRecord | null;
	pendingStatusRecord: ActivatableRecordPendingStatus<TRecord> | null;
	setPendingDeleteRecord: (record: TRecord | null) => void;
	setPendingStatusRecord: (
		pendingStatus: ActivatableRecordPendingStatus<TRecord> | null,
	) => void;
}

export type ServicePageDraftFilters = object;

export interface UseDraftFiltersOptions<
	TFilters extends ServicePageDraftFilters,
> {
	initialFilters: TFilters;
}

export interface UseDraftFiltersResult<
	TFilters extends ServicePageDraftFilters,
> {
	appliedFilters: TFilters;
	draftFilters: TFilters;
	hasAppliedFilters: boolean;
	applyDraftFilters: () => void;
	clearFilters: () => void;
	setAppliedFilters: Dispatch<SetStateAction<TFilters>>;
	setDraftFilter: <TKey extends keyof TFilters>(
		key: TKey,
		value: TFilters[TKey],
	) => void;
	setDraftFilters: Dispatch<SetStateAction<TFilters>>;
}
