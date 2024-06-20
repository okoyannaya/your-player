import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        // для оптимизации и удаления stroke/fill у svg
        // необходима установка @svgr/plugin-svgo
        plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
      },
      include: "**/*.svg",
    }),
  ],

});
