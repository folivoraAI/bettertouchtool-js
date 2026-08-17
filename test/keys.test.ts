import { describe, expect, it } from "vitest";
import { ModifierMask, parseShortcut, toBttShortcutString } from "../src/index.js";

describe("parseShortcut", () => {
  it("parses common notations", () => {
    for (const s of ["cmd+shift+s", "⌘⇧S", "command shift s", "Cmd-Shift-S"]) {
      const p = parseShortcut(s);
      expect(p.keyCode).toBe(1);
      expect(p.modifierMask).toBe(ModifierMask.command | ModifierMask.shift);
      expect(p.bttShortcutString).toBe("56,55,1");
    }
  });
  it("handles special keys and fn", () => {
    expect(parseShortcut("fn+left").bttShortcutString).toBe("63,123");
    expect(parseShortcut("ctrl+alt+delete").bttShortcutString).toBe("59,58,51");
    expect(parseShortcut("space").keyCode).toBe(49);
    expect(parseShortcut("f5").keyCode).toBe(96);
    expect(parseShortcut("cmd+keycode:12").keyCode).toBe(12);
  });
  it("passes through raw key code strings", () => {
    expect(toBttShortcutString("55, 1")).toBe("55,1");
  });
  it("throws on unknown keys", () => {
    expect(() => parseShortcut("cmd+bogus")).toThrow(/Unknown key/);
  });
});
