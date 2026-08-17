import { assertNoInbandError, parseBool, parseJson, parseMaybeJson, parseNumber } from "./api/parse.js";
import type {
  ClipboardManagerQuery,
  ClipboardManagerResult,
  ClipboardOptions,
  ExportPresetOptions,
  GetTriggersFilter,
  MenuItemDetails,
  MenuItemRef,
  NotificationOptions,
  PasteTextOptions,
  PresetDetails,
  TriggerNamedOptions,
  WidgetUpdate,
} from "./api/types.js";
import { Chain } from "./chain.js";
import { HttpTransport } from "./transport/http.js";
import { InProcessTransport } from "./transport/in-process.js";
import { UnixSocketTransport } from "./transport/unix-socket.js";
import type { TriggerHandle } from "./triggers/handle.js";
import { createTriggerHandle, createWidgetHandle, type WidgetHandle } from "./triggers/handle.js";
import {
  type ActionJson,
  BttError,
  type CommandParams,
  type HttpTransportOptions,
  type Transport,
  type TriggerJson,
  type UnixSocketTransportOptions,
} from "./types.js";
import { Variables } from "./variables.js";

export interface BttOptions {
  /** Explicit transport instance. Takes precedence over everything else. */
  transport?: Transport;
  /** Webserver settings — used when no transport is given (or as fallback of `auto`). */
  http?: HttpTransportOptions;
  /** Unix socket settings (Node only). */
  socket?: UnixSocketTransportOptions | false;
  /** Shared secret applied to http + socket when not set individually. */
  sharedSecret?: string;
  /** Prefer in-process `callBTT` when the code runs inside BTT (default true). */
  inProcess?: boolean;
  /** Log every call (command + params) to this function. */
  logger?: (message: string) => void;
}

/**
 * Main entry point. Create with a transport (or let it pick one) and call BTT's scripting
 * functions as typed methods. All methods return promises.
 *
 * ```ts
 * const btt = new Btt({ http: { port: 64472, sharedSecret: "…" } });
 * await btt.triggerNamed("My Named Trigger");
 * const app = await btt.getStringVariable("BTTActiveAppBundleIdentifier");
 * ```
 */
export class Btt {
  private transportInstance: Transport | undefined;
  private readonly options: BttOptions;
  /** Typed access to BTT variables: `await btt.vars.get("name")`, `await btt.vars.set("name", 1)` … */
  readonly vars: Variables;

  constructor(options: BttOptions = {}) {
    this.options = options;
    this.transportInstance = options.transport;
    this.vars = new Variables(this);
  }

  /** Convenience: client for the webserver. */
  static http(options: HttpTransportOptions): Btt {
    return new Btt({ transport: new HttpTransport(options) });
  }

  /** Convenience: client for the unix socket (Node only). */
  static socket(options: UnixSocketTransportOptions = {}): Btt {
    return new Btt({ transport: new UnixSocketTransport(options) });
  }

  /** Convenience: client for scripts running inside BTT. */
  static inProcess(): Btt {
    return new Btt({ transport: new InProcessTransport() });
  }

  /**
   * Resolve the transport lazily: explicit → in-process (inside BTT) → unix socket (Node, socket
   * file present) → http (if configured). Throws a helpful error otherwise.
   */
  async transport(): Promise<Transport> {
    if (this.transportInstance) return this.transportInstance;
    const o = this.options;
    if (o.inProcess !== false && InProcessTransport.isAvailable()) {
      this.transportInstance = new InProcessTransport();
      return this.transportInstance;
    }
    if (o.socket !== false) {
      const path = o.socket?.path;
      if (await UnixSocketTransport.isAvailable(path)) {
        this.transportInstance = new UnixSocketTransport({
          sharedSecret: o.sharedSecret,
          ...(o.socket ?? {}),
        });
        return this.transportInstance;
      }
    }
    if (o.http) {
      this.transportInstance = new HttpTransport({ sharedSecret: o.sharedSecret, ...o.http });
      return this.transportInstance;
    }
    throw new BttError(
      "No way to reach BetterTouchTool: not running inside BTT, no unix socket found and no http options given. " +
        "Enable the webserver or socket server in BTT → Settings → Scripting and pass { http: { port } } or { socket: {} }.",
    );
  }

  /** Raw escape hatch: call any BTT scripting command. Returns BTT's raw string reply. */
  async call(command: string, params: CommandParams = {}): Promise<string> {
    const t = await this.transport();
    this.options.logger?.(`btt.call ${command} ${JSON.stringify(params)}`);
    const raw = await t.call(command, params);
    return assertNoInbandError(raw, command);
  }

  /** Like call() but parses JSON replies. */
  async callJson<T = unknown>(command: string, params: CommandParams = {}): Promise<T> {
    return parseJson<T>(await this.call(command, params), command);
  }

  // ------------------------------------------------------------------ triggers & actions

  /** Runs a named trigger (Automations & Named Triggers). Returns the result of script actions. */
  async triggerNamed(name: string, options: TriggerNamedOptions = {}): Promise<string> {
    return this.call("trigger_named", {
      trigger_name: name,
      wait_for_reply: options.waitForReply ?? true,
    });
  }

  /** Runs a named trigger without waiting; `delaySeconds` makes it cancelable via cancelDelayedNamedTrigger(). */
  async triggerNamedAsync(name: string, options: Pick<TriggerNamedOptions, "delaySeconds"> = {}): Promise<void> {
    await this.call("trigger_named_async_without_response", {
      trigger_name: name,
      ...(options.delaySeconds !== undefined ? { delay: options.delaySeconds } : {}),
    });
  }

  async cancelDelayedNamedTrigger(name: string): Promise<void> {
    await this.call("cancel_delayed_named_trigger_execution", { trigger_name: name });
  }

  /** Executes one action (or a sequence) described as JSON. See `actions.*` builders. */
  async triggerAction(action: ActionJson | ActionJson[], options: { waitForReply?: boolean } = {}): Promise<string> {
    const json = Array.isArray(action) ? sequenceToJson(action) : action;
    return this.call("trigger_action", { json, wait_for_reply: options.waitForReply ?? true });
  }

  /** Executes the actions assigned to an existing trigger. */
  async executeAssignedActionsForTrigger(uuid: string): Promise<string> {
    return this.call("execute_assigned_actions_for_trigger", { uuid });
  }

  /** Runs a shortcut from Apple's Shortcuts app. */
  async runShortcut(name: string, input?: string): Promise<string> {
    return this.call("run_shortcut", { name, ...(input !== undefined ? { input } : {}) });
  }

  async getTrigger<T extends TriggerJson = TriggerJson>(uuid: string): Promise<T> {
    return this.callJson<T>("get_trigger", { uuid });
  }

  async getTriggers<T extends TriggerJson = TriggerJson>(filter: GetTriggersFilter = {}): Promise<T[]> {
    const params: CommandParams = {};
    if (filter.triggerType) params.trigger_type = filter.triggerType;
    if (filter.triggerId !== undefined) params.trigger_id = filter.triggerId;
    if (filter.parentUuid) params.trigger_parent_uuid = filter.parentUuid;
    if (filter.uuid) params.trigger_uuid = filter.uuid;
    if (filter.appBundleIdentifier) params.trigger_app_bundle_identifier = filter.appBundleIdentifier;
    if (filter.preset) params.preset = filter.preset;
    if (filter.returnOnlyIfModifiersMatch !== undefined) {
      params.return_only_if_modifiers_match = filter.returnOnlyIfModifiersMatch;
    }
    const raw = await this.call("get_triggers", params);
    if (raw.trim() === "") return [];
    const parsed = parseJson<T | T[]>(raw, "get_triggers");
    return Array.isArray(parsed) ? parsed : [parsed];
  }

  /**
   * Adds a trigger. BTT assigns a fresh UUID on import (any BTTUUID in the JSON is ignored) and
   * returns it; the returned handle uses that UUID. Use `upsertTrigger()` to control the UUID.
   */
  async addNewTrigger(trigger: TriggerJson, options: { parentUuid?: string } = {}): Promise<TriggerHandle> {
    const raw = await this.call("add_new_trigger", {
      json: trigger,
      ...(options.parentUuid ? { parent_uuid: options.parentUuid, trigger_parent_uuid: options.parentUuid } : {}),
    });
    const returned = raw.trim();
    const uuid = UUID_RE.test(returned) ? returned : trigger.BTTUUID;
    if (!uuid) throw new BttError(`add_new_trigger did not return a UUID (got: ${returned.slice(0, 120)})`);
    return createTriggerHandle(this, uuid);
  }

  /** Creates the trigger with exactly this UUID, or updates it if it already exists. */
  async upsertTrigger(uuid: string, trigger: TriggerJson, options: { parentUuid?: string } = {}): Promise<TriggerHandle> {
    await this.updateTrigger(uuid, { ...trigger, BTTUUID: uuid }, options);
    return createTriggerHandle(this, uuid);
  }

  /** Creates or updates a trigger identified by uuid. */
  async updateTrigger(uuid: string, patch: TriggerJson, options: { parentUuid?: string } = {}): Promise<void> {
    await this.call("update_trigger", {
      uuid,
      json: patch,
      ...(options.parentUuid ? { trigger_parent_uuid: options.parentUuid } : {}),
    });
  }

  async deleteTrigger(uuid: string): Promise<void> {
    await this.call("delete_trigger", { uuid });
  }

  /** Deletes all triggers matching the filter (same filter as getTriggers). */
  async deleteTriggers(filter: GetTriggersFilter): Promise<void> {
    const params: CommandParams = {};
    if (filter.triggerType) params.trigger_type = filter.triggerType;
    if (filter.triggerId !== undefined) params.trigger_id = filter.triggerId;
    if (filter.parentUuid) params.trigger_parent_uuid = filter.parentUuid;
    if (filter.uuid) params.trigger_uuid = filter.uuid;
    if (filter.appBundleIdentifier) params.trigger_app_bundle_identifier = filter.appBundleIdentifier;
    if (filter.preset) params.preset = filter.preset;
    if (Object.keys(params).length === 0) throw new BttError("deleteTriggers requires at least one filter");
    await this.call("delete_triggers", params);
  }

  /** Re-runs the scripts of a script widget (Touch Bar / Stream Deck / menubar). */
  async refreshWidget(uuid: string): Promise<void> {
    await this.call("refresh_widget", { uuid });
  }

  /** Shows a trigger in the BTT UI. */
  async revealElementInUI(uuid: string): Promise<void> {
    await this.call("reveal_element_in_ui", { uuid });
  }

  /** Handle object for an existing trigger (invoke / update / delete / fetch). */
  trigger(uuid: string): TriggerHandle {
    return createTriggerHandle(this, uuid);
  }

  /** Handle object for a script widget (update / refresh). */
  widget(uuid: string, kind: "touchbar" | "streamdeck" | "menubar" = "touchbar"): WidgetHandle {
    return createWidgetHandle(this, uuid, kind);
  }

  /** Start a fluent sequence of actions. `.run()` executes them, `.toAction()` yields one JSON. */
  chain(): Chain {
    return new Chain(this);
  }

  // ------------------------------------------------------------------ variables

  async getStringVariable(name: string): Promise<string> {
    return this.call("get_string_variable", { variable_name: name });
  }

  async getNumberVariable(name: string): Promise<number> {
    return parseNumber(await this.call("get_number_variable", { variable_name: name }));
  }

  /** "string", "number" or "" (unknown). */
  async getVariableType(name: string): Promise<string> {
    return (await this.call("get_variable_type", { variable_name: name })).trim();
  }

  async setStringVariable(name: string, value: string): Promise<void> {
    await this.call("set_string_variable", { variable_name: name, to: value });
  }

  async setNumberVariable(name: string, value: number): Promise<void> {
    await this.call("set_number_variable", { variable_name: name, to: value });
  }

  async setPersistentStringVariable(name: string, value: string): Promise<void> {
    await this.call("set_persistent_string_variable", { variable_name: name, to: value });
  }

  async setPersistentNumberVariable(name: string, value: number): Promise<void> {
    await this.call("set_persistent_number_variable", { variable_name: name, to: value });
  }

  // ------------------------------------------------------------------ clipboard & text

  async getClipboardContent(options: ClipboardOptions = {}): Promise<string> {
    return this.call("get_clipboard_content", { ...options });
  }

  /** Currently selected text (or other pasteboard representation) in the frontmost app. */
  async getSelection(options: Omit<ClipboardOptions, "excludeConcealed"> = {}): Promise<string> {
    return this.call("get_selection", options);
  }

  async setClipboardContent(content: string, format?: string): Promise<void> {
    await this.call("set_clipboard_content", { content, ...(format ? { format } : {}) });
  }

  /** Sets several representations at once, e.g. plain + HTML. */
  async setClipboardContents(entries: Array<{ content: string; format: string }>): Promise<void> {
    await this.call("set_clipboard_contents", {
      contents: entries.map((e) => e.content),
      formats: entries.map((e) => e.format),
    });
  }

  async getItemsFromClipboardManager(query: ClipboardManagerQuery = {}): Promise<ClipboardManagerResult> {
    return this.callJson<ClipboardManagerResult>("get_items_from_clipboard_manager", { ...query });
  }

  async pasteClipboardManagerItems(uuids: string[], options: { deleteAfterPaste?: boolean } = {}): Promise<void> {
    await this.call("paste_clipboard_manager_items_with_uuids", {
      uuids: uuids.join(","),
      ...(options.deleteAfterPaste !== undefined ? { deleteAfterPaste: options.deleteAfterPaste } : {}),
    });
  }

  /** Types or pastes text into the frontmost app. */
  async pasteText(text: string, options: PasteTextOptions = {}): Promise<void> {
    await this.call("paste_text", {
      text,
      ...(options.insertByPasting !== undefined ? { insert_by_pasting: options.insertByPasting } : {}),
      ...(options.moveCursorLeftByXAfterPasting !== undefined
        ? { move_cursor_left_by_x_after_pasting: options.moveCursorLeftByXAfterPasting }
        : {}),
      ...(options.format ? { format: options.format } : {}),
    });
  }

  // ------------------------------------------------------------------ widgets

  /** Temporarily updates a Touch Bar script widget. */
  async updateTouchBarWidget(uuid: string, update: WidgetUpdate): Promise<void> {
    await this.call("update_touch_bar_widget", { uuid, json: update });
  }

  /** Temporarily updates a menubar item. */
  async updateMenubarItem(uuid: string, update: WidgetUpdate): Promise<void> {
    await this.call("update_menubar_item", { uuid, json: update });
  }

  /** Temporarily updates a Stream Deck script widget (any BTTStreamDeck* key allowed). */
  async updateStreamDeckWidget(uuid: string, update: WidgetUpdate): Promise<void> {
    await this.call("update_stream_deck_widget", { uuid, json: update });
  }

  async getActiveTouchBarGroup(): Promise<string> {
    return this.call("get_active_touch_bar_group");
  }

  // ------------------------------------------------------------------ floating menus

  /** Updates properties of a floating menu item (`BTTMenuItemText`, colors, …). */
  async updateMenuItem(
    ref: MenuItemRef | string,
    patch: Record<string, unknown>,
    options: { persist?: boolean } = {},
  ): Promise<void> {
    await this.call("update_menu_item", {
      ...menuRefParams(ref),
      json: patch,
      ...(options.persist !== undefined ? { persist: options.persist } : {}),
    });
  }

  async getMenuItemValue(ref: MenuItemRef | string): Promise<unknown> {
    return parseMaybeJson(await this.call("get_menu_item_value", menuRefParams(ref)));
  }

  async setMenuItemValue(ref: MenuItemRef | string, value: unknown): Promise<void> {
    await this.call("set_menu_item_value", { ...menuRefParams(ref), value });
  }

  /** Loads HTML/URL into a WebView menu item, or runs JS inside it. */
  async webviewMenuItemLoad(
    ref: MenuItemRef | string,
    content: { htmlOrUrl?: string; javascript?: string; userAgent?: string },
  ): Promise<string> {
    return this.call("webview_menu_item_load_html_url_js", {
      ...menuRefParams(ref),
      ...(content.htmlOrUrl !== undefined ? { html_or_url: content.htmlOrUrl } : {}),
      ...(content.javascript !== undefined ? { javascript_to_execute: content.javascript } : {}),
      ...(content.userAgent !== undefined ? { useragent: content.userAgent } : {}),
    });
  }

  /** Shows a menu described in BTT's Simple JSON Format. */
  async showSimpleJsonFormatMenu(menu: Record<string, unknown>): Promise<string> {
    return this.call("show_simple_json_format_menu", { json: menu });
  }

  // ------------------------------------------------------------------ presets

  async exportPreset(options: ExportPresetOptions): Promise<string> {
    return this.call("export_preset", {
      name: options.name,
      ...(options.compress !== undefined ? { compress: options.compress ? 1 : 0 } : {}),
      ...(options.includeSettings !== undefined ? { includeSettings: options.includeSettings ? 1 : 0 } : {}),
      ...(options.outputPath ? { outputPath: options.outputPath } : {}),
      ...(options.comment ? { comment: options.comment } : {}),
      ...(options.link ? { link: options.link } : {}),
      ...(options.minimumVersion ? { minimumVersion: options.minimumVersion } : {}),
    });
  }

  async importPreset(path: string): Promise<string> {
    return this.call("import_preset", { path });
  }

  async getPresetDetails(name: string): Promise<PresetDetails[]> {
    const parsed = await this.callJson<PresetDetails | PresetDetails[]>("get_preset_details", { name });
    return Array.isArray(parsed) ? parsed : [parsed];
  }

  // ------------------------------------------------------------------ system / misc

  async displayNotification(options: NotificationOptions): Promise<void> {
    await this.call("display_notification", options);
  }

  /** Details of a menubar menu item of the frontmost app, path like "Edit;Cut". */
  async getMenuItemDetails(menuPath: string): Promise<MenuItemDetails> {
    return this.callJson<MenuItemDetails>("get_menu_item_details", { itemPath: menuPath, "": menuPath });
  }

  async getDockBadge(appBundleIdOrPath: string): Promise<string> {
    return this.call("get_dock_badge_for", { app: appBundleIdOrPath, "": appBundleIdOrPath });
  }

  async isAppRunning(appBundleIdOrName: string): Promise<boolean> {
    return parseBool(await this.call("is_app_running", { app: appBundleIdOrName, "": appBundleIdOrName }));
  }

  async isTrueToneEnabled(): Promise<boolean> {
    return parseBool(await this.call("is_true_tone_enabled"));
  }

  async getLocation(format?: string): Promise<unknown> {
    return parseMaybeJson(await this.call("get_location", format ? { format } : {}));
  }

  async getWeather(options: { location?: string; unit?: "celsius" | "fahrenheit" } = {}): Promise<unknown> {
    return parseMaybeJson(await this.call("get_weather", options));
  }
}

const UUID_RE = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

function menuRefParams(ref: MenuItemRef | string): CommandParams {
  if (typeof ref === "string") return { item_uuid: ref };
  const p: CommandParams = {};
  if (ref.itemUuid) p.item_uuid = ref.itemUuid;
  if (ref.menuName) p.menu_name = ref.menuName;
  if (ref.itemName) p.item_name = ref.itemName;
  return p;
}

/** Turns an array of actions into one action JSON (first + BTTAdditionalActions). */
export function sequenceToJson(actions: ActionJson[]): ActionJson {
  if (actions.length === 0) throw new BttError("Empty action sequence");
  const [first, ...rest] = actions as [ActionJson, ...ActionJson[]];
  if (rest.length === 0) return first;
  return { ...first, BTTAdditionalActions: [...(first.BTTAdditionalActions ?? []), ...rest] };
}

export function generateUuid(): string {
  const c = globalThis.crypto as Crypto | undefined;
  if (c && typeof c.randomUUID === "function") return c.randomUUID().toUpperCase();
  // fallback (non-crypto) – fine for trigger identifiers
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
    .replace(/[xy]/g, (ch) => {
      const r = (Math.random() * 16) | 0;
      return (ch === "x" ? r : (r & 0x3) | 0x8).toString(16);
    })
    .toUpperCase();
}
