import React from "react";

import { Redirect } from "expo-router";
import type { Href } from "expo-router";

import { LoginScreen } from "@/features/auth/login";
import { useAuthStore } from "@/stores";

/* Expo typed routes have not regenerated the new route yet. Keep the cast local
until the route type manifest is refreshed. */
const WIRE_CREDENTIALS_ROUTE = "/wire-credentials" as Href;

export default function LoginRoute() {
	const isAuthenticated = useAuthStore(state => state.isAuthenticated);
	const requiresCredentialSetup = useAuthStore(
		state => state.requiresCredentialSetup,
	);

	if (isAuthenticated) {
		if (requiresCredentialSetup) {
			return <Redirect href={WIRE_CREDENTIALS_ROUTE} />;
		}

		return <Redirect href="/" />;
	}

	return <LoginScreen />;
}
