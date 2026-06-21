import type { BadgeTone } from "../components/primitives/display/badge";

export interface DiscoverProjectCardProps {
	title: string;
	entityName: string;
	description: string;
	statusLabel: string;
	statusTone: BadgeTone;
	seatsLabel: string;
	hoursLabel: string;
	onPress: () => void;
}
