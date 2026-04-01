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
      manifest: {
        name: "Genzy Basket — Fresh Groceries Delivered",
        short_name: "Genzy Basket",
        description: "Order fresh groceries, fruits, vegetables, and daily essentials online. Fast delivery to your doorstep.",
        theme_color: "#099E0E",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        scope: "/",
        lang: "en",
        categories: ["food", "shopping"],
        icons: [
          {
            src: "/logo_icon.png",
            sizes: "254x254",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg}"],
        // Don't precache sitemap and robots
        globIgnores: ["**/sitemap.xml", "**/robots.txt"],
      },
    }),
  ],
  base: "/",
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
