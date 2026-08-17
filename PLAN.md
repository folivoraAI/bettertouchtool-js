# bettertouchtool (npm) — modernization plan

Successor to `Worie/btt` (v3.5.2, TS 2.9 / webpack 4, last feature work 2019).
Decision: **rewrite**, keep the good concepts (typed action builders, chaining, trigger/widget objects),
generate the action + trigger catalogs from BTT's own docs, ship a zero-dependency ESM/CJS package.

Repo: `/Users/andi/Xcode/BetterTouchTool/btt-js`  ·  package name: `bettertouchtool` (free on npm; `btt` is taken)

---

## Part A — the library

### A1. Toolchain (Tier 1)
- TypeScript 5.x, `strict`, no decorators.
- Build: `tsup` → `dist/index.js` (ESM), `dist/index.cjs`, `dist/index.d.ts`; separate `browser`
  entry (no `node:` imports) so it also runs inside BTT WebViews / floating HTML menus.
- Tests: `vitest` (unit tests against a fake transport; opt-in integration test against a live BTT via `BTT_TEST_URL`).
- Lint/format: `biome`.
- Zero runtime dependencies (`fetch`, `crypto.randomUUID`, `URLSearchParams`, `node:net` only in the Node build).
- Node ≥ 18.

### A2. Transports (`src/transport/`)
One interface: `call(command, params) → Promise<string>` plus `describe()`.
1. `HttpTransport` — BTT webserver, `GET /<command>/?<query>&shared_secret=…`. Works everywhere.
   Handles JSON params (`json`, dict values) by `JSON.stringify`, booleans/numbers as strings.
2. `UnixSocketTransport` (Node only) — `/tmp/com.hegenberg.BetterTouchTool.sock`, request line
   `/<command>/?<query>\n`, `shared_secret` param, read until EOF. No webserver needed, local-only, faster.
3. `InProcessTransport` — when the code runs *inside* BTT (Run Real JavaScript / WebView): uses the
   global `callBTT(cmd, params)` that BTT injects. Lets the same script work in Node **and** in BTT
   (answers the forum question #47592: bundle with esbuild → `eval(readFile(...))` or paste).
4. `autoTransport()` — picks in-process → unix socket (Node, socket exists) → http (config given).

### A3. Low-level API (`src/api/`) — one typed method per BTT scripting command
Grouped, all returning parsed values where BTT returns JSON:
- triggers: `triggerNamed`, `triggerNamedAsync`, `cancelDelayedNamedTrigger`, `triggerAction(actionJson)`,
  `executeAssignedActionsForTrigger`, `getTrigger`, `getTriggers(filter)`, `addNewTrigger`, `updateTrigger`,
  `deleteTrigger`, `deleteTriggers(filter)`, `refreshWidget`, `revealElementInUI`
- variables: `getStringVariable`, `getNumberVariable`, `getVariableType`, `setStringVariable`, `setNumberVariable`,
  `setPersistentStringVariable`, `setPersistentNumberVariable` + a `variables` proxy (`btt.vars.get/set`)
- clipboard: `getClipboardContent`, `getSelection`, `setClipboardContent`, `setClipboardContents`,
  `getItemsFromClipboardManager`, `pasteClipboardManagerItemsWithUuids`, `pasteText`
- floating menus: `updateMenuItem`, `getMenuItemValue`, `setMenuItemValue`, `webviewMenuItemLoadHtmlUrlJs`,
  `showSimpleJsonFormatMenu`
- widgets: `updateTouchBarWidget`, `updateMenubarItem`, `updateStreamDeckWidget`, `getActiveTouchBarGroup`
- presets: `exportPreset`, `importPreset`, `getPresetDetails`
- misc: `displayNotification`, `getMenuItemDetails`, `getDockBadgeFor`, `isAppRunning`, `isTrueToneEnabled`,
  `getLocation`, `getWeather`, `runShortcut`
- escape hatch: `btt.call(command, params)`

### A4. Action builders (`src/actions/`)
- `catalog.generated.ts` — **generated** from `Code/AI/Resources/action-definitions.mdx`
  (id, name, category, description, documented params, example JSON) — ~450 actions,
  exposed as `ActionType` enum + `actionCatalog` lookup (`byId`, `byName`, `search`).
- `builders.ts` — ergonomic, typed builders for the frequently used actions (return plain action JSON):
  showHUD, showNotification, sendShortcut (accepts `"cmd+shift+s"`; BTT normalizes on import),
  sendShortcutToApp, insertText / pasteText, launchApp, toggleApp, quitApp, moveMouse, click*,
  runAppleScript, runShellScript, runJavaScript, runShortcut, setVariable, delay, triggerNamed,
  openURL, moveWindow…, plus `action(id, extra)` generic and `sequence(...actions)`.
- `keys.ts` — human shortcut ⇄ BTT key-code string (modifiers + US layout keycodes) for people who want
  to be explicit / older BTT versions.

### A5. Trigger builders (`src/triggers/`)
- `catalog.generated.ts` — generated from `trigger-definitions.mdx` (class → [{id, name}]).
- `builders.ts` — `keyboardShortcut("cmd+shift+k", actions, opts)`, `namedTrigger(name, actions)`,
  `trackpadGesture(id, actions)`, `otherTrigger(id, actions)`, `touchBarButton(...)`, `streamDeckButton(...)`,
  `floatingMenuItem(...)`. Each returns trigger JSON usable with `addNewTrigger` / `updateTrigger`.
- Rich objects: `Trigger` (invoke/update/delete/get), `Widget` (update/refresh), `NamedTrigger`.

### A6. Chain / composition
- `btt.chain().showHUD(...).delay(300).sendShortcut("cmd+s").run()` — executes sequentially, or
  `.toAction()` to turn the chain into a single multi-action JSON executed by BTT (one round trip).

### A7. CLI (`bin/btt`)
`btt trigger-named "Foo"`, `btt get-var BTTActiveAppBundleIdentifier`, `btt call <cmd> k=v …`,
`btt actions search hud`, auto-detects transport. Small, but very handy for shell users.

### A8. Docs / examples
README with the 3 environments (Node, browser/WebView, inside BTT), typedoc site, migration table
from `Worie/btt` names → new names, `examples/` (clock widget, floating menu update, event server).

### A9. Events (later, depends on B6)
`btt.on("triggerFired", cb)` via WebSocket `/service` once BTT streams events (see B6). Until then a
polling helper for variables (`btt.vars.watch(name, cb, interval)`).

---

## Part B — BTT-side improvements (found while reading `BTTHTTPConnection.m`, `BTTUnixSocketServer.m`,
`BTTGenericScriptHandler.m`, `BTTWebSocket.m`)

### B1. HTTP route table is hand-copied and buggy — replace with the generic dispatcher
`BTTHTTPConnection.m` duplicates the command list as `if/else` and several branches call the **wrong**
handler:
| path | actually calls |
|---|---|
| `/get_selection/` | `get_clipboard_content` |
| `/get_items_from_clipboard_manager/` | `get_clipboard_content` |
| `/paste_clipboard_manager_items_with_uuids/` | `get_clipboard_content` |
| `/get_weather/` | `reveal_element_in_ui` |
| `/import_preset/`, `/export_preset/`, `/update_stream_deck_widget/` | `trigger_action` |
| `/run_shortcut/` | `trigger_named` (works only by accident) |
| second `/delete_trigger/` | `get_trigger` (dead branch) |
Also missing entirely over HTTP: `display_notification`, `is_app_running`, `delete_triggers`,
`show_simple_json_format_menu`, `set_user_defaults`(should stay excluded), `logitech_reset_to_factory_defaults`.
Fix: use the same `routes` array the unix socket server uses (move it to `BTTGenericScriptHandler`
as `+webserverRoutes`) and dispatch generically. One list, one behaviour.

### B2. Shared-secret check is `[path containsString:secret]`
Any URL containing the secret substring anywhere passes; not constant-time; secret ends up in
proxy/browser logs. Parse `shared_secret` from the query (like the socket server does), compare exactly,
and additionally accept an `Authorization: Bearer <secret>` / `X-BTT-Shared-Secret` header so it never
has to be in the URL.

### B3. GET-only → also accept POST bodies
`add_new_trigger`/`update_trigger`/`trigger_action` with big JSON blow URL length limits and need
double-encoding. Accept `POST` with `application/json` (`{command?, ...params}`) or
`application/x-www-form-urlencoded`. The library uses POST when available (feature-detect via B4).

### B4. `/get_info/` (or `/ping/`) endpoint
Returns `{version, build, routes:[…], supportsPost:true, socketPath}` so clients can feature-detect and
show a good error instead of an empty 200. Zero risk, huge DX win.

### B5. Response typing
Everything comes back as `text/plain`, status 200 — even "command not found". Set
`Content-Type: application/json` when the handler returned a dict/array/number, `404` for unknown
command, `400` for missing/invalid JSON param, `403` stays. Also stringify NSNumber results consistently
(the socket server got the coercion fix; HTTP has a narrower version).

### B6. WebSocket `/service` is a stub (`didReceiveMessage` echoes the date)
Turn it into an event stream: `{"type":"triggerFired","uuid":…,"name":…}`, `{"type":"variableChanged",…}`,
`{"type":"activeAppChanged",…}`; and accept the same JSON-RPC-ish commands over the socket
(`{"id":1,"command":"trigger_named","params":{…}}` → `{"id":1,"result":…}`). This is what made
`Worie/btt` need a separate `btt-node-server`; BTT can do it natively.

### B10. `get_triggers` / `delete_triggers`: `trigger_id` string vs number   ✅ done
Over http/socket `trigger_id` arrives as a string; the fetch predicate compares it with the integer
`gestureType`. SQLite coerces, in-memory evaluation of *pending* objects does not → triggers created via
`add_new_trigger` were invisible to `get_triggers({trigger_id})` until BTT saved. Now normalized to NSNumber.

### B11. `add_new_trigger` ignores a provided `BTTUUID`
The importer always assigns a fresh UUID (so the same JSON can be imported twice) and returns it. Fine, but
undocumented; the client uses the returned UUID and offers `upsertTrigger(uuid)` (= `update_trigger`) when a
stable UUID is needed. Consider honouring `BTTUUID` when no trigger with that UUID exists.

### B12. Keyboard-shortcut triggers could accept human-readable shortcuts
`BTTShortcutToSend` (send-shortcut action) accepts `"cmd+shift+s"`, but keyboard shortcut *triggers* still
need `BTTShortcutKeyCode` + `BTTShortcutModifierKeys`. Accepting e.g. `"BTTShortcut": "cmd+shift+s"` in the
importer would remove the need for a key-code table in every client (the npm package ships one for now).

### B13. `trigger_named` / `trigger_action` replies lost for Run Real JavaScript   ✅ fixed (BTT + lib)
Root causes found live:
1. **Servers blocked main**: socket + HTTP called the handler synchronously → handlers `dispatch_sync` the
   work to main and pump a nested run loop there. Replies that arrive *via the main queue* (JS runner
   `replyOnMainQueue`) can never be drained inside a main-queue block → 5 s timeout, "" result.
   Fix: `-[BTTGenericScriptHandler performExternalScriptCommand:withParameters:timeout:]` – async reply +
   semaphore on the server thread, main stays free. Used by `BTTHTTPConnection` and `BTTUnixSocketServer`.
2. **Global JS context function cache**: a cached `main()` from another trigger was executed instead of
   the new script (same function name → stale code!) and its `returnToBTT<callingID>` pointed at an old
   reply. Fix in `BTTJavaScriptCoreRunner`: script hash per function key → re-evaluate when the text
   changed; re-bind the per-run reply functions for cached functions. Also fixed a nil `functionSuffix`
   `stringByAppendingString:` crash path.
3. **Docs were wrong**: `BTTShellTaskActionConfig` must be `launchPath:::params:::-:::env`
   (`"/bin/bash:::-c:::-:::"`), a bare `"/bin/bash"` silently does nothing; Run Real JavaScript needs
   `BTTScriptFunctionToCall` for a return value. Docs + builders (`runShellScript`, `runJavaScript`) fixed.

### B7. Unix socket server: wrong defaults key
`BTTUnixSocketServer.m:147` checks `BTTSocketServer` but the setting is `BTTSocketServerEnabled` —
the guard is dead (harmless today because the server is only started when enabled, but should be fixed).

### B8. In-process JS runner: module loading (forum #47592)
Add `import_script(pathOrURL)` (reads file, evaluates in the current context) and `require_bundle()`
convenience so pre-bundled libraries can be loaded; document esbuild recipe. Consider a
`BTTJSModuleSearchPaths` folder (`~/Library/Application Support/BetterTouchTool/JavaScriptModules`)
that is auto-evaluated once per context. (True npm/ESM support would need Node/Bun — out of scope.)

### B9. Docs
`docs/scripting/webserver.mdx` currently lists endpoints without params; generate the endpoint list +
params from the same catalog the npm package uses (single source of truth), and link the package.

---

## Status (2026-08-17)
| Item | Status |
|---|---|
| A1 toolchain, A2 transports (http/socket/in-process/auto), A3 typed API, A4 action catalog + builders, A5 trigger catalog + builders + handles, A6 chain, A7 CLI, A8 README/examples | ✅ done, 21 unit tests + 4 live tests (socket) green |
| B1 generic route dispatch (shared `+externalScriptingRoutes`) | ✅ done (`BTTHTTPConnection.m`, `BTTUnixSocketServer.m`) |
| B2 exact secret check + `X-BTT-Shared-Secret` / `Authorization: Bearer` (legacy path-contains kept for compat) | ✅ done |
| B3 POST bodies (JSON / form) | ✅ done – client uses POST automatically for >6 KB requests (`method: "auto"`) |
| B4 `/get_info/` (also on socket + in-process) | ✅ done – `btt.info()` |
| B5 JSON content type, 403/400 JSON errors, shared result coercion | ✅ done (unknown routes → static file server / 404 as before) |
| B7 socket server defaults key | ✅ done |
| B10 trigger_id coercion | ✅ done |
| B9 docs (`webserver.mdx`) | ✅ updated |
| B6 WebSocket event stream + A9 client events | ⏳ next |
| B8 `import_script()` in the JS runner | ⏳ next |
| B11 / B12 | ⏳ optional |

BTT-side changes compile (Debug build OK) but the HTTP path was **not** exercised against a running BTT yet
(webserver is disabled on this machine, socket path is verified live). To verify: enable the webserver, then
`BTT_LIVE=1 BTT_URL=http://127.0.0.1:PORT npm run test:live` and
`curl -X POST http://127.0.0.1:PORT/get_info/ -H 'Content-Type: application/json' -d '{}'`.
