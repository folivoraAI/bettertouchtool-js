# bettertouchtool

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
| Node on the same Mac | `UnixSocketTransport` (default when the socket exists) | Settings → Scripting → **Enable Socket Server** (+ optional shared secret) |
| Node / browser / other devices | `HttpTransport` | Settings → Scripting → **Webserver** (port, shared secret, interface) |
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

BTT's JS engine has no `require`/`import`. Bundle your script (this package + your code) into one file and
load it – the client detects `callBTT` and needs no configuration:

```bash
npx esbuild my-script.ts --bundle --format=iife --platform=browser --outfile=~/Library/Application\ Support/BetterTouchTool/my-script.js
```

```js
// Run Real JavaScript action:
async function run() {
  eval(readFile("~/Library/Application Support/BetterTouchTool/my-script.js"));
  return "done";
}
```

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

## Development

```bash
npm run generate     # regenerate catalogs from BTT's docs (BTT_DOCS_DIR=…/Code/AI/Resources)
npm test             # unit tests (fake transport)
BTT_LIVE=1 npm run test:live            # against a running BTT (socket) – or BTT_URL=http://127.0.0.1:PORT
npm run build
```

MIT © folivora.AI GmbH
