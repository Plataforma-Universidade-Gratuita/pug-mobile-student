import type { AppResolvedTheme } from "@/types/client";

export function createAuthenticatedShellTabScreenOptions(
	theme: AppResolvedTheme,
) {
	return {
		headerShown: false,
		tabBarActiveTintColor: theme.colors.brand,
		tabBarInactiveTintColor: theme.colors.chromeMuted,
		tabBarHideOnKeyboard: true,
		tabBarLabelStyle: {
			fontFamily: theme.font.sans,
			fontSize: theme.type.xs,
			fontWeight: theme.weight.semibold,
		},
		tabBarStyle: {
			backgroundColor: theme.colors.surface2,
			borderTopColor: theme.colors.border2,
			height: 68,
			paddingBottom: theme.space[2],
			paddingTop: theme.space[2],
		},
		sceneStyle: {
			backgroundColor: theme.colors.surface1,
		},
	} as const;
}
