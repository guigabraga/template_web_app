import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import { Home } from "../pages/private/paths";
import { Login } from "../pages/public/paths";

type TRouterObject = {
  path: string;
  available: boolean;
  element: ReactElement;
  title?: string;
  icon?: ReactElement;
  activeIcon?: ReactElement;
  panel?: "admin" | "agent" | "general";
};

type TRouterConfig = {
  public: TRouterObject[];
  private: TRouterObject[];
};

const Router: TRouterConfig = {
  public: [
    {
      path: "/login",
      available: true,
      element: <Login />,
    },
    {
      path: "*",
      available: true,
      element: <Navigate to="/login" replace />,
    },
  ],
  private: [
    {
      path: "/home",
      available: true,
      element: <Home />,
      title: "Início",
      icon: <HomeOutlinedIcon />,
      activeIcon: <HomeRoundedIcon />,
      panel: "general",
    },
  ],
};

export { Router };
