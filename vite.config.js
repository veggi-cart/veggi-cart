import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        // Cache all images automatically
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg}"],
      },
    }),
  ],
  base: "/veggi-cart/",
  server: {
    host: true,
    strictPort: true,
    allowedHosts: [
      "e1bef59488f9.ngrok-free.app",
      ".ngrok-free.app",
      ".ngrok.io",
    ],
  },
});
