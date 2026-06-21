import React, { useMemo, useState } from "react";

import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, View } from "react-native";

import * as api from "@/api";
import { Badge, Label, OverflowActionSheet } from "@/components/primitives";
import { useAuthStore, useLocaleStore, useThemeStore } from "@/stores";
import { createPrimitiveSurfaceStyleSpec } from "@/styles";
import { withAlpha } from "@/utils";

import { PROFILE_LANGUAGE_OPTIONS, PROFILE_THEME_OPTIONS } from "./constants";
import { createStyles } from "./styles";
import { getInitials, resolveProfileFieldValue } from "./utils";

export function ProfileScreen() {
	const { t } = useTranslation();
	const theme = useThemeStore(state => state.theme);
	const themeMode = useThemeStore(state => state.mode);
	const setThemeMode = useThemeStore(state => state.setMode);
	const language = useLocaleStore(state => state.language);
	const setLanguage = useLocaleStore(state => state.setLanguage);
	const signOut = useAuthStore(state => state.signOut);
	const signOutAll = useAuthStore(state => state.signOutAll);
	const isMutatingSession = useAuthStore(state => state.isMutatingSession);
	const [isLogoutSheetVisible, setIsLogoutSheetVisible] = useState(false);
	const spec = useMemo(() => createPrimitiveSurfaceStyleSpec(theme), [theme]);
	const styles = useMemo(() => createStyles(theme, spec), [spec, theme]);

	const currentAccountQuery = api.identity.accounts.useCurrentAccountQuery();
	const currentUserQuery = api.identity.users.useCurrentUserQuery();
	const currentFormerStudentQuery =
		api.academic.formerStudents.useCurrentFormerStudentQuery();
	const courseQuery = api.academic.courses.useCourseDetailQuery(
		currentFormerStudentQuery.data?.courseId ?? null,
	);

	const loadingLabel = t("profile.values.loading");
	const unavailableLabel = t("profile.values.unavailable");
	const currentUser = currentUserQuery.data;
	const currentAccount = currentAccountQuery.data;
	const currentFormerStudent = currentFormerStudentQuery.data;
	const currentCourse = courseQuery.data;
	const hasProfileLoadError =
		currentAccountQuery.isError ||
		currentUserQuery.isError ||
		currentFormerStudentQuery.isError ||
		courseQuery.isError;

	const activeLabel = currentAccountQuery.isPending
		? loadingLabel
		: currentAccount
			? currentAccount.active
				? t("profile.values.active")
				: t("profile.values.inactive")
			: unavailableLabel;
	const activeTone: "neutral" | "success" | "danger" =
		currentAccountQuery.isPending || !currentAccount
			? "neutral"
			: currentAccount.active
				? "success"
				: "danger";

	const profileName = resolveProfileFieldValue(
		currentUser?.name,
		currentUserQuery.isPending,
		loadingLabel,
		unavailableLabel,
	);
	const cpf = resolveProfileFieldValue(
		currentUser?.cpfFormatted ?? currentUser?.cpf,
		currentUserQuery.isPending,
		loadingLabel,
		unavailableLabel,
	);
	const email = resolveProfileFieldValue(
		currentAccount?.email,
		currentAccountQuery.isPending,
		loadingLabel,
		unavailableLabel,
	);
	const academicRegistration = resolveProfileFieldValue(
		currentFormerStudent?.academicRegistration,
		currentFormerStudentQuery.isPending,
		loadingLabel,
		unavailableLabel,
	);
	const campus = resolveProfileFieldValue(
		currentFormerStudent?.campus.campusFormatted,
		currentFormerStudentQuery.isPending,
		loadingLabel,
		unavailableLabel,
	);
	const courseName = resolveProfileFieldValue(
		currentCourse?.name,
		courseQuery.isPending,
		loadingLabel,
		unavailableLabel,
	);
	const areaOfExpertiseName = resolveProfileFieldValue(
		currentCourse?.areaOfExpertise.name,
		courseQuery.isPending,
		loadingLabel,
		unavailableLabel,
	);

	const selectorBackground = withAlpha(
		theme.colors.surface2,
		theme.mode === "dark" ? 0.42 : 0.72,
	);
	const selectorOptionPressedBackground = withAlpha(theme.colors.brand, 0.14);
	const avatarBackground = withAlpha(
		theme.colors.brand,
		theme.mode === "dark" ? 0.16 : 0.1,
	);
	const avatarBorder = withAlpha(
		theme.colors.brand,
		theme.mode === "dark" ? 0.28 : 0.16,
	);
	const neutralOptionBackground = theme.colors.surface3;
	const neutralOptionBorder = spec.panelBorder;
	const warningOptionBackground = withAlpha(
		theme.colors.warning,
		theme.mode === "dark" ? 0.16 : 0.14,
	);
	const warningOptionBorder = withAlpha(
		theme.colors.warning,
		theme.mode === "dark" ? 0.24 : 0.22,
	);
	const dangerOptionBackground = withAlpha(
		theme.colors.danger,
		theme.mode === "dark" ? 0.16 : 0.12,
	);
	const dangerOptionBorder = withAlpha(
		theme.colors.danger,
		theme.mode === "dark" ? 0.28 : 0.2,
	);

	return (
		<View style={[styles.screen, { backgroundColor: spec.screenBackground }]}>
			<ScrollView
				contentContainerStyle={styles.content}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.shell}>
					<View
						style={[
							styles.identityCard,
							{
								backgroundColor: spec.panelBackground,
								borderColor: spec.panelBorder,
							},
						]}
					>
						<View style={styles.identityTop}>
							<View style={styles.identityCopy}>
								<Badge
									style={styles.identityBadge}
									tone="brand"
									variant="primary"
								>
									{t("profile.badge")}
								</Badge>

								<Label
									role="title"
									style={styles.identityName}
								>
									{profileName}
								</Label>

								<Label role="subtitle">{t("profile.headline")}</Label>
							</View>

							<View
								style={[
									styles.avatarBadge,
									{
										backgroundColor: avatarBackground,
										borderColor: avatarBorder,
									},
								]}
							>
								<Label
									role="field"
									tone="brand"
									style={styles.avatarText}
								>
									{getInitials(currentUser?.name)}
								</Label>
							</View>
						</View>

						<Label role="helper">{`${t("profile.fields.cpf")} · ${cpf}`}</Label>
					</View>

					<View
						style={[
							styles.section,
							{
								backgroundColor: spec.panelBackground,
								borderColor: spec.panelBorder,
							},
						]}
					>
						<View style={styles.sectionHeader}>
							<Label role="caption">{t("profile.sections.record")}</Label>
						</View>

						<View style={styles.rows}>
							<View style={styles.row}>
								<View style={styles.rowCopy}>
									<Label role="caption">
										{t("profile.fields.accountEmail")}
									</Label>
									<Label style={styles.rowValue}>{email}</Label>
								</View>

								<View style={styles.rowAccessory}>
									<Badge
										tone={activeTone}
										variant="secondary"
									>
										{activeLabel}
									</Badge>
								</View>
							</View>

							<View
								style={[
									styles.row,
									styles.rowDivider,
									{ borderTopColor: spec.panelBorder },
								]}
							>
								<View style={styles.rowCopy}>
									<Label role="caption">
										{t("profile.fields.academicRegistration")}
									</Label>
									<Label style={styles.rowValue}>{academicRegistration}</Label>
								</View>

								<View style={styles.rowAccessory}>
									<Badge
										tone="neutral"
										variant="primary"
									>
										{campus}
									</Badge>
								</View>
							</View>

							<View
								style={[
									styles.row,
									styles.rowDivider,
									{ borderTopColor: spec.panelBorder },
								]}
							>
								<View style={styles.rowCopy}>
									<Label role="caption">{t("profile.fields.course")}</Label>
									<Label style={styles.rowValue}>{courseName}</Label>
								</View>
							</View>

							<View
								style={[
									styles.row,
									styles.rowDivider,
									{ borderTopColor: spec.panelBorder },
								]}
							>
								<View style={styles.rowCopy}>
									<Label role="caption">
										{t("profile.fields.areaOfExpertise")}
									</Label>
									<Label style={styles.rowValue}>{areaOfExpertiseName}</Label>
								</View>
							</View>
						</View>

						{hasProfileLoadError ? (
							<Label
								role="helper"
								tone="danger"
							>
								{t("profile.errors.load")}
							</Label>
						) : null}
					</View>

					<View
						style={[
							styles.section,
							{
								backgroundColor: spec.panelBackground,
								borderColor: spec.panelBorder,
							},
						]}
					>
						<View style={styles.sectionHeader}>
							<Label role="caption">{t("profile.sections.preferences")}</Label>
						</View>

						<View style={styles.rows}>
							<View style={styles.row}>
								<View style={styles.rowCopy}>
									<Label role="field">{t("profile.fields.theme")}</Label>
									<Label role="helper">{t("profile.fields.themeHelper")}</Label>
								</View>
							</View>

							<View
								style={[
									styles.selector,
									{
										backgroundColor: selectorBackground,
										borderColor: spec.panelBorder,
									},
								]}
							>
								{PROFILE_THEME_OPTIONS.map(option => {
									const isSelected = themeMode === option.value;

									return (
										<Pressable
											key={option.value}
											onPress={() => {
												void setThemeMode(option.value);
											}}
											style={({ pressed }) => [
												styles.selectorOption,
												{
													backgroundColor: isSelected
														? theme.colors.tabBgActive
														: pressed
															? selectorOptionPressedBackground
															: "transparent",
												},
											]}
										>
											<Label
												role="caption"
												tone={isSelected ? "brand" : "muted"}
											>
												{t(option.labelKey)}
											</Label>
										</Pressable>
									);
								})}
							</View>

							<View
								style={[
									styles.row,
									styles.rowDivider,
									{ borderTopColor: spec.panelBorder },
								]}
							>
								<View style={styles.rowCopy}>
									<Label role="field">{t("profile.fields.language")}</Label>
									<Label role="helper">
										{t("profile.fields.languageHelper")}
									</Label>
								</View>
							</View>

							<View
								style={[
									styles.selector,
									{
										backgroundColor: selectorBackground,
										borderColor: spec.panelBorder,
									},
								]}
							>
								{PROFILE_LANGUAGE_OPTIONS.map(option => {
									const isSelected = language === option.value;

									return (
										<Pressable
											key={option.value}
											onPress={() => {
												void setLanguage(option.value);
											}}
											style={({ pressed }) => [
												styles.selectorOption,
												styles.selectorOptionCompact,
												{
													backgroundColor: isSelected
														? theme.colors.tabBgActive
														: pressed
															? selectorOptionPressedBackground
															: "transparent",
												},
											]}
										>
											<Label
												role="caption"
												tone={isSelected ? "brand" : "muted"}
											>
												{option.label}
											</Label>
										</Pressable>
									);
								})}
							</View>

							<Pressable
								onPress={() => {
									setIsLogoutSheetVisible(true);
								}}
								style={({ pressed }) => [
									styles.logoutTrigger,
									{
										backgroundColor: pressed
											? theme.colors.chromeBgHover
											: theme.colors.chromeBg,
									},
								]}
							>
								<Label
									role="field"
									style={{ color: theme.colors.chromeFg }}
								>
									{t("profile.logout.trigger")}
								</Label>
							</Pressable>
						</View>
					</View>
				</View>
			</ScrollView>

			<OverflowActionSheet
				visible={isLogoutSheetVisible}
				onDismiss={() => {
					if (!isMutatingSession) {
						setIsLogoutSheetVisible(false);
					}
				}}
			>
				<View style={styles.sheetContent}>
					<View style={styles.sheetHeader}>
						<Label role="caption">{t("profile.sections.session")}</Label>
						<Label role="field">{t("profile.logout.title")}</Label>
						<Label role="helper">{t("profile.logout.subtitle")}</Label>
					</View>

					<View style={styles.sheetOptions}>
						<Pressable
							disabled={isMutatingSession}
							onPress={() => {
								setIsLogoutSheetVisible(false);
							}}
							style={({ pressed }) => [
								styles.logoutOption,
								{
									backgroundColor: pressed
										? withAlpha(theme.colors.surfaceHighlight, 1)
										: neutralOptionBackground,
									borderColor: neutralOptionBorder,
									opacity: isMutatingSession ? 0.6 : 1,
								},
							]}
						>
							<View style={styles.logoutOptionCopy}>
								<Label role="field">{t("profile.logout.stay")}</Label>
								<Label role="helper">{t("profile.logout.stayHelper")}</Label>
							</View>
						</Pressable>

						<Pressable
							disabled={isMutatingSession}
							onPress={() => {
								void signOutAll();
							}}
							style={({ pressed }) => [
								styles.logoutOption,
								{
									backgroundColor: pressed
										? withAlpha(
												theme.colors.warning,
												theme.mode === "dark" ? 0.22 : 0.18,
											)
										: warningOptionBackground,
									borderColor: warningOptionBorder,
									opacity: isMutatingSession ? 0.6 : 1,
								},
							]}
						>
							<View style={styles.logoutOptionCopy}>
								<Label
									role="field"
									style={{ color: theme.colors.warningSoftText }}
								>
									{t("profile.logout.everywhere")}
								</Label>
								<Label role="helper">
									{t("profile.logout.everywhereHelper")}
								</Label>
							</View>
						</Pressable>

						<Pressable
							disabled={isMutatingSession}
							onPress={() => {
								void signOut();
							}}
							style={({ pressed }) => [
								styles.logoutOption,
								{
									backgroundColor: pressed
										? withAlpha(
												theme.colors.danger,
												theme.mode === "dark" ? 0.24 : 0.18,
											)
										: dangerOptionBackground,
									borderColor: dangerOptionBorder,
									opacity: isMutatingSession ? 0.6 : 1,
								},
							]}
						>
							<View style={styles.logoutOptionCopy}>
								<Label
									role="field"
									style={{ color: theme.colors.danger }}
								>
									{t("profile.logout.device")}
								</Label>
								<Label role="helper">{t("profile.logout.deviceHelper")}</Label>
							</View>
						</Pressable>
					</View>
				</View>
			</OverflowActionSheet>
		</View>
	);
}
