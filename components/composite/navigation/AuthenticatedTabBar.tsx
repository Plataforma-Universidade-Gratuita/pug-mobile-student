import React, { useMemo } from "react";

import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Label } from "@/components/primitives";
import { useThemeStore } from "@/stores";

import { createTabBarStyles } from "./tab-bar-styles";

const TAB_ICON_SIZE = 22;

function resolveTabLabel(
	label: BottomTabBarProps["descriptors"][string]["options"]["tabBarLabel"],
	title?: string,
) {
	if (typeof label === "string") {
		return label;
	}

	return title ?? "";
}

export function AuthenticatedTabBar({
	state,
	descriptors,
	navigation,
}: BottomTabBarProps) {
	const theme = useThemeStore(state => state.theme);
	const insets = useSafeAreaInsets();
	const styles = useMemo(
		() => createTabBarStyles(theme, insets.bottom),
		[insets.bottom, theme],
	);

	return (
		<View style={styles.container}>
			<View style={styles.rail}>
				{state.routes.map((route, index) => {
					const isFocused = state.index === index;
					const descriptor = descriptors[route.key];
					const options = descriptor?.options;

					if (!descriptor || !options) {
						return null;
					}

					const color = isFocused
						? theme.colors.brand
						: theme.colors.chromeMuted;
					const label = resolveTabLabel(options.tabBarLabel, options.title);
					const icon = options.tabBarIcon?.({
						focused: isFocused,
						color,
						size: TAB_ICON_SIZE,
					});

					return (
						<Pressable
							key={route.key}
							accessibilityRole="tab"
							accessibilityState={isFocused ? { selected: true } : {}}
							onLongPress={() => {
								navigation.emit({
									type: "tabLongPress",
									target: route.key,
								});
							}}
							onPress={() => {
								const event = navigation.emit({
									type: "tabPress",
									target: route.key,
									canPreventDefault: true,
								});

								if (isFocused || event.defaultPrevented) {
									return;
								}

								navigation.navigate(route.name, route.params);
							}}
							style={({ pressed }) => [
								styles.item,
								isFocused ? styles.itemActive : null,
								pressed ? styles.itemPressed : null,
							]}
						>
							<View style={styles.iconSlot}>{icon}</View>
							<Label
								align="center"
								role="caption"
								style={[
									styles.label,
									{ color },
									isFocused ? styles.labelActive : null,
								]}
							>
								{label}
							</Label>
						</Pressable>
					);
				})}
			</View>
		</View>
	);
}
