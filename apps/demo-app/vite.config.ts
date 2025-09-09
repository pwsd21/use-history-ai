import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "use-history-ai": "/../../packages/use-history-ai/src",
    },
  },
});
