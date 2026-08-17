/**
 * Generates src/actions/catalog.generated.ts and src/triggers/catalog.generated.ts from
 * BetterTouchTool's bundled reference docs (Code/AI/Resources/*.mdx in the BTT repo).
 *
 * Usage: BTT_DOCS_DIR=/path/to/BetterTouchTool/Code/AI/Resources npm run generate
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const docsDir = process.env.BTT_DOCS_DIR ?? resolve(here, "../../BetterTouchTool/Code/AI/Resources");

// ---------------------------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------------------------

interface ParamDoc {
  key: string;
  description: string;
  /** nested keys documented under this parameter (e.g. inside BTTAdditionalActionData) */
  children?: ParamDoc[];
}

interface ActionDoc {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  params: ParamDoc[];
  example: Record<string, unknown> | null;
}

function toSlug(name: string): string {
  return name
    .replace(/[’'`"]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((w, i) =>
      i === 0 ? w.charAt(0).toLowerCase() + w.slice(1) : w.charAt(0).toUpperCase() + w.slice(1),
    )
    .join("")
    .replace(/^(\d)/, "_$1");
}

function toConstName(name: string): string {
  const s = name
    .replace(/[’'`"]/g, "")
    .replace(/&/g, " AND ")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();
  return /^\d/.test(s) ? `_${s}` : s;
}

function parseActions(md: string): ActionDoc[] {
  const lines = md.split("\n");
  const out: ActionDoc[] = [];
  let category = "Uncategorized";
  let i = 0;
  const skipCategories = new Set([
    "Important Notes",
    "Table of Contents",
    "Additional Notes",
    "Action Categories",
  ]);
  while (i < lines.length) {
    const line = lines[i]!;
    if (line.startsWith("## ")) {
      category = line.slice(3).trim();
      i++;
      continue;
    }
    if (line.startsWith("### ") && !skipCategories.has(category)) {
      const name = line.slice(4).trim();
      i++;
      let description = "";
      const params: ParamDoc[] = [];
      let example: Record<string, unknown> | null = null;
      let id: number | null = null;
      // consume until next heading
      while (i < lines.length && !lines[i]!.startsWith("### ") && !lines[i]!.startsWith("## ")) {
        const l = lines[i]!;
        if (l.startsWith("> ") && !description) {
          description = l.slice(2).trim();
          // multi-line quotes
          while (i + 1 < lines.length && lines[i + 1]!.startsWith("> ")) {
            i++;
            description += ` ${lines[i]!.slice(2).trim()}`;
          }
        } else if (/^\* \*\*[A-Za-z0-9_]+\*\*/.test(l)) {
          const m = l.match(/^\* \*\*([A-Za-z0-9_]+)\*\*:?\s*(.*)$/);
          if (m) {
            const p: ParamDoc = { key: m[1]!, description: m[2]!.trim() };
            // nested children: lines starting with two spaces + "- `Key`"
            while (i + 1 < lines.length && /^\s+- `?[A-Za-z0-9_]+`?/.test(lines[i + 1]!)) {
              i++;
              const cm = lines[i]!.match(/^\s+- `?([A-Za-z0-9_]+)`?:?\s*(.*)$/);
              if (cm) {
                p.children ??= [];
                p.children.push({ key: cm[1]!, description: cm[2]!.trim() });
              }
            }
            params.push(p);
            if (p.key === "BTTPredefinedActionType") {
              const idm = p.description.match(/-?\d+/);
              if (idm) id = Number.parseInt(idm[0], 10);
            }
          }
        } else if (l.trim().startsWith("```json") && example === null) {
          const buf: string[] = [];
          i++;
          while (i < lines.length && !lines[i]!.trim().startsWith("```")) {
            buf.push(lines[i]!);
            i++;
          }
          try {
            const parsed = JSON.parse(buf.join("\n").replace(/\/\/[^\n"]*$/gm, ""));
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
              example = parsed;
              if (id === null && typeof parsed.BTTPredefinedActionType === "number") {
                id = parsed.BTTPredefinedActionType;
              }
            }
          } catch {
            // ignore unparsable examples
          }
        }
        i++;
      }
      if (id !== null) {
        out.push({ id, name, slug: toSlug(name), category, description, params, example });
      }
      continue;
    }
    i++;
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// Triggers
// ---------------------------------------------------------------------------------------------

interface TriggerDoc {
  id: number;
  name: string;
  slug: string;
  category: string;
  /** primary BTTTriggerClass for this category */
  triggerClass: string;
  section?: string;
}

interface TriggerCategoryDoc {
  category: string;
  classes: string[];
  triggers: TriggerDoc[];
}

function parseTriggers(md: string): TriggerCategoryDoc[] {
  const lines = md.split("\n");
  const cats: TriggerCategoryDoc[] = [];
  let cur: TriggerCategoryDoc | null = null;
  let section: string | undefined;
  let inCategories = false;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i]!;
    if (l.startsWith("## ")) {
      inCategories = l.startsWith("## Trigger Categories");
      cur = null;
      continue;
    }
    if (!inCategories) continue;
    const h = l.match(/^### \d+\.\s+(.*)$/);
    if (h) {
      cur = { category: h[1]!.trim(), classes: [], triggers: [] };
      cats.push(cur);
      section = undefined;
      continue;
    }
    if (!cur) continue;
    if (l.startsWith("#### ")) {
      section = l.slice(5).trim();
      continue;
    }
    const cls = l.match(/^- `"(BTTTriggerType[A-Za-z0-9]+)"`/);
    if (cls) {
      cur.classes.push(cls[1]!);
      continue;
    }
    const inlineCls = l.match(/\*\*BTTTriggerClass\*\*:\s*`"?(BTTTriggerType[A-Za-z0-9]+)"?`/);
    if (inlineCls) {
      cur.classes.push(inlineCls[1]!);
      continue;
    }
    const t = l.match(/^\s*- `(-?\d+)` - (.+)$/);
    if (t) {
      const name = t[2]!.replace(/\*\*/g, "").trim();
      cur.triggers.push({
        id: Number.parseInt(t[1]!, 10),
        name,
        slug: toSlug(name),
        category: cur.category,
        triggerClass: cur.classes[0] ?? "",
        section,
      });
    }
  }
  return cats;
}

// ---------------------------------------------------------------------------------------------
// Emit
// ---------------------------------------------------------------------------------------------

function emitActions(actions: ActionDoc[]): { types: string; defs: string } {
  // dedupe by id (first wins), keep stable ordering by document order
  const seen = new Map<number, ActionDoc>();
  for (const a of actions) if (!seen.has(a.id)) seen.set(a.id, a);
  const list = [...seen.values()];
  // ensure unique const names
  const usedConst = new Map<string, number>();
  const constNames = new Map<number, string>();
  for (const a of list) {
    let c = toConstName(a.name);
    const n = usedConst.get(c) ?? 0;
    usedConst.set(c, n + 1);
    if (n > 0) c = `${c}_${a.id}`;
    constNames.set(a.id, c);
  }
  const lines: string[] = [];
  lines.push("// GENERATED FILE — do not edit. Run `npm run generate`.");
  lines.push(`// Source: BetterTouchTool action-definitions.mdx (${list.length} actions)`);
  lines.push("");
  lines.push("export interface ActionParamDoc {");
  lines.push("  key: string;");
  lines.push("  description: string;");
  lines.push("  children?: ActionParamDoc[];");
  lines.push("}");
  lines.push("");
  lines.push("export interface ActionDefinition {");
  lines.push("  /** BTTPredefinedActionType */");
  lines.push("  id: number;");
  lines.push("  name: string;");
  lines.push("  /** camelCase identifier */");
  lines.push("  slug: string;");
  lines.push("  category: string;");
  lines.push("  description: string;");
  lines.push("  params: ActionParamDoc[];");
  lines.push("  example: Record<string, unknown> | null;");
  lines.push("}");
  lines.push("");
  lines.push("/** All known BTTPredefinedActionType values by name. */");
  lines.push("export const ActionType = {");
  for (const a of list) {
    lines.push(`  /** ${a.name} — ${a.description.replace(/\*\//g, "* /")} */`);
    lines.push(`  ${constNames.get(a.id)}: ${a.id},`);
  }
  lines.push("} as const;");
  lines.push("");
  lines.push("export type ActionTypeName = keyof typeof ActionType;");
  lines.push("export type ActionTypeId = (typeof ActionType)[ActionTypeName];");
  lines.push("");
  const defs: string[] = [];
  defs.push("// GENERATED FILE — do not edit. Run `npm run generate`.");
  defs.push(`// Source: BetterTouchTool action-definitions.mdx (${list.length} actions)`);
  defs.push('import type { ActionDefinition } from "./catalog.generated.js";');
  defs.push("");
  defs.push("export const actionDefinitions: readonly ActionDefinition[] = ");
  defs.push(JSON.stringify(list));
  defs.push(";");
  defs.push("");
  return { types: lines.join("\n"), defs: defs.join("\n") };
}

function emitTriggers(cats: TriggerCategoryDoc[]): { types: string; defs: string } {
  const lines: string[] = [];
  const total = cats.reduce((n, c) => n + c.triggers.length, 0);
  lines.push("// GENERATED FILE — do not edit. Run `npm run generate`.");
  lines.push(
    `// Source: BetterTouchTool trigger-definitions.mdx (${cats.length} categories, ${total} trigger types)`,
  );
  lines.push("");
  lines.push("export interface TriggerDefinition {");
  lines.push("  /** BTTTriggerType */");
  lines.push("  id: number;");
  lines.push("  name: string;");
  lines.push("  slug: string;");
  lines.push("  category: string;");
  lines.push("  /** default BTTTriggerClass for this trigger */");
  lines.push("  triggerClass: string;");
  lines.push("  section?: string;");
  lines.push("}");
  lines.push("");
  lines.push("export interface TriggerCategoryDefinition {");
  lines.push("  category: string;");
  lines.push("  classes: string[];");
  lines.push("  triggers: TriggerDefinition[];");
  lines.push("}");
  lines.push("");
  lines.push("/** All BTTTriggerClass values. */");
  lines.push("export const TriggerClass = {");
  const classes = new Set<string>();
  for (const c of cats) for (const k of c.classes) classes.add(k);
  for (const k of classes) lines.push(`  ${k.replace(/^BTTTriggerType/, "")}: "${k}",`);
  lines.push("} as const;");
  lines.push("export type TriggerClassName = (typeof TriggerClass)[keyof typeof TriggerClass];");
  lines.push("");
  const defs: string[] = [];
  defs.push("// GENERATED FILE — do not edit. Run `npm run generate`.");
  defs.push('import type { TriggerCategoryDefinition } from "./catalog.generated.js";');
  defs.push("");
  defs.push("export const triggerCategories: readonly TriggerCategoryDefinition[] = ");
  defs.push(JSON.stringify(cats));
  defs.push(";");
  defs.push("");
  return { types: lines.join("\n"), defs: defs.join("\n") };
}

const actionsMd = readFileSync(join(docsDir, "action-definitions.mdx"), "utf8");
const triggersMd = readFileSync(join(docsDir, "trigger-definitions.mdx"), "utf8");
const actions = parseActions(actionsMd);
const triggers = parseTriggers(triggersMd);
const emitted = emitActions(actions);
writeFileSync(resolve(here, "../src/actions/catalog.generated.ts"), emitted.types);
writeFileSync(resolve(here, "../src/actions/definitions.generated.ts"), emitted.defs);
const emittedT = emitTriggers(triggers);
writeFileSync(resolve(here, "../src/triggers/catalog.generated.ts"), emittedT.types);
writeFileSync(resolve(here, "../src/triggers/definitions.generated.ts"), emittedT.defs);
console.log(
  `actions: ${new Set(actions.map((a) => a.id)).size} unique ids · triggers: ${triggers.reduce((n, c) => n + c.triggers.length, 0)} in ${triggers.length} categories`,
);
