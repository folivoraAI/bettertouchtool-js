/**
 * Ergonomic builders for the most used BTT actions. Every builder returns plain action JSON
 * (`ActionJson`) that you can pass to `btt.triggerAction()`, put into a trigger's
 * `BTTActionsToExecute`, or combine with `sequence()`.
 *
 * For anything not covered here use `action(ActionType.X, {...})` together with the generated
 * `actionDefinitions` catalog (each entry documents its parameters).
 */
import type { ActionJson } from "../types.js";
import { ActionType } from "./catalog.generated.js";
import { toBttShortcutString } from "./keys.js";

/** Generic builder: any BTTPredefinedActionType plus extra keys. */
export function action(type: number, extra: Record<string, unknown> = {}): ActionJson {
  return { BTTPredefinedActionType: type, ...extra };
}

/** Combines several actions into one action JSON (first action + BTTAdditionalActions). */
export function sequence(...actions: ActionJson[]): ActionJson {
  if (actions.length === 0) throw new Error("sequence() needs at least one action");
  const [first, ...rest] = actions as [ActionJson, ...ActionJson[]];
  return rest.length
    ? { ...first, BTTAdditionalActions: [...(first.BTTAdditionalActions ?? []), ...rest] }
    : first;
}

// ------------------------------------------------------------------ HUD / notifications

export interface HudOptions {
  title?: string;
  detail?: string;
  /** seconds; 0 = stays until dismissed */
  duration?: number;
  /** CSS-ish color e.g. "#000000CC" or "r,g,b,a" */
  background?: string;
  blur?: boolean;
  /** 0 center, 1 top-center, 2 bottom-center, 3 top-left, 4 top-right, 5 bottom-left, 6 bottom-right */
  position?: number;
  offsetX?: number;
  offsetY?: number;
  closeOnClick?: boolean;
  hideWhenOtherHudAppears?: boolean;
  width?: number;
  height?: number;
  padding?: number;
  borderColor?: string;
  borderWidth?: number;
  slideDirection?: number;
  /** 0 main display, 1 display with mouse … */
  display?: number;
  /** Any raw BTTActionHUD* keys */
  extra?: Record<string, unknown>;
}

export function showHUD(titleOrOptions: string | HudOptions, options: HudOptions = {}): ActionJson {
  const o = typeof titleOrOptions === "string" ? { title: titleOrOptions, ...options } : titleOrOptions;
  const data: Record<string, unknown> = {
    BTTActionHUDTitle: o.title ?? "",
    BTTActionHUDDetail: o.detail ?? "",
    BTTActionHUDDuration: o.duration ?? 0.8,
    ...(o.background !== undefined ? { BTTActionHUDBackground: o.background } : {}),
    ...(o.blur !== undefined ? { BTTActionHUDBlur: o.blur } : {}),
    ...(o.position !== undefined ? { BTTActionHUDPosition: o.position } : {}),
    ...(o.offsetX !== undefined ? { BTTActionHUDOffsetX: o.offsetX } : {}),
    ...(o.offsetY !== undefined ? { BTTActionHUDOffsetY: o.offsetY } : {}),
    ...(o.closeOnClick !== undefined ? { BTTActionHUDCloseOnClick: o.closeOnClick } : {}),
    ...(o.hideWhenOtherHudAppears !== undefined
      ? { BTTActionHUDHideWhenOtherHUDAppears: o.hideWhenOtherHudAppears }
      : {}),
    ...(o.width !== undefined ? { BTTActionHUDWidth: o.width } : {}),
    ...(o.height !== undefined ? { BTTActionHUDHeight: o.height } : {}),
    ...(o.padding !== undefined ? { BTTActionHUDPadding: o.padding } : {}),
    ...(o.borderColor !== undefined ? { BTTActionHUDBorderColor: o.borderColor } : {}),
    ...(o.borderWidth !== undefined ? { BTTActionHUDBorderWidth: o.borderWidth } : {}),
    ...(o.slideDirection !== undefined ? { BTTActionHUDSlideDirection: o.slideDirection } : {}),
    ...(o.display !== undefined ? { BTTActionHUDDisplayToUse: o.display } : {}),
    ...(o.extra ?? {}),
  };
  return action(ActionType.SHOW_HUD, { BTTAdditionalActionData: data });
}

export interface NotificationActionOptions {
  title: string;
  subtitle?: string;
  message?: string;
  /** e.g. "default", "Frog" */
  sound?: string;
  /** image path */
  attachment?: string;
}

export function showNotification(o: NotificationActionOptions): ActionJson {
  return action(ActionType.SHOW_NOTIFICATION, {
    BTTAdditionalActionData: {
      BTTActionSendNotificationTitle: o.title,
      ...(o.subtitle !== undefined ? { BTTActionSendNotificationSubTitle: o.subtitle } : {}),
      ...(o.message !== undefined ? { BTTActionSendNotificationMessage: o.message } : {}),
      ...(o.sound !== undefined ? { BTTActionSendNotificationSound: o.sound } : {}),
      ...(o.attachment !== undefined ? { BTTActionSendNotificationAttachment: o.attachment } : {}),
    },
  });
}

// ------------------------------------------------------------------ keyboard / text

export interface SendShortcutOptions {
  /** "onlyDown" | "onlyUp" */
  upDown?: "onlyDown" | "onlyUp";
  includeCurrentModifiers?: boolean;
  /** send at HID level (helps with apps that ignore session-level events) */
  lowLevel?: boolean;
}

/** Sends a keyboard shortcut system-wide, e.g. sendShortcut("cmd+shift+s"). */
export function sendShortcut(shortcut: string, o: SendShortcutOptions = {}): ActionJson {
  const extra: Record<string, unknown> = { BTTShortcutToSend: toBttShortcutString(shortcut) };
  if (o.upDown) extra.BTTShortcutUpDown = o.upDown;
  if (o.includeCurrentModifiers !== undefined || o.lowLevel !== undefined) {
    extra.BTTAdditionalActionData = {
      ...(o.includeCurrentModifiers !== undefined
        ? { BTTActionSendKeyboardShortcutIncludeCurrentModifiers: o.includeCurrentModifiers }
        : {}),
      ...(o.lowLevel !== undefined ? { BTTActionSendKeyboardShortcutLowLevel: o.lowLevel } : {}),
    };
  }
  return action(ActionType.SEND_KEYBOARD_SHORTCUT, extra);
}

/** Sends a shortcut to a specific app (bundle id / path / "active app" / "app under mouse cursor"). */
export function sendShortcutToApp(
  shortcut: string,
  app: string,
  o: { switchToAppFirst?: boolean } = {},
): ActionJson {
  return action(ActionType.SEND_SHORTCUT_TO_SPECIFIC_APP, {
    BTTShortcutToSend: toBttShortcutString(shortcut),
    BTTShortcutApp: app,
    BTTShortcutSwitchToAppFirst: o.switchToAppFirst ? 1 : 0,
  });
}

/** Types text character by character. */
export function typeText(text: string, o: { moveCursorLeftBy?: number } = {}): ActionJson {
  return action(ActionType.TYPE_STRING, {
    BTTStringToType: text,
    ...(o.moveCursorLeftBy !== undefined ? { BTTMoveCursorLeftBy: o.moveCursorLeftBy } : {}),
  });
}

/** Pastes text (faster than typing, uses the clipboard). */
export function pasteText(text: string, o: { moveCursorLeftBy?: number } = {}): ActionJson {
  return action(ActionType.PASTE_STRING, {
    BTTStringToType: text,
    ...(o.moveCursorLeftBy !== undefined ? { BTTMoveCursorLeftBy: o.moveCursorLeftBy } : {}),
  });
}

// ------------------------------------------------------------------ apps & urls

export function launchApp(pathOrBundleId: string): ActionJson {
  return action(ActionType.LAUNCH_APPLICATION, { BTTLaunchPath: pathOrBundleId });
}

export function showHideApp(
  bundleIdOrPath: string,
  o: { showIfHidden?: boolean; hideIfVisible?: boolean } = {},
): ActionJson {
  return action(ActionType.SHOW_HIDE_SPECIFIC_APPLICATION, {
    BTTAppToShowOrHide: bundleIdOrPath,
    BTTGenericActionConfig2: { showIfHidden: o.showIfHidden ?? true, hideIfVisible: o.hideIfVisible ?? true },
  });
}

export function quitApp(
  bundleIdOrPath: string,
  o: { force?: boolean; forceAfterSeconds?: number } = {},
): ActionJson {
  const cfg: Record<string, unknown> = {};
  if (o.force !== undefined) cfg.BTTQuitAppForceQuit = o.force;
  if (o.forceAfterSeconds !== undefined) cfg.BTTQuitAppForceQuitTimeout = o.forceAfterSeconds;
  return action(ActionType.QUIT_SPECIFIC_APPLICATION, {
    BTTAppToQuit: bundleIdOrPath,
    ...(Object.keys(cfg).length ? { BTTQuitAppConfig: JSON.stringify(cfg) } : {}),
  });
}

export function openURL(url: string, o: { browserBundleId?: string } = {}): ActionJson {
  return action(ActionType.OPEN_URL, {
    BTTOpenURL: url,
    ...(o.browserBundleId ? { BTTOpenURLBrowser: o.browserBundleId } : {}),
  });
}

// ------------------------------------------------------------------ scripts

export interface ScriptOptions {
  /** run in background (async) instead of blocking */
  background?: boolean;
  /** treat `script` as a file path */
  path?: boolean;
}

export function runAppleScript(script: string, o: ScriptOptions = {}): ActionJson {
  return action(o.background ? ActionType.RUN_APPLESCRIPT_BACKGROUND : ActionType.RUN_APPLESCRIPT_BLOCKING, {
    BTTAdditionalActionData: {
      BTTScriptType: 0,
      BTTAppleScriptUsePath: o.path ?? false,
      BTTScriptLocation: 0,
      BTTAppleScriptRunInBackground: o.background ?? false,
      BTTAppleScriptString: script,
    },
  });
}

/** Runs BTT's "Run Real JavaScript" (JavaScriptCore with async/await, callBTT etc). */
export function runJavaScript(script: string, o: { path?: boolean } = {}): ActionJson {
  return action(ActionType.RUN_CORE_JAVASCRIPT, {
    BTTAdditionalActionData: {
      BTTScriptType: 3,
      BTTAppleScriptUsePath: o.path ?? false,
      BTTScriptLocation: 0,
      BTTAppleScriptRunInBackground: true,
      BTTAppleScriptString: script,
    },
  });
}

/** Runs JavaScript for Automation (JXA). */
export function runJXA(script: string, o: ScriptOptions = {}): ActionJson {
  return action(o.background ? ActionType.RUN_JAVASCRIPT_BACKGROUND : ActionType.RUN_JAVASCRIPT_MAIN_THREAD, {
    BTTAdditionalActionData: {
      BTTScriptType: 1,
      BTTAppleScriptUsePath: o.path ?? false,
      BTTScriptLocation: 0,
      BTTAppleScriptRunInBackground: o.background ?? true,
      BTTAppleScriptString: script,
    },
  });
}

/** Runs a shell script (Shell Script Task). `shell` defaults to /bin/bash. */
export function runShellScript(script: string, o: { shell?: string } = {}): ActionJson {
  return action(ActionType.SHELL_SCRIPT_TASK, {
    BTTShellTaskActionScript: script,
    BTTShellTaskActionConfig: o.shell ?? "/bin/bash",
  });
}

export function runTerminalCommand(command: string, o: { background?: boolean } = {}): ActionJson {
  return action(
    o.background ? ActionType.TERMINAL_COMMAND_BACKGROUND : ActionType.TERMINAL_COMMAND_BLOCKING,
    {
      BTTTerminalCommand: command,
    },
  );
}

/** Runs a shortcut from Apple's Shortcuts app. */
export function runAppleShortcut(name: string, input?: string): ActionJson {
  return action(ActionType.RUN_APPLE_SHORTCUT, {
    BTTAdditionalActionData: {
      BTTFormAppleShortcutName: name,
      ...(input !== undefined ? { BTTShortcutInput: input } : {}),
    },
  });
}

// ------------------------------------------------------------------ BTT control flow / variables

export function triggerNamed(name: string, variables?: Record<string, string>): ActionJson {
  const data: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(variables ?? {})) data[`BTTActionTriggerNamedTriggerVar_${k}`] = v;
  return action(ActionType.TRIGGER_NAMED_TRIGGER, {
    BTTNamedTriggerToTrigger: name,
    ...(Object.keys(data).length ? { BTTAdditionalActionData: data } : {}),
  });
}

/** Executes the actions of the trigger with the given UUID. */
export function triggerUuid(uuid: string): ActionJson {
  return action(ActionType.TRIGGER_ACTIONS_FOR_ITEM_WITH_UUID, { BTTGenericActionConfig: uuid });
}

/** Non-blocking delay between actions (seconds). */
export function delay(seconds: number, o: { blocking?: boolean } = {}): ActionJson {
  return action(o.blocking ? ActionType.DELAY_BLOCKING : ActionType.DELAY_ASYNC_NON_BLOCKING, {
    BTTDelayNextActionBy: seconds,
  });
}

export function setVariable(
  name: string,
  value: string | number,
  o: { persistent?: boolean; onlyIfUndefined?: boolean } = {},
): ActionJson {
  return action(ActionType.SET_VARIABLE, {
    BTTVariableName: name,
    BTTVariableValue: String(value),
    BTTVariablePersist: o.persistent ? 1 : 0,
    BTTVariableType: typeof value === "number" ? 1 : 0,
    ...(o.onlyIfUndefined !== undefined ? { BTTVariableOnlySetIfNotYetDefined: o.onlyIfUndefined } : {}),
  });
}

export function increaseVariable(name: string, by = 1): ActionJson {
  return action(ActionType.INCREASE_VARIABLE, { BTTVariableName: name, BTTGenericActionConfig: String(by) });
}

export function toggleVariable(name: string, values?: string[]): ActionJson {
  if (!values) return action(ActionType.TOGGLE_ON_OFF, { BTTVariableName: name });
  return action(ActionType.TOGGLE_VARIABLE, {
    BTTVariableName: name,
    BTTGenericActionConfig: JSON.stringify({ values }),
  });
}

// ------------------------------------------------------------------ mouse

export interface MoveMouseOptions {
  /** see docs: 0 global, 1-4 window corners, 5 window center, 6 relative to cursor, … */
  anchor?: number;
  /** 0 px, 1 % of window, 2 % of screen */
  unitX?: 0 | 1 | 2;
  unitY?: 0 | 1 | 2;
  /** seconds (default 0.2) */
  duration?: number;
  withoutPressedModifiers?: boolean;
  screen?: string;
}

export function moveMouse(x: number, y: number, o: MoveMouseOptions = {}): ActionJson {
  return action(ActionType.MOVE_MOUSE_TO_POSITION, {
    BTTAdditionalActionData: {
      BTTMouseMoveX: x,
      BTTMouseMoveY: y,
      BTTMouseMoveAnchor: o.anchor ?? 0,
      BTTMouseMoveUnitX: o.unitX ?? 0,
      BTTMouseMoveUnitY: o.unitY ?? 0,
      ...(o.duration !== undefined ? { BTTMouseMoveDuration: o.duration } : {}),
      ...(o.withoutPressedModifiers !== undefined
        ? { BTTMouseMoveWithoutPressedModifierKeys: o.withoutPressedModifiers }
        : {}),
      ...(o.screen ? { BTTMouseMoveScreenNameOrUUID: o.screen } : {}),
    },
  });
}

export const leftClick = (): ActionJson => action(ActionType.LEFT_CLICK);
export const rightClick = (): ActionJson => action(ActionType.RIGHT_CLICK);
export const middleClick = (): ActionJson => action(ActionType.MIDDLE_CLICK);
export const doubleClick = (): ActionJson => action(ActionType.DOUBLE_LEFT_CLICK);

// ------------------------------------------------------------------ system

export const noAction = (): ActionJson => action(ActionType.NO_ACTION);
export const sleepDisplay = (): ActionJson => action(ActionType.SLEEP_DISPLAY);
export const sleepComputer = (): ActionJson => action(ActionType.SLEEP_COMPUTER);
export const lockScreen = (): ActionJson => action(ActionType.LOCK_SCREEN);
export const startScreenSaver = (): ActionJson => action(ActionType.START_SCREEN_SAVER);
export const toggleDoNotDisturb = (): ActionJson => action(ActionType.TOGGLE_DO_NOT_DISTURB);
export const toggleDarkMode = (): ActionJson => action(ActionType.TOGGLE_DARK_MODE);
export const missionControl = (): ActionJson => action(ActionType.MISSION_CONTROL);
export const showDesktop = (): ActionJson => action(ActionType.SHOW_DESKTOP);
export const volumeUp = (o: { small?: boolean } = {}): ActionJson =>
  action(o.small ? ActionType.VOLUME_UP_SMALL_STEP : ActionType.VOLUME_UP);
export const volumeDown = (o: { small?: boolean } = {}): ActionJson =>
  action(o.small ? ActionType.VOLUME_DOWN_SMALL_STEP : ActionType.VOLUME_DOWN);
export const setVolume = (percent: number): ActionJson =>
  action(ActionType.SET_VOLUME, { BTTGenericActionConfig: String(Math.max(0, Math.min(100, percent))) });
export const mute = (): ActionJson => action(ActionType.MUTE);

// ------------------------------------------------------------------ floating menus

export interface FloatingMenuActionOptions {
  /** 0 don't steal focus, 1 activate & steal, 2 steal without activating */
  keyboardFocus?: 0 | 1 | 2;
  hideOnModifierRelease?: boolean;
  restorePosition?: boolean;
  triggerHoveredOnHide?: boolean;
  closeSubmenuOnHide?: boolean;
}

function menuData(menuNameOrId: string, o: FloatingMenuActionOptions): Record<string, unknown> {
  const isUuid = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i.test(menuNameOrId);
  return {
    ...(isUuid ? { BTTMenuActionMenuID: menuNameOrId } : { BTTMenuActionMenuName: menuNameOrId }),
    ...(o.keyboardFocus !== undefined ? { BTTMenuActionActivateKeyboardFocus: o.keyboardFocus } : {}),
    ...(o.hideOnModifierRelease !== undefined
      ? { BTTMenuActionHideOnModifierRelease: o.hideOnModifierRelease }
      : {}),
    ...(o.restorePosition !== undefined ? { BTTMenuActionRestorePosition: o.restorePosition } : {}),
    ...(o.triggerHoveredOnHide !== undefined
      ? { BTTMenuActionTriggerHoveredOnHide: o.triggerHoveredOnHide }
      : {}),
    ...(o.closeSubmenuOnHide !== undefined ? { BTTMenuActionCloseSubmenuOnHide: o.closeSubmenuOnHide } : {}),
  };
}

export function showFloatingMenu(menuNameOrId: string, o: FloatingMenuActionOptions = {}): ActionJson {
  return action(ActionType.SHOW_FLOATING_MENU, { BTTAdditionalActionData: menuData(menuNameOrId, o) });
}
export function hideFloatingMenu(menuNameOrId: string, o: FloatingMenuActionOptions = {}): ActionJson {
  return action(ActionType.HIDE_FLOATING_MENU, { BTTAdditionalActionData: menuData(menuNameOrId, o) });
}
export function toggleFloatingMenu(menuNameOrId: string, o: FloatingMenuActionOptions = {}): ActionJson {
  return action(ActionType.TOGGLE_FLOATING_MENU, { BTTAdditionalActionData: menuData(menuNameOrId, o) });
}

// ------------------------------------------------------------------ haptics

/** 0 none, 16 very light, 1 light, 2 strong, 3 light→strong, 4 double strong, 5 double light, 6 spring light */
export function hapticFeedback(pattern = 1): ActionJson {
  return action(ActionType.HAPTIC_FEEDBACK, { BTTHapticFeedbackAction: pattern });
}
