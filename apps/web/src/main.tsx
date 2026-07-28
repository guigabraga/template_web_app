import "@fontsource-variable/roboto/wght.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AppThemeProvider from "./theme";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AppThemeProvider>
      <App />
    </AppThemeProvider>
  </QueryClientProvider>,
);
