import type { CommandParams } from "../types.js";

/**
 * Serialise command params the way BTT's script handler expects them:
 * strings/numbers/booleans verbatim, objects & arrays JSON-encoded (BTT parses JSON strings
 * for `json`, `contents`, `formats` etc.), undefined/null dropped.
 */
export function normalizeParams(params: CommandParams | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!params) return out;
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (typeof value === "string") out[key] = value;
    else if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
      out[key] = String(value);
    } else out[key] = JSON.stringify(value);
  }
  return out;
}

export function toQueryString(params: Record<string, string>): string {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) usp.append(k, v);
  return usp.toString();
}
