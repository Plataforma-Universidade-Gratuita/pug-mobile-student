import React from "react";

import { ChevronLeft } from "lucide-react-native";

import { HeaderActionButton } from "@/components";
import type { AppBackButtonProps } from "@/types/client";

export function AppBackButton({
	accessibilityLabel = "Go back",
	onPress,
	style,
}: AppBackButtonProps) {
	const actionProps = onPress ? { onPress } : {};

	return (
		<HeaderActionButton
			accessibilityLabel={accessibilityLabel}
			icon={ChevronLeft}
			{...actionProps}
			style={style}
		/>
	);
}
