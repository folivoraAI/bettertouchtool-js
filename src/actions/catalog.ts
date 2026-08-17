import type { ActionDefinition } from "./catalog.generated.js";
import { actionDefinitions } from "./definitions.generated.js";

const byId = new Map<number, ActionDefinition>();
const bySlug = new Map<string, ActionDefinition>();
for (const a of actionDefinitions) {
  if (!byId.has(a.id)) byId.set(a.id, a);
  if (!bySlug.has(a.slug)) bySlug.set(a.slug, a);
}

/** Lookup helpers over the generated action catalog. */
export const actionCatalog = {
  all: actionDefinitions,
  byId(id: number): ActionDefinition | undefined {
    return byId.get(id);
  },
  bySlug(slug: string): ActionDefinition | undefined {
    return bySlug.get(slug);
  },
  byName(name: string): ActionDefinition | undefined {
    const n = name.trim().toLowerCase();
    return actionDefinitions.find((a) => a.name.toLowerCase() === n);
  },
  /** Case-insensitive substring search over name, description and category. */
  search(query: string): ActionDefinition[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return actionDefinitions.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        String(a.id) === q,
    );
  },
  categories(): string[] {
    return [...new Set(actionDefinitions.map((a) => a.category))];
  },
};
