import React, { useMemo } from "react";

import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Label } from "@/components/primitives";
import { useThemeStore } from "@/stores";
import { createPrimitiveSurfaceStyleSpec } from "@/styles";
import type { ProjectEntityCardProps } from "@/types/client";

import { createStyles } from "./styles";

export function ProjectEntityCard({
	entityName,
	addressValue,
	cnpjValue,
	cityValue,
	staffItems,
	staffStateLabel,
}: ProjectEntityCardProps) {
	const { t } = useTranslation();
	const theme = useThemeStore(state => state.theme);
	const spec = useMemo(() => createPrimitiveSurfaceStyleSpec(theme), [theme]);
	const styles = useMemo(() => createStyles(theme, spec), [spec, theme]);

	return (
		<View
			style={[
				styles.card,
				{
					backgroundColor: spec.panelBackground,
					borderColor: spec.panelBorder,
				},
			]}
		>
			<Label
				role="field"
				style={styles.sectionTitle}
			>
				{t("projectDetail.sections.entity")}
			</Label>

			<View style={styles.entityRows}>
				<View style={styles.entityRow}>
					<Label role="helper">{t("projectDetail.entity.name")}</Label>
					<Label role="field">{entityName}</Label>
				</View>
				{addressValue ? (
					<View style={styles.entityRow}>
						<Label role="helper">{t("projectDetail.entity.address")}</Label>
						<Label role="field">{addressValue}</Label>
					</View>
				) : null}
				<View style={styles.entityRow}>
					<Label role="helper">{t("projectDetail.entity.cnpj")}</Label>
					<Label role="field">{cnpjValue}</Label>
				</View>
				<View style={styles.entityRow}>
					<Label role="helper">{t("projectDetail.entity.city")}</Label>
					<Label role="field">{cityValue}</Label>
				</View>
			</View>

			<View style={styles.staffBlock}>
				<Label role="helper">{t("projectDetail.entity.staff")}</Label>
				{staffItems.length > 0 ? (
					<View style={styles.staffList}>
						{staffItems.map(staffItem => (
							<View
								key={`${staffItem.name}-${staffItem.email}`}
								style={[
									styles.staffItem,
									{
										backgroundColor: theme.colors.surface2,
										borderColor: spec.panelBorder,
									},
								]}
							>
								<Label role="field">{staffItem.name}</Label>
								<Label role="helper">{staffItem.email}</Label>
							</View>
						))}
					</View>
				) : (
					<Label role="field">{staffStateLabel}</Label>
				)}
			</View>
		</View>
	);
}
