import type { WidgetUpdate } from "../api/types.js";
import type { Btt } from "../client.js";
import type { TriggerJson } from "../types.js";

/** Convenience wrapper around one trigger uuid. */
export interface TriggerHandle {
  readonly uuid: string;
  /** Executes the trigger's assigned actions. */
  invoke(): Promise<string>;
  get<T extends TriggerJson = TriggerJson>(): Promise<T>;
  update(patch: TriggerJson): Promise<void>;
  delete(): Promise<void>;
  reveal(): Promise<void>;
  enable(): Promise<void>;
  disable(): Promise<void>;
}

export function createTriggerHandle(btt: Btt, uuid: string): TriggerHandle {
  return {
    uuid,
    invoke: () => btt.executeAssignedActionsForTrigger(uuid),
    get: <T extends TriggerJson = TriggerJson>() => btt.getTrigger<T>(uuid),
    update: (patch) => btt.updateTrigger(uuid, patch),
    delete: () => btt.deleteTrigger(uuid),
    reveal: () => btt.revealElementInUI(uuid),
    enable: () => btt.updateTrigger(uuid, { BTTEnabled: 1, BTTEnabled2: 1 }),
    disable: () => btt.updateTrigger(uuid, { BTTEnabled: 0, BTTEnabled2: 0 }),
  };
}

/** Convenience wrapper around a script widget (Touch Bar / Stream Deck / menubar). */
export interface WidgetHandle {
  readonly uuid: string;
  readonly kind: "touchbar" | "streamdeck" | "menubar";
  /** Temporary visual update (text, icon, background…). */
  update(update: WidgetUpdate): Promise<void>;
  /** Re-run the widget's script. */
  refresh(): Promise<void>;
  /** Execute the widget's assigned actions (like a tap). */
  invoke(): Promise<string>;
  delete(): Promise<void>;
}

export function createWidgetHandle(btt: Btt, uuid: string, kind: WidgetHandle["kind"]): WidgetHandle {
  return {
    uuid,
    kind,
    update: (u) =>
      kind === "streamdeck"
        ? btt.updateStreamDeckWidget(uuid, u)
        : kind === "menubar"
          ? btt.updateMenubarItem(uuid, u)
          : btt.updateTouchBarWidget(uuid, u),
    refresh: () => btt.refreshWidget(uuid),
    invoke: () => btt.executeAssignedActionsForTrigger(uuid),
    delete: () => btt.deleteTrigger(uuid),
  };
}
