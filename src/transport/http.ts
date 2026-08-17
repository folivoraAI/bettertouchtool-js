import { BttError, type CommandParams, type HttpTransportOptions, type Transport } from "../types.js";
import { normalizeParams, toQueryString } from "./params.js";

/**
 * Talks to BetterTouchTool's built-in webserver (Settings → Scripting → Webserver).
 * Works in Node ≥18, browsers, BTT WebViews and Floating HTML menus.
 */
export class HttpTransport implements Transport {
  readonly kind = "http" as const;
  readonly baseUrl: string;
  private readonly sharedSecret: string | undefined;
  private readonly timeoutMs: number;
  private readonly fetchImpl: typeof fetch;

  constructor(options: HttpTransportOptions = {}) {
    const url =
      options.url ??
      `${options.https ? "https" : "http"}://${options.host ?? "127.0.0.1"}${options.port ? `:${options.port}` : ""}`;
    this.baseUrl = url.replace(/\/+$/, "");
    this.sharedSecret = options.sharedSecret;
    this.timeoutMs = options.timeoutMs ?? 30_000;
    const f = options.fetch ?? globalThis.fetch;
    if (!f) throw new BttError("No fetch implementation available; pass options.fetch");
    this.fetchImpl = f;
  }

  buildUrl(command: string, params?: CommandParams): string {
    const normalized = normalizeParams(params);
    if (this.sharedSecret) normalized.shared_secret = this.sharedSecret;
    const qs = toQueryString(normalized);
    return `${this.baseUrl}/${command}/${qs ? `?${qs}` : ""}`;
  }

  async call(command: string, params?: CommandParams): Promise<string> {
    const url = this.buildUrl(command, params);
    const controller = typeof AbortController !== "undefined" ? new AbortController() : undefined;
    const timer = controller ? setTimeout(() => controller.abort(), this.timeoutMs) : undefined;
    try {
      const res = await this.fetchImpl(url, { method: "GET", signal: controller?.signal });
      const text = await res.text();
      if (res.status === 403) {
        throw new BttError("BTT webserver rejected the request (403) – wrong or missing shared secret?", command, params);
      }
      if (!res.ok) throw new BttError(`BTT webserver returned HTTP ${res.status}: ${text}`, command, params);
      return text;
    } catch (err) {
      if (err instanceof BttError) throw err;
      throw new BttError(
        `Could not reach BTT webserver at ${this.baseUrl} – is the webserver enabled in BTT? (${(err as Error).message})`,
        command,
        params,
        err,
      );
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  describe(): string {
    return `http (${this.baseUrl})`;
  }
}
