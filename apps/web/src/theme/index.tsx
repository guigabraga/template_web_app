import { CssBaseline, useMediaQuery } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useMemo, type PropsWithChildren } from "react";
import { useThemeStore } from "../stores";
import type { TResolvedThemeMode } from "../types";

export default function AppThemeProvider({ children }: PropsWithChildren) {
  const selectedMode = useThemeStore((state) => state.mode);
  const systemPrefersDark = useMediaQuery("(prefers-color-scheme: dark)", {
    noSsr: true,
  });

  const resolvedMode: TResolvedThemeMode =
    selectedMode === "system" ? (systemPrefersDark ? "dark" : "light") : selectedMode;

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: resolvedMode,
        },
        typography: {
          fontFamily: '"Roboto Variable", Roboto, sans-serif',
        },
      }),
    [resolvedMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}
