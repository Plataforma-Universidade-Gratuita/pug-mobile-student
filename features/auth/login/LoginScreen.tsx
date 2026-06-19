import React, { useState } from "react";

import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

import { Button, Badge, Input, Label } from "@/components/primitives";
import { useAuthScreen, useServerErrorState } from "@/hooks";
import { useAuthStore } from "@/stores";

import { createStyles } from "./styles";
import {
	normalizeLoginEmail,
	normalizeLoginPassword,
	resolveLoginErrorMessageWithMessages,
	validateLoginEmailWithMessages,
} from "./utils";

export function LoginScreen() {
	const { t } = useTranslation();
	const router = useRouter();
	const signIn = useAuthStore(state => state.signIn);
	const { isMutatingSession, styles } = useAuthScreen(createStyles);
	const { clearServerError, serverError, setServerError } =
		useServerErrorState();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState<string | null>(null);

	async function handleSubmit() {
		const nextEmailError = validateLoginEmailWithMessages(email, {
			required: t("auth.login.errors.emailRequired"),
			invalid: t("auth.login.errors.emailInvalid"),
		});

		setEmailError(nextEmailError);
		clearServerError();

		if (nextEmailError) {
			return;
		}

		try {
			const tokens = await signIn({
				email: normalizeLoginEmail(email),
				password: normalizeLoginPassword(password),
			});

			if (!tokens.passwordWired) {
				router.replace("/wire-credentials");
				return;
			}

			router.replace("/");
		} catch (error) {
			setServerError(
				resolveLoginErrorMessageWithMessages(error, {
					invalidCredentials: t("auth.login.errors.invalidCredentials"),
					fallback: t("auth.login.errors.fallback"),
				}),
			);
		}
	}

	return (
		<View style={styles.screen}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				style={styles.keyboard}
			>
				<ScrollView
					contentContainerStyle={styles.content}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.panel}>
						<Badge
							style={styles.badge}
							tone="brand"
							variant="primary"
						>
							{t("auth.login.badge")}
						</Badge>

						<View style={styles.header}>
							<Label role="title">{t("auth.login.title")}</Label>
							<Label role="subtitle">{t("auth.login.subtitle")}</Label>
						</View>

						<View style={styles.form}>
							<View style={styles.field}>
								<Label role="field">{t("auth.login.emailLabel")}</Label>
								<Input
									autoComplete="email"
									onChangeText={value => {
										setEmail(value);
										if (emailError) {
											setEmailError(null);
										}
										clearServerError();
									}}
									onSubmitEditing={handleSubmit}
									returnKeyType="next"
									type="email"
									value={email}
									error={emailError}
								/>
							</View>

							<View style={styles.field}>
								<Label role="field">{t("auth.login.passwordLabel")}</Label>
								<Input
									autoComplete="password"
									helperText={t("auth.login.passwordHelper")}
									onChangeText={value => {
										setPassword(value);
										clearServerError();
									}}
									onSubmitEditing={handleSubmit}
									returnKeyType="done"
									type="password"
									value={password}
								/>
							</View>

							{serverError ? (
								<Label
									role="helper"
									tone="danger"
								>
									{serverError}
								</Label>
							) : null}

							<Button
								loading={isMutatingSession}
								onPress={() => {
									void handleSubmit();
								}}
							>
								{t("auth.login.submit")}
							</Button>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}
