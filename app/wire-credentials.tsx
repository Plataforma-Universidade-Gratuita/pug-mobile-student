import React from "react";

import { Redirect } from "expo-router";

import { WireCredentialsScreen } from "@/features/auth/wire-credentials";
import { useAuthStore } from "@/stores";

export default function WireCredentialsRoute() {
	const isAuthenticated = useAuthStore(state => state.isAuthenticated);
	const requiresCredentialSetup = useAuthStore(
		state => state.requiresCredentialSetup,
	);

	if (!isAuthenticated) {
		return <Redirect href="/login" />;
	}

	if (!requiresCredentialSetup) {
		return <Redirect href="/" />;
	}

	return <WireCredentialsScreen />;
}
