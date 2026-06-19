import React, { useMemo, useState } from "react";

import { View } from "react-native";
import { TextInput as PaperTextInput } from "react-native-paper";

import { createPrimitiveFormStyleSpec } from "@/app/styles";
import { useThemeStore } from "@/stores";
import type { PrimitiveInputProps } from "@/types/client";

import { Label } from "../label";
import { styles } from "./styles";
import {
	resolveInputAutoCapitalize,
	resolveInputAutoComplete,
	resolveInputColors,
	resolveInputKeyboardType,
	resolvePasswordToggleIcon,
	resolveSecureTextEntry,
	shouldRenderPasswordToggle,
} from "./utils";

export function Input({
	value,
	onChangeText,
	type = "text",
	placeholder,
	disabled = false,
	error = null,
	helperText,
	autoFocus = false,
	autoCapitalize,
	autoCorrect = false,
	autoComplete,
	keyboardType,
	returnKeyType,
	onBlur,
	onSubmitEditing,
	style,
}: PrimitiveInputProps) {
	const theme = useThemeStore(state => state.theme);
	const spec = useMemo(() => createPrimitiveFormStyleSpec(theme), [theme]);
	const [passwordVisible, setPasswordVisible] = useState(false);
	const hasError = Boolean(error);
	const resolvedAutoCapitalize = resolveInputAutoCapitalize(
		type,
		autoCapitalize,
	);
	const resolvedAutoComplete = resolveInputAutoComplete(type, autoComplete);
	const colors = useMemo(
		() => resolveInputColors(hasError, theme, spec),
		[hasError, spec, theme],
	);
	const shouldShowPasswordToggle = shouldRenderPasswordToggle(type);
	const blurProps = onBlur ? { onBlur } : {};
	const changeTextProps = onChangeText ? { onChangeText } : {};
	const placeholderProps = placeholder ? { placeholder } : {};
	const submitProps = onSubmitEditing ? { onSubmitEditing } : {};
	const autoCapitalizeProps =
		resolvedAutoCapitalize !== undefined
			? { autoCapitalize: resolvedAutoCapitalize }
			: {};
	const autoCompleteProps =
		resolvedAutoComplete !== undefined
			? { autoComplete: resolvedAutoComplete }
			: {};
	const keyboardTypeProps = keyboardType
		? { keyboardType: resolveInputKeyboardType(type, keyboardType) }
		: type === "email"
			? { keyboardType: resolveInputKeyboardType(type, keyboardType) }
			: {};
	const returnKeyTypeProps = returnKeyType ? { returnKeyType } : {};
	const rightAdornmentProps = shouldShowPasswordToggle
		? {
				right: (
					<PaperTextInput.Icon
						icon={resolvePasswordToggleIcon(passwordVisible)}
						onPress={() => setPasswordVisible(current => !current)}
						forceTextInputFocus={false}
					/>
				),
			}
		: {};

	return (
		<View style={[styles.root, style]}>
			<PaperTextInput
				mode="outlined"
				value={value}
				disabled={disabled}
				error={hasError}
				autoFocus={autoFocus}
				autoCorrect={autoCorrect}
				secureTextEntry={resolveSecureTextEntry(type, passwordVisible)}
				textColor={colors.textColor}
				placeholderTextColor={colors.placeholderTextColor}
				outlineColor={colors.outlineColor}
				activeOutlineColor={colors.activeOutlineColor}
				{...changeTextProps}
				{...placeholderProps}
				{...autoCapitalizeProps}
				{...autoCompleteProps}
				{...keyboardTypeProps}
				{...returnKeyTypeProps}
				{...blurProps}
				{...submitProps}
				contentStyle={styles.content}
				{...rightAdornmentProps}
				style={[
					styles.input,
					{
						backgroundColor: spec.inputBackground,
						fontFamily: theme.font.sans,
						fontSize: theme.type.md,
						fontWeight: theme.weight.regular,
					},
				]}
				outlineStyle={[
					styles.outline,
					{
						borderRadius: theme.form.controlRadius,
					},
				]}
			/>

			{error ? (
				<Label
					role="helper"
					tone="danger"
					style={styles.helper}
				>
					{error}
				</Label>
			) : helperText ? (
				<Label
					role="helper"
					tone="muted"
					style={styles.helper}
				>
					{helperText}
				</Label>
			) : null}
		</View>
	);
}
