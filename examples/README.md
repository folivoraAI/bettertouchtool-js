# Examples

| file | shows |
|---|---|
| `hud-socket.mjs` | HUD via the unix socket server |
| `hud-http.mjs` | HUD via the webserver (`BTT_PORT`, `BTT_SECRET`) |
| `hud-inside-btt.js` | HUD from a Run Real JavaScript action inside BTT via `require("bettertouchtool")` |
| `basic.mjs` | variables + HUD with auto transport |
| `menubar-clock.mjs` | update a menubar item every second |
| `floating-menu.mjs` | update a floating menu item and show the menu |
| `inside-btt.ts` | bundle the package into a Run Real JavaScript action |

Run with `node <file>` after `npm i bettertouchtool` (or from this repo: `npm run build` and import from `../dist/index.js`).
