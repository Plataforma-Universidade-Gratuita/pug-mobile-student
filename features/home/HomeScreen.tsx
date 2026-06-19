import React from "react";

import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Button, Badge, Label } from "@/components/primitives";
import { useAuthScreen } from "@/hooks";
import { useAuthStore } from "@/stores";

import { createStyles } from "./styles";

export function HomeScreen() {
	const { t } = useTranslation();
	const signOut = useAuthStore(state => state.signOut);
	const { isMutatingSession, styles } = useAuthScreen(createStyles);

	return (
		<View style={styles.screen}>
			<View style={styles.content}>
				<View style={styles.shell}>
					<Badge
						style={styles.badge}
						tone="success"
						variant="primary"
					>
						{t("home.badge")}
					</Badge>

					<View style={styles.header}>
						<Label role="title">{t("home.title")}</Label>
						<Label role="subtitle">{t("home.subtitleFallback")}</Label>
					</View>

					<Button
						loading={isMutatingSession}
						onPress={() => {
							void signOut();
						}}
					>
						{t("home.logout")}
					</Button>
				</View>
			</View>
		</View>
	);
}
