import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    allowedHosts: [
      "e1bef59488f9.ngrok-free.app",
      ".ngrok-free.app",
      ".ngrok.io",
    ],
  },
});
