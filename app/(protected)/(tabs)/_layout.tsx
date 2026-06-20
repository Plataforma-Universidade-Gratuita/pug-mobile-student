import React from "react";

import { Tabs } from "expo-router";

import {
	AuthenticatedShellTabs,
	createAuthenticatedShellTabScreenOptions,
} from "@/components";
import { useThemeStore } from "@/stores";

export default function ProtectedTabsLayout() {
	const theme = useThemeStore(state => state.theme);

	return (
		<Tabs screenOptions={createAuthenticatedShellTabScreenOptions(theme)}>
			<AuthenticatedShellTabs />
		</Tabs>
	);
}
