// Shows a HUD through BTT's webserver (Settings → Scripting BTT → Webserver)
//   BTT_PORT=64472 BTT_SECRET=my-secret node hud-http.mjs
import { Btt, actions } from "bettertouchtool";

const btt = Btt.http({
  url: process.env.BTT_URL ?? `http://127.0.0.1:${process.env.BTT_PORT ?? 64472}`,
  sharedSecret: process.env.BTT_SECRET,
});
await btt.triggerAction(
  actions.showHUD("Hello over HTTP", {
    detail: "sent by Node.js",
    duration: 2,
    background: "#1E88E5CC",
    position: 1,
  }),
);
