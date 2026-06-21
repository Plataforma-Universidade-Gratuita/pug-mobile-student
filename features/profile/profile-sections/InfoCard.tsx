import React, { useMemo } from "react";

import { View } from "react-native";

import { Badge, Label } from "@/components/primitives";
import { useThemeStore } from "@/stores";
import { createPrimitiveSurfaceStyleSpec } from "@/styles";
import type { ProfileInfoCardProps } from "@/types/client";

import { createSectionStyles } from "./styles";

export function InfoCard({
	sectionTitle,
	emailLabel,
	emailValue,
	activeStatusLabel,
	activeTone,
	academicRegistrationLabel,
	academicRegistrationValue,
	campusValue,
	courseLabel,
	courseValue,
	areaOfExpertiseLabel,
	areaOfExpertiseValue,
	errorMessage,
}: ProfileInfoCardProps) {
	const theme = useThemeStore(state => state.theme);
	const spec = useMemo(() => createPrimitiveSurfaceStyleSpec(theme), [theme]);
	const styles = useMemo(() => createSectionStyles(theme, spec), [spec, theme]);

	return (
		<View
			style={[
				styles.card,
				styles.sectionCard,
				{
					backgroundColor: spec.panelBackground,
					borderColor: spec.panelBorder,
				},
			]}
		>
			<View style={styles.sectionHeader}>
				<Label role="caption">{sectionTitle}</Label>
			</View>

			<View style={[styles.rows, styles.rowsBottomTrim]}>
				<View style={styles.row}>
					<View style={styles.rowCopy}>
						<Label role="caption">{emailLabel}</Label>
						<Label style={styles.rowValue}>{emailValue}</Label>
					</View>

					<View style={styles.rowAccessory}>
						<Badge
							tone={activeTone}
							variant="secondary"
						>
							{activeStatusLabel}
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
						<Label role="caption">{academicRegistrationLabel}</Label>
						<Label style={styles.rowValue}>{academicRegistrationValue}</Label>
					</View>

					<View style={styles.rowAccessory}>
						<Badge
							tone="neutral"
							variant="primary"
						>
							{campusValue}
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
						<Label role="caption">{courseLabel}</Label>
						<Label style={styles.rowValue}>{courseValue}</Label>
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
						<Label role="caption">{areaOfExpertiseLabel}</Label>
						<Label style={styles.rowValue}>{areaOfExpertiseValue}</Label>
					</View>
				</View>
			</View>

			{errorMessage ? (
				<Label
					role="helper"
					tone="danger"
				>
					{errorMessage}
				</Label>
			) : null}
		</View>
	);
}
