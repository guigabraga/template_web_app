import ComputerRoundedIcon from "@mui/icons-material/ComputerRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import type { ReactNode } from "react";
import { DropMenu, type TDropMenuItem } from "../../components";
import { useThemeStore } from "../../stores";
import type { TThemeMode } from "../../types";

const themeIcons: Record<TThemeMode, ReactNode> = {
  dark: <DarkModeRoundedIcon />,
  light: <LightModeRoundedIcon />,
  system: <ComputerRoundedIcon />,
};

export default function ButtonTheme() {
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);

  const items: TDropMenuItem[] = [
    {
      id: "dark",
      label: "Escuro",
      icon: <DarkModeRoundedIcon fontSize="small" />,
      selected: mode === "dark",
      onClick: () => setMode("dark"),
    },
    {
      id: "light",
      label: "Claro",
      icon: <LightModeRoundedIcon fontSize="small" />,
      selected: mode === "light",
      onClick: () => setMode("light"),
    },
    {
      id: "system",
      label: "Sistema",
      icon: <ComputerRoundedIcon fontSize="small" />,
      selected: mode === "system",
      onClick: () => setMode("system"),
    },
  ];

  return <DropMenu items={items} triggerIcon={themeIcons[mode]} />;
}
