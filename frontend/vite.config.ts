import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Allow overriding the base path via VITE_BASE (useful for GitHub Pages)
const base = process.env.VITE_BASE ?? "/";

export default defineConfig({
  base,
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
