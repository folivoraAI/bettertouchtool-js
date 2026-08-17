import * as A from "./actions/builders.js";
import { actionCatalog } from "./actions/catalog.js";
/**
 * `btt` command line: talk to BetterTouchTool from the shell.
 *
 *   btt trigger-named "My Trigger"
 *   btt get-var BTTActiveAppBundleIdentifier
 *   btt set-var counter 5 --persistent
 *   btt call trigger_action json='{"BTTPredefinedActionType":254,...}'
 *   btt hud "Hello" --detail "world" --duration 2
 *   btt actions search hud   |  btt actions show 254
 *   btt triggers list --type BTTTriggerTypeKeyboardShortcut
 *
 * Connection: --socket [path] | --url http://127.0.0.1:PORT | --port PORT | --secret S
 * or env BTT_URL / BTT_PORT / BTT_SECRET / BTT_SOCKET. Default: auto (socket if present, else http).
 */
import { Btt } from "./client.js";
import { HttpTransport } from "./transport/http.js";
import { UnixSocketTransport } from "./transport/unix-socket.js";
import { triggerCatalog } from "./triggers/catalog.js";
import type { Transport } from "./types.js";

interface Parsed {
  positional: string[];
  flags: Record<string, string | boolean>;
}

function parseArgv(argv: string[]): Parsed {
  const positional: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a.startsWith("--")) {
      const [k, v] = a.slice(2).split("=", 2) as [string, string | undefined];
      if (v !== undefined) flags[k] = v;
      else if (i + 1 < argv.length && !argv[i + 1]!.startsWith("--")) flags[k] = argv[++i]!;
      else flags[k] = true;
    } else positional.push(a);
  }
  return { positional, flags };
}

async function makeClient(flags: Record<string, string | boolean>): Promise<Btt> {
  const env = process.env;
  const secret = (flags.secret as string) ?? env.BTT_SECRET;
  let transport: Transport | undefined;
  if (flags.socket !== undefined || env.BTT_SOCKET) {
    transport = new UnixSocketTransport({
      path: typeof flags.socket === "string" ? flags.socket : env.BTT_SOCKET,
      sharedSecret: secret,
    });
  } else if (flags.url || env.BTT_URL) {
    transport = new HttpTransport({ url: (flags.url as string) ?? env.BTT_URL, sharedSecret: secret });
  } else if (flags.port || env.BTT_PORT) {
    transport = new HttpTransport({ port: Number(flags.port ?? env.BTT_PORT), sharedSecret: secret });
  }
  return new Btt({
    transport,
    sharedSecret: secret,
    socket: {},
    logger: flags.verbose ? console.error : undefined,
  });
}

function kv(args: string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const a of args) {
    const i = a.indexOf("=");
    if (i < 0) {
      out[""] = a;
      continue;
    }
    const k = a.slice(0, i);
    const v = a.slice(i + 1);
    if ((v.startsWith("{") || v.startsWith("[")) && k) {
      try {
        out[k] = JSON.parse(v);
        continue;
      } catch {
        /* keep string */
      }
    }
    out[k] = v;
  }
  return out;
}

const HELP = `btt — BetterTouchTool CLI (bettertouchtool npm package)

Commands:
  trigger-named <name> [--no-wait]        run a named trigger
  invoke <uuid>                           execute the actions of a trigger
  get-var <name>                          print a variable
  set-var <name> <value> [--persistent]   set a variable (number if numeric)
  hud <title> [--detail t] [--duration s] show a HUD
  notify <title> [--message m] [--subtitle s]
  paste <text> [--type]                   paste (or type) text into the frontmost app
  shortcut <cmd+shift+s> [--app bundleId] send a keyboard shortcut
  open <url>                              open a URL
  launch <app>                            launch an app (path or bundle id)
  clipboard [--format f]                  print clipboard content
  selection                               print the current selection
  triggers list [--type cls] [--id n] [--parent uuid] [--app bundleId] [--json]
  triggers get <uuid>                     print a trigger's JSON
  triggers delete <uuid>
  actions search <text> | actions show <id|name> | actions list [--category c]
  trigger-types search <text>
  call <command> [key=value ...]          raw scripting call (json values are parsed)
  action-json '<json>'                    run a raw action JSON

Connection flags: --socket [path] | --url http://host:port | --port n | --secret s | --verbose
Env: BTT_SOCKET, BTT_URL, BTT_PORT, BTT_SECRET`;

async function main(): Promise<void> {
  const { positional, flags } = parseArgv(process.argv.slice(2));
  const [cmd, ...rest] = positional;
  if (!cmd || cmd === "help" || flags.help) {
    console.log(HELP);
    return;
  }
  const out = (v: unknown) => {
    if (v === undefined || v === null || v === "") return;
    console.log(typeof v === "string" ? v : JSON.stringify(v, null, 2));
  };

  // offline commands first
  if (cmd === "actions") {
    const [sub, ...q] = rest;
    if (sub === "search")
      return out(
        actionCatalog
          .search(q.join(" "))
          .map((a) => `${a.id}\t${a.name}\t(${a.category})`)
          .join("\n"),
      );
    if (sub === "show") {
      const key = q.join(" ");
      const a = /^-?\d+$/.test(key) ? actionCatalog.byId(Number(key)) : actionCatalog.byName(key);
      if (!a) throw new Error(`No action "${key}"`);
      return out(a);
    }
    if (sub === "list") {
      const cat = flags.category as string | undefined;
      return out(
        actionCatalog.all
          .filter((a) => !cat || a.category.toLowerCase().includes(cat.toLowerCase()))
          .map((a) => `${a.id}\t${a.name}\t(${a.category})`)
          .join("\n"),
      );
    }
    throw new Error("usage: actions search|show|list");
  }
  if (cmd === "trigger-types") {
    return out(
      triggerCatalog
        .search(rest.slice(1).join(" "))
        .map((t) => `${t.id}\t${t.name}\t(${t.category})`)
        .join("\n"),
    );
  }

  const btt = await makeClient(flags);
  switch (cmd) {
    case "trigger-named":
      return out(await btt.triggerNamed(need(rest[0], "name"), { waitForReply: !flags["no-wait"] }));
    case "invoke":
      return out(await btt.executeAssignedActionsForTrigger(need(rest[0], "uuid")));
    case "get-var":
      return out(await btt.vars.get(need(rest[0], "name")));
    case "set-var": {
      const raw = need(rest[1], "value");
      const value = /^-?\d+(\.\d+)?$/.test(raw) && !flags.string ? Number(raw) : raw;
      await btt.vars.set(need(rest[0], "name"), value, { persistent: !!flags.persistent });
      return;
    }
    case "hud":
      return out(
        await btt.triggerAction(
          A.showHUD(need(rest[0], "title"), {
            detail: flags.detail as string | undefined,
            duration: flags.duration ? Number(flags.duration) : undefined,
          }),
        ),
      );
    case "notify":
      return out(
        await btt.triggerAction(
          A.showNotification({
            title: need(rest[0], "title"),
            message: flags.message as string | undefined,
            subtitle: flags.subtitle as string | undefined,
          }),
        ),
      );
    case "paste":
      return out(await btt.pasteText(rest.join(" "), { insertByPasting: !flags.type }));
    case "shortcut":
      return out(
        await btt.triggerAction(
          flags.app
            ? A.sendShortcutToApp(need(rest[0], "shortcut"), flags.app as string)
            : A.sendShortcut(need(rest[0], "shortcut")),
        ),
      );
    case "open":
      return out(await btt.triggerAction(A.openURL(need(rest[0], "url"))));
    case "launch":
      return out(await btt.triggerAction(A.launchApp(need(rest[0], "app"))));
    case "clipboard":
      return out(await btt.getClipboardContent({ format: flags.format as string | undefined }));
    case "selection":
      return out(await btt.getSelection({ format: flags.format as string | undefined }));
    case "triggers": {
      const [sub, arg] = rest;
      if (sub === "list") {
        const list = await btt.getTriggers({
          triggerType: flags.type as string | undefined,
          triggerId: flags.id ? Number(flags.id) : undefined,
          parentUuid: flags.parent as string | undefined,
          appBundleIdentifier: flags.app as string | undefined,
        });
        if (flags.json) return out(list);
        return out(
          list
            .map(
              (t) =>
                `${t.BTTUUID ?? "?"}\t${t.BTTTriggerClass ?? ""}/${t.BTTTriggerType ?? ""}\t${
                  t.BTTTriggerName ?? t.BTTTriggerTypeDescription ?? t.BTTNotes ?? ""
                }`,
            )
            .join("\n"),
        );
      }
      if (sub === "get") return out(await btt.getTrigger(need(arg, "uuid")));
      if (sub === "delete") return out(await btt.deleteTrigger(need(arg, "uuid")));
      throw new Error("usage: triggers list|get|delete");
    }
    case "call":
      return out(await btt.call(need(rest[0], "command"), kv(rest.slice(1))));
    case "action-json":
      return out(await btt.triggerAction(JSON.parse(need(rest[0], "json"))));
    default:
      throw new Error(`Unknown command "${cmd}". Run "btt help".`);
  }
}

function need(v: string | undefined, what: string): string {
  if (v === undefined) throw new Error(`Missing ${what}`);
  return v;
}

main().catch((err: Error) => {
  console.error(`btt: ${err.message}`);
  process.exit(1);
});
