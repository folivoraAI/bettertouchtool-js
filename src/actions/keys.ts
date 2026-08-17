/**
 * Keyboard helpers: parse human-readable shortcuts ("cmd+shift+s", "⌘⇧S", "ctrl-alt-delete")
 * into macOS virtual key codes and NSEvent modifier masks.
 *
 * Send-shortcut *actions* accept human strings directly (BTT normalises them on import), so you
 * mostly need this for keyboard shortcut *triggers* (`BTTShortcutKeyCode` + `BTTShortcutModifierKeys`).
 */

/** NSEvent modifier flag masks used in BTTShortcutModifierKeys / BTTRequiredModifierKeys. */
export const ModifierMask = {
  capsLock: 1 << 16, // 65536
  shift: 1 << 17, // 131072
  control: 1 << 18, // 262144
  option: 1 << 19, // 524288
  command: 1 << 20, // 1048576
  fn: 1 << 23, // 8388608
} as const;

/** Key codes used *inside* BTTShortcutToSend for modifier keys (send-shortcut actions). */
export const ModifierKeyCode = {
  fn: 63,
  rightControl: 62,
  rightOption: 61,
  rightShift: 60,
  control: 59,
  option: 58,
  shift: 56,
  command: 55,
  rightCommand: 54,
} as const;

/** macOS virtual key codes (ANSI/US layout for letters, digits and punctuation). */
export const KeyCode: Record<string, number> = {
  a: 0, s: 1, d: 2, f: 3, h: 4, g: 5, z: 6, x: 7, c: 8, v: 9,
  b: 11, q: 12, w: 13, e: 14, r: 15, y: 16, t: 17,
  "1": 18, "2": 19, "3": 20, "4": 21, "6": 22, "5": 23, "=": 24, "9": 25, "7": 26, "-": 27, "8": 28, "0": 29,
  "]": 30, o: 31, u: 32, "[": 33, i: 34, p: 35, return: 36, l: 37, j: 38, "'": 39, k: 40, ";": 41,
  "\\": 42, ",": 43, "/": 44, n: 45, m: 46, ".": 47, tab: 48, space: 49, "`": 50, delete: 51, escape: 53,
  command: 55, shift: 56, capslock: 57, option: 58, control: 59, rightcommand: 54, rightshift: 60,
  rightoption: 61, rightcontrol: 62, fn: 63,
  f17: 64, keypaddecimal: 65, keypadmultiply: 67, keypadplus: 69, keypadclear: 71, volumeup: 72,
  volumedown: 73, mute: 74, keypaddivide: 75, keypadenter: 76, keypadminus: 78, f18: 79, f19: 80,
  keypadequals: 81, keypad0: 82, keypad1: 83, keypad2: 84, keypad3: 85, keypad4: 86, keypad5: 87,
  keypad6: 88, keypad7: 89, f20: 90, keypad8: 91, keypad9: 92,
  f5: 96, f6: 97, f7: 98, f3: 99, f8: 100, f9: 101, f11: 103, f13: 105, f16: 106, f14: 107, f10: 109,
  f12: 111, f15: 113, help: 114, home: 115, pageup: 116, forwarddelete: 117, f4: 118, end: 119, f2: 120,
  pagedown: 121, f1: 122, left: 123, right: 124, down: 125, up: 126,
};

const KEY_ALIASES: Record<string, string> = {
  esc: "escape", enter: "return", spacebar: "space", backspace: "delete", del: "delete",
  deleteforward: "forwarddelete", pgup: "pageup", pgdn: "pagedown", leftarrow: "left", arrowleft: "left",
  rightarrow: "right", arrowright: "right", uparrow: "up", arrowup: "up", downarrow: "down", arrowdown: "down",
  plus: "=", minus: "-", dash: "-", hyphen: "-", period: ".", dot: ".", comma: ",", slash: "/",
  forwardslash: "/", backslash: "\\", semicolon: ";", quote: "'", apostrophe: "'", grave: "`", backtick: "`",
  equals: "=", equal: "=", leftbracket: "[", openbracket: "[", rightbracket: "]", closebracket: "]",
  caps: "capslock", capslock: "capslock",
};

const MODIFIER_ALIASES: Record<string, keyof typeof ModifierMask> = {
  cmd: "command", command: "command", "⌘": "command", meta: "command", super: "command", win: "command",
  shift: "shift", "⇧": "shift",
  ctrl: "control", control: "control", "⌃": "control", "^": "control",
  opt: "option", option: "option", alt: "option", "⌥": "option",
  fn: "fn", function: "fn", "🌐": "fn",
};

export interface ParsedShortcut {
  /** Virtual key code of the non-modifier key. */
  keyCode: number;
  /** Canonical key name (e.g. "s", "space", "f5"). */
  key: string;
  /** NSEvent modifier mask (BTTShortcutModifierKeys). */
  modifierMask: number;
  modifiers: Array<keyof typeof ModifierMask>;
  /** BTT key-code string usable in BTTShortcutToSend, e.g. "55,1" for cmd+s. */
  bttShortcutString: string;
}

/**
 * Parses shortcuts like "cmd+shift+s", "⌘⇧S", "ctrl alt delete", "command-option-f5", "fn+left".
 * Throws on unknown keys. Single-symbol modifiers may be concatenated ("⌘⇧S").
 */
export function parseShortcut(input: string): ParsedShortcut {
  let s = input.trim();
  if (!s) throw new Error("Empty shortcut");
  // split concatenated symbol modifiers: "⌘⇧S" → "⌘ ⇧ S"
  s = s.replace(/[⌘⇧⌥⌃🌐]/gu, (m) => ` ${m} `);
  const rawTokens = s.split(/[\s+,;|·•]+|(?<=.)-(?=.)/u).filter(Boolean);
  const modifiers: Array<keyof typeof ModifierMask> = [];
  const keyTokens: string[] = [];
  for (const tok of rawTokens) {
    const low = tok.toLowerCase();
    const mod = MODIFIER_ALIASES[low];
    if (mod && !(rawTokens.length === 1)) {
      if (!modifiers.includes(mod)) modifiers.push(mod);
    } else keyTokens.push(tok);
  }
  if (keyTokens.length === 0) throw new Error(`Shortcut "${input}" has no key`);
  let key = keyTokens.join("").toLowerCase().replace(/[\s_]/g, "");
  key = KEY_ALIASES[key] ?? key;
  let keyCode: number | undefined;
  const explicit = key.match(/^(?:keycode|vk):(\d+)$/);
  if (explicit) keyCode = Number.parseInt(explicit[1]!, 10);
  else keyCode = KeyCode[key];
  if (keyCode === undefined) throw new Error(`Unknown key "${keyTokens.join(" ")}" in shortcut "${input}"`);
  const modifierMask = modifiers.reduce((m, k) => m | ModifierMask[k], 0);
  const modCodes: number[] = [];
  // BTT sorts modifier codes highest → lowest, then the key code
  if (modifiers.includes("fn")) modCodes.push(ModifierKeyCode.fn);
  if (modifiers.includes("control")) modCodes.push(ModifierKeyCode.control);
  if (modifiers.includes("option")) modCodes.push(ModifierKeyCode.option);
  if (modifiers.includes("shift")) modCodes.push(ModifierKeyCode.shift);
  if (modifiers.includes("command")) modCodes.push(ModifierKeyCode.command);
  modCodes.sort((a, b) => b - a);
  return {
    keyCode,
    key,
    modifierMask,
    modifiers,
    bttShortcutString: [...modCodes, keyCode].join(","),
  };
}

/** Human string → BTT key-code string ("cmd+s" → "55,1"). Passes through strings that already are key codes. */
export function toBttShortcutString(shortcut: string): string {
  if (/^\s*-?\d+(\s*,\s*-?\d+)*\s*$/.test(shortcut)) return shortcut.replace(/\s/g, "");
  return parseShortcut(shortcut).bttShortcutString;
}
