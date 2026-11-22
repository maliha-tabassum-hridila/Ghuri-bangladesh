import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Page, DestinationCard, inputCls } from "@/components/site";
import { DESTINATIONS } from "@/data/destinations";
import { DIVISIONS } from "@/data/divisions";
import { useI18n, type Key } from "@/lib/i18n";
import { useStore } from "@/lib/saved";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): { q?: string } => ({ q: typeof s.q === "string" ? s.q.slice(0, 100) : undefined }),
  head: () => ({ meta: [
    { title: "Search Bangladesh Destinations — GHURI" },
    { name: "description", content: "Search destinations, districts, divisions and activities across Bangladesh." },
    { property: "og:title", content: "Search — GHURI" },
    { property: "og:description", content: "Find places across Bangladesh." },
  ] }),
  component: SearchPage,
});

const POPULAR: { query: string; label?: Key }[] = [
  { query: "Cox's Bazar" }, { query: "Sajek" }, { query: "Sundarbans" }, { query: "Sylhet" }, { query: "Bandarban" },
  { query: "waterfall", label: "waterfall" }, { query: "beach", label: "beachCategory" },
];

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const { t, lang } = useI18n();
  const nav = useNavigate({ from: "/search" });
  const [text, setText] = useState(q);
  const [recent, setRecent] = useStore<string[]>("ghuri-recent", []);
  useEffect(() => { setText(q); if (q.trim().length > 1) setRecent((p) => [q, ...p.filter((x) => x !== q)].slice(0, 6)); }, [q]);
  const term = q.toLowerCase().trim();
  const results = term ? DESTINATIONS.filter((d) => [d.name, d.bangla_name, d.district, d.division, d.category, d.description, ...d.activities, ...d.attractions].join(" ").toLowerCase().includes(term)) : [];
  const divs = term ? DIVISIONS.filter((d) => (d.name + d.bn).toLowerCase().includes(term)) : [];
  const go = (v: string) => nav({ search: { q: v } });
  return (
    <Page kicker={t("search")} title={t("searchBangladesh")}>
      <form onSubmit={(e) => { e.preventDefault(); go(text); }}><input autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder={t("searchPlaceholder")} className={`${inputCls} py-4 text-lg`} aria-label={t("search")} /></form>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {recent.length > 0 && <span className="py-1.5 text-muted-foreground">{t("recent")}</span>}
        {recent.map((r) => <button key={r} onClick={() => go(r)} className="rounded-full bg-muted px-3 py-1.5">{r}</button>)}
        <span className="py-1.5 text-muted-foreground">{t("popular")}</span>
        {POPULAR.map(({ query, label }) => <button key={query} onClick={() => go(query)} className="rounded-full bg-secondary px-3 py-1.5 font-medium">{label ? t(label) : query}</button>)}
      </div>
      {divs.length > 0 && <div className="mt-8 flex flex-wrap gap-2">{divs.map((d) => <Link key={d.id} to="/divisions/$id" params={{ id: d.id }} className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-forest-foreground">{lang === "bn" ? d.bn : d.name} {t("division")} →</Link>)}</div>}
      {term && results.length === 0 && divs.length === 0 && <p className="mt-10 rounded-2xl bg-muted p-10 text-center text-muted-foreground">{t("noResultsFor", { query: q })}. {t("hotelRestaurantHelp")} <Link to="/nearby" className="font-semibold text-primary underline">{t("nearFinderLink")}</Link>.</p>}
      {results.length > 0 && <><p className="mt-8 text-sm text-muted-foreground">{t("destinationsResultCount", { count: results.length })}</p><div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{results.map((d) => <DestinationCard key={d.slug} d={d} />)}</div></>}
    </Page>
  );
}
