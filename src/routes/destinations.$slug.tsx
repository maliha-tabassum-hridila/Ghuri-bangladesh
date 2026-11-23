import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, ExternalLink, AlertTriangle, CalendarDays, Clock, Ticket, MapPin } from "lucide-react";
import {
  SiteHeader,
  SiteFooter,
  EstimateBadge,
  DestinationPhotoCredit,
  DestinationCard,
  btnPrimary,
  btnGhost,
} from "@/components/site";
import { DESTINATIONS, getDestination, SEASON_INFO, SEASON_INFO_BN } from "@/data/destinations";
import { getDestinationPhoto } from "@/data/destination-photos";
import { getDivision } from "@/data/divisions";
import { translateDuration, useI18n } from "@/lib/i18n";
import { useFavourites } from "@/lib/saved";
import { MapView } from "@/components/MapView";
import { NearbyPanel } from "@/components/NearbyPanel";
import { haversineKm, formatKm, formatDuration } from "@/lib/geo";
import { MODES, estimateFare, estimateMinutes, TRANSPORT_REVIEWED } from "@/lib/transport";
import { formatBDT } from "@/lib/budget";
import { fetchRoute, type RouteResult } from "@/lib/services";

export const Route = createFileRoute("/destinations/$slug")({
  loader: ({ params }) => { const d = getDestination(params.slug); if (!d) throw notFound(); return d; },
  head: ({ loaderData: d }) => ({ meta: d ? [
    { title: `${d.name}, ${d.district} — GHURI Bangladesh` },
    { name: "description", content: d.description },
    { property: "og:title", content: `${d.name} — GHURI Bangladesh` },
    { property: "og:description", content: d.description },
  ] : [{ title: "Destination not found — GHURI" }, { name: "robots", content: "noindex" }] }),
  component: Detail,
});

const DHAKA: [number, number] = [90.4125, 23.8103];

function Detail() {
  const d = Route.useLoaderData();
  const photo = getDestinationPhoto(d);
  const { t, lang } = useI18n();
  const { has, toggle } = useFavourites();
  const div = getDivision(d.division)!;
  const [roadRoute, setRoadRoute] = useState<RouteResult | null>(null);
  const [roadLoading, setRoadLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setRoadLoading(true);
    fetchRoute(DHAKA, d.coordinates, false)
      .then((routes) => { if (active) setRoadRoute(routes[0] ?? null); })
      .catch(() => { if (active) setRoadRoute(null); })
      .finally(() => { if (active) setRoadLoading(false); });
    return () => { active = false; };
  }, [d.coordinates[0], d.coordinates[1]]);
  const nearby = DESTINATIONS.filter((x) => x.slug !== d.slug).map((x) => ({ x, km: haversineKm(d.coordinates, x.coordinates) })).sort((a, b) => a.km - b.km).slice(0, 4);
  const roadKm = roadRoute?.km ?? null;
  const transportRows = MODES.filter((m) => m.id !== "walk").map((m) => {
    const roadMode = m.id === "car" || m.id === "motorcycle" || m.id === "bus";
    const fare = roadMode ? estimateFare(m.id, roadKm, 1) : null;
    const minutes = roadMode ? m.id === "car" ? roadRoute?.minutes ?? null : estimateMinutes(m.id, roadKm) : null;
    const modeLabel: Record<string, string> = { car: t("modeCar"), motorcycle: t("modeMotorcycle"), bus: t("modeBus"), train: t("modeTrain"), launch: t("modeLaunch") };
    const modeNote: Record<string, string> = { car: t("carNote"), motorcycle: t("motorcycleNote"), bus: t("busNote"), train: t("trainNote"), launch: t("launchNote") };
    return {
      id: m.id,
      mode: modeLabel[m.id],
      note: modeNote[m.id],
      distance: roadMode && roadKm !== null ? formatKm(roadKm, lang) : t("notAvailable"),
      time: minutes === null ? t("notAvailable") : `~${formatDuration(minutes, lang)}`,
      fare: fare ? `${formatBDT(fare.low, lang)} – ${formatBDT(fare.high, lang)} (${t("estimate")})` : t("notAvailable"),
    };
  });
  const Info = ({ icon: I, label, value }: { icon: typeof Clock; label: string; value: string | null }) => (
    <div className="min-w-0 rounded-2xl border border-border bg-card p-4"><I className="h-5 w-5 text-river" /><p className="mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      {value ? <p className="mt-1 break-words font-semibold">{value}</p> : <p className="mt-1 text-sm text-muted-foreground">{t("notVerified")}</p>}</div>
  );
  return (
    <div className="[overflow-wrap:anywhere]">
      <SiteHeader />
      <section className="relative h-[60svh] min-h-[380px] max-h-[720px] overflow-hidden text-forest-foreground sm:min-h-[420px]">
        <img
          src={photo.src}
          alt={photo.status === "available" ? `${d.name} destination photograph` : ""}
          className="absolute inset-0 h-full w-full object-cover"
          width={1024}
          height={768}
        />
        <div className="absolute inset-0 scrim" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 md:px-8">
          <p className="text-sm opacity-85"><Link to="/divisions/$id" params={{ id: div.id }} className="underline">{lang === "bn" ? div.bn : div.name} {t("division")}</Link> · {d.district} · <span className="capitalize">{t(({ nature: "natureCategory", beach: "beachCategory", hill: "hillCategory", historical: "historicalCategory", religious: "religiousCategory", wildlife: "wildlifeCategory", water: "waterCategory", urban: "urbanCategory" } as const)[d.category])}</span></p>
          <h1 className="mt-2 break-words text-4xl font-semibold [overflow-wrap:anywhere] sm:text-5xl md:text-7xl">{lang === "bn" ? d.bangla_name : d.name}</h1>
          <p className="mt-1 text-xl opacity-85">{lang === "bn" ? d.name : d.bangla_name}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => toggle(d.slug)} className="inline-flex items-center gap-2 rounded-full bg-sand px-5 py-2.5 text-sm font-semibold text-forest"><Heart className={`h-4 w-4 ${has(d.slug) ? "fill-current" : ""}`} />{has(d.slug) ? t("savedBtn") : t("save")}</button>
            <Link to="/route-finder" search={{ to: d.slug }} className="rounded-full border border-forest-foreground/60 px-5 py-2.5 text-sm font-semibold">{t("directions")}</Link>
            <Link to="/planner" search={{ d: d.slug }} className="rounded-full border border-forest-foreground/60 px-5 py-2.5 text-sm font-semibold">{t("addToTrip")}</Link>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 pt-2 text-[11px] text-muted-foreground md:px-8">
        <DestinationPhotoCredit photo={photo} />
      </div>

      <main className="mx-auto grid max-w-7xl gap-12 px-4 py-10 md:px-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-12">
          <section>
            <h2 className="text-3xl font-semibold">{t("overview")}</h2>
            <p className="mt-4 text-lg leading-relaxed">{d.description}</p>
            {d.history && <><h3 className="mt-6 text-xl font-semibold">{t("history")}</h3><p className="mt-2 text-muted-foreground">{d.history}</p></>}
            <p className="mt-6"><span className="font-semibold">{t("famousFor")}</span> {d.famous_for}</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div><h3 className="font-semibold">{t("mainAttractions")}</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">{d.attractions.map((a) => <li key={a}>{a}</li>)}</ul></div>
              <div><h3 className="font-semibold">{t("thingsToDo")}</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">{d.activities.map((a) => <li key={a}>{a}</li>)}</ul></div>
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Info icon={CalendarDays} label={t("bestTime")} value={d.best_season.map((s) => `${t(s)} (${lang === "bn" ? SEASON_INFO_BN[s].months : SEASON_INFO[s].months})`).join(", ")} />
            <Info icon={Clock} label={t("duration")} value={translateDuration(lang, d.recommended_duration)} />
            <Info icon={Ticket} label={t("entryFee")} value={d.entry_fee} />
            <Info icon={Clock} label={t("hours")} value={d.opening_hours} />
          </section>
          {d.seasonal_warning && <div className="flex gap-3 rounded-2xl border border-estimate/40 bg-estimate/10 p-4 text-sm"><AlertTriangle className="h-5 w-5 shrink-0" /><p><strong>{t("seasonalAccess")}</strong> {lang === "bn" ? d.seasonal_warning_bn : d.seasonal_warning}</p></div>}

          <section>
            <h2 className="text-3xl font-semibold">{t("howToReach")}</h2>
            <p className="mt-3 text-muted-foreground">{d.transport_information}</p>
            <p className="mt-3 text-xs text-muted-foreground">{t("fromDhaka")} · {roadLoading ? t("routeDataLoading") : roadKm === null ? t("notAvailable") : `${formatKm(roadKm, lang)} · ${t("routeSourceOsm")}`} · {t("estimatedFare")} · {TRANSPORT_REVIEWED}</p>
            <div className="mt-5 space-y-3 md:hidden">
              {transportRows.map((row) => (
                <article key={row.id} className="rounded-2xl border border-border bg-card p-4">
                  <h3 className="font-semibold">{row.mode}</h3>
                  <p className="text-xs text-muted-foreground">{row.note}</p>
                  <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                    <div className="min-w-0"><dt className="text-xs text-muted-foreground">{t("routedDistance")}</dt><dd className="break-words">{row.distance}</dd></div>
                    <div className="min-w-0"><dt className="text-xs text-muted-foreground">{t("time")}</dt><dd className="break-words">{row.time}</dd></div>
                    <div className="col-span-2 min-w-0"><dt className="text-xs text-muted-foreground">{t("fareRange")}</dt><dd className="break-words">{row.fare}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
            <div className="mt-5 hidden max-w-full overflow-x-auto rounded-2xl border border-border md:block" tabIndex={0} aria-label={t("howToReach")}>
              <table className="w-full min-w-[560px] text-sm">
                <thead className="bg-muted text-left"><tr><th className="p-3">{t("mode")}</th><th className="p-3">{t("routedDistance")}</th><th className="p-3">{t("time")}</th><th className="p-3">{t("fareRange")}</th></tr></thead>
                <tbody>{transportRows.map((row) => (
                  <tr key={row.id} className="border-t border-border">
                    <td className="p-3 align-top font-medium">{row.mode}<div className="text-xs text-muted-foreground">{row.note}</div></td>
                    <td className="p-3 align-top">{row.distance}</td>
                    <td className="p-3 align-top">{row.time}</td>
                    <td className="p-3 align-top">{row.fare}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{t("routeModeDisclaimer")} <a className="underline" href="https://eticket.railway.gov.bd" target="_blank" rel="noopener noreferrer">{t("useOfficialSource")}</a>.</p>
          </section>

          <section className="grid gap-6 sm:grid-cols-2">
            <div><h2 className="text-2xl font-semibold">{t("tips")}</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">{d.travel_tips.map((x) => <li key={x}>{x}</li>)}</ul></div>
            <div><h2 className="text-2xl font-semibold">{t("safety")}</h2><p className="mt-3 text-muted-foreground">{d.safety_information}</p><p className="mt-2 text-sm">National emergency: <a href="tel:999" className="font-semibold text-primary">999</a></p></div>
          </section>

          <section>
            <h2 className="text-3xl font-semibold">{t("nearbyServices")}</h2>
            <div className="mt-5"><NearbyPanel center={d.coordinates} name={lang === "bn" ? d.bangla_name : d.name} /></div>
          </section>
        </div>

        <aside className="min-w-0 space-y-6 lg:sticky lg:top-20 lg:self-start">
          <MapView className="h-64 sm:h-72" markers={[{ id: d.slug, coords: d.coordinates, label: lang === "bn" ? d.bangla_name : d.name, sub: d.district }]} center={d.coordinates} zoom={11} />
          <p className="flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {d.coordinates[1].toFixed(4)}°N, {d.coordinates[0].toFixed(4)}°E ({t("approximateSiteCentre")})</p>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("sourceLabel")}</p>
            <ul className="mt-2 space-y-1 text-sm">{d.source_urls.map((u) => <li key={u}><a href={u} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-river underline">{new URL(u).hostname}<ExternalLink className="h-3 w-3" /></a></li>)}</ul>
            <p className="mt-3 text-xs text-muted-foreground">{t("lastReviewed")} {d.last_verified}. {t("spottedError")} <Link to="/contact" className="underline">{t("contact")}</Link>.</p>
          </div>
          <div className="flex flex-wrap gap-2"><Link to="/nearby" search={{ d: d.slug }} className={`${btnGhost} min-w-0 flex-1`}>{t("fullNearbyFinder")}</Link><Link to="/planner" search={{ d: d.slug }} className={`${btnPrimary} min-w-0 flex-1`}>{t("planTrip")}</Link></div>
        </aside>
      </main>
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <h2 className="text-3xl font-semibold">{t("nearbyDestinations")}</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{nearby.map(({ x }) => <DestinationCard key={x.slug} d={x} />)}</div>
      </section>
      <SiteFooter />
    </div>
  );
}
