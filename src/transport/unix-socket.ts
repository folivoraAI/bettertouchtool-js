import { BttError, type CommandParams, type Transport, type UnixSocketTransportOptions } from "../types.js";
import { normalizeParams, toQueryString } from "./params.js";

export const DEFAULT_SOCKET_PATH = "/tmp/com.hegenberg.BetterTouchTool.sock";

/**
 * Talks to BetterTouchTool's unix socket server (Settings → Scripting → "Enable Socket Server").
 * Local only, no webserver required. Node.js only.
 *
 * Wire format: one request line `/<command>/?<urlencoded params>\n`, response is the raw result,
 * connection is closed by BTT after the reply.
 */
export class UnixSocketTransport implements Transport {
  readonly kind = "unix-socket" as const;
  readonly path: string;
  private readonly sharedSecret: string | undefined;
  private readonly timeoutMs: number;

  constructor(options: UnixSocketTransportOptions = {}) {
    this.path = options.path ?? DEFAULT_SOCKET_PATH;
    this.sharedSecret = options.sharedSecret;
    this.timeoutMs = options.timeoutMs ?? 30_000;
  }

  /** True when running in Node and the socket file exists. */
  static async isAvailable(path: string = DEFAULT_SOCKET_PATH): Promise<boolean> {
    if (typeof process === "undefined" || !process.versions?.node) return false;
    try {
      const fs = await import("node:fs");
      return fs.existsSync(path);
    } catch {
      return false;
    }
  }

  buildRequestLine(command: string, params?: CommandParams): string {
    const normalized = normalizeParams(params);
    if (this.sharedSecret) normalized.shared_secret = this.sharedSecret;
    return `/${command}/?${toQueryString(normalized)}\n`;
  }

  async call(command: string, params?: CommandParams): Promise<string> {
    const net = await import("node:net");
    const line = this.buildRequestLine(command, params);
    return new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = [];
      const socket = net.createConnection(this.path);
      const timer = setTimeout(() => {
        socket.destroy();
        reject(new BttError(`Timed out after ${this.timeoutMs}ms waiting for BTT socket reply`, command, params));
      }, this.timeoutMs);
      socket.on("connect", () => socket.write(line));
      socket.on("data", (d: Buffer) => chunks.push(d));
      socket.on("end", () => {
        clearTimeout(timer);
        const text = Buffer.concat(chunks).toString("utf8").replace(/\n$/, "");
        if (text.startsWith("ERROR:")) reject(new BttError(text.replace(/^ERROR:\s*/, ""), command, params));
        else resolve(text);
      });
      socket.on("error", (err: Error) => {
        clearTimeout(timer);
        reject(
          new BttError(
            `Could not connect to BTT socket at ${this.path} – is the socket server enabled? (${err.message})`,
            command,
            params,
            err,
          ),
        );
      });
    });
  }

  describe(): string {
    return `unix-socket (${this.path})`;
  }
}
