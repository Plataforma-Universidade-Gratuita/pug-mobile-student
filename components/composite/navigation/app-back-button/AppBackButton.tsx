import React from "react";

import { ChevronLeft } from "lucide-react-native";

import type { AppBackButtonProps } from "@/types/client";

import { HeaderActionButton } from "../header-action-button";

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
