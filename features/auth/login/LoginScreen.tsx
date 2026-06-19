import React, { useMemo, useState } from "react";

import { useRouter } from "expo-router";
import type { Href } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

import { createPrimitiveSurfaceStyleSpec } from "@/app/styles";
import { Button, Badge, Input, Label } from "@/components/primitives";
import { useAuthStore, useThemeStore } from "@/stores";

import { createStyles } from "./styles";
import {
	normalizeLoginEmail,
	normalizeLoginPassword,
	resolveLoginErrorMessage,
	validateLoginEmail,
} from "./utils";

/* Expo typed routes have not regenerated the new route yet. Keep the cast local
until the route type manifest is refreshed. */
const WIRE_CREDENTIALS_ROUTE = "/wire-credentials" as Href;

export function LoginScreen() {
	const router = useRouter();
	const theme = useThemeStore(state => state.theme);
	const signIn = useAuthStore(state => state.signIn);
	const isMutatingSession = useAuthStore(state => state.isMutatingSession);
	const surfaceSpec = useMemo(
		() => createPrimitiveSurfaceStyleSpec(theme),
		[theme],
	);
	const styles = useMemo(
		() => createStyles(theme, surfaceSpec),
		[surfaceSpec, theme],
	);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState<string | null>(null);
	const [serverError, setServerError] = useState<string | null>(null);

	async function handleSubmit() {
		const nextEmailError = validateLoginEmail(email);

		setEmailError(nextEmailError);
		setServerError(null);

		if (nextEmailError) {
			return;
		}

		try {
			const tokens = await signIn({
				email: normalizeLoginEmail(email),
				password: normalizeLoginPassword(password),
			});

			if (!tokens.passwordWired) {
				router.replace(WIRE_CREDENTIALS_ROUTE);
				return;
			}

			router.replace("/");
		} catch (error) {
			setServerError(resolveLoginErrorMessage(error));
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
							tone="brand"
							variant="secondary"
						>
							Former student access
						</Badge>

						<View style={styles.header}>
							<Label role="title">PUG</Label>
							<Label role="subtitle">
								Keep control of your counterpart hours.
							</Label>
						</View>

						<View style={styles.form}>
							<View style={styles.field}>
								<Label role="field">Email</Label>
								<Input
									autoFocus
									autoComplete="email"
									onChangeText={value => {
										setEmail(value);
										if (emailError) {
											setEmailError(null);
										}
										if (serverError) {
											setServerError(null);
										}
									}}
									onSubmitEditing={handleSubmit}
									placeholder="student@pug.edu"
									returnKeyType="next"
									type="email"
									value={email}
									error={emailError}
								/>
							</View>

							<View style={styles.field}>
								<Label role="field">Password</Label>
								<Input
									autoComplete="password"
									helperText="Leave it blank on your first access."
									onChangeText={value => {
										setPassword(value);
										if (serverError) {
											setServerError(null);
										}
									}}
									onSubmitEditing={handleSubmit}
									placeholder="Enter your password"
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
								Login
							</Button>
						</View>

						<View style={styles.note}>
							<Badge
								tone="info"
								variant="secondary"
							>
								First access
							</Badge>
							<Label
								role="helper"
								tone="muted"
							>
								Your first access does not require a password.
							</Label>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}
