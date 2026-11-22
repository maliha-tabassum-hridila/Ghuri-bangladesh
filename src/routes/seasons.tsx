import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Page, DestinationCard } from "@/components/site";
import { DESTINATIONS, SEASONS, SEASON_INFO, SEASON_INFO_BN, type Season } from "@/data/destinations";
import { useI18n, type Key } from "@/lib/i18n";

export const Route = createFileRoute("/seasons")({
  head: () => ({ meta: [
    { title: "Seasonal Travel Guide to Bangladesh — GHURI" },
    { name: "description", content: "Where to go in winter, spring, summer, monsoon and autumn, with access restrictions and safety notes." },
    { property: "og:title", content: "Seasonal Travel Guide — GHURI" },
    { property: "og:description", content: "Best Bangladesh destinations by season." },
  ] }),
  component: () => {
    const { t, lang } = useI18n();
    const [s, setS] = useState<Season>("winter");
    const info = lang === "bn" ? SEASON_INFO_BN[s] : SEASON_INFO[s];
    const seasonKey: Record<Season, Key> = { winter: "winter", spring: "spring", summer: "summer", monsoon: "monsoon", autumn: "autumn" };
    const list = DESTINATIONS.filter((d) => d.best_season.includes(s));
    const caution = DESTINATIONS.filter((d) => d.seasonal_warning && !d.best_season.includes(s));
    return (
      <Page kicker={t("seasonalGuide")} title={t("whenToGo")} intro={t("seasonalIntro")}>
        <div className="flex flex-wrap gap-2">{SEASONS.map((x) => <button key={x} onClick={() => setS(x)} className={`rounded-full px-5 py-2 text-sm font-semibold capitalize ${s === x ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{t(seasonKey[x])}</button>)}</div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-forest p-5 text-forest-foreground"><p className="text-xs uppercase opacity-70">{t("months")}</p><p className="font-display text-3xl">{info.months}</p></div>
          <div className="rounded-2xl border border-border bg-card p-5"><p className="text-xs uppercase text-muted-foreground">{t("weather")}</p><p className="mt-1">{info.weather}</p></div>
          <div className="rounded-2xl border border-estimate/40 bg-estimate/10 p-5"><p className="text-xs uppercase">{t("caution")}</p><p className="mt-1">{info.caution}</p></div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{t("checkForecast")} <a className="underline" href="https://live6.bmd.gov.bd" target="_blank" rel="noopener noreferrer">Bangladesh Meteorological Department</a>.</p>
        <h2 className="mt-10 text-3xl font-semibold">{t("recommended")} ({list.length})</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{list.map((d) => <DestinationCard key={d.slug} d={d} />)}</div>
        {caution.length > 0 && <>
          <h2 className="mt-12 text-2xl font-semibold">{t("restrictedSeason")}</h2>
          <ul className="mt-4 space-y-2">{caution.map((d) => <li key={d.slug} className="flex gap-2 rounded-xl bg-muted p-3 text-sm"><AlertTriangle className="h-4 w-4 shrink-0" /><span><strong>{lang === "bn" ? d.bangla_name : d.name}:</strong> {lang === "bn" ? d.seasonal_warning_bn : d.seasonal_warning}</span></li>)}</ul>
        </>}
      </Page>
    );
  },
});
