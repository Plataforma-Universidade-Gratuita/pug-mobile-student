import type { ReactNode } from "react";

import type { SelectOption } from "@/types/client";

export function getFilteredOptions(
	options: SelectOption[],
	searchable: boolean,
	searchTerm: string,
) {
	if (!searchable || !searchTerm.trim()) {
		return options;
	}

	const normalizedTerm = normalizeTextForSearch(searchTerm);

	return options.filter(option =>
		getSearchableOptionText(option).includes(normalizedTerm),
	);
}

function getSearchableOptionText(option: SelectOption) {
	return normalizeTextForSearch(
		[
			option.value,
			getNodeText(option.label),
			getNodeText(option.description),
			option.searchText ?? "",
			...(option.keywords ?? []),
		].join(" "),
	);
}

function normalizeTextForSearch(value: string) {
	return value
		.trim()
		.normalize("NFD")
		.replace(/\p{Diacritic}+/gu, "")
		.toLocaleLowerCase();
}

function getNodeText(node?: ReactNode): string {
	if (typeof node === "string" || typeof node === "number") {
		return String(node);
	}

	if (Array.isArray(node)) {
		return node
			.map(child => getNodeText(child))
			.join(" ")
			.trim();
	}

	return "";
}
