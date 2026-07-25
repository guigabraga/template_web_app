import type { ReactElement } from "react";

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
  public: [],
  private: []
}