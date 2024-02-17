import { defineConfig, loadEnv, type PluginOption } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      visualizer({
        open: true,
        filename: "bundle-report.html",
        title: "Bundle Report (Vite)",
      }) as PluginOption,
    ],
    define: {
      "process.env": { ...env },
    },
  };
});
