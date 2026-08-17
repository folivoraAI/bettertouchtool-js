import type { Btt } from "./client.js";

/** Small ergonomic wrapper around BTT's variable functions. */
export class Variables {
  constructor(private readonly btt: Btt) {}

  /** Returns a string variable, or a number when the variable is numeric. */
  async get(name: string): Promise<string | number> {
    const type = await this.btt.getVariableType(name);
    if (type === "number") return this.btt.getNumberVariable(name);
    return this.btt.getStringVariable(name);
  }

  getString(name: string): Promise<string> {
    return this.btt.getStringVariable(name);
  }

  getNumber(name: string): Promise<number> {
    return this.btt.getNumberVariable(name);
  }

  /** Sets a (non-persistent) variable; type is inferred from the value. */
  set(name: string, value: string | number, options: { persistent?: boolean } = {}): Promise<void> {
    if (typeof value === "number") {
      return options.persistent
        ? this.btt.setPersistentNumberVariable(name, value)
        : this.btt.setNumberVariable(name, value);
    }
    return options.persistent
      ? this.btt.setPersistentStringVariable(name, value)
      : this.btt.setStringVariable(name, value);
  }

  setPersistent(name: string, value: string | number): Promise<void> {
    return this.set(name, value, { persistent: true });
  }

  /**
   * Polls a variable and calls `onChange` when its value changes. Returns a stop function.
   * (Until BTT streams events over its WebSocket, polling is the only option from outside.)
   */
  watch(name: string, onChange: (value: string | number) => void, intervalMs = 1000): () => void {
    let last: string | number | undefined;
    let stopped = false;
    const tick = async () => {
      if (stopped) return;
      try {
        const v = await this.get(name);
        if (v !== last) {
          last = v;
          onChange(v);
        }
      } catch {
        // ignore transient errors while polling
      }
      if (!stopped) timer = setTimeout(tick, intervalMs);
    };
    let timer: ReturnType<typeof setTimeout> = setTimeout(tick, 0);
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }
}
