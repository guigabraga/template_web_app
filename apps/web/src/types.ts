export type ThemeMode = "light" | "dark" | "system";
export type ResolvedThemeMode = Exclude<ThemeMode, "system">;
