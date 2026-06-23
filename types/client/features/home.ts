import type { LucideIcon } from "lucide-react-native";

import type { PrimitiveBadgeProps } from "@/types/client/components";

export interface HomeSummaryMetricItem {
	label: string;
	value: string;
}

export interface HomeCounterpartSummaryCardProps {
	badgeLabel: string;
	courseLabel: string;
	dueDateLabel: string;
	name: string;
	progressLabel: string;
	progressRatio: number;
	remainingDaysLabel: string;
	summaryMetrics: HomeSummaryMetricItem[];
}

export interface HomeQuickActionItem {
	helper: string;
	icon: LucideIcon;
	label: string;
	onPress: () => void;
}

export interface HomeQuickActionsSectionProps {
	items: HomeQuickActionItem[];
}

export interface HomeActivitySnapshotCardProps {
	badgeLabel: string;
	badgeTone: PrimitiveBadgeProps["tone"];
	ctaLabel: string | null;
	description: string;
	eyebrow: string;
	onPress?: (() => void) | undefined;
	title: string;
}

export interface HomeQuickActionBuildArgs {
	latestAttendanceId: string | null;
	onAttendancesPress: () => void;
	onDiscoverPress: () => void;
	onEnrollmentsPress: () => void;
	onLatestQrPress: () => void;
	onProfilePress: () => void;
	t: (...args: any[]) => any;
}
