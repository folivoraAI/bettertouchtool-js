import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: { index: "src/index.ts", browser: "src/browser.ts", catalog: "src/catalog.ts" },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    target: "es2022",
    platform: "neutral",
    external: ["node:net", "node:fs", "node:process"],
    treeshake: true,
  },
  {
    // single-file CommonJS bundle shipped inside BetterTouchTool.app (see scripts/sync-to-btt.mjs)
    entry: { "bettertouchtool.btt": "src/btt-module.ts" },
    format: ["cjs"],
    outExtension: () => ({ js: ".cjs" }),
    sourcemap: false,
    dts: false,
    target: "es2020",
    platform: "browser",
    noExternal: [/.*/],
    treeshake: true,
    minify: false,
  },
  {
    entry: { cli: "src/cli.ts" },
    format: ["esm"],
    sourcemap: false,
    target: "node18",
    platform: "node",
    banner: { js: "#!/usr/bin/env node" },
  },
]);
