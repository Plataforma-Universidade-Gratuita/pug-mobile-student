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
	createdByValue,
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

				<View style={styles.entityRow}>
					<Label role="helper">{t("projectDetail.entity.createdBy")}</Label>
					<Label role="field">{createdByValue}</Label>
				</View>
			</View>
		</View>
	);
}
