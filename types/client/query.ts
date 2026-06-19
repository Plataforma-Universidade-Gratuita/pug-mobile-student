import type { ReactNode } from "react";

export interface ApiErrorToastContent {
	title: ReactNode;
	description?: ReactNode;
}

export interface QueryErrorToastContent {
	title: ReactNode;
	description?: ReactNode;
}

export interface QueryErrorToastProps {
	error: unknown;
	errorUpdatedAt: number;
	getContent: (error: unknown) => QueryErrorToastContent;
	isError: boolean;
}

export interface QueryErrorToastDescriptor extends QueryErrorToastProps {
	key: string;
}

export interface DeferredUndoActionOptions {
	description: ReactNode;
	duration?: number;
	key: string;
	onCommit: () => void;
	title: ReactNode;
	undoLabel: ReactNode;
}

export type SearchDateBoundary = "start" | "end";

export interface ApiErrorToastOptions {
	fallbackTitle: ReactNode;
	fallbackDescription?: ReactNode;
}