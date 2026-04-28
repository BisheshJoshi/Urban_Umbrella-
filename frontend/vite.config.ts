import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react({ jsxRuntime: "automatic" })],
  // @ts-expect-error — vitest augments this type at runtime
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["e2e/**"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.tsx"],
      exclude: ["src/main.tsx"],
    },
  },
});
