import { describe, it, expect } from "vitest";
import { calculateBudget, STYLE_PRESETS } from "./budget";

const base = { days: 3, nights: 2, personsPerRoom: 2, sites: 4, transportGroupTotal: 10000, includeGuide: false, contingencyPct: 10, prices: STYLE_PRESETS.standard };

describe("trip budget", () => {
  it("per-person equals group total divided by travellers", () => {
    const r = calculateBudget({ ...base, travellers: 5 });
    expect(r.perPerson).toBe(Math.round(r.total / 5));
  });
  it("rooms round up for odd group sizes (5 people, 2 per room = 3 rooms)", () => {
    expect(calculateBudget({ ...base, travellers: 5 }).rooms).toBe(3);
  });
  it("shared transport cost per person drops as group grows", () => {
    const a = calculateBudget({ ...base, travellers: 2 }).lines.find((l) => l.key === "transport")!;
    const b = calculateBudget({ ...base, travellers: 5 }).lines.find((l) => l.key === "transport")!;
    expect(a.perPerson).toBe(5000);
    expect(b.perPerson).toBe(2000);
  });
  it("contingency is the given percent of subtotal", () => {
    const r = calculateBudget({ ...base, travellers: 4 });
    expect(r.contingency).toBe(Math.round(r.subtotal * 0.1));
    expect(r.total).toBe(r.subtotal + r.contingency);
  });
});
