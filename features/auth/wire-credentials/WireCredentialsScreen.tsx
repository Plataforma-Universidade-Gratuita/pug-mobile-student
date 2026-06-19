import React, { useMemo, useState } from "react";

import { useRouter } from "expo-router";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	View,
} from "react-native";

import { createPrimitiveSurfaceStyleSpec } from "@/app/styles";
import * as api from "@/api";
import { Button, Badge, Input, Label } from "@/components/primitives";
import { useAuthStore, useThemeStore } from "@/stores";

import { createStyles } from "./styles";
import {
	resolveWireCredentialsErrorMessage,
	validateCredentialConfirmation,
	validateCredentialPassword,
} from "./utils";

const { identity } = api;
const { auth: authApi } = identity;

export function WireCredentialsScreen() {
	const router = useRouter();
	const theme = useThemeStore(state => state.theme);
	const sessionPayload = useAuthStore(state => state.sessionPayload);
	const signOut = useAuthStore(state => state.signOut);
	const setRequiresCredentialSetup = useAuthStore(
		state => state.setRequiresCredentialSetup,
	);
	const isMutatingSession = useAuthStore(state => state.isMutatingSession);
	const surfaceSpec = useMemo(
		() => createPrimitiveSurfaceStyleSpec(theme),
		[theme],
	);
	const styles = useMemo(() => createStyles(theme, surfaceSpec), [surfaceSpec, theme]);
	const [password, setPassword] = useState("");
	const [confirmation, setConfirmation] = useState("");
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [confirmationError, setConfirmationError] = useState<string | null>(null);
	const [serverError, setServerError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const email = sessionPayload?.upn ?? "";
	const isBusy = isSubmitting || isMutatingSession;

	async function handleSubmit() {
		const nextPasswordError = validateCredentialPassword(password);
		const nextConfirmationError = validateCredentialConfirmation(
			password,
			confirmation,
		);

		setPasswordError(nextPasswordError);
		setConfirmationError(nextConfirmationError);
		setServerError(null);

		if (nextPasswordError || nextConfirmationError) {
			return;
		}

		if (!email) {
			setServerError("Unable to resolve the current account email.");
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
			setServerError(resolveWireCredentialsErrorMessage(error));
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
						<Badge tone="warning" variant="secondary">
							First login setup
						</Badge>

						<View style={styles.header}>
							<Label role="title">Finish your first access.</Label>
							<Label role="subtitle">
								Set your password now. It will be required on future logins.
							</Label>
						</View>

						<View style={styles.form}>
							<View style={styles.field}>
								<Label role="field">Password</Label>
								<Input
									autoFocus
									autoComplete="password-new"
									error={passwordError}
									onChangeText={value => {
										setPassword(value);
										if (passwordError) {
											setPasswordError(null);
										}
										if (serverError) {
											setServerError(null);
										}
									}}
									onSubmitEditing={handleSubmit}
									placeholder="Create your password"
									returnKeyType="next"
									type="password"
									value={password}
								/>
							</View>

							<View style={styles.field}>
								<Label role="field">Confirm password</Label>
								<Input
									autoComplete="password-new"
									error={confirmationError}
									onChangeText={value => {
										setConfirmation(value);
										if (confirmationError) {
											setConfirmationError(null);
										}
										if (serverError) {
											setServerError(null);
										}
									}}
									onSubmitEditing={handleSubmit}
									placeholder="Repeat your password"
									returnKeyType="done"
									type="password"
									value={confirmation}
								/>
							</View>

							{serverError ? (
								<Label role="helper" tone="danger">
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
									Finish setup
								</Button>

								<Button
									disabled={isBusy}
									onPress={() => {
										void handleFinishLater();
									}}
									variant="text"
								>
									Finish later
								</Button>
							</View>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}
