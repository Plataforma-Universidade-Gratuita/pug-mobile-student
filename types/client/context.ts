import { SUPPORTED_LANGS } from "@/constants/locale";

export type { AppTheme } from "@/types/client/theme";
import type { AppTheme } from "@/types/client/theme";

export type AppLang = (typeof SUPPORTED_LANGS)[number];

export interface LocaleContextValue {
	lang: AppLang;
	setLang: (lang: AppLang) => void;
}

export interface ThemeContextValue {
	mode: AppTheme;
	setMode: (mode: AppTheme) => void;
}
