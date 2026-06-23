import React, { useMemo } from "react";

import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

import { Label, OverflowActionSheet } from "@/components/primitives";
import { useThemeStore } from "@/stores";
import { createPrimitiveSurfaceStyleSpec } from "@/styles";
import type { ProfileLogoutSheetProps } from "@/types/client";
import { withAlpha } from "@/utils";

import { createStyles } from "../styles";

export function ProfileLogoutSheet({
	isBusy,
	onDismiss,
	onSignOut,
	onSignOutAll,
	visible,
}: ProfileLogoutSheetProps) {
	const { t } = useTranslation();
	const theme = useThemeStore(state => state.theme);
	const spec = useMemo(() => createPrimitiveSurfaceStyleSpec(theme), [theme]);
	const styles = useMemo(() => createStyles(theme), [theme]);

	return (
		<OverflowActionSheet
			visible={visible}
			onDismiss={onDismiss}
		>
			<View style={styles.sheetContent}>
				<View style={styles.sheetHeader}>
					<Label role="caption" style={styles.sheetCaption}>{t("profile.sections.session")}</Label>
					<Label role="field" style={styles.sheetTitle}>{t("profile.logout.title")}</Label>
					<Label role="helper" style={styles.sheetSubtitle}>{t("profile.logout.subtitle")}</Label>
				</View>

				<View style={styles.sheetOptions}>
					<Pressable disabled={isBusy} onPress={onDismiss} style={({ pressed }) => [styles.logoutOption, { backgroundColor: pressed ? withAlpha(theme.colors.text, theme.mode === "dark" ? 0.08 : 0.04) : theme.colors.surface3, borderColor: spec.panelBorder, opacity: isBusy ? 0.6 : 1 }]}>
						<View style={styles.logoutOptionCopy}>
							<Label role="field" style={styles.logoutOptionTitle}>{t("profile.logout.stay")}</Label>
							<Label role="helper" style={styles.logoutOptionHelper}>{t("profile.logout.stayHelper")}</Label>
						</View>
					</Pressable>
					<Pressable disabled={isBusy} onPress={onSignOutAll} style={({ pressed }) => [styles.logoutOption, { backgroundColor: pressed ? withAlpha(theme.colors.warning, theme.mode === "dark" ? 0.22 : 0.18) : withAlpha(theme.colors.warning, theme.mode === "dark" ? 0.16 : 0.14), borderColor: withAlpha(theme.colors.warning, theme.mode === "dark" ? 0.24 : 0.22), opacity: isBusy ? 0.6 : 1 }]}>
						<View style={styles.logoutOptionCopy}>
							<Label role="field" style={{ color: theme.colors.warningSoftText }}>{t("profile.logout.everywhere")}</Label>
							<Label role="helper" style={styles.logoutWarningHelper}>{t("profile.logout.everywhereHelper")}</Label>
						</View>
					</Pressable>
					<Pressable disabled={isBusy} onPress={onSignOut} style={({ pressed }) => [styles.logoutOption, { backgroundColor: pressed ? withAlpha(theme.colors.danger, theme.mode === "dark" ? 0.24 : 0.18) : withAlpha(theme.colors.danger, theme.mode === "dark" ? 0.16 : 0.12), borderColor: withAlpha(theme.colors.danger, theme.mode === "dark" ? 0.28 : 0.2), opacity: isBusy ? 0.6 : 1 }]}>
						<View style={styles.logoutOptionCopy}>
							<Label role="field" style={{ color: theme.colors.danger }}>{t("profile.logout.device")}</Label>
							<Label role="helper" style={styles.logoutDangerHelper}>{t("profile.logout.deviceHelper")}</Label>
						</View>
					</Pressable>
				</View>
			</View>
		</OverflowActionSheet>
	);
}
