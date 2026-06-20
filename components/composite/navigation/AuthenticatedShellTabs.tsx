import React from "react";

import { Tabs } from "expo-router";
import { Compass, House, ListChecks, UserRound } from "lucide-react-native";

import type { AppResolvedTheme } from "@/types/client";

const TAB_ICON_SIZE = 18;

export function createAuthenticatedShellTabScreenOptions(
	theme: AppResolvedTheme,
) {
	return {
		headerShown: false,
		tabBarActiveTintColor: theme.colors.brand,
		tabBarInactiveTintColor: theme.colors.chromeMuted,
		tabBarHideOnKeyboard: true,
		tabBarLabelStyle: {
			fontFamily: theme.font.sans,
			fontSize: theme.type.xs,
			fontWeight: theme.weight.semibold,
		},
		tabBarStyle: {
			backgroundColor: theme.colors.surface2,
			borderTopColor: theme.colors.border2,
			height: 68,
			paddingBottom: theme.space[2],
			paddingTop: theme.space[2],
		},
		sceneStyle: {
			backgroundColor: theme.colors.surface1,
		},
	} as const;
}

export function AuthenticatedShellTabs() {
	return (
		<>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => (
						<House
							color={color}
							size={TAB_ICON_SIZE}
							strokeWidth={2.1}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="discover"
				options={{
					title: "Discover",
					tabBarIcon: ({ color }) => (
						<Compass
							color={color}
							size={TAB_ICON_SIZE}
							strokeWidth={2.1}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="activity"
				options={{
					title: "Activity",
					tabBarIcon: ({ color }) => (
						<ListChecks
							color={color}
							size={TAB_ICON_SIZE}
							strokeWidth={2.1}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color }) => (
						<UserRound
							color={color}
							size={TAB_ICON_SIZE}
							strokeWidth={2.1}
						/>
					),
				}}
			/>
		</>
	);
}
