# bettertouchtool

[![CI](https://github.com/folivoraAI/bettertouchtool-js/actions/workflows/ci.yml/badge.svg)](https://github.com/folivoraAI/bettertouchtool-js/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/bettertouchtool.svg)](https://www.npmjs.com/package/bettertouchtool)

Typed JavaScript/TypeScript client for [BetterTouchTool](https://folivora.ai)'s scripting API.
Zero dependencies, ESM + CJS, works in **Node ≥ 18**, **browsers / BTT WebViews**, and **inside BTT itself**
(Run Real JavaScript). Successor to the unmaintained [`btt`](https://github.com/Worie/btt) package.

```bash
npm i bettertouchtool
```

```ts
import { Btt, actions, triggers } from "bettertouchtool";

// picks the best transport automatically:
//   inside BTT → callBTT · Node + socket server on → unix socket · otherwise → webserver
const btt = new Btt({ http: { port: 64472, sharedSecret: "…" } });

await btt.triggerNamed("Toggle Focus Mode");
const app = await btt.getStringVariable("BTTActiveAppBundleIdentifier");
await btt.vars.set("counter", 42, { persistent: true });

await btt.triggerAction(actions.showHUD("Hello", { detail: app, duration: 1.5 }));

await btt.chain()
  .launchApp("com.apple.Safari")
  .delay(0.5)
  .sendShortcut("cmd+t")
  .pasteText("https://folivora.ai")
  .sendShortcut("return")
  .run();                       // one round trip – BTT executes the sequence

const handle = await btt.addNewTrigger(
  triggers.keyboardShortcut("cmd+shift+k", [actions.showHUD("⌘⇧K pressed")], { description: "demo" }),
);
await handle.invoke();
await handle.delete();
```

## Connecting

| Environment | Transport | Setup in BTT |
|---|---|---|
| Node on the same Mac | `UnixSocketTransport` (default when the socket exists) | Settings → Scripting BTT → Command Line → **Enable Socket Server** (+ optional shared secret) |
| Node / browser / other devices | `HttpTransport` | Settings → Scripting BTT → **Webserver** (enable, port, shared secret, interface) |
| Inside BTT (Run Real JavaScript, WebView, floating HTML menu, script widgets) | `InProcessTransport` (auto) | nothing – uses BTT's `callBTT()` |

```ts
Btt.socket();                                   // unix socket, default path
Btt.socket({ sharedSecret: "s" });
Btt.http({ url: "http://192.168.1.10:64472", sharedSecret: "s" });
Btt.inProcess();                                // when bundled into a BTT script
new Btt({ http: { port: 64472 }, sharedSecret: "s" });   // auto: in-process → socket → http
new Btt({ transport: myTransport });            // anything implementing Transport
```

`await btt.info()` returns BTT's version and the list of available functions (BTT ≥ 6.735, `null` before).

Every method throws `BttError` with a readable message when BTT can't be reached, the shared secret is
wrong, or BTT answers with an in-band error (`command not found …`).

## Examples

All examples are plain Node ≥ 18 ESM scripts (`node example.mjs`). Copy-paste and run.

### Show a HUD via the unix socket

Enable BTT → Settings → Scripting BTT → Command Line → "Enable Socket Server" (a BTT relaunch may be needed).

```js
// hud-socket.mjs
import { Btt, actions } from "bettertouchtool";

const btt = Btt.socket(); // /tmp/com.hegenberg.BetterTouchTool.sock
// with a scripting shared secret configured in BTT:  Btt.socket({ sharedSecret: "…" })

await btt.triggerAction(
  actions.showHUD("Hello from the socket 👋", { detail: "sent by Node.js", duration: 2 }),
);
```

### Show a HUD via the webserver (HTTP)

Enable BTT → Settings → Scripting BTT → Webserver, note the port (and set a shared secret if you expose it
to your network).

```js
// hud-http.mjs
import { Btt, actions } from "bettertouchtool";

const btt = Btt.http({ port: 64472, sharedSecret: "my-secret" });
// other machine:  Btt.http({ url: "http://192.168.1.10:64472", sharedSecret: "my-secret" })
// BTT ≥ 6.735:    Btt.http({ port: 64472, sharedSecret: "my-secret", secretInHeader: true })  // secret in a header, not the URL

await btt.triggerAction(
  actions.showHUD("Hello over HTTP", {
    detail: "sent by Node.js",
    duration: 2,
    background: "#1E88E5CC",
    position: 1, // top center
  }),
);
```

The same call as a raw request (what the library sends):

```bash
curl "http://127.0.0.1:64472/trigger_action/?shared_secret=my-secret&json=%7B%22BTTPredefinedActionType%22%3A254%2C%22BTTAdditionalActionData%22%3A%7B%22BTTActionHUDTitle%22%3A%22Hello%22%2C%22BTTActionHUDDuration%22%3A2%7D%7D"
# BTT ≥ 6.735 also accepts POST with a JSON body:
curl -X POST http://127.0.0.1:64472/trigger_action/ -H 'X-BTT-Shared-Secret: my-secret' \
     -H 'Content-Type: application/json' \
     -d '{"json":{"BTTPredefinedActionType":254,"BTTAdditionalActionData":{"BTTActionHUDTitle":"Hello","BTTActionHUDDuration":2}}}'
```

### Show a HUD from inside BTT (Run Real JavaScript)

Nothing to install: BetterTouchTool ≥ 6.735 ships this library and offers `require()`. Paste into a
*Run Real JavaScript* action (or any script widget):

```js
async function main() {
  const { Btt, actions } = require("bettertouchtool");
  const btt = Btt.inProcess();               // talks to BTT directly, no socket / webserver needed

  const app = await btt.getStringVariable("BTTActiveAppBundleIdentifier");
  await btt.triggerAction(
    actions.showHUD("Hello from inside BTT 🖐", { detail: `frontmost app: ${app}`, duration: 2 }),
  );
  return app;                                // becomes the action's result
}
```

### Read and write variables

```js
import { Btt } from "bettertouchtool";
const btt = new Btt({ http: { port: 64472 } }); // auto: socket if available, else http

console.log(await btt.getStringVariable("BTTActiveAppBundleIdentifier")); // "com.apple.Safari"
console.log(await btt.getNumberVariable("OutputVolume"));                  // 0.4375
console.log(await btt.getStringVariable("selected_text"));                 // current text selection

await btt.setNumberVariable("my_counter", 1);
await btt.vars.set("my_mode", "dark", { persistent: true });               // type inferred, survives restarts
console.log(await btt.vars.get("my_mode"));                                 // "dark"

// poll a variable and react to changes (until BTT streams events)
const stop = btt.vars.watch("BTTActiveAppBundleIdentifier", (app) => console.log("now active:", app), 500);
setTimeout(stop, 60_000);
```

### Run a named trigger and get its result

Create a named trigger in BTT (Automations, Named & Other Triggers → Named Trigger) whose action is e.g.
"Run AppleScript (blocking)" with `return "hello"`; then:

```js
const result = await btt.triggerNamed("My Named Trigger");            // waits for the reply
await btt.triggerNamedAsync("Fire And Forget", { delaySeconds: 10 });   // cancelable:
await btt.cancelDelayedNamedTrigger("Fire And Forget");
```

### Create, run and delete triggers from code

```js
import { Btt, actions, triggers } from "bettertouchtool";
const btt = Btt.socket();

// global keyboard shortcut ⌘⇧K → HUD + open URL
const shortcut = await btt.addNewTrigger(
  triggers.keyboardShortcut("cmd+shift+k", [actions.showHUD("⌘⇧K"), actions.openURL("https://folivora.ai")], {
    description: "created from Node",
  }),
);

// named trigger that runs a shell script and returns its output
const named = await btt.addNewTrigger(
  triggers.namedTrigger("uptime", [actions.runShellScript("uptime")]),
);
console.log(await btt.triggerNamed("uptime")); // "22:41  up 3 days, …"

// named trigger running Real JavaScript – the function's return value is the result
await btt.addNewTrigger(
  triggers.namedTrigger("front-window", [
    actions.runJavaScript(`async function main() {
      const app = await get_string_variable({ variable_name: "BTTActiveAppBundleIdentifier" });
      return "front app: " + app;
    }`),
  ]),
);
console.log(await btt.triggerNamed("front-window"));

// inspect / clean up
console.log((await btt.getTriggers({ triggerType: "BTTTriggerTypeKeyboardShortcut" })).length, "shortcuts");
await shortcut.disable();
await shortcut.delete();
await named.delete();
```

### Sequences: several actions in one round trip

```js
await btt.chain()
  .launchApp("com.apple.Safari")
  .delay(0.5)
  .sendShortcut("cmd+t")
  .pasteText("https://folivora.ai")
  .sendShortcut("return")
  .showHUD("Done", { duration: 1 })
  .run();
```

### Clipboard, selection, typing

```js
const clip = await btt.getClipboardContent();
const html = await btt.getClipboardContent({ format: "NSPasteboardTypeHTML" });
const selection = await btt.getSelection();
await btt.setClipboardContent("plain text");
await btt.setClipboardContents([
  { content: "hello", format: "NSPasteboardTypeString" },
  { content: "<b>hello</b>", format: "NSPasteboardTypeHTML" },
]);
await btt.pasteText("typed into the frontmost app", { insertByPasting: false });
const recent = await btt.getItemsFromClipboardManager({ start: 0, numberOfItems: 5 });
```

### Floating menus, widgets, notifications

```js
await btt.updateMenuItem({ menuName: "Quick Actions", itemName: "Status" }, {
  BTTMenuItemText: "All systems go",
  BTTMenuItemBackgroundColor: "20, 200, 20, 255",
}, { persist: true });
await btt.triggerAction(actions.showFloatingMenu("Quick Actions"));

const item = btt.widget("PUT-MENUBAR-ITEM-UUID-HERE", "menubar");   // uuid: right-click the item in BTT
setInterval(() => item.update({ text: new Date().toLocaleTimeString() }), 1000);

await btt.displayNotification({ title: "Build finished", subTitle: "3 warnings", soundName: "Glass" });
```

### Anything else: raw calls and the action catalog

```js
// any scripting function, any parameters (see the BTT docs – names are identical)
await btt.call("update_touch_bar_widget", { uuid: "…", json: { text: "hi", background_color: "200,100,100,255" } });
const presets = await btt.callJson("get_preset_details", { name: "Default" });

// build any of the ~400 predefined actions by id
import { ActionType, actions } from "bettertouchtool";
await btt.triggerAction(actions.action(ActionType.LOCK_SCREEN));
await btt.triggerAction(actions.action(ActionType.MOVE_MOUSE_TO_POSITION, {
  BTTAdditionalActionData: { BTTMouseMoveX: 100, BTTMouseMoveY: 100, BTTMouseMoveAnchor: 0 },
}));

// look up ids and documented parameters
import { actionCatalog } from "bettertouchtool/catalog";
console.log(actionCatalog.search("dark mode").map((a) => `${a.id} ${a.name}`));
console.log(actionCatalog.byId(254)?.params);
```

### Inside BetterTouchTool (Run Real JavaScript / WebView)

Bundle your script together with this package into one file and load it – the client detects `callBTT`
and needs no configuration (see the section below).

## API overview

**Triggers & actions** — `triggerNamed`, `triggerNamedAsync`, `cancelDelayedNamedTrigger`,
`triggerAction(json | json[])`, `executeAssignedActionsForTrigger`, `runShortcut`, `getTrigger`,
`getTriggers(filter)`, `addNewTrigger`, `upsertTrigger`, `updateTrigger`, `deleteTrigger`, `deleteTriggers`,
`refreshWidget`, `revealElementInUI`, `trigger(uuid)` → handle, `widget(uuid)` → handle, `chain()`

**Variables** — `getStringVariable`, `getNumberVariable`, `getVariableType`, `set*Variable`,
`setPersistent*Variable`, plus `btt.vars.get/set/setPersistent/watch`

**Clipboard & text** — `getClipboardContent`, `getSelection`, `setClipboardContent`, `setClipboardContents`,
`getItemsFromClipboardManager`, `pasteClipboardManagerItems`, `pasteText`

**Floating menus** — `updateMenuItem`, `getMenuItemValue`, `setMenuItemValue`, `webviewMenuItemLoad`,
`showSimpleJsonFormatMenu`

**Widgets** — `updateTouchBarWidget`, `updateMenubarItem`, `updateStreamDeckWidget`, `getActiveTouchBarGroup`

**Presets** — `exportPreset`, `importPreset`, `getPresetDetails`

**System** — `displayNotification`, `getMenuItemDetails`, `getDockBadge`, `isAppRunning`,
`isTrueToneEnabled`, `getLocation`, `getWeather`

**Escape hatch** — `btt.call("any_command", { any: "params" })`, `btt.callJson(...)`

### Action builders (`actions.*`)

`showHUD`, `showNotification`, `sendShortcut("cmd+shift+s")`, `sendShortcutToApp`, `typeText`, `pasteText`,
`launchApp`, `showHideApp`, `quitApp`, `openURL`, `runAppleScript`, `runJavaScript`, `runJXA`,
`runShellScript`, `runTerminalCommand`, `runAppleShortcut`, `triggerNamed`, `triggerUuid`, `delay`,
`setVariable`, `increaseVariable`, `toggleVariable`, `moveMouse`, `leftClick`…, `volumeUp/Down`, `setVolume`,
`mute`, `sleepDisplay`, `lockScreen`, `toggleDarkMode`, `showFloatingMenu/hide/toggle`, `hapticFeedback`,
generic `action(ActionType.X, {...})` and `sequence(...)`.

`ActionType` contains **all** ~400 `BTTPredefinedActionType` ids by name (`ActionType.SHOW_HUD === 254`).
The full documented catalog (parameters, examples) lives in a separate entry point so the core stays small:

```ts
import { actionCatalog, triggerCatalog } from "bettertouchtool/catalog";
actionCatalog.search("floating menu");   // [{ id: 386, name: "Show Floating Menu", params: [...] }, …]
actionCatalog.byId(254)?.params;
triggerCatalog.search("three finger");
```

### Trigger builders (`triggers.*`)

`keyboardShortcut("cmd+shift+k", actions)`, `namedTrigger(name, actions, { variables })`,
`trackpadGesture(id, actions)`, `magicMouseGesture`, `mouseTrigger`, `otherTrigger(id, actions)`,
`touchBarButton`, `streamDeckButton`, `floatingMenuItem`, generic `trigger(type, class, actions)`.
Options: `description`, `enabled`, `conditions` (NSPredicate string), `requiredModifiers`, `config`, `extra`.

### Keys

`parseShortcut("⌘⇧S")` → `{ keyCode: 1, modifierMask: 1179648, bttShortcutString: "56,55,1" }`,
`toBttShortcutString`, `KeyCode`, `ModifierMask`, `ModifierKeyCode`.

## Using it *inside* BTT (Run Real JavaScript)

BetterTouchTool ≥ 6.735 ships a copy of this library and provides `require()` in its JavaScript engine:

```js
async function main() {
  const { Btt, actions } = require("bettertouchtool");
  const btt = Btt.inProcess();
  await btt.triggerAction(actions.showHUD("Hello from inside BTT"));
  return await btt.getStringVariable("BTTActiveAppBundleIdentifier");
}
```

`require()` also loads your own CommonJS bundles from `~/Library/Application Support/BetterTouchTool/JavaScriptModules/<name>.js`
or from a file path (`npx esbuild my.js --bundle --format=cjs --platform=browser --outfile=…`). On older BTT
versions bundle as IIFE and use `eval(readFile("/path/to/bundle.js"))`.

## CLI

```bash
npx bettertouchtool help
btt trigger-named "My Trigger"
btt get-var BTTActiveAppBundleIdentifier
btt set-var counter 5 --persistent
btt hud "Hello" --detail "from the shell" --duration 2
btt shortcut "cmd+shift+4"
btt triggers list --type BTTTriggerTypeKeyboardShortcut
btt actions search hud · btt actions show 254 · btt trigger-types search swipe
btt call trigger_action json='{"BTTPredefinedActionType":254,"BTTAdditionalActionData":{"BTTActionHUDTitle":"hi"}}'
```

Connection: `--socket [path]`, `--url http://host:port`, `--port n`, `--secret s` or env
`BTT_SOCKET`, `BTT_URL`, `BTT_PORT`, `BTT_SECRET`. Default is auto-detect (socket if present).

## Migrating from `btt` (Worie)

| `btt` 3.x | `bettertouchtool` |
|---|---|
| `new Btt({ domain, port, protocol, sharedKey })` | `Btt.http({ host, port, https, sharedSecret })` |
| `btt.showHUD({...}).invoke()` | `btt.triggerAction(actions.showHUD(...))` |
| `btt.invokeChain().showHUD().sendShortcut().call()` | `btt.chain().showHUD().sendShortcut().run()` |
| `btt.Trigger.create(json)` / `.get({uuid})` | `btt.addNewTrigger(json)` / `btt.trigger(uuid)` |
| `btt.Widget.get({uuid})` `.update()` `.refresh()` | `btt.widget(uuid)` `.update()` `.refresh()` |
| `btt.state.get/set` | `btt.vars.get/set` |
| `btt.addEventListener` (needs btt-node-server) | not needed – use BTT triggers + `btt.vars.watch`, WebSocket events planned |
| `EActions.SHOW_HUD` | `ActionType.SHOW_HUD` |

## About this project

This package is published by folivora.AI (the makers of BetterTouchTool). It is **AI generated and AI
maintained**: the code, tests, docs and the catalogs were written with Claude (Anthropic) and are kept in
sync with new BetterTouchTool versions the same way – the action/trigger catalogs are regenerated from BTT's
own reference documentation. Bug reports and pull requests are welcome; expect fixes to be produced with AI
assistance and reviewed by a human before release. It succeeds the community package
[`btt`](https://github.com/Worie/btt) by Wojciech Połowniak, which inspired the overall shape (typed action
builders, chaining, trigger/widget objects) but shares no code with it.

## Development

```bash
npm run generate     # regenerate catalogs from BTT's docs (BTT_DOCS_DIR=…/Code/AI/Resources)
npm test             # unit tests (fake transport)
BTT_LIVE=1 npm run test:live            # against a running BTT (socket) – or BTT_URL=http://127.0.0.1:PORT
npm run build
```

MIT © folivora.AI GmbH
