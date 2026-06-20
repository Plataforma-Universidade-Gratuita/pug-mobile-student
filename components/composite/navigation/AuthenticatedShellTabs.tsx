import React from "react";

import { Tabs } from "expo-router";
import { Compass, House, ListChecks, UserRound } from "lucide-react-native";

import { AUTHENTICATED_SHELL_TAB_ICON_SIZE } from "./constants";

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
							size={AUTHENTICATED_SHELL_TAB_ICON_SIZE}
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
							size={AUTHENTICATED_SHELL_TAB_ICON_SIZE}
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
							size={AUTHENTICATED_SHELL_TAB_ICON_SIZE}
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
							size={AUTHENTICATED_SHELL_TAB_ICON_SIZE}
							strokeWidth={2.1}
						/>
					),
				}}
			/>
		</>
	);
}
