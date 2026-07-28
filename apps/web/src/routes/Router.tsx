import { Navigate } from "react-router-dom";
import type { ReactElement } from "react";
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

export const Router: TRouterConfig = {
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
  private: [],
};
