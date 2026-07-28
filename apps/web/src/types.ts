export type TThemeMode = "light" | "dark" | "system";
export type TResolvedThemeMode = Exclude<TThemeMode, "system">;
