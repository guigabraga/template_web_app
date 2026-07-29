import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "../pages/private/shared";
import { Router } from "./Router";

const Private = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {Router.private
            .filter((route) => route.available)
            .map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export { Private as default };
