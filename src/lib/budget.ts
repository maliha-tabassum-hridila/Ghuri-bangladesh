/** Trip cost engine — pure functions, no UI. All values in BDT. */
export type Style = "budget" | "standard" | "premium" | "luxury";

/** Editable default unit prices (estimates). */
export interface UnitPrices {
  roomPerNight: number; // per room
  foodPerPersonDay: number;
  localTransportPerPersonDay: number;
  entryPerPersonPerSite: number;
  activitiesPerPersonDay: number;
  guidePerDay: number; // per group
  otherPerPersonDay: number;
}

export const STYLE_PRESETS: Record<Style, UnitPrices> = {
  budget:   { roomPerNight: 1500, foodPerPersonDay: 600,  localTransportPerPersonDay: 250, entryPerPersonPerSite: 50,  activitiesPerPersonDay: 150, guidePerDay: 0,    otherPerPersonDay: 100 },
  standard: { roomPerNight: 3500, foodPerPersonDay: 1000, localTransportPerPersonDay: 400, entryPerPersonPerSite: 50,  activitiesPerPersonDay: 300, guidePerDay: 1500, otherPerPersonDay: 200 },
  premium:  { roomPerNight: 7500, foodPerPersonDay: 1800, localTransportPerPersonDay: 700, entryPerPersonPerSite: 100, activitiesPerPersonDay: 600, guidePerDay: 2500, otherPerPersonDay: 400 },
  luxury:   { roomPerNight: 15000, foodPerPersonDay: 3000, localTransportPerPersonDay: 1200, entryPerPersonPerSite: 100, activitiesPerPersonDay: 1200, guidePerDay: 4000, otherPerPersonDay: 800 },
};

export interface BudgetInput {
  travellers: number;
  days: number;
  nights: number;
  personsPerRoom: number;
  sites: number;
  transportGroupTotal: number; // intercity transport for whole group
  includeGuide: boolean;
  contingencyPct: number; // e.g. 10
  prices: UnitPrices;
}

export interface BudgetLine { key: string; label: string; group: number; perPerson: number }
export interface BudgetResult {
  lines: BudgetLine[];
  subtotal: number;
  contingency: number;
  total: number;
  perPerson: number;
  perDay: number;
  perPersonPerDay: number;
  rooms: number;
}

const r = (n: number) => Math.round(n);

export function calculateBudget(i: BudgetInput): BudgetResult {
  const t = Math.max(1, Math.floor(i.travellers));
  const days = Math.max(1, Math.floor(i.days));
  const nights = Math.max(0, Math.floor(i.nights));
  const rooms = Math.ceil(t / Math.max(1, i.personsPerRoom));
  const p = i.prices;
  const groupLines: [string, string, number][] = [
    ["transport", "Transportation", i.transportGroupTotal],
    ["accommodation", "Accommodation", rooms * nights * p.roomPerNight],
    ["food", "Food", t * days * p.foodPerPersonDay],
    ["entry", "Entry tickets", t * i.sites * p.entryPerPersonPerSite],
    ["local", "Local transport", t * days * p.localTransportPerPersonDay],
    ["activities", "Activities", t * days * p.activitiesPerPersonDay],
    ["guide", "Guide charges", i.includeGuide ? days * p.guidePerDay : 0],
    ["other", "Other expenses", t * days * p.otherPerPersonDay],
  ];
  const lines = groupLines.map(([key, label, group]) => ({ key, label, group: r(group), perPerson: r(group / t) }));
  const subtotal = lines.reduce((s, l) => s + l.group, 0);
  const contingency = r((subtotal * Math.max(0, i.contingencyPct)) / 100);
  const total = subtotal + contingency;
  return { lines, subtotal, contingency, total, perPerson: r(total / t), perDay: r(total / days), perPersonPerDay: r(total / t / days), rooms };
}

export const formatBDT = (n: number, locale: "en" | "bn" = "en") =>
  "৳" + new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-IN", { maximumFractionDigits: 0 }).format(n);
