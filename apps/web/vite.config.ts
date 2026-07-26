import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const usePolling = process.env.VITE_USE_POLLING === "true";
const watchInterval = Number(process.env.VITE_WATCH_INTERVAL ?? 300);

export default defineConfig({
  plugins: [react()],
  server: {
    host: process.env.VITE_HOST ?? "127.0.0.1",
    port: 1002,
    strictPort: true,
    watch: {
      usePolling,
      interval: watchInterval,
    },
  },
});
