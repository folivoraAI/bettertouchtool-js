import type { ActionJson, TriggerJson } from "../types.js";

/** Pasteboard formats accepted by clipboard/paste functions. Any UTI string also works. */
export type PasteboardFormat =
  | "NSPasteboardTypeString"
  | "NSPasteboardTypeTIFF"
  | "NSPasteboardTypePNG"
  | "NSPasteboardTypeRTF"
  | "NSPasteboardTypeRTFD"
  | "NSPasteboardTypeHTML"
  | "NSPasteboardTypeTabularText"
  | "NSPasteboardTypeFont"
  | "NSPasteboardTypeRuler"
  | "NSPasteboardTypeColor"
  | "NSPasteboardTypeSound"
  | "NSPasteboardTypeMultipleTextSelection"
  | "NSPasteboardTypeTextFinderOptions"
  | "NSPasteboardTypeURL"
  | "NSPasteboardTypeFileURL"
  | "all"
  | (string & {});

export interface TriggerNamedOptions {
  /** Wait for the (AppleScript / shell / JS) result. Default true. */
  waitForReply?: boolean;
  /** Only for the async variant: delay in seconds before execution (cancelable). */
  delaySeconds?: number;
}

export interface GetTriggersFilter {
  /** e.g. "BTTTriggerTypeKeyboardShortcut" */
  triggerType?: string;
  /** e.g. 643 for named triggers */
  triggerId?: number;
  /** items of a folder / group */
  parentUuid?: string;
  uuid?: string;
  appBundleIdentifier?: string;
  /** restrict to a preset name */
  preset?: string;
  returnOnlyIfModifiersMatch?: boolean;
}

export interface WidgetUpdate {
  text?: string;
  /** base64 encoded image */
  icon_data?: string;
  icon_path?: string;
  /** "r,g,b,a" 0-255 */
  background_color?: string;
  [key: string]: unknown;
}

export interface ClipboardOptions {
  format?: PasteboardFormat;
  asBase64?: boolean;
  /** get_clipboard_content only */
  excludeConcealed?: boolean;
}

export interface ClipboardManagerQuery {
  start?: number;
  numberOfItems?: number;
  format?: PasteboardFormat;
  snippetGroup?: string;
  asBase64?: boolean;
  /** return currently selected items in the open clipboard manager window */
  selected?: boolean;
}

export interface ClipboardManagerItem {
  meta: { copiedFrom?: string; uuid: string; previewText?: string; date?: string; [k: string]: unknown };
  content: unknown;
}

export interface ClipboardManagerResult {
  items: ClipboardManagerItem[];
  latest?: string;
}

export interface PasteTextOptions {
  /** Use cmd+v instead of typing. */
  insertByPasting?: boolean;
  moveCursorLeftByXAfterPasting?: number;
  format?: PasteboardFormat;
}

export interface NotificationOptions {
  title: string;
  subTitle?: string;
  soundName?: string;
  imagePath?: string;
  [key: string]: unknown;
}

export interface MenuItemRef {
  itemUuid?: string;
  menuName?: string;
  itemName?: string;
}

export interface ExportPresetOptions {
  name: string;
  compress?: boolean;
  includeSettings?: boolean;
  outputPath?: string;
  comment?: string;
  link?: string;
  minimumVersion?: string;
}

export interface PresetDetails {
  uuid: string;
  name: string;
  hidden: number;
  /** 0 disabled, 1 enabled, 2 enabled & master */
  activated: 0 | 1 | 2;
  color?: string;
  [k: string]: unknown;
}

export interface MenuItemDetails {
  available: boolean;
  enabled: boolean;
  checked: boolean;
}

export type Actionish = ActionJson | ActionJson[];
export type { ActionJson, TriggerJson };
