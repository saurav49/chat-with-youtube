import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// import { resolve } from "path";
import manifest from "./manifest.json";

import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { crx } from "@crxjs/vite-plugin";

export default defineConfig({
  plugins: [react(), tailwindcss(), crx({ manifest })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // rollupOptions: {
    //   // multiple entrypoints
    //   input: {
    //     popup: resolve(__dirname, "index.html"),
    //     content: resolve(__dirname, "src/content/entry.ts"),
    //     background: resolve(__dirname, "src/background/background.ts"),
    //   },
    //   output: {
    //     entryFileNames: (chunk) => {
    //       if (chunk.name === "content") return "content/[name].js";
    //       if (chunk.name === "background") return "background/[name].js";
    //       return "assets/[name].js";
    //     },
    //   },
    // },
    outDir: "dist",
    sourcemap: true,
  },
  publicDir: "public",
});

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
// import path from "path";
// import { crx } from "@crxjs/vite-plugin";
// import manifest from "./manifest.json";

// export default defineConfig({
//   plugins: [react(), crx({ manifest })],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   build: {
//     outDir: "dist",
//     sourcemap: true,
//   },
//   publicDir: "public",
// });
