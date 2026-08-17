import type { TriggerDefinition } from "./catalog.generated.js";
import { triggerCategories } from "./definitions.generated.js";

const all: TriggerDefinition[] = triggerCategories.flatMap((c) => c.triggers);
const byId = new Map<number, TriggerDefinition>();
for (const t of all) if (!byId.has(t.id)) byId.set(t.id, t);

export const triggerCatalog = {
  all,
  categories: triggerCategories,
  byId(id: number): TriggerDefinition | undefined {
    return byId.get(id);
  },
  search(query: string): TriggerDefinition[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return all.filter(
      (t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || String(t.id) === q,
    );
  },
};
