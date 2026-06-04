import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: [
      // Stub all SVG-as-component imports (match whole specifier so the full path is replaced)
      { find: /^.*\.svg$/, replacement: path.resolve(__dirname, "src/test/svg-stub.tsx") },
      // Stub next/image (static-import dimensions aren't available under Vite)
      { find: /^next\/image$/, replacement: path.resolve(__dirname, "src/test/next-image-stub.tsx") },
      // Path alias mirroring tsconfig "@/*" -> "src/*"
      { find: /^@\//, replacement: path.resolve(__dirname, "src") + "/" },
    ],
  },
});
