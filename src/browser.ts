/**
 * Browser / BTT WebView entry: identical API, but never imports node: modules.
 * The unix socket transport is unavailable here; `Btt` picks in-process (inside BTT WebViews) or http.
 */
export * from "./index.js";
