import React, { useMemo } from "react";

import { View } from "react-native";
import { Modal, Portal } from "react-native-paper";

import { useThemeStore } from "@/stores";
import { createPrimitiveSurfaceStyleSpec } from "@/styles";
import type { OverflowActionSheetProps } from "@/types/client";

import { createStyles } from "./styles";

export function OverflowActionSheet({
	visible,
	onDismiss,
	children,
}: OverflowActionSheetProps) {
	const theme = useThemeStore(state => state.theme);
	const spec = useMemo(() => createPrimitiveSurfaceStyleSpec(theme), [theme]);
	const styles = useMemo(() => createStyles(theme, spec), [spec, theme]);

	return (
		<Portal>
			<Modal
				contentContainerStyle={styles.sheetModal}
				visible={visible}
				onDismiss={onDismiss}
			>
				<View
					style={[
						styles.sheetSurface,
						{
							backgroundColor: spec.panelBackground,
							borderColor: spec.panelBorder,
						},
					]}
				>
					{children}
				</View>
			</Modal>
		</Portal>
	);
}
