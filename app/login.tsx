import React, { useEffect, useState } from "react";

import { useRouter } from "expo-router";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";

import { useLocalizedZodForm } from "@/hooks";
import { createLoginFormSchema } from "@/schemas/client";
import { useAuthStore } from "@/store";
import { getApiErrorMessage } from "@/utils/api-errors";

export default function LoginScreen() {
	const { t } = useTranslation();
	const router = useRouter();
	const isAuthenticated = useAuthStore(state => state.isAuthenticated);
	const isMutatingSession = useAuthStore(state => state.isMutatingSession);
	const signIn = useAuthStore(state => state.signIn);
	const [submitError, setSubmitError] = useState<string | null>(null);

	const form = useLocalizedZodForm({
		schemaFactory: createLoginFormSchema,
		defaultValues: {
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		if (isAuthenticated) {
			router.replace("/");
		}
	}, [isAuthenticated, router]);

	if (isAuthenticated) {
		return null;
	}

	const onSubmit = form.handleSubmit(async values => {
		setSubmitError(null);

		try {
			await signIn(values);
		} catch (error) {
			setSubmitError(
				getApiErrorMessage(error) ?? t("auth.login.feedback.error"),
			);
		}
	});

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : undefined}
			style={styles.container}
		>
			<View style={styles.card}>
				<Text style={styles.brand}>{t("auth.login.brand.name")}</Text>
				<Text style={styles.subtitle}>{t("auth.login.brand.subtitle")}</Text>

				<View style={styles.header}>
					<Text style={styles.title}>{t("auth.login.form.title")}</Text>
					<Text style={styles.description}>
						{t("auth.login.form.description")}
					</Text>
				</View>

				<View style={styles.form}>
					<Controller
						control={form.control}
						name="email"
						render={({ field: { onBlur, onChange, value } }) => (
							<View style={styles.field}>
								<Text style={styles.label}>
									{t("auth.login.form.fields.email.label")}
								</Text>
								<TextInput
									autoCapitalize="none"
									autoComplete="email"
									keyboardType="email-address"
									onBlur={onBlur}
									onChangeText={onChange}
									placeholder={t("auth.login.form.fields.email.placeholder")}
									placeholderTextColor="#94a3b8"
									style={styles.input}
									value={value}
								/>
								{form.formState.errors.email ? (
									<Text style={styles.errorText}>
										{form.formState.errors.email.message}
									</Text>
								) : null}
							</View>
						)}
					/>

					<Controller
						control={form.control}
						name="password"
						render={({ field: { onBlur, onChange, value } }) => (
							<View style={styles.field}>
								<Text style={styles.label}>
									{t("auth.login.form.fields.password.label")}
								</Text>
								<TextInput
									autoCapitalize="none"
									autoComplete="password"
									onBlur={onBlur}
									onChangeText={onChange}
									placeholder={t("auth.login.form.fields.password.placeholder")}
									placeholderTextColor="#94a3b8"
									secureTextEntry
									style={styles.input}
									value={value}
								/>
								{form.formState.errors.password ? (
									<Text style={styles.errorText}>
										{form.formState.errors.password.message}
									</Text>
								) : null}
							</View>
						)}
					/>

					{submitError ? (
						<Text style={styles.errorText}>{submitError}</Text>
					) : null}

					<Pressable
						disabled={isMutatingSession}
						onPress={() => void onSubmit()}
						style={({ pressed }) => [
							styles.button,
							pressed && !isMutatingSession ? styles.buttonPressed : null,
							isMutatingSession ? styles.buttonDisabled : null,
						]}
					>
						{isMutatingSession ? (
							<ActivityIndicator color="#ffffff" />
						) : (
							<Text style={styles.buttonText}>
								{t("auth.login.form.submit")}
							</Text>
						)}
					</Pressable>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: "#eff6ff",
		padding: 20,
	},
	card: {
		backgroundColor: "#ffffff",
		borderRadius: 16,
		padding: 24,
		gap: 24,
		shadowColor: "#0f172a",
		shadowOpacity: 0.08,
		shadowRadius: 16,
		shadowOffset: { width: 0, height: 8 },
		elevation: 4,
	},
	brand: {
		fontSize: 24,
		fontWeight: "700",
		color: "#0f172a",
	},
	subtitle: {
		fontSize: 14,
		color: "#475569",
		marginTop: 4,
	},
	header: {
		gap: 8,
	},
	title: {
		fontSize: 22,
		fontWeight: "700",
		color: "#0f172a",
	},
	description: {
		fontSize: 15,
		lineHeight: 22,
		color: "#475569",
	},
	form: {
		gap: 16,
	},
	field: {
		gap: 8,
	},
	label: {
		fontSize: 14,
		fontWeight: "600",
		color: "#0f172a",
	},
	input: {
		borderWidth: 1,
		borderColor: "#cbd5e1",
		borderRadius: 12,
		paddingHorizontal: 14,
		paddingVertical: 12,
		fontSize: 16,
		color: "#0f172a",
		backgroundColor: "#ffffff",
	},
	errorText: {
		fontSize: 13,
		color: "#b91c1c",
	},
	button: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 12,
		backgroundColor: "#2563eb",
		paddingVertical: 14,
	},
	buttonPressed: {
		backgroundColor: "#1d4ed8",
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
