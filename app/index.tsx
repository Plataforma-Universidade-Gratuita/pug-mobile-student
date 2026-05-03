import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { useAuthStore } from "@/store";

export default function HomeScreen() {
	const { t } = useTranslation();
	const router = useRouter();
	const isAuthenticated = useAuthStore(state => state.isAuthenticated);
	const isMutatingSession = useAuthStore(state => state.isMutatingSession);
	const sessionPayload = useAuthStore(state => state.sessionPayload);
	const signOut = useAuthStore(state => state.signOut);

	useEffect(() => {
		if (!isAuthenticated || !sessionPayload) {
			router.replace("/login");
		}
	}, [isAuthenticated, router, sessionPayload]);

	if (!isAuthenticated || !sessionPayload) {
		return null;
	}

	return (
		<View style={styles.container}>
			<View style={styles.card}>
				<Text style={styles.title}>{t("mobile.home.title")}</Text>
				<Text style={styles.description}>{t("mobile.home.description")}</Text>

				<View style={styles.detailList}>
					<View style={styles.detailItem}>
						<Text style={styles.detailLabel}>{t("mobile.home.fields.email")}</Text>
						<Text style={styles.detailValue}>{sessionPayload.upn}</Text>
					</View>

					<View style={styles.detailItem}>
						<Text style={styles.detailLabel}>
							{t("mobile.home.fields.accountId")}
						</Text>
						<Text style={styles.detailValue}>{sessionPayload.accountId}</Text>
					</View>

					<View style={styles.detailItem}>
						<Text style={styles.detailLabel}>{t("mobile.home.fields.userId")}</Text>
						<Text style={styles.detailValue}>{sessionPayload.userId}</Text>
					</View>

					<View style={styles.detailItem}>
						<Text style={styles.detailLabel}>{t("mobile.home.fields.groups")}</Text>
						<Text style={styles.detailValue}>
							{sessionPayload.groups.join(", ")}
						</Text>
					</View>
				</View>

				<Pressable
					disabled={isMutatingSession}
					onPress={() => void signOut()}
					style={({ pressed }) => [
						styles.button,
						pressed && !isMutatingSession ? styles.buttonPressed : null,
						isMutatingSession ? styles.buttonDisabled : null,
					]}
				>
					<Text style={styles.buttonText}>{t("Navbar.account.logout")}</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8fafc",
		padding: 20,
		justifyContent: "center",
	},
	card: {
		borderRadius: 16,
		backgroundColor: "#ffffff",
		padding: 24,
		gap: 20,
		shadowColor: "#0f172a",
		shadowOpacity: 0.08,
		shadowRadius: 16,
		shadowOffset: { width: 0, height: 8 },
		elevation: 4,
	},
	title: {
		fontSize: 24,
		fontWeight: "700",
		color: "#0f172a",
	},
	description: {
		fontSize: 15,
		lineHeight: 22,
		color: "#475569",
	},
	detailList: {
		gap: 14,
	},
	detailItem: {
		gap: 4,
	},
	detailLabel: {
		fontSize: 13,
		fontWeight: "600",
		color: "#64748b",
		textTransform: "uppercase",
	},
	detailValue: {
		fontSize: 16,
		color: "#0f172a",
	},
	button: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 12,
		backgroundColor: "#dc2626",
		paddingVertical: 14,
	},
	buttonPressed: {
		backgroundColor: "#b91c1c",
	},
	buttonDisabled: {
		opacity: 0.7,
	},
	buttonText: {
		fontSize: 16,
		fontWeight: "700",
		color: "#ffffff",
	},
});
