import path from "path";
import { defineConfig } from "vite";
import reactPlugin from "@vitejs/plugin-react";

const LIB_ENTRY = path.resolve(__dirname, "../lib/index.ts");
export default defineConfig({
  plugins: [reactPlugin()],
  build: {
    lib: {
      entry: LIB_ENTRY,
      name: __dirname,
      formats: ["es"],
      fileName: (format) => `${LIB_NAME}.${format}.js`,
    },
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
  resolve: {
    alias: {
      "@dev/useparams": LIB_ENTRY,
    },
  },
});
