import type { AppResolvedTheme } from "@/types/client";

export function createAuthenticatedShellTabScreenOptions(
	theme: AppResolvedTheme,
) {
	return {
		headerShown: false,
		tabBarActiveTintColor: theme.colors.brand,
		tabBarInactiveTintColor: theme.colors.chromeMuted,
		sceneStyle: {
			backgroundColor: theme.colors.surface1,
		},
	} as const;
}
