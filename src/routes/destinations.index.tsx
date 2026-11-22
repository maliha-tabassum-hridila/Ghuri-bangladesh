import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { Page, DestinationCard, inputCls } from "@/components/site";
import { DESTINATIONS, CATEGORIES, SEASONS, TAGS, type Category, type Season, type Tag } from "@/data/destinations";
import { DIVISIONS } from "@/data/divisions";
import { useI18n, type Key } from "@/lib/i18n";

const categoryKey: Record<Category, Key> = {
  nature: "natureCategory", beach: "beachCategory", hill: "hillCategory", historical: "historicalCategory",
  religious: "religiousCategory", wildlife: "wildlifeCategory", water: "waterCategory", urban: "urbanCategory",
};
const seasonKey: Record<Season, Key> = {
  winter: "winter", spring: "spring", summer: "summer", monsoon: "monsoon", autumn: "autumn",
};
const tagKey: Record<Tag, Key> = {
  family: "familyFriendly", adventure: "adventure", couple: "forCouples", budget: "budgetTrips", weekend: "weekendGetaways", hidden: "hiddenGem",
};

type S = { division?: string; district?: string; category?: string; season?: string; tag?: string; budget?: string; q?: string };

export const Route = createFileRoute("/destinations/")({
  validateSearch: (s: Record<string, unknown>): S => {
    const o: S = {};
    for (const k of ["division", "district", "category", "season", "tag", "budget", "q"] as const) if (typeof s[k] === "string" && s[k]) o[k] = s[k] as string;
    return o;
  },
  head: () => ({ meta: [
    { title: "Destination Explorer — GHURI Bangladesh" },
    { name: "description", content: "Filter Bangladesh destinations by division, district, category, season and budget." },
    { property: "og:title", content: "Destination Explorer — GHURI Bangladesh" },
    { property: "og:description", content: "Find beaches, hills, forests and heritage sites across Bangladesh." },
  ] }),
  component: Explorer,
});

export function Explorer() {
  const { t, lang } = useI18n();
  const s = Route.useSearch();
  const nav = useNavigate({ from: "/destinations/" });
  const set = (k: keyof S, v: string) => nav({ search: (p: S) => ({ ...p, [k]: v || undefined, ...(k === "division" ? { district: undefined } : {}) }) });
  const districts = useMemo(() => [...new Set(DESTINATIONS.filter((d) => !s.division || d.division === s.division).map((d) => d.district))].sort(), [s.division]);
  const list = DESTINATIONS.filter((d) =>
    (!s.division || d.division === s.division) && (!s.district || d.district === s.district) && (!s.category || d.category === s.category) &&
    (!s.season || d.best_season.includes(s.season as never)) && (!s.tag || d.tags.includes(s.tag as never)) && (!s.budget || d.cost_level === Number(s.budget)) &&
    (!s.q || (d.name + d.bangla_name + d.district + d.description).toLowerCase().includes(s.q.toLowerCase())));
  const Sel = ({ k, label, opts }: { k: keyof S; label: string; opts: [string, string][] }) => (
    <label className="text-xs font-semibold text-muted-foreground">{label}
      <select value={s[k] ?? ""} onChange={(e) => set(k, e.target.value)} className={`${inputCls} mt-1 capitalize`}>
        <option value="">{t("any")}</option>{opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
  return (
    <Page kicker={t("destinationExplorer")} title={t("findNextPlace")} intro={t("destinationIntro", { count: DESTINATIONS.length })}>
      <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-7">
        <label className="text-xs font-semibold text-muted-foreground lg:col-span-1">{t("keyword")}<input value={s.q ?? ""} onChange={(e) => set("q", e.target.value)} className={`${inputCls} mt-1`} placeholder={t("waterfallExample")} /></label>
        <Sel k="division" label={t("division")} opts={DIVISIONS.map((d) => [d.id, lang === "bn" ? d.bn : d.name])} />
        <Sel k="district" label={t("district")} opts={districts.map((d) => [d, d])} />
        <Sel k="category" label={t("category")} opts={CATEGORIES.map((c) => [c, t(categoryKey[c])])} />
        <Sel k="season" label={t("bestSeason")} opts={SEASONS.map((c) => [c, t(seasonKey[c])])} />
        <Sel k="tag" label={t("tripType")} opts={TAGS.map((c) => [c, t(tagKey[c])])} />
        <Sel k="budget" label={t("areaCost")} opts={[["1", t("budgetFriendly")], ["2", t("moderate")], ["3", t("higherCost")]]} />
      </div>
      <p className="mt-6 text-sm text-muted-foreground">{list.length} {t("results")} {Object.keys(s).length > 0 && <button className="ml-2 font-semibold text-primary underline" onClick={() => nav({ search: {} })}>{t("clearFilters")}</button>}</p>
      {list.length === 0 ? <p className="mt-6 rounded-2xl bg-muted p-10 text-center text-muted-foreground">{t("noDestinationMatches")}</p> :
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{list.map((d) => <DestinationCard key={d.slug} d={d} />)}</div>}
    </Page>
  );
}
