import type { BadgeTone } from "../components/primitives/display/badge";

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
