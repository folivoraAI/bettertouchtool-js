// Bundle with: npx esbuild examples/inside-btt.ts --bundle --format=iife --platform=browser --outfile=out.js
// then in a "Run Real JavaScript" action: eval(readFile("/path/to/out.js"))
import { Btt, actions } from "bettertouchtool";
declare function returnToBTT(v: unknown): void;

(async () => {
  const btt = Btt.inProcess();
  const sel = await btt.getSelection();
  await btt.triggerAction(actions.showHUD(`Selected ${sel.length} chars`));
  returnToBTT(sel.toUpperCase());
})();
