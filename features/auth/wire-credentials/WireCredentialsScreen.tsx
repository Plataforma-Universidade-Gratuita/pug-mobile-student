import React, { useState } from "react";

import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

import * as api from "@/api";
import { Button, Badge, Input, Label } from "@/components/primitives";
import { useAuthScreen, useServerErrorState } from "@/hooks";
import { useAuthStore } from "@/stores";

import { createStyles } from "./styles";
import {
	resolveWireCredentialsErrorMessageWithFallback,
	validateCredentialConfirmationWithMessages,
	validateCredentialPasswordWithMessages,
} from "./utils";

const { identity } = api;
const { auth: authApi } = identity;

export function WireCredentialsScreen() {
	const { t } = useTranslation();
	const router = useRouter();
	const sessionPayload = useAuthStore(state => state.sessionPayload);
	const signOut = useAuthStore(state => state.signOut);
	const setRequiresCredentialSetup = useAuthStore(
		state => state.setRequiresCredentialSetup,
	);
	const { isMutatingSession, styles } = useAuthScreen(createStyles);
	const { clearServerError, serverError, setServerError } =
		useServerErrorState();
	const [password, setPassword] = useState("");
	const [confirmation, setConfirmation] = useState("");
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [confirmationError, setConfirmationError] = useState<string | null>(
		null,
	);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const email = sessionPayload?.upn ?? "";
	const isBusy = isSubmitting || isMutatingSession;

	async function handleSubmit() {
		const nextPasswordError = validateCredentialPasswordWithMessages(password, {
			required: t("auth.wireCredentials.errors.passwordRequired"),
			minLength: t("auth.wireCredentials.errors.passwordMinLength"),
		});
		const nextConfirmationError = validateCredentialConfirmationWithMessages(
			password,
			confirmation,
			{
				required: t("auth.wireCredentials.errors.confirmationRequired"),
				mismatch: t("auth.wireCredentials.errors.confirmationMismatch"),
			},
		);

		setPasswordError(nextPasswordError);
		setConfirmationError(nextConfirmationError);
		clearServerError();

		if (nextPasswordError || nextConfirmationError) {
			return;
		}

		if (!email) {
			setServerError(t("auth.wireCredentials.errors.missingEmail"));
			return;
		}

		setIsSubmitting(true);

		try {
			await authApi.wireCredentials({
				email,
				password: password.trim(),
			});

			setRequiresCredentialSetup(false);
			router.replace("/");
		} catch (error) {
			setServerError(
				resolveWireCredentialsErrorMessageWithFallback(
					error,
					t("auth.wireCredentials.errors.fallback"),
				),
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	async function handleFinishLater() {
		await signOut();
		router.replace("/login");
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
							tone="warning"
							variant="secondary"
						>
							{t("auth.wireCredentials.badge")}
						</Badge>

						<View style={styles.header}>
							<Label role="title">{t("auth.wireCredentials.title")}</Label>
							<Label role="subtitle">
								{t("auth.wireCredentials.subtitle")}
							</Label>
						</View>

						<View style={styles.form}>
							<View style={styles.field}>
								<Label role="field">
									{t("auth.wireCredentials.passwordLabel")}
								</Label>
								<Input
									autoFocus
									autoComplete="password-new"
									error={passwordError}
									onChangeText={value => {
										setPassword(value);
										if (passwordError) {
											setPasswordError(null);
										}
										clearServerError();
									}}
									onSubmitEditing={handleSubmit}
									placeholder={t("auth.wireCredentials.passwordPlaceholder")}
									returnKeyType="next"
									type="password"
									value={password}
								/>
							</View>

							<View style={styles.field}>
								<Label role="field">
									{t("auth.wireCredentials.confirmPasswordLabel")}
								</Label>
								<Input
									autoComplete="password-new"
									error={confirmationError}
									onChangeText={value => {
										setConfirmation(value);
										if (confirmationError) {
											setConfirmationError(null);
										}
										clearServerError();
									}}
									onSubmitEditing={handleSubmit}
									placeholder={t(
										"auth.wireCredentials.confirmPasswordPlaceholder",
									)}
									returnKeyType="done"
									type="password"
									value={confirmation}
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

							<View style={styles.actions}>
								<Button
									loading={isBusy}
									onPress={() => {
										void handleSubmit();
									}}
								>
									{t("auth.wireCredentials.submit")}
								</Button>

								<Button
									disabled={isBusy}
									onPress={() => {
										void handleFinishLater();
									}}
									variant="text"
								>
									{t("auth.wireCredentials.finishLater")}
								</Button>
							</View>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}
