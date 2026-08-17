/** Any JSON-compatible value. */
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

/** A BTT action definition (`BTTPredefinedActionType` + configuration keys). */
export interface ActionJson {
  BTTPredefinedActionType: number;
  BTTPredefinedActionName?: string;
  BTTAdditionalActionData?: Record<string, unknown>;
  BTTGenericActionConfig?: string | Record<string, unknown>;
  BTTGenericActionConfig2?: string | Record<string, unknown>;
  /** Extra actions to run after this one (BTT flattens these into the sequence). */
  BTTAdditionalActions?: ActionJson[];
  BTTEnabled?: 0 | 1;
  BTTOrder?: number;
  BTTUUID?: string;
  [key: string]: unknown;
}

/** A BTT trigger definition as accepted by add_new_trigger / update_trigger. */
export interface TriggerJson {
  BTTTriggerType?: number;
  BTTTriggerClass?: string;
  BTTTriggerTypeDescription?: string;
  BTTTriggerName?: string;
  BTTUUID?: string;
  BTTEnabled?: 0 | 1;
  BTTEnabled2?: 0 | 1;
  BTTOrder?: number;
  BTTRequiredModifierKeys?: number;
  BTTNotes?: string;
  BTTTriggerConfig?: Record<string, unknown>;
  BTTTriggerConditionsFormat?: string;
  BTTActionsToExecute?: ActionJson[];
  BTTAdditionalActions?: ActionJson[];
  /** Legacy single-action shorthand */
  BTTPredefinedActionType?: number;
  BTTPredefinedActionName?: string;
  BTTShortcutKeyCode?: number;
  BTTShortcutModifierKeys?: number;
  BTTLayoutIndependentChar?: string;
  BTTTriggerOnDown?: 0 | 1;
  BTTAutoAdaptToKeyboardLayout?: 0 | 1;
  [key: string]: unknown;
}

/** Parameters passed to a BTT scripting command. Values are serialised for the transport. */
export type CommandParams = Record<string, unknown>;

/** Configuration for the built-in webserver transport. */
export interface HttpTransportOptions {
  /** e.g. "http://127.0.0.1:64472" — port is the one shown in BTT's webserver settings. */
  url?: string;
  host?: string;
  port?: number;
  https?: boolean;
  /** Shared secret configured in BTT (sent as `shared_secret` query parameter). */
  sharedSecret?: string;
  /** Request timeout in ms (default 30000). */
  timeoutMs?: number;
  /** Custom fetch (defaults to globalThis.fetch). */
  fetch?: typeof fetch;
}

/** Configuration for the unix socket transport (Node only). */
export interface UnixSocketTransportOptions {
  /** Defaults to /tmp/com.hegenberg.BetterTouchTool.sock */
  path?: string;
  /** Shared secret configured in BTT → Scripting settings. */
  sharedSecret?: string;
  timeoutMs?: number;
}

export interface Transport {
  readonly kind: "http" | "unix-socket" | "in-process" | "custom";
  /** Perform a scripting command; resolves with the raw string BTT returned ("" for void). */
  call(command: string, params?: CommandParams): Promise<string>;
  describe(): string;
}

export class BttError extends Error {
  constructor(
    message: string,
    public readonly command?: string,
    public readonly params?: CommandParams,
    public override readonly cause?: unknown,
  ) {
    super(message);
    this.name = "BttError";
  }
}
