import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  server: {
    port: 5173,

    // DEV ONLY
    ...(mode === "development" && {
      proxy: {
        "/api": "http://localhost:8080",
      },
      allowedHosts: [
        "localhost",
        "127.0.0.1",
        ".ngrok-free.dev", // wildcard works in Vite 5
      ],
    }),
  },
}));
