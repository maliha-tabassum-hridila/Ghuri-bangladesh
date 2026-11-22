import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LocateFixed, Loader2 } from "lucide-react";
import { Page, inputCls, btnPrimary, btnGhost, EstimateBadge } from "@/components/site";
import { DESTINATIONS, getDestination } from "@/data/destinations";
import { MapView } from "@/components/MapView";
import { geocode, fetchRoute, type RouteResult, type GeoResult } from "@/lib/services";
import { formatKm, formatDuration, type LngLat } from "@/lib/geo";
import { MODES, estimateFare, estimateMinutes, TRANSPORT_REVIEWED, type Mode } from "@/lib/transport";
import { formatBDT } from "@/lib/budget";
import { useI18n, type Key } from "@/lib/i18n";

export const Route = createFileRoute("/route-finder")({
  validateSearch: (s: Record<string, unknown>): { to?: string } => ({ to: typeof s.to === "string" ? s.to : undefined }),
  head: () => ({ meta: [
    { title: "Route Finder — GHURI Bangladesh" },
    { name: "description", content: "Live road routes, distances and clearly labelled fare estimates to Bangladesh destinations." },
    { property: "og:title", content: "Route Finder — GHURI" },
    { property: "og:description", content: "Directions and transport estimates across Bangladesh." },
  ] }),
  component: RouteFinder,
});

function RouteFinder() {
  const s = Route.useSearch();
  const { t, lang } = useI18n();
  const [to, setTo] = useState(s.to && getDestination(s.to) ? s.to : "coxs-bazar-beach");
  const [startText, setStartText] = useState("Dhaka");
  const [start, setStart] = useState<GeoResult | null>(null);
  const [options, setOptions] = useState<GeoResult[]>([]);
  const [mode, setMode] = useState<Mode>("car");
  const [people, setPeople] = useState(1);
  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const dest = getDestination(to)!;

  async function run(from: GeoResult, destination: LngLat = dest.coordinates) {
    setStart(from); setOptions([]); setErr(""); setBusy(true); setRoutes([]);
    try { setRoutes(await fetchRoute(from.coords, destination)); }
    catch { setErr(t("roadRoutingError")); }
    finally { setBusy(false); }
  }
  async function search() {
    setErr(""); setBusy(true);
    try { const r = await geocode(startText); if (!r.length) setErr(t("noMatchingPlace")); else if (r.length === 1) await run(r[0]); else setOptions(r); }
    catch { setErr(t("placeSearchUnavailable")); } finally { setBusy(false); }
  }
  function locate() {
    if (!navigator.geolocation) return setErr(t("browserNoLocation"));
    setBusy(true);
    navigator.geolocation.getCurrentPosition((p) => run({ name: "Your location", coords: [p.coords.longitude, p.coords.latitude] }), () => { setBusy(false); setErr(t("locationDenied")); }, { enableHighAccuracy: false, timeout: 10000 });
  }
  const main = routes[0];
  const isRoadMode = mode === "car" || mode === "motorcycle" || mode === "bus";
  const km = isRoadMode ? main?.km ?? null : null;
  const isLive = !!main;
  const minutes = mode === "car" && main ? main.minutes : estimateMinutes(mode, km);
  const fare = estimateFare(mode, km, people);
  const modeKeys: Record<Mode, Key> = { car: "modeCar", motorcycle: "modeMotorcycle", bus: "modeBus", train: "modeTrain", launch: "modeLaunch", walk: "modeWalk" };
  const modeNotes: Record<Mode, Key> = { car: "carNote", motorcycle: "motorcycleNote", bus: "busNote", train: "trainNote", launch: "launchNote", walk: "walkNote" };

  return (
    <Page kicker={t("route")} title={t("routeFinderTitle")} intro={t("routeFinderIntro")}>
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <label className="block text-xs font-semibold">{t("from")}
            <div className="mt-1 flex gap-2"><input value={startText} onChange={(e) => setStartText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()} className={inputCls} maxLength={120} aria-label={t("from")} /><button onClick={search} className={btnPrimary} disabled={busy || startText.trim().length < 2}>{t("go")}</button></div>
          </label>
          <button onClick={locate} className={`${btnGhost} w-full`}><LocateFixed className="h-4 w-4" /> {t("getMyLocation")}</button>
          <p className="text-[11px] text-muted-foreground">{t("locationPrivacy")}</p>
          {options.length > 0 && <ul className="space-y-1">{options.map((o) => <li key={o.name}><button onClick={() => run(o)} className="w-full rounded-lg px-2 py-1.5 text-left text-xs hover:bg-muted">{o.name}</button></li>)}</ul>}
          <label className="block text-xs font-semibold">{t("to")}<select value={to} onChange={(e) => { const destination = getDestination(e.target.value); setTo(e.target.value); if (start && destination) void run(start, destination.coordinates); }} className={`${inputCls} mt-1`}>{DESTINATIONS.map((d) => <option key={d.slug} value={d.slug}>{lang === "bn" ? d.bangla_name : d.name} — {d.district}</option>)}</select></label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold">{t("mode")}<select value={mode} onChange={(e) => setMode(e.target.value as Mode)} className={`${inputCls} mt-1`}>{MODES.map((m) => <option key={m.id} value={m.id}>{t(modeKeys[m.id])}</option>)}</select></label>
            <label className="text-xs font-semibold">{t("people")}<input type="number" min={1} max={40} value={people} onChange={(e) => setPeople(Math.max(1, Math.min(40, Number(e.target.value) || 1)))} className={`${inputCls} mt-1`} /></label>
          </div>
          {busy && <p className="flex items-center gap-2 text-sm"><Loader2 className="h-4 w-4 animate-spin" /> {t("working")}</p>}
          {err && <p className="rounded-lg bg-estimate/10 p-2 text-sm">{err}</p>}
          {start && (
            <div className="space-y-3 rounded-xl bg-muted p-4">
              <p className="text-sm"><strong>{start.name.split(",")[0]}</strong> → <strong>{lang === "bn" ? dest.bangla_name : dest.name}</strong></p>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-muted-foreground">{t("routedDistance")} {isLive && isRoadMode && <EstimateBadge kind="live" />}</p><p className="text-2xl font-semibold">{km === null ? t("notAvailable") : formatKm(km, lang)}</p></div>
                <div><p className="text-xs text-muted-foreground">{t("durationEstimate")} {minutes !== null && <EstimateBadge />}</p><p className="text-2xl font-semibold">{minutes === null ? t("notAvailable") : formatDuration(minutes, lang)}</p></div>
              </div>
              <div><p className="text-xs text-muted-foreground">{t("fareFor", { count: people })} {fare && <EstimateBadge />}</p><p className="text-xl font-semibold">{mode === "walk" ? t("free") : fare ? `${formatBDT(fare.low, lang)} – ${formatBDT(fare.high, lang)}` : t("notAvailable")}</p><p className="text-[11px] text-muted-foreground">{t(modeNotes[mode])} {fare && t("roadFareEstimateNote")} {fare && `(${TRANSPORT_REVIEWED})`}</p></div>
              {routes.length > 1 && isRoadMode && <p className="text-xs">{t("alternativeRoute")}: {formatKm(routes[1].km, lang)}, {formatDuration(routes[1].minutes, lang)} ({t("dashedMap")})</p>}
              {MODES.find((m) => m.id === mode)!.officialUrl && <a href={MODES.find((m) => m.id === mode)!.officialUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-river underline">{t("ticketSource")} →</a>}
              <p className="text-[11px] text-muted-foreground">{dest.transport_information}</p>
            </div>
          )}
        </div>
        <MapView className="h-[420px] sm:h-[640px]" fit user={start?.name === "Your location" ? start.coords : null}
          lines={isRoadMode ? routes.map((r) => r.geometry) : []}
          markers={[...(start ? [{ id: "a", coords: start.coords, label: start.name.split(",")[0], color: "estimate" as const }] : []), { id: "b", coords: dest.coordinates, label: lang === "bn" ? dest.bangla_name : dest.name, href: `/destinations/${dest.slug}` }]} />
      </div>
    </Page>
  );
}
