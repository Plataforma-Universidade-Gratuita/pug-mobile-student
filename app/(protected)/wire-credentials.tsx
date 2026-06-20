import React from "react";

import { Redirect } from "expo-router";
import type { Href } from "expo-router";

import { WireCredentialsScreen } from "@/features/auth/wire-credentials";
import { useAuthStore } from "@/stores";

const HOME_ROUTE = "/" as Href;
const LOGIN_ROUTE = "/login" as Href;

export default function WireCredentialsRoute() {
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

	if (!requiresCredentialSetup) {
		return <Redirect href={HOME_ROUTE} />;
	}

	return <WireCredentialsScreen />;
}
