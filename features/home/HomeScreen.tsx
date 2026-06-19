import React, { useMemo } from "react";

import { View } from "react-native";

import { createPrimitiveSurfaceStyleSpec } from "@/app/styles";
import { Button, Badge, Label } from "@/components/primitives";
import { useAuthStore, useThemeStore } from "@/stores";

import { createStyles } from "./styles";

export function HomeScreen() {
	const theme = useThemeStore(state => state.theme);
	const sessionPayload = useAuthStore(state => state.sessionPayload);
	const signOut = useAuthStore(state => state.signOut);
	const isMutatingSession = useAuthStore(state => state.isMutatingSession);
	const surfaceSpec = useMemo(
		() => createPrimitiveSurfaceStyleSpec(theme),
		[theme],
	);
	const styles = useMemo(
		() => createStyles(theme, surfaceSpec),
		[surfaceSpec, theme],
	);

	return (
		<View style={styles.screen}>
			<View style={styles.panel}>
				<Badge
					tone="success"
					variant="secondary"
				>
					Session active
				</Badge>

				<View style={styles.header}>
					<Label role="title">You are signed in.</Label>
					<Label role="subtitle">
						{sessionPayload?.upn ?? "Your session is ready."}
					</Label>
				</View>

				<View style={styles.actions}>
					<Button
						loading={isMutatingSession}
						onPress={() => {
							void signOut();
						}}
						variant="secondary"
					>
						Log out
					</Button>
				</View>
			</View>
		</View>
	);
}
