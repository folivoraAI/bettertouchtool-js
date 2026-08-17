import { BttError } from "../types.js";

/** Parse a BTT reply that should be JSON; throws a helpful error on garbage. */
export function parseJson<T = unknown>(raw: string, command?: string): T {
  const text = raw.trim();
  if (text === "") throw new BttError(`BTT returned an empty reply for ${command ?? "command"}`, command);
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new BttError(`BTT reply for ${command ?? "command"} is not JSON: ${text.slice(0, 200)}`, command);
  }
}

/** Parse a BTT reply that may be JSON or a plain string; returns the string when not JSON. */
export function parseMaybeJson(raw: string): unknown {
  const text = raw.trim();
  if (text === "") return "";
  const first = text[0];
  if (first === "{" || first === "[" || first === '"') {
    try {
      return JSON.parse(text);
    } catch {
      return raw;
    }
  }
  return raw;
}

export function parseNumber(raw: string): number {
  const n = Number.parseFloat(raw.trim());
  return Number.isNaN(n) ? 0 : n;
}

export function parseBool(raw: string): boolean {
  const t = raw.trim().toLowerCase();
  return t === "1" || t === "true" || t === "yes";
}

/** Throws when BTT signals a failure in-band (its handlers reply with plain strings). */
export function assertNoInbandError(raw: string, command: string): string {
  const t = raw.trim();
  if (/^error\b/i.test(t) || t.startsWith("command not found") || t.startsWith("UNKOWN ERROR")) {
    throw new BttError(`BTT: ${t}`, command);
  }
  return raw;
}
