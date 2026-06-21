import React, { useMemo } from "react";

import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Label } from "@/components/primitives";
import { useThemeStore } from "@/stores";
import type { BrandScreenHeaderProps } from "@/types/client";

import { createStyles } from "./styles";

const brandLogo = require("../../../public/assets/brand/pug-logo.png");

export function BrandScreenHeader({
	title,
	leftAccessory,
	rightAccessory,
}: BrandScreenHeaderProps) {
	const insets = useSafeAreaInsets();
	const theme = useThemeStore(state => state.theme);
	const styles = useMemo(() => createStyles(theme), [theme]);

	return (
		<View
			style={[
				styles.brandHeader,
				{
					backgroundColor: theme.colors.surface1,
					paddingTop: insets.top + theme.space[1],
				},
			]}
		>
			<View style={styles.brandHeaderRow}>
				<View style={styles.brandHeaderSlot}>{leftAccessory ?? null}</View>

				<View style={styles.brandHeaderCenter}>
					<View style={styles.brandLogoFrame}>
						<Image
							source={brandLogo}
							style={styles.brandLogoImage}
						/>
					</View>

					<Label
						role="field"
						style={styles.brandHeaderTitle}
					>
						{title}
					</Label>
				</View>

				<View style={styles.brandHeaderSlot}>{rightAccessory ?? null}</View>
			</View>
		</View>
	);
}
