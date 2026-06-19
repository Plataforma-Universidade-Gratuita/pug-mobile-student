import React, { useMemo } from "react";

import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { createPrimitiveSurfaceStyleSpec } from "@/app/styles";
import { Button, Badge, Label } from "@/components/primitives";
import { useAuthStore, useThemeStore } from "@/stores";

import { createStyles } from "./styles";

export function HomeScreen() {
	const { t } = useTranslation();
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
					{t("home.badge")}
				</Badge>

				<View style={styles.header}>
					<Label role="title">{t("home.title")}</Label>
					<Label role="subtitle">
						{sessionPayload?.upn ?? t("home.subtitleFallback")}
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
						{t("home.logout")}
					</Button>
				</View>
			</View>
		</View>
	);
}
