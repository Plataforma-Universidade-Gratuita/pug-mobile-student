import React from "react";

import { Tabs } from "expo-router";
import { Compass, House, ListChecks, UserRound } from "lucide-react-native";

import { createAuthenticatedShellTabScreenOptions } from "@/components";
import { useThemeStore } from "@/stores";

const TAB_ICON_SIZE = 22;

export default function ProtectedTabsLayout() {
	const theme = useThemeStore(state => state.theme);

	return (
		<Tabs screenOptions={createAuthenticatedShellTabScreenOptions(theme)}>
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
		</Tabs>
	);
}
