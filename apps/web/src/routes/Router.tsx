import { Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import { Error, Login, NewAccess } from "../pages/public/paths";

type RouterObject = {
  path: string;
  available: boolean;
  element: ReactElement;
  title?: string;
  icon?: ReactElement;
  activeIcon?: ReactElement;
  panel?: "admin" | "agent" | "general";
};

type RouterConfig = {
  public: RouterObject[];
  private: RouterObject[];
};

export const Router: RouterConfig = {
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
