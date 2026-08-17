import { describe, expect, it } from "vitest";
import { actionCatalog, triggerCatalog } from "../src/catalog.js";
import { ActionType, actions, triggers } from "../src/index.js";

describe("catalogs", () => {
  it("contain well known actions and triggers", () => {
    expect(ActionType.SHOW_HUD).toBe(254);
    expect(actionCatalog.byId(264)?.name).toBe("Send Keyboard Shortcut");
    expect(actionCatalog.search("hud").length).toBeGreaterThan(0);
    expect(actionCatalog.all.length).toBeGreaterThan(350);
    expect(triggerCatalog.byId(643)?.name).toMatch(/Named Trigger/);
    expect(triggerCatalog.all.length).toBeGreaterThan(400);
  });
  it("builders produce documented keys", () => {
    expect(actions.sendShortcut("cmd+s")).toEqual({
      BTTPredefinedActionType: 264,
      BTTShortcutToSend: "55,1",
    });
    expect(actions.showHUD("Hi", { duration: 2 }).BTTAdditionalActionData).toMatchObject({
      BTTActionHUDTitle: "Hi",
      BTTActionHUDDuration: 2,
    });
    const kb = triggers.keyboardShortcut("cmd+shift+k", [actions.showHUD("x")], { description: "test" });
    expect(kb).toMatchObject({
      BTTTriggerClass: "BTTTriggerTypeKeyboardShortcut",
      BTTShortcutKeyCode: 40,
      BTTShortcutModifierKeys: 1179648,
      BTTTriggerOnDown: 1,
    });
    expect(kb.BTTActionsToExecute).toHaveLength(1);
  });
});
