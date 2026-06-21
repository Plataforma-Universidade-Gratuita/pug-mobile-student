import type { ProjectStatus } from "@/types/api";

import type { BadgeTone } from "../components/primitives/display/badge";

export interface DiscoverFilters {
	query: string;
	entityIds: string[];
	statuses: ProjectStatus[];
}

export interface DiscoverFilterEntityOption {
	id: string;
	label: string;
}

export interface DiscoverFilterStatusOption {
	value: ProjectStatus;
	label: string;
}

export interface DiscoverFilterSheetProps {
	visible: boolean;
	filters: DiscoverFilters;
	entityOptions: DiscoverFilterEntityOption[];
	statusOptions: DiscoverFilterStatusOption[];
	onApply: (filters: DiscoverFilters) => void;
	onDismiss: () => void;
}

export interface DiscoverProjectCardProps {
	title: string;
	entityMeta: string;
	description: string;
	statusLabel: string;
	statusTone: BadgeTone;
	seatsLabel: string;
	hoursLabel: string;
	onPress: () => void;
}
