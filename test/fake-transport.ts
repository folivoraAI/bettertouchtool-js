import type { CommandParams, Transport } from "../src/types.js";

export interface RecordedCall {
  command: string;
  params: CommandParams | undefined;
}

/** In-memory transport for unit tests: records calls, replies from a handler map. */
export class FakeTransport implements Transport {
  readonly kind = "custom" as const;
  readonly calls: RecordedCall[] = [];
  constructor(private readonly replies: Record<string, string | ((p: CommandParams | undefined) => string)> = {}) {}
  async call(command: string, params?: CommandParams): Promise<string> {
    this.calls.push({ command, params });
    const r = this.replies[command];
    if (typeof r === "function") return r(params);
    return r ?? "";
  }
  describe() {
    return "fake";
  }
  last(): RecordedCall {
    const c = this.calls[this.calls.length - 1];
    if (!c) throw new Error("no calls");
    return c;
  }
}
