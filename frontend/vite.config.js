import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:8080" // your backend
    },
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "callum-trismic-paradingly.ngrok-free.dev" // add your ngrok host here
    ]
  }
});
