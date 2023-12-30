import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import fg from "fast-glob";

const html = await fg(["**/*.html", "!build/**/*", "!public/**/*"]);
export default defineConfig({
  root: "src",
  publicDir: "../public",
  plugins: [svelte({})],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: html,
    },
  },
});
