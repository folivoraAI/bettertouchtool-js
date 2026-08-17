import { Btt, actions } from "bettertouchtool";

const btt = new Btt({
  http: { port: Number(process.env.BTT_PORT ?? 64472), sharedSecret: process.env.BTT_SECRET },
});
console.log("active app:", await btt.getStringVariable("BTTActiveAppBundleIdentifier"));
await btt.triggerAction(actions.showHUD("Hello from Node", { duration: 1 }));
