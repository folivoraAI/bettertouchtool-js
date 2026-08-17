import * as A from "./actions/builders.js";
import type { Btt } from "./client.js";
import type { ActionJson } from "./types.js";

/**
 * Fluent action sequence. Two execution modes:
 * - `run()` sends the whole sequence to BTT as ONE combined action (one round trip, BTT executes
 *   them in order and honours delays).
 * - `runEach()` executes step by step from JS (each step awaits the previous, results collected).
 * - `toAction()` / `toActions()` return the JSON for use in triggers.
 */
export class Chain {
  private readonly steps: ActionJson[] = [];

  constructor(private readonly btt: Btt) {}

  add(action: ActionJson): this {
    this.steps.push(action);
    return this;
  }

  toActions(): ActionJson[] {
    return [...this.steps];
  }

  toAction(): ActionJson {
    return A.sequence(...this.steps);
  }

  async run(): Promise<string> {
    if (this.steps.length === 0) return "";
    return this.btt.triggerAction(this.toAction());
  }

  async runEach(): Promise<string[]> {
    const results: string[] = [];
    for (const step of this.steps) results.push(await this.btt.triggerAction(step));
    return results;
  }

  // sugar for the most common builders
  showHUD(titleOrOptions: string | A.HudOptions, options?: A.HudOptions): this {
    return this.add(A.showHUD(titleOrOptions, options));
  }
  showNotification(o: A.NotificationActionOptions): this {
    return this.add(A.showNotification(o));
  }
  sendShortcut(shortcut: string, o?: A.SendShortcutOptions): this {
    return this.add(A.sendShortcut(shortcut, o));
  }
  sendShortcutToApp(shortcut: string, app: string, o?: { switchToAppFirst?: boolean }): this {
    return this.add(A.sendShortcutToApp(shortcut, app, o));
  }
  typeText(text: string): this {
    return this.add(A.typeText(text));
  }
  pasteText(text: string): this {
    return this.add(A.pasteText(text));
  }
  launchApp(pathOrBundleId: string): this {
    return this.add(A.launchApp(pathOrBundleId));
  }
  showHideApp(bundleIdOrPath: string): this {
    return this.add(A.showHideApp(bundleIdOrPath));
  }
  quitApp(bundleIdOrPath: string, o?: { force?: boolean }): this {
    return this.add(A.quitApp(bundleIdOrPath, o));
  }
  openURL(url: string): this {
    return this.add(A.openURL(url));
  }
  runAppleScript(script: string, o?: A.ScriptOptions): this {
    return this.add(A.runAppleScript(script, o));
  }
  runShellScript(script: string, o?: { shell?: string }): this {
    return this.add(A.runShellScript(script, o));
  }
  runJavaScript(script: string): this {
    return this.add(A.runJavaScript(script));
  }
  runAppleShortcut(name: string, input?: string): this {
    return this.add(A.runAppleShortcut(name, input));
  }
  triggerNamed(name: string, variables?: Record<string, string>): this {
    return this.add(A.triggerNamed(name, variables));
  }
  delay(seconds: number): this {
    return this.add(A.delay(seconds));
  }
  setVariable(name: string, value: string | number, o?: { persistent?: boolean }): this {
    return this.add(A.setVariable(name, value, o));
  }
  moveMouse(x: number, y: number, o?: A.MoveMouseOptions): this {
    return this.add(A.moveMouse(x, y, o));
  }
  leftClick(): this {
    return this.add(A.leftClick());
  }
  rightClick(): this {
    return this.add(A.rightClick());
  }
  showFloatingMenu(menu: string, o?: A.FloatingMenuActionOptions): this {
    return this.add(A.showFloatingMenu(menu, o));
  }
  hideFloatingMenu(menu: string, o?: A.FloatingMenuActionOptions): this {
    return this.add(A.hideFloatingMenu(menu, o));
  }
  toggleFloatingMenu(menu: string, o?: A.FloatingMenuActionOptions): this {
    return this.add(A.toggleFloatingMenu(menu, o));
  }
  hapticFeedback(pattern?: number): this {
    return this.add(A.hapticFeedback(pattern));
  }
  action(type: number, extra?: Record<string, unknown>): this {
    return this.add(A.action(type, extra));
  }
}
