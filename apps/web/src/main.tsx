import "@fontsource-variable/roboto/wght.css";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AppThemeProvider from "./theme";

createRoot(document.getElementById("root")!).render(
  <AppThemeProvider>
    <App />
  </AppThemeProvider>,
);
