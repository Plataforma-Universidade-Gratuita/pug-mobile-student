import React from "react";

import { Redirect, Stack, usePathname } from "expo-router";
import type { Href } from "expo-router";

import { useAuthStore } from "@/stores";

const HOME_ROUTE = "/" as Href;
const LOGIN_ROUTE = "/login" as Href;
const WIRE_CREDENTIALS_ROUTE = "/wire-credentials" as Href;

export default function ProtectedLayout() {
	const pathname = usePathname();
	const isAuthenticated = useAuthStore(state => state.isAuthenticated);
	const isBootstrapping = useAuthStore(state => state.isBootstrapping);
	const requiresCredentialSetup = useAuthStore(
		state => state.requiresCredentialSetup,
	);

	if (isBootstrapping) {
		return null;
	}

	if (!isAuthenticated) {
		return <Redirect href={LOGIN_ROUTE} />;
	}

	if (requiresCredentialSetup && pathname !== WIRE_CREDENTIALS_ROUTE) {
		return <Redirect href={WIRE_CREDENTIALS_ROUTE} />;
	}

	if (!requiresCredentialSetup && pathname === WIRE_CREDENTIALS_ROUTE) {
		return <Redirect href={HOME_ROUTE} />;
	}

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="(tabs)" />
			<Stack.Screen name="wire-credentials" />
			<Stack.Screen name="(modals)" options={{ presentation: "modal" }} />
		</Stack>
	);
}
