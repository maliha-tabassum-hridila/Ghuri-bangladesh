import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUp, ArrowDown, X, Plus, Printer, Save, AlertTriangle, Trash2 } from "lucide-react";
import { Page, inputCls, btnPrimary, btnGhost, EstimateBadge } from "@/components/site";
import { DESTINATIONS, getDestination } from "@/data/destinations";
import { DIVISIONS } from "@/data/divisions";
import { MapView } from "@/components/MapView";
import { BudgetPanel } from "@/components/BudgetPanel";
import { buildItinerary, type ItinDay } from "@/lib/itinerary";
import { MODES, estimateFare, type Mode } from "@/lib/transport";
import type { Style } from "@/lib/budget";
import { useTrips } from "@/lib/saved";
import { fetchRoute, type RouteResult } from "@/lib/services";
import { formatKm } from "@/lib/geo";
import { translateDuration, useI18n, type Key } from "@/lib/i18n";

export const Route = createFileRoute("/planner")({
  validateSearch: (s: Record<string, unknown>): { d?: string; days?: number } => ({ d: typeof s.d === "string" ? s.d : undefined, days: Number(s.days) > 0 ? Number(s.days) : undefined }),
  head: () => ({ meta: [
    { title: "Smart Trip Planner — GHURI Bangladesh" },
    { name: "description", content: "Build a realistic day-by-day Bangladesh itinerary with distances, travel times and a full group cost breakdown." },
    { property: "og:title", content: "Smart Trip Planner — GHURI" },
    { property: "og:description", content: "Day-by-day itineraries and per-person trip budgets." },
  ] }),
  component: Planner,
});

function Planner() {
  const s = Route.useSearch();
  const { t, lang } = useI18n();
  const [startId, setStartId] = useState("dhaka");
  const [slugs, setSlugs] = useState<string[]>(() => (s.d ? s.d.split(",").filter((x) => getDestination(x)) : []));
  const [days, setDays] = useState(s.days ?? 3);
  const [date, setDate] = useState("");
  const [travellers, setTravellers] = useState(2);
  const [children, setChildren] = useState(0);
  const [mode, setMode] = useState<Mode>("bus");
  const [style, setStyle] = useState<Style>("standard");
  const [budgetCap, setBudgetCap] = useState(0);
  const [q, setQ] = useState("");
  const [plan, setPlan] = useState<ItinDay[] | null>(null);
  const [meta, setMeta] = useState<{ warnings: string[]; totalKm: number | null; nights: number } | null>(null);
  const [roadLegs, setRoadLegs] = useState<(RouteResult | null)[]>([]);
  const [generating, setGenerating] = useState(false);
  const [total, setTotal] = useState(0);
  const [, setTrips] = useTrips();
  const [savedMsg, setSavedMsg] = useState("");

  const start = DIVISIONS.find((d) => d.id === startId)!;
  const stops = useMemo(() => slugs.map((x) => getDestination(x)!), [slugs]);
  const results = q.length > 1 ? DESTINATIONS.filter((d) => !slugs.includes(d.slug) && (d.name + d.bangla_name + d.district + d.division).toLowerCase().includes(q.toLowerCase())).slice(0, 6) : [];
  const move = (i: number, dir: -1 | 1) => setSlugs((p) => { const n = [...p]; const j = i + dir; if (j < 0 || j >= n.length) return p; [n[i], n[j]] = [n[j], n[i]]; return n; });
  const generate = async () => {
    setGenerating(true);
    const roadMode = mode === "car" || mode === "motorcycle" || mode === "bus";
    const locations = [start.center, ...stops.map((d) => d.coordinates), start.center];
    const legs: (RouteResult | null)[] = [];
    if (roadMode) {
      for (let i = 0; i < locations.length - 1; i++) {
        try {
          const routes = await fetchRoute(locations[i], locations[i + 1], false);
          legs.push(routes[0] ?? null);
        } catch {
          legs.push(null);
        }
      }
    } else {
      legs.push(...Array.from({ length: locations.length - 1 }, () => null));
    }
    const result = buildItinerary({ name: start.name, coords: start.center }, stops, days, mode, legs);
    setRoadLegs(legs);
    setPlan(result.days);
    setMeta(result);
    setGenerating(false);
  };
  const transportFare = meta ? estimateFare(mode, meta.totalKm, travellers + children) : null;
  const transportTotal = transportFare ? Math.round((transportFare.low + transportFare.high) / 2) : null;
  const seasonWarn = useMemo(() => {
    if (!date) return [];
    const m = new Date(date).getMonth();
    const season = m === 11 || m <= 1 ? "winter" : m <= 3 ? "spring" : m === 4 ? "summer" : m <= 8 ? "monsoon" : "autumn";
    return stops.filter((d) => !d.best_season.includes(season as never)).map((d) => `${t("offSeasonWarning", { name: lang === "bn" ? d.bangla_name : d.name, season: t(season as Key) })}${d.seasonal_warning ? ` ${lang === "bn" ? d.seasonal_warning_bn : d.seasonal_warning}` : ""}`);
  }, [date, stops, lang, t]);

  const editItem = (di: number, ii: number, text: string) => setPlan((p) => p && p.map((d, i) => i !== di ? d : { ...d, items: d.items.map((it, j) => j === ii ? { ...it, text } : it) }));
  const removeItem = (di: number, ii: number) => setPlan((p) => p && p.map((d, i) => i !== di ? d : { ...d, items: d.items.filter((_, j) => j !== ii) }));
  const addItem = (di: number) => setPlan((p) => p && p.map((d, i) => i !== di ? d : { ...d, items: [...d.items, { time: "", text: t("newActivity") }] }));

  return (
    <Page kicker={t("plannerKicker")} title={t("plannerTitle")} intro={t("plannerIntro")}>
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-xl font-semibold">{t("travelPreferences")}</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold">{t("startingCity")}<select value={startId} onChange={(e) => setStartId(e.target.value)} className={`${inputCls} mt-1`}>{DIVISIONS.map((d) => <option key={d.id} value={d.id}>{lang === "bn" ? d.bn : d.name}</option>)}</select></label>
            <label className="text-xs font-semibold">{t("startDate")}<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`${inputCls} mt-1`} /></label>
            <label className="text-xs font-semibold">{t("days")}<input type="number" min={1} max={21} value={days} onChange={(e) => setDays(Math.max(1, Math.min(21, Number(e.target.value) || 1)))} className={`${inputCls} mt-1`} /></label>
            <label className="text-xs font-semibold">{t("adults")}<input type="number" min={1} max={40} value={travellers} onChange={(e) => setTravellers(Math.max(1, Math.min(40, Number(e.target.value) || 1)))} className={`${inputCls} mt-1`} /></label>
            <label className="text-xs font-semibold">{t("children")}<input type="number" min={0} max={20} value={children} onChange={(e) => setChildren(Math.max(0, Math.min(20, Number(e.target.value) || 0)))} className={`${inputCls} mt-1`} /></label>
            <label className="text-xs font-semibold">{t("transport")}<select value={mode} onChange={(e) => setMode(e.target.value as Mode)} className={`${inputCls} mt-1`}>{MODES.filter((m) => m.id !== "walk").map((m) => <option key={m.id} value={m.id}>{t(modeKeys[m.id])}</option>)}</select></label>
            <label className="text-xs font-semibold">{t("travelStyle")}<select value={style} onChange={(e) => setStyle(e.target.value as Style)} className={`${inputCls} mt-1 capitalize`}>{(["budget", "standard", "premium", "luxury"] as const).map((x) => <option key={x} value={x}>{t(styleKeys[x])}</option>)}</select></label>
            <label className="text-xs font-semibold">{t("totalBudgetOptional")}<input type="number" min={0} value={budgetCap || ""} onChange={(e) => setBudgetCap(Math.max(0, Number(e.target.value) || 0))} className={`${inputCls} mt-1`} /></label>
          </div>
          <h2 className="pt-2 text-xl font-semibold">{t("plannerDestinations")}</h2>
          <div className="relative">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("searchToAdd")} className={inputCls} aria-label={t("searchToAdd")} />
            {results.length > 0 && <ul className="absolute inset-x-0 top-full z-10 mt-1 rounded-xl border border-border bg-card shadow-soft">{results.map((d) => <li key={d.slug}><button onClick={() => { setSlugs((p) => [...p, d.slug]); setQ(""); }} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-muted"><Plus className="h-4 w-4" />{lang === "bn" ? d.bangla_name : d.name} <span className="text-xs text-muted-foreground">{d.district}</span></button></li>)}</ul>}
          </div>
          <ol className="space-y-2">
            {stops.map((d, i) => (
              <li key={d.slug} className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-sm">
                <span className="font-semibold text-river">{i + 1}</span><span className="flex-1">{lang === "bn" ? d.bangla_name : d.name} <span className="text-xs text-muted-foreground">· {translateDuration(lang, d.recommended_duration)}</span></span>
                <button aria-label={t("moveUp")} onClick={() => move(i, -1)}><ArrowUp className="h-4 w-4" /></button>
                <button aria-label={t("moveDown")} onClick={() => move(i, 1)}><ArrowDown className="h-4 w-4" /></button>
                <button aria-label={t("remove")} onClick={() => setSlugs((p) => p.filter((x) => x !== d.slug))}><X className="h-4 w-4" /></button>
              </li>
            ))}
            {stops.length === 0 && <p className="text-sm text-muted-foreground">{t("addAtLeastOne")}</p>}
          </ol>
          <button onClick={() => void generate()} disabled={!stops.length || generating} className={btnPrimary}>{generating ? t("working") : t("generate")}</button>
        </section>
        <MapView className="h-[360px] sm:h-[560px]" fit lines={roadLegs.flatMap((leg) => leg ? [leg.geometry] : [])}
          markers={[{ id: "start", coords: start.center, label: `${t("from")}: ${lang === "bn" ? start.bn : start.name}`, color: "estimate" }, ...stops.map((d, i) => ({ id: d.slug, coords: d.coordinates, label: `${i + 1}. ${lang === "bn" ? d.bangla_name : d.name}` }))]} />
      </div>
      {seasonWarn.length > 0 && <div className="mt-6 space-y-1 rounded-2xl border border-estimate/40 bg-estimate/10 p-4 text-sm">{seasonWarn.map((w) => <p key={w} className="flex gap-2"><AlertTriangle className="h-4 w-4 shrink-0" />{w}</p>)}</div>}

      {plan && meta && (
        <section className="mt-12 print:mt-0" id="itinerary">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><h2 className="text-3xl font-semibold">{t("yourItinerary")}</h2><p className="text-sm text-muted-foreground">{t("tripDays", { count: plan.length })} · {t("tripNights", { count: meta.nights })} · {meta.totalKm === null ? t("roadDistanceUnavailable") : `${formatKm(meta.totalKm, lang)} ${t("totalKm")}`} {meta.totalKm !== null && <EstimateBadge kind="live" />}</p><p className="mt-1 text-xs text-muted-foreground">{t("itineraryTransportDisclaimer")}</p></div>
            <div className="flex gap-2 print:hidden">
              <button onClick={() => window.print()} className={btnGhost}><Printer className="h-4 w-4" /> {t("printPdf")}</button>
              <button onClick={() => { setTrips((p) => [...p, { id: crypto.randomUUID(), name: `${start.name} → ${stops.map((d) => lang === "bn" ? d.bangla_name : d.name).join(" → ")}`, createdAt: new Date().toISOString(), slugs, days: plan.length, travellers: travellers + children, total }]); setSavedMsg(t("tripSaved")); }} className={btnPrimary}><Save className="h-4 w-4" /> {t("saveTrip")}</button>
            </div>
          </div>
          {savedMsg && <p className="mt-2 text-sm text-verified">{savedMsg}</p>}
          {meta.warnings.map((w) => <p key={w} className="mt-3 flex gap-2 rounded-xl bg-destructive/5 p-3 text-sm"><AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />{w}</p>)}
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plan.map((d, di) => (
              <div key={di} className="rounded-2xl border border-border bg-card p-5">
                <p className="font-display text-2xl">{d.title}</p>
                <ul className="mt-3 space-y-2">
                  {d.items.map((it, ii) => (
                    <li key={ii} className="flex gap-2 text-sm">
                      <span className="w-12 shrink-0 font-mono text-xs text-muted-foreground pt-1">{it.time}</span>
                      <input value={it.text} onChange={(e) => editItem(di, ii, e.target.value)} className="flex-1 rounded-md bg-transparent px-1 py-0.5 hover:bg-muted focus:bg-muted focus:outline-none" aria-label={t("editActivity")} />
                      <button onClick={() => removeItem(di, ii)} aria-label={t("removeActivity")} className="print:hidden"><Trash2 className="h-3.5 w-3.5 text-muted-foreground" /></button>
                    </li>
                  ))}
                </ul>
                <button onClick={() => addItem(di)} className="mt-3 text-xs font-semibold text-primary print:hidden">+ {t("addActivity")}</button>
              </div>
            ))}
          </div>
          <h2 className="mt-12 text-3xl font-semibold">{t("tripCost")}</h2>
          {budgetCap > 0 && <p className={`mt-2 text-sm font-semibold ${total > budgetCap ? "text-destructive" : "text-verified"}`}>{total > budgetCap ? `${t("overBudget")} ৳${(total - budgetCap).toLocaleString(lang === "bn" ? "bn-BD" : "en-IN")}` : t("withinBudget")}</p>}
          <div className="mt-4"><BudgetPanel key={`${plan.length}-${transportTotal}`} travellers={travellers + children} setTravellers={(n) => setTravellers(Math.max(1, n - children))} days={plan.length} nights={meta.nights} sites={stops.length} transportGroupTotal={transportTotal} style={style} setStyle={setStyle} onTotal={setTotal} /></div>
          <p className="mt-2 text-xs text-muted-foreground">{transportTotal === null ? t("transportUnavailableBudgetNote") : t("transportCostNote")}</p>
        </section>
      )}
    </Page>
  );
}

const modeKeys: Record<Mode, Key> = { car: "modeCar", motorcycle: "modeMotorcycle", bus: "modeBus", train: "modeTrain", launch: "modeLaunch", walk: "modeWalk" };
const styleKeys: Record<Style, Key> = { budget: "budgetStyle", standard: "standardStyle", premium: "premiumStyle", luxury: "luxuryStyle" };
