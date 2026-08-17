import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    exclude: process.env.BTT_LIVE ? [] : ["test/live/**"],
  },
});
