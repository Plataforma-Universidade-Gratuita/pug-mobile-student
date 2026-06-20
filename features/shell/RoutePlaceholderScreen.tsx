import React, { useMemo } from "react";

import { View } from "react-native";

import { AppScreenHeader } from "@/components/composite";
import { Badge, Label } from "@/components/primitives";
import { useThemeStore } from "@/stores";
import { createPrimitiveSurfaceStyleSpec } from "@/styles";

import { createStyles } from "./styles";

interface RoutePlaceholderScreenProps {
	title: string;
	subtitle?: string;
	description?: string;
	showBackButton?: boolean;
}

const DEFAULT_DESCRIPTION =
	"This route is wired into the authenticated shell. Feature content lands here next.";

export function RoutePlaceholderScreen({
	title,
	subtitle,
	description = DEFAULT_DESCRIPTION,
	showBackButton = false,
}: RoutePlaceholderScreenProps) {
	const theme = useThemeStore(state => state.theme);
	const spec = useMemo(() => createPrimitiveSurfaceStyleSpec(theme), [theme]);
	const styles = useMemo(() => createStyles(theme, spec), [spec, theme]);
	const headerProps = subtitle ? { subtitle } : {};

	return (
		<View style={styles.screen}>
			<View style={styles.content}>
				<AppScreenHeader
					showBackButton={showBackButton}
					title={title}
					{...headerProps}
				/>

				<View style={styles.panel}>
					<Badge
						style={styles.badge}
						variant="secondary"
					>
						Planned route
					</Badge>

					<View style={styles.body}>
						<Label role="field">{title}</Label>
						<Label role="helper">{description}</Label>
					</View>
				</View>
			</View>
		</View>
	);
}
