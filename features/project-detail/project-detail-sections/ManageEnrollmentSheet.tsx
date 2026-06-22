import React, { useMemo } from "react";

import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";

import { Label, OverflowActionSheet } from "@/components/primitives";
import { useThemeStore } from "@/stores";
import { createPrimitiveSurfaceStyleSpec } from "@/styles";
import type { ManageEnrollmentSheetProps } from "@/types/client";
import { withAlpha } from "@/utils";

import { createStyles } from "./styles";

export function ManageEnrollmentSheet({
	visible,
	projectName,
	isBusy,
	onDismiss,
	onExitProject,
}: ManageEnrollmentSheetProps) {
	const { t } = useTranslation();
	const theme = useThemeStore(state => state.theme);
	const spec = useMemo(() => createPrimitiveSurfaceStyleSpec(theme), [theme]);
	const styles = useMemo(() => createStyles(theme, spec), [spec, theme]);

	return (
		<OverflowActionSheet
			visible={visible}
			onDismiss={() => {
				if (!isBusy) {
					onDismiss();
				}
			}}
		>
			<View style={styles.sheetContent}>
				<View style={styles.sheetHeader}>
					<Label role="caption">{t("projectDetail.manage.caption")}</Label>
					<Label role="field">{projectName}</Label>
					<Label role="helper">{t("projectDetail.manage.subtitle")}</Label>
				</View>

				<View style={styles.sheetOptions}>
					<Pressable
						disabled={isBusy}
						onPress={onExitProject}
						style={({ pressed }) => [
							styles.sheetOption,
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
								opacity: isBusy ? 0.6 : 1,
							},
						]}
					>
						<View style={styles.sheetOptionCopy}>
							<Label
								role="field"
								style={{ color: theme.colors.danger }}
							>
								{t("projectDetail.actions.exitProject")}
							</Label>
							<Label role="helper">
								{t("projectDetail.manage.exitProjectHelper")}
							</Label>
						</View>
					</Pressable>

					<Pressable
						disabled={isBusy}
						onPress={onDismiss}
						style={({ pressed }) => [
							styles.sheetOption,
							{
								backgroundColor: pressed
									? withAlpha(
											theme.colors.text,
											theme.mode === "dark" ? 0.08 : 0.04,
										)
									: theme.colors.surface3,
								borderColor: spec.panelBorder,
								opacity: isBusy ? 0.6 : 1,
							},
						]}
					>
						<View style={styles.sheetOptionCopy}>
							<Label role="field">{t("projectDetail.actions.close")}</Label>
							<Label role="helper">
								{t("projectDetail.manage.closeHelper")}
							</Label>
						</View>
					</Pressable>
				</View>
			</View>
		</OverflowActionSheet>
	);
}
