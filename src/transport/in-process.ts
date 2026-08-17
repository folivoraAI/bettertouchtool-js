import { BttError, type CommandParams, type Transport } from "../types.js";

type CallBTT = (command: string, params: unknown) => Promise<unknown>;

/**
 * Uses the `callBTT(command, params)` function that BetterTouchTool injects when a script runs
 * *inside* BTT (Run Real JavaScript action, WebView / Floating HTML menu, Touch Bar/Stream Deck
 * script widgets). Lets one code base work both in Node and inside BTT.
 */
export class InProcessTransport implements Transport {
  readonly kind = "in-process" as const;
  private readonly callBTT: CallBTT;

  constructor(callBTT?: CallBTT) {
    const fn = callBTT ?? InProcessTransport.detect();
    if (!fn) throw new BttError("Not running inside BetterTouchTool (no callBTT() function found)");
    this.callBTT = fn;
  }

  /** Returns BTT's global callBTT if present. */
  static detect(): CallBTT | undefined {
    const g = globalThis as Record<string, unknown>;
    if (typeof g.callBTT === "function") return g.callBTT as CallBTT;
    const btt = g.BTT as
      | { callHandler?: (c: string, p: unknown, cb: (r: unknown) => void) => void }
      | undefined;
    if (btt && typeof btt.callHandler === "function") {
      return (command, params) => new Promise((resolve) => btt.callHandler?.(command, params, resolve));
    }
    return undefined;
  }

  static isAvailable(): boolean {
    return InProcessTransport.detect() !== undefined;
  }

  async call(command: string, params?: CommandParams): Promise<string> {
    // BTT's in-process handler takes JS objects directly (no query encoding needed);
    // nested objects for `json` are accepted as objects or strings.
    const result = await this.callBTT(command, params ?? {});
    if (result === undefined || result === null) return "";
    if (typeof result === "string") return result;
    if (typeof result === "object") return JSON.stringify(result);
    return String(result);
  }

  describe(): string {
    return "in-process (callBTT)";
  }
}
