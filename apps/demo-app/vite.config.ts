import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "use-history-ai": path.resolve(
        __dirname,
        "../../packages/use-history-ai/src"
      ),
    },
  },
});
