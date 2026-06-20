import React from "react";

import { Redirect } from "expo-router";
import type { Href } from "expo-router";

import { LoginScreen } from "@/features/auth/login";
import { useAuthStore } from "@/stores";

const HOME_ROUTE = "/" as Href;
const WIRE_CREDENTIALS_ROUTE = "/wire-credentials" as Href;

export default function LoginRoute() {
	const isAuthenticated = useAuthStore(state => state.isAuthenticated);
	const isBootstrapping = useAuthStore(state => state.isBootstrapping);
	const requiresCredentialSetup = useAuthStore(
		state => state.requiresCredentialSetup,
	);

	if (isBootstrapping) {
		return null;
	}

	if (isAuthenticated) {
		if (requiresCredentialSetup) {
			return <Redirect href={WIRE_CREDENTIALS_ROUTE} />;
		}

		return <Redirect href={HOME_ROUTE} />;
	}

	return <LoginScreen />;
}
