import path from "path";
import { defineConfig } from "vite";
import packageJson from "./package.json";

export default defineConfig({
  build: {
    target: "esnext",
    lib: {
      name: packageJson.name,
      entry: path.resolve(__dirname, "lib/index.ts"),
      fileName: (format) => `index.${format}.js`,
    },
    minify: "esbuild",
    chunkSizeWarningLimit: 2,
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
