/**
 * Integration test against a running BetterTouchTool. Opt-in:
 *   BTT_LIVE=1 BTT_URL=http://127.0.0.1:PORT [BTT_SECRET=…] npm run test:live
 * or with the unix socket enabled: BTT_LIVE=1 BTT_SOCKET=1 npm run test:live
 */
import { afterAll, describe, expect, it } from "vitest";
import { Btt, HttpTransport, UnixSocketTransport, actions, triggers } from "../../src/index.js";

const secret = process.env.BTT_SECRET;
const transport = process.env.BTT_URL
  ? new HttpTransport({ url: process.env.BTT_URL, sharedSecret: secret })
  : new UnixSocketTransport({ sharedSecret: secret });
const btt = new Btt({ transport });
const created: string[] = [];

describe.skipIf(!process.env.BTT_LIVE)("live BTT", () => {
  afterAll(async () => {
    for (const u of created) await btt.deleteTrigger(u).catch(() => {});
  });

  it("reads a system variable", async () => {
    const app = await btt.getStringVariable("BTTActiveAppBundleIdentifier");
    expect(typeof app).toBe("string");
  });

  it("sets and reads variables", async () => {
    await btt.vars.set("btt_js_test_num", 42);
    expect(await btt.getNumberVariable("btt_js_test_num")).toBe(42);
    await btt.vars.set("btt_js_test_str", "hello");
    expect(await btt.getStringVariable("btt_js_test_str")).toBe("hello");
  });

  it("creates, lists, invokes and deletes a named trigger", async () => {
    const name = `btt-js-live-${Date.now()}`;
    const h = await btt.addNewTrigger(
      triggers.namedTrigger(name, [actions.setVariable("btt_js_live_ran", "yes")]),
    );
    created.push(h.uuid);
    // NOTE: getTriggers({ triggerId }) does not see unsaved triggers over http/socket in BTT < 6.735
    // (trigger_id arrives as a string); filter by type instead.
    const found = await btt.getTriggers({ triggerType: "BTTTriggerTypeOtherTriggers" });
    expect(found.some((t) => t.BTTTriggerName === name)).toBe(true);
    expect((await btt.getTriggers({ uuid: h.uuid }))[0]?.BTTTriggerName).toBe(name);
    await btt.triggerNamed(name);
    expect(await btt.getStringVariable("btt_js_live_ran")).toBe("yes");
    const json = await h.get();
    expect(json.BTTTriggerName).toBe(name);
    await h.delete();
    created.pop();
  });

  it("shows a HUD via trigger_action", async () => {
    await btt.triggerAction(actions.showHUD("bettertouchtool npm", { detail: "live test", duration: 1 }));
  });
});
