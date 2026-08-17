// Shows a HUD through BTT's unix socket server (Settings → Scripting BTT → Command Line → Enable Socket Server)
import { Btt, actions } from "bettertouchtool";

const btt = Btt.socket({ sharedSecret: process.env.BTT_SECRET });
await btt.triggerAction(actions.showHUD("Hello from the socket 👋", { detail: "sent by Node.js", duration: 2 }));
