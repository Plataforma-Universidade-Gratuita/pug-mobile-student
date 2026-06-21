import React, { useMemo, useState } from "react";

import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import * as api from "@/api";
import { BrandScreenHeader } from "@/components";
import { Label, OverflowActionSheet } from "@/components/primitives";
import { useAuthStore, useLocaleStore, useThemeStore } from "@/stores";
import { createPrimitiveSurfaceStyleSpec } from "@/styles";
import { withAlpha } from "@/utils";

import { InfoCard, PreferencesCard, StudentCard } from "./profile-sections";
import { createStyles } from "./styles";
import { resolveProfileFieldValue } from "./utils";

export function ProfileScreen() {
	const { t } = useTranslation();
	const insets = useSafeAreaInsets();
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
	const styles = useMemo(() => createStyles(theme), [theme]);
	const contentBottomPadding =
		theme.space[8] + Math.max(insets.bottom, theme.space[2]) + theme.space[4];

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

	const activeStatusLabel = currentAccountQuery.isPending
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

	const studentName = resolveProfileFieldValue(
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

	return (
		<View style={[styles.screen, { backgroundColor: spec.screenBackground }]}> 
			<BrandScreenHeader title={t("profile.title")} />

			<ScrollView
				contentContainerStyle={[
					styles.content,
					{ paddingBottom: contentBottomPadding },
				]}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.shell}>
					<StudentCard
						badgeLabel={t("profile.badge")}
						cpfLabel={t("profile.fields.cpf")}
						cpfValue={cpf}
						name={studentName}
					/>

					<InfoCard
						academicRegistrationLabel={t("profile.fields.academicRegistration")}
						academicRegistrationValue={academicRegistration}
						activeStatusLabel={activeStatusLabel}
						activeTone={activeTone}
						areaOfExpertiseLabel={t("profile.fields.areaOfExpertise")}
						areaOfExpertiseValue={areaOfExpertiseName}
						campusValue={campus}
						courseLabel={t("profile.fields.course")}
						courseValue={courseName}
						emailLabel={t("profile.fields.accountEmail")}
						emailValue={email}
						errorMessage={
							hasProfileLoadError ? t("profile.errors.load") : undefined
						}
						sectionTitle={t("profile.sections.record")}
					/>

					<PreferencesCard
						language={language}
						languageHelper={t("profile.fields.languageHelper")}
						languageLabel={t("profile.fields.language")}
						logoutLabel={t("profile.logout.trigger")}
						onLanguageChange={nextLanguage => {
							void setLanguage(nextLanguage);
						}}
						onOpenLogout={() => {
							setIsLogoutSheetVisible(true);
						}}
						onThemeModeChange={nextThemeMode => {
							void setThemeMode(nextThemeMode);
						}}
						sectionTitle={t("profile.sections.preferences")}
						themeHelper={t("profile.fields.themeHelper")}
						themeLabel={t("profile.fields.theme")}
						themeMode={themeMode}
					/>
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
						<Label
							role="caption"
							style={styles.sheetCaption}
						>
							{t("profile.sections.session")}
						</Label>
						<Label
							role="field"
							style={styles.sheetTitle}
						>
							{t("profile.logout.title")}
						</Label>
						<Label
							role="helper"
							style={styles.sheetSubtitle}
						>
							{t("profile.logout.subtitle")}
						</Label>
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
										: theme.colors.surface3,
									borderColor: spec.panelBorder,
									opacity: isMutatingSession ? 0.6 : 1,
								},
							]}
						>
							<View style={styles.logoutOptionCopy}>
								<Label
									role="field"
									style={styles.logoutOptionTitle}
								>
									{t("profile.logout.stay")}
								</Label>
								<Label
									role="helper"
									style={styles.logoutOptionHelper}
								>
									{t("profile.logout.stayHelper")}
								</Label>
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
										: withAlpha(
												theme.colors.warning,
												theme.mode === "dark" ? 0.16 : 0.14,
											),
									borderColor: withAlpha(
										theme.colors.warning,
										theme.mode === "dark" ? 0.24 : 0.22,
									),
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
								<Label
									role="helper"
									style={styles.logoutWarningHelper}
								>
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
										: withAlpha(
												theme.colors.danger,
												theme.mode === "dark" ? 0.16 : 0.12,
											),
									borderColor: withAlpha(
										theme.colors.danger,
										theme.mode === "dark" ? 0.28 : 0.2,
									),
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
								<Label
									role="helper"
									style={styles.logoutDangerHelper}
								>
									{t("profile.logout.deviceHelper")}
								</Label>
							</View>
						</Pressable>
					</View>
				</View>
			</OverflowActionSheet>
		</View>
	);
}