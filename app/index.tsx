import React from "react";

import { Redirect } from "expo-router";
import type { Href } from "expo-router";

import { HomeScreen } from "@/features/home";
import { useAuthStore } from "@/stores";

/* Expo typed routes have not regenerated the new route yet. Keep the cast local
until the route type manifest is refreshed. */
const WIRE_CREDENTIALS_ROUTE = "/wire-credentials" as Href;

export default function IndexRoute() {
	const isAuthenticated = useAuthStore(state => state.isAuthenticated);
	const requiresCredentialSetup = useAuthStore(
		state => state.requiresCredentialSetup,
	);

	if (!isAuthenticated) {
		return <Redirect href="/login" />;
	}

	if (requiresCredentialSetup) {
		return <Redirect href={WIRE_CREDENTIALS_ROUTE} />;
	}

	return <HomeScreen />;
}
