import React, { useMemo } from "react";

import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeStore } from "@/stores";

import { createTabBarStyles } from "./tab-bar-styles";

const TAB_ICON_SIZE = 24;

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
			<View
				pointerEvents="none"
				style={styles.topEdge}
			/>
			<View style={styles.rail}>
				{state.routes.map((route, index) => {
					const isFocused = state.index === index;
					const descriptor = descriptors[route.key];
					const options = descriptor?.options;

					if (!descriptor || !options) {
						return null;
					}

					const color = isFocused
						? theme.colors.tabFgActive
						: theme.colors.tabFgInactive;
					const icon = options.tabBarIcon?.({
						focused: isFocused,
						color,
						size: TAB_ICON_SIZE,
					});
					const accessibilityLabel =
						typeof options.title === "string" ? options.title : route.name;

					return (
						<Pressable
							key={route.key}
							accessibilityLabel={accessibilityLabel}
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
						</Pressable>
					);
				})}
			</View>
		</View>
	);
}