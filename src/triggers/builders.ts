/**
 * Builders returning trigger JSON for `btt.addNewTrigger()` / `btt.updateTrigger()`.
 * All builders accept a list of actions (see `actions.*`) plus common options.
 */
import { parseShortcut } from "../actions/keys.js";
import type { ActionJson, TriggerJson } from "../types.js";
import { TriggerClass } from "./catalog.generated.js";

export interface TriggerOptions {
  /** Shown in the BTT UI ("Notes"). */
  description?: string;
  uuid?: string;
  enabled?: boolean;
  /** NSPredicate format string for advanced conditions. */
  conditions?: string;
  /** Required modifier mask (BTTRequiredModifierKeys). */
  requiredModifiers?: number;
  /** Any raw keys merged into the trigger. */
  extra?: Record<string, unknown>;
  /** BTTTriggerConfig contents. */
  config?: Record<string, unknown>;
}

function base(triggerType: number, triggerClass: string, actions: ActionJson[], o: TriggerOptions): TriggerJson {
  return {
    BTTTriggerType: triggerType,
    BTTTriggerClass: triggerClass,
    BTTEnabled: o.enabled === false ? 0 : 1,
    BTTEnabled2: o.enabled === false ? 0 : 1,
    ...(o.uuid ? { BTTUUID: o.uuid } : {}),
    ...(o.description ? { BTTTriggerTypeDescription: o.description, BTTNotes: o.description } : {}),
    ...(o.conditions ? { BTTTriggerConditionsFormat: o.conditions } : {}),
    ...(o.requiredModifiers !== undefined ? { BTTRequiredModifierKeys: o.requiredModifiers } : {}),
    ...(o.config ? { BTTTriggerConfig: o.config } : {}),
    BTTActionsToExecute: actions,
    ...(o.extra ?? {}),
  };
}

/** Generic trigger of any type/class. */
export function trigger(
  triggerType: number,
  triggerClass: string,
  actions: ActionJson[],
  o: TriggerOptions = {},
): TriggerJson {
  return base(triggerType, triggerClass, actions, o);
}

/** Global keyboard shortcut trigger, e.g. keyboardShortcut("cmd+shift+k", [showHUD("hi")]). */
export function keyboardShortcut(
  shortcut: string,
  actions: ActionJson[],
  o: TriggerOptions & { onKeyUp?: boolean; autoAdaptToLayout?: boolean } = {},
): TriggerJson {
  const p = parseShortcut(shortcut);
  return base(0, TriggerClass.KeyboardShortcut, actions, {
    ...o,
    extra: {
      BTTShortcutKeyCode: p.keyCode,
      BTTShortcutModifierKeys: p.modifierMask,
      BTTShortcutAdvancedModifierKeys: String(p.modifierMask),
      BTTAdditionalConfiguration: String(p.modifierMask),
      BTTLayoutIndependentChar: p.key,
      BTTTriggerOnDown: o.onKeyUp ? 0 : 1,
      BTTAutoAdaptToKeyboardLayout: o.autoAdaptToLayout ? 1 : 0,
      ...(o.extra ?? {}),
    },
  });
}

export interface NamedTriggerOptions extends TriggerOptions {
  aiDescription?: string;
  allowAI?: boolean;
  variables?: Array<{ name: string; type?: "text" | "number"; description?: string; options?: string[] }>;
}

/** Reusable named trigger (Automations & Named Triggers) callable via btt.triggerNamed(name). */
export function namedTrigger(name: string, actions: ActionJson[], o: NamedTriggerOptions = {}): TriggerJson {
  const cfg: Record<string, unknown> = {};
  if (o.variables?.length) {
    cfg.BTTNamedTriggerAIRequiresVariables = true;
    o.variables.slice(0, 2).forEach((v, i) => {
      const n = i + 1;
      cfg[`BTTNamedTriggerAIVar${n}Name`] = v.name;
      if (v.type) cfg[`BTTNamedTriggerAIVar${n}Type`] = v.type === "number" ? 1 : 0;
      if (v.description) cfg[`BTTNamedTriggerAIVar${n}Description`] = v.description;
      if (v.options) cfg[`BTTNamedTriggerAIVar${n}Options`] = v.options.join("\n");
    });
  }
  return base(643, TriggerClass.OtherTriggers, actions, {
    ...o,
    extra: {
      BTTTriggerName: name,
      ...(o.aiDescription ? { BTTNamedTriggerAIDescription: o.aiDescription } : {}),
      ...(o.allowAI !== undefined ? { BTTNamedTriggerAIAllow: o.allowAI ? 1 : 0 } : {}),
      ...(Object.keys(cfg).length ? { BTTCustomContextMenuItemConfig: cfg } : {}),
      ...(o.extra ?? {}),
    },
  });
}

/** Trackpad gesture (BTTTriggerType from triggerCatalog, e.g. 112 = three finger swipe left…). */
export function trackpadGesture(
  triggerType: number,
  actions: ActionJson[],
  o: TriggerOptions & { device?: keyof typeof TrackpadClass } = {},
): TriggerJson {
  return base(triggerType, TrackpadClass[o.device ?? "all"], actions, o);
}

export const TrackpadClass = {
  all: TriggerClass.TouchpadAll,
  builtIn: TriggerClass.TouchpadBuiltIn,
  magicTrackpad: TriggerClass.TouchpadMagicTrackpad,
  magicTrackpad2: TriggerClass.TouchpadMagicTrackpad2,
  touchBar: TriggerClass.TouchBarTrackpad,
} as const;

export function magicMouseGesture(triggerType: number, actions: ActionJson[], o: TriggerOptions = {}): TriggerJson {
  return base(triggerType, TriggerClass.MagicMouse, actions, o);
}

export function mouseTrigger(triggerType: number, actions: ActionJson[], o: TriggerOptions = {}): TriggerJson {
  return base(triggerType, TriggerClass.Mouse, actions, o);
}

/** "Other" trigger / automation (app launched, wifi, timer, file changed, …). */
export function otherTrigger(triggerType: number, actions: ActionJson[], o: TriggerOptions = {}): TriggerJson {
  return base(triggerType, TriggerClass.OtherTriggers, actions, o);
}

export interface TouchBarButtonOptions extends TriggerOptions {
  /** "r, g, b, a" */
  color?: string;
  sfSymbol?: string;
  iconWidth?: number;
  iconHeight?: number;
}

export function touchBarButton(name: string, actions: ActionJson[], o: TouchBarButtonOptions = {}): TriggerJson {
  return base(629, TriggerClass.TouchBar, actions, {
    ...o,
    extra: { BTTTouchBarButtonName: name, ...(o.extra ?? {}) },
    config: {
      ...(o.color ? { BTTTouchBarButtonColor: o.color } : {}),
      ...(o.sfSymbol ? { BTTTouchBarItemSFSymbolDefaultIcon: o.sfSymbol } : {}),
      ...(o.iconWidth !== undefined ? { BTTTouchBarItemIconWidth: o.iconWidth } : {}),
      ...(o.iconHeight !== undefined ? { BTTTouchBarItemIconHeight: o.iconHeight } : {}),
      ...(o.config ?? {}),
    },
  });
}

export interface StreamDeckButtonOptions extends TriggerOptions {
  backgroundColor?: string;
  sfSymbol?: string;
  cornerRadius?: number;
  serial?: string;
}

export function streamDeckButton(name: string, actions: ActionJson[], o: StreamDeckButtonOptions = {}): TriggerJson {
  return base(719, TriggerClass.StreamDeck, actions, {
    ...o,
    extra: {
      BTTStreamDeckButtonName: name,
      ...(o.serial ? { BTTStreamDeckSN: o.serial } : {}),
      ...(o.extra ?? {}),
    },
    config: {
      ...(o.backgroundColor ? { BTTStreamDeckBackgroundColor: o.backgroundColor } : {}),
      ...(o.sfSymbol ? { BTTStreamDeckIconType: 2, BTTStreamDeckSFSymbolName: o.sfSymbol } : {}),
      ...(o.cornerRadius !== undefined ? { BTTStreamDeckCornerRadius: o.cornerRadius } : {}),
      ...(o.config ?? {}),
    },
  });
}

/** Floating menu item (button, BTTTriggerType 773). `menuConfig` = BTTMenuConfig keys (BTTMenuItemText …). */
export function floatingMenuItem(
  actions: ActionJson[],
  o: TriggerOptions & { menuConfig?: Record<string, unknown>; itemType?: number } = {},
): TriggerJson {
  return base(o.itemType ?? 773, TriggerClass.FloatingMenu, actions, {
    ...o,
    extra: { ...(o.menuConfig ? { BTTMenuConfig: o.menuConfig } : {}), ...(o.extra ?? {}) },
  });
}
