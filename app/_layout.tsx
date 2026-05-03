import React, { useEffect, useRef } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { I18nextProvider, useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { DEFAULT_LANG } from "@/constants/locale";
import { APP_QUERY_CLIENT_OPTIONS } from "@/constants/react-query";
import { useAuthStore } from "@/store";
import { initI18n } from "@/utils/locale";

const i18n = initI18n(DEFAULT_LANG);
const queryClient = new QueryClient(APP_QUERY_CLIENT_OPTIONS);

function BootstrapScreen() {
	const { t } = useTranslation();

	return (
		<View style={styles.centered}>
			<ActivityIndicator
				size="large"
				color="#2563eb"
			/>
			<Text style={styles.bootText}>{t("mobile.bootstrapping")}</Text>
		</View>
	);
}

function RootNavigator() {
	const bootstrapSession = useAuthStore(state => state.bootstrapSession);
	const isBootstrapping = useAuthStore(state => state.isBootstrapping);
	const hasBootstrapped = useRef(false);

	useEffect(() => {
		if (hasBootstrapped.current) {
			return;
		}

		hasBootstrapped.current = true;
		void bootstrapSession();
	}, [bootstrapSession, hasBootstrapped]);

	return (
		<View style={styles.container}>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="index" />
				<Stack.Screen name="login" />
			</Stack>

			{isBootstrapping ? (
				<View style={styles.bootstrapOverlay}>
					<BootstrapScreen />
				</View>
			) : null}
		</View>
	);
}

export default function RootLayout() {
	return (
		<I18nextProvider i18n={i18n}>
			<QueryClientProvider client={queryClient}>
				<RootNavigator />
			</QueryClientProvider>
		</I18nextProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	centered: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#f8fafc",
		padding: 24,
	},
	bootText: {
		marginTop: 16,
		fontSize: 16,
		color: "#0f172a",
	},
	bootstrapOverlay: {
		...StyleSheet.absoluteFillObject,
	},
});
