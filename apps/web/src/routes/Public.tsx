import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "../pages/public/shared";
import { Router } from "./Router";

export default function Public() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {Router.public
            .filter((e) => e.available === true)
            .map((item, index) => {
              return (
                <Route key={index} path={item.path} element={item.element} />
              );
            })}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
