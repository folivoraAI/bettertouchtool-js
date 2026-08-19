// Paste into a "Run Real JavaScript" action in BetterTouchTool (≥ 6.735). Nothing to install:
// BTT ships this library and provides require().
async function main() {
  const { Btt, actions } = require("bettertouchtool");
  const btt = Btt.inProcess();

  const app = await btt.getStringVariable("BTTActiveAppBundleIdentifier");
  await btt.triggerAction(
    actions.showHUD("Hello from inside BTT 🖐", { detail: `frontmost app: ${app}`, duration: 2 }),
  );
  return app;
}
