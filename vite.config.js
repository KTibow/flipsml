import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import fg from "fast-glob";

const html = await fg("src/**/index.html");
export default defineConfig({
  appType: "mpa",
  root: "src",
  publicDir: "../public",
  plugins: [tailwindcss(), svelte()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: html,
    },
  },
});
