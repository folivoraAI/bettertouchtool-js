import { describe, expect, it } from "vitest";
import { Btt, BttError, actions, triggers } from "../src/index.js";
import { FakeTransport } from "./fake-transport.js";

const make = (replies: ConstructorParameters<typeof FakeTransport>[0] = {}) => {
  const t = new FakeTransport(replies);
  return { t, btt: new Btt({ transport: t }) };
};

describe("Btt client", () => {
  it("triggerNamed passes name and wait flag", async () => {
    const { t, btt } = make({ trigger_named: "ok" });
    expect(await btt.triggerNamed("Foo")).toBe("ok");
    expect(t.last()).toEqual({ command: "trigger_named", params: { trigger_name: "Foo", wait_for_reply: true } });
  });

  it("variables round-trip and infer types", async () => {
    const { t, btt } = make({ get_number_variable: "0.5", get_variable_type: "number", get_string_variable: "x" });
    expect(await btt.getNumberVariable("OutputVolume")).toBe(0.5);
    expect(await btt.vars.get("OutputVolume")).toBe(0.5);
    await btt.vars.set("a", 3, { persistent: true });
    expect(t.last().command).toBe("set_persistent_number_variable");
    await btt.vars.set("b", "s");
    expect(t.last()).toEqual({ command: "set_string_variable", params: { variable_name: "b", to: "s" } });
  });

  it("getTriggers builds filter params and parses arrays", async () => {
    const { t, btt } = make({ get_triggers: JSON.stringify([{ BTTUUID: "1" }, { BTTUUID: "2" }]) });
    const res = await btt.getTriggers({ triggerId: 643, appBundleIdentifier: "com.apple.finder" });
    expect(res.map((r) => r.BTTUUID)).toEqual(["1", "2"]);
    expect(t.last().params).toEqual({ trigger_id: 643, trigger_app_bundle_identifier: "com.apple.finder" });
  });

  it("addNewTrigger uses the uuid BTT returns", async () => {
    const { t, btt } = make({ add_new_trigger: "31A8C22E-776B-43F5-B0BC-ED70DAF96F4C" });
    const h = await btt.addNewTrigger(triggers.namedTrigger("hello", [actions.showHUD("hi")]));
    expect(h.uuid).toBe("31A8C22E-776B-43F5-B0BC-ED70DAF96F4C");
    const json = t.last().params?.json as Record<string, unknown>;
    expect(json.BTTTriggerType).toBe(643);
    expect(json.BTTTriggerName).toBe("hello");
    await h.disable();
    expect(t.last()).toEqual({
      command: "update_trigger",
      params: { uuid: h.uuid, json: { BTTEnabled: 0, BTTEnabled2: 0 } },
    });
  });

  it("triggerAction merges sequences into one action", async () => {
    const { t, btt } = make();
    await btt.triggerAction([actions.showHUD("a"), actions.delay(1), actions.sendShortcut("cmd+s")]);
    const json = t.last().params?.json as { BTTPredefinedActionType: number; BTTAdditionalActions: unknown[] };
    expect(json.BTTPredefinedActionType).toBe(254);
    expect(json.BTTAdditionalActions).toHaveLength(2);
  });

  it("chain.run sends one combined action", async () => {
    const { t, btt } = make();
    await btt.chain().showHUD("x").delay(0.5).launchApp("com.apple.Safari").run();
    expect(t.calls).toHaveLength(1);
    const json = t.last().params?.json as { BTTAdditionalActions: Array<{ BTTPredefinedActionType: number }> };
    expect(json.BTTAdditionalActions.map((a) => a.BTTPredefinedActionType)).toEqual([345, 49]);
  });

  it("surfaces in-band BTT errors", async () => {
    const { btt } = make({ trigger_named: "command not found: trigger_named" });
    await expect(btt.triggerNamed("x")).rejects.toBeInstanceOf(BttError);
  });

  it("menu item refs accept uuid string or object", async () => {
    const { t, btt } = make({ get_menu_item_value: "42" });
    expect(await btt.getMenuItemValue("ABC")).toBe("42");
    expect(t.last().params).toEqual({ item_uuid: "ABC" });
    await btt.updateMenuItem({ menuName: "M", itemName: "I" }, { BTTMenuItemText: "hi" }, { persist: true });
    expect(t.last().params).toEqual({ menu_name: "M", item_name: "I", json: { BTTMenuItemText: "hi" }, persist: true });
  });

  it("clipboard contents map arrays", async () => {
    const { t, btt } = make();
    await btt.setClipboardContents([
      { content: "hi", format: "NSPasteboardTypeString" },
      { content: "<b>hi</b>", format: "NSPasteboardTypeHTML" },
    ]);
    expect(t.last().params).toEqual({
      contents: ["hi", "<b>hi</b>"],
      formats: ["NSPasteboardTypeString", "NSPasteboardTypeHTML"],
    });
  });
});
