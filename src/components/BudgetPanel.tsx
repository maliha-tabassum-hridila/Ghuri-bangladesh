import { useEffect, useMemo, useState } from "react";
import { calculateBudget, formatBDT, STYLE_PRESETS, type Style, type UnitPrices } from "@/lib/budget";
import { EstimateBadge, inputCls } from "./site";
import { useI18n, type Key } from "@/lib/i18n";

const PRICE_LABELS: Record<keyof UnitPrices, Key> = {
  roomPerNight: "roomPerNight", foodPerPersonDay: "foodPerPersonDay", localTransportPerPersonDay: "localTransport",
  entryPerPersonPerSite: "siteEntry", activitiesPerPersonDay: "activities", guidePerDay: "guidePerDay", otherPerPersonDay: "other",
};
const LINE_LABELS: Record<string, Key> = {
  transport: "transportation", accommodation: "accommodation", food: "food", entry: "entryTickets",
  local: "localTransport", activities: "activities", guide: "guideCharges", other: "otherExpenses",
};
const STYLE_KEYS: Record<Style, Key> = { budget: "budgetStyle", standard: "standardStyle", premium: "premiumStyle", luxury: "luxuryStyle" };
const STYLES: Style[] = ["budget", "standard", "premium", "luxury"];

export function BudgetPanel({ travellers, setTravellers, days, nights, sites, transportGroupTotal, style, setStyle, onTotal }: {
  travellers: number; setTravellers: (n: number) => void; days: number; nights: number; sites: number; transportGroupTotal: number | null; style: Style; setStyle: (s: Style) => void; onTotal?: (n: number) => void;
}) {
  const { t, lang } = useI18n();
  const [overrides, setOverrides] = useState<Partial<Record<Style, UnitPrices>>>({});
  const prices = overrides[style] ?? STYLE_PRESETS[style];
  const [perRoom, setPerRoom] = useState(2);
  const [guide, setGuide] = useState(false);
  const [cont, setCont] = useState(10);
  const [transport, setTransport] = useState<number | null>(null);
  const r = useMemo(() => calculateBudget({ travellers, days, nights, personsPerRoom: perRoom, sites, transportGroupTotal: transport ?? transportGroupTotal ?? 0, includeGuide: guide, contingencyPct: cont, prices }), [travellers, days, nights, perRoom, sites, transport, transportGroupTotal, guide, cont, prices]);
  useEffect(() => { onTotal?.(r.total); }, [r.total]);
  const f = (n: number) => formatBDT(n, lang);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs font-semibold">{t("travellers")}<input type="number" min={1} max={50} value={travellers} onChange={(e) => setTravellers(Math.max(1, Math.min(50, Number(e.target.value) || 1)))} className={`${inputCls} mt-1`} /></label>
          <label className="text-xs font-semibold">{t("peoplePerRoom")}<select value={perRoom} onChange={(e) => setPerRoom(Number(e.target.value))} className={`${inputCls} mt-1`}>{[1, 2, 3, 4].map((n) => <option key={n}>{n}</option>)}</select></label>
          <label className="text-xs font-semibold">{t("travelStyle")}<select value={style} onChange={(e) => setStyle(e.target.value as Style)} className={`${inputCls} mt-1 capitalize`}>{STYLES.map((s) => <option key={s} value={s}>{t(STYLE_KEYS[s])}</option>)}</select></label>
          <label className="text-xs font-semibold">{t("contingencyPct")}<input type="number" min={0} max={50} value={cont} onChange={(e) => setCont(Math.max(0, Math.min(50, Number(e.target.value) || 0)))} className={`${inputCls} mt-1`} /></label>
          <label className="col-span-2 text-xs font-semibold">{t("intercityTransportGroup")}<input type="number" min={0} value={transport ?? transportGroupTotal ?? ""} onChange={(e) => setTransport(Math.max(0, Number(e.target.value) || 0))} className={`${inputCls} mt-1`} /></label>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={guide} onChange={(e) => setGuide(e.target.checked)} /> {t("includeGuide")}</label>
        <details>
          <summary className="cursor-pointer text-sm font-semibold">{t("editUnitPrices")} <EstimateBadge /></summary>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(Object.keys(PRICE_LABELS) as (keyof UnitPrices)[]).map((k) => (
              <label key={k} className="text-xs">{t(PRICE_LABELS[k])}<input type="number" min={0} value={prices[k]} onChange={(e) => setOverrides((o) => ({ ...o, [style]: { ...prices, [k]: Math.max(0, Number(e.target.value) || 0) } }))} className={`${inputCls} mt-1`} /></label>
            ))}
          </div>
        </details>
        <p className="text-xs text-muted-foreground">{t("budgetAssumptionText", { days, nights, sites, rooms: r.rooms })} {t("roughMarketRanges")}</p>
      </div>
      <div className="min-w-0 rounded-2xl bg-forest p-4 text-forest-foreground sm:p-6">
        <div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-widest opacity-70">{t("costBreakdown")}</p><EstimateBadge /></div>
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[320px] text-sm">
          <thead className="text-left text-xs opacity-60"><tr><th className="py-1">{t("item")}</th><th className="py-1 text-right">{t("group")}</th><th className="py-1 text-right">{t("perPerson")}</th></tr></thead>
          <tbody>
            {r.lines.map((l) => <tr key={l.key} className="border-t border-forest-foreground/10"><td className="py-2">{t(LINE_LABELS[l.key])}</td><td className="py-2 text-right">{l.key === "transport" && transportGroupTotal === null && transport === null ? t("notAvailable") : f(l.group)}</td><td className="py-2 text-right opacity-80">{l.key === "transport" && transportGroupTotal === null && transport === null ? t("notAvailable") : f(l.perPerson)}</td></tr>)}
            <tr className="border-t border-forest-foreground/10"><td className="py-2">{t("emergencyContingency", { pct: cont })}</td><td className="py-2 text-right">{f(r.contingency)}</td><td className="py-2 text-right opacity-80">{f(Math.round(r.contingency / travellers))}</td></tr>
          </tbody>
        </table></div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div><p className="text-xs opacity-70">{t("total")}</p><p className="font-display text-3xl" data-testid="total">{f(r.total)}</p></div>
          <div><p className="text-xs opacity-70">{t("perPerson")}</p><p className="font-display text-3xl" data-testid="per-person">{f(r.perPerson)}</p></div>
          <div><p className="text-xs opacity-70">{t("perDayGroup")}</p><p className="text-xl font-semibold">{f(r.perDay)}</p></div>
          <div><p className="text-xs opacity-70">{t("perPersonPerDay")}</p><p className="text-xl font-semibold">{f(r.perPersonPerDay)}</p></div>
        </div>
      </div>
    </div>
  );
}
