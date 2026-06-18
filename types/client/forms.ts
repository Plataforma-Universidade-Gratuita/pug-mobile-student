import type { ReactNode } from "react";

export interface SelectOption {
	value: string;
	label: ReactNode;
	description?: ReactNode;
	disabled?: boolean;
	keywords?: string[];
	searchText?: string;
}

export interface ComboboxOption extends SelectOption {}

export interface CpfFormFieldExistingUser {
	cpf: string;
	cpfFormatted: string;
	name: string;
}
