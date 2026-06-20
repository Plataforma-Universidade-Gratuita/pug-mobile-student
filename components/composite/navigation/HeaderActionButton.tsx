import React, { useMemo } from "react";

import { Pressable } from "react-native";

import { useThemeStore } from "@/stores";
import type { HeaderActionButtonProps } from "@/types/client";

import { createStyles } from "./styles";

export function HeaderActionButton({
	icon: Icon,
	accessibilityLabel,
	onPress,
	disabled = false,
	style,
}: HeaderActionButtonProps) {
	const theme = useThemeStore(state => state.theme);
	const styles = useMemo(() => createStyles(theme), [theme]);

	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel}
			disabled={disabled}
			onPress={onPress}
			style={({ pressed }) => [
				styles.actionButton,
				{
					backgroundColor: pressed
						? theme.colors.chromeBgHover
						: theme.colors.chromeBg,
					borderColor: theme.colors.border2,
					borderRadius: theme.radius.md,
					opacity: disabled ? 0.5 : 1,
				},
				style,
			]}
		>
			<Icon
				color={theme.colors.chromeFg}
				size={18}
				strokeWidth={2.25}
			/>
		</Pressable>
	);
}
