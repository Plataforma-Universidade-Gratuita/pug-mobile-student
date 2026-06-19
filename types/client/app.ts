import type { ReactNode } from "react";

export interface AppLayoutProps {
	children: ReactNode;
}

export interface PrimitiveSurfaceStyleSpec {
	screenBackground: string;
	screenGlow: string;
	panelBackground: string;
	panelBorder: string;
	panelRadius: number;
	panelPadding: number;
}

export interface PrimitiveFormStyleSpec {
	formMaxWidth: number;
	headerGap: number;
	formGap: number;
	fieldGap: number;
	titleSize: number;
	titleLineHeight: number;
	subtitleSize: number;
	subtitleLineHeight: number;
	labelText: string;
	helperText: string;
	inputBackground: string;
	inputBorder: string;
	inputText: string;
	inputPlaceholder: string;
	inputRadius: number;
	inputHeight: number;
	buttonHeight: number;
	buttonRadius: number;
	buttonShadowColor: string;
	buttonShadowOpacity: number;
	textActionColor: string;
	badgeHeight: number;
	badgeBackground: string;
	badgeText: string;
}

export interface ProvidersProps {
	children: ReactNode;
	initialLangCookieValue: unknown;
	initialThemeCookieValue: unknown;
}

export interface RootLayoutProps {
	children: ReactNode;
}

export interface NavbarProps {
	children: ReactNode;
}

export interface AppRouteSlugParams {
	slug?: string[];
}

export interface AppRouteSlugContext {
	params: Promise<AppRouteSlugParams>;
}

export interface RouteBoundaryPageProps {
	error: Error & { digest?: string };
	reset: () => void;
}
