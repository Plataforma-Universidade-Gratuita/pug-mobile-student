import type { ReactNode } from "react";
import type {
	KeyboardTypeOptions,
	StyleProp,
	TextInputProps,
	TextStyle,
	ViewStyle,
} from "react-native";

export type PrimitiveInputType = "text" | "email" | "password";

export interface PrimitiveInputProps {
	value: string;
	onChangeText?: (value: string) => void;
	type?: PrimitiveInputType;
	placeholder?: string;
	disabled?: boolean;
	error?: string | null;
	helperText?: ReactNode;
	autoFocus?: boolean;
	autoCapitalize?: TextInputProps["autoCapitalize"];
	autoCorrect?: boolean;
	autoComplete?: TextInputProps["autoComplete"];
	keyboardType?: KeyboardTypeOptions;
	returnKeyType?: TextInputProps["returnKeyType"];
	onBlur?: TextInputProps["onBlur"];
	onSubmitEditing?: TextInputProps["onSubmitEditing"];
	style?: StyleProp<ViewStyle>;
}
