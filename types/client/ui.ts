import type { LucideIcon } from "lucide-react-native";

import { BUTTON_SIZES, BUTTON_USAGES, BUTTON_VARIANTS } from "@/constants";

export type ButtonUsage = keyof typeof BUTTON_USAGES;
export type ButtonVariant = keyof typeof BUTTON_VARIANTS;
export type ButtonSize = keyof typeof BUTTON_SIZES;

export type BadgeTone =
	| "neutral"
	| "brand"
	| "success"
	| "info"
	| "warning"
	| "danger";

export type BadgeVariant = "primary" | "secondary";

export type TabsVariant = "default" | "icon";

export type IconComponent = LucideIcon;
