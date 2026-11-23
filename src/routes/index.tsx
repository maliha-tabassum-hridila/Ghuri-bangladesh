import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, ArrowDown, MapPin, Mountain, Waves, Landmark, Heart, Users, Wallet, Clock } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { SiteHeader, SiteFooter, DestinationCard, btnPrimary } from "@/components/site";
import { DIVISIONS } from "@/data/divisions";
import { DESTINATIONS, byDivision, type Tag } from "@/data/destinations";
import { useI18n, type Key } from "@/lib/i18n";
import type { Category } from "@/data/destinations";
import { MapView } from "@/components/MapView";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GHURI Bangladesh — Explore Bangladesh, Travel Smarter" },
      { name: "description", content: "Discover destinations across all 8 divisions of Bangladesh, find nearby services, plan routes and build day-by-day trips with cost estimates." },
      { property: "og:title", content: "GHURI Bangladesh — Travel Guide" },
      { property: "og:description", content: "Destinations, maps, routes and a smart trip planner for Bangladesh." },
    ],
  }),
  component: Home,
});

function Welcome() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  useEffect(() => { const id = setTimeout(() => setLoading(false), 900); return () => clearTimeout(id); }, []);
  return (
    <section
      className="relative h-[100svh] min-h-[520px] overflow-hidden bg-forest text-forest-foreground sm:min-h-[600px]"
      style={{ perspective: "1200px" }}
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setTilt({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 }); }}
    >
      <div className="absolute inset-0 transition-transform duration-700 ease-out" style={{ transform: `rotateY(${tilt.x * 3}deg) rotateX(${-tilt.y * 2}deg) scale(1.06)` }}>
        <img src={hero} alt={t("heroImageAlt")} width={1920} height={1088} className="h-full w-full object-cover animate-drift" fetchPriority="high" />
      </div>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {[12, 38, 64].map((top, i) => (
          <div key={top} className="absolute h-40 w-[60vw] rounded-full bg-forest-foreground/10 blur-3xl animate-cloud" style={{ top: `${top}%`, animationDelay: `${-i * 18}s`, animationDuration: `${50 + i * 15}s` }} />
        ))}
      </div>
      <div className="absolute inset-0 scrim" />
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 sm:pb-20 md:px-8">
        <p className="animate-rise text-xs font-semibold uppercase tracking-[0.4em] opacity-80" style={{ animationDelay: ".9s" }}>GHURI Bangladesh</p>
        <h1 className="animate-rise mt-4 max-w-4xl text-[2.75rem] font-semibold leading-[1.02] sm:text-6xl md:text-8xl" style={{ animationDelay: "1.05s" }}>{t("welcome")}</h1>
        <p className="animate-rise mt-5 max-w-xl text-lg opacity-90 md:text-xl" style={{ animationDelay: "1.25s" }}>{t("welcomeSub")}</p>
        <div className="animate-rise mt-8 flex max-w-full flex-col gap-3 min-[390px]:flex-row" style={{ animationDelay: "1.4s" }}>
          <a href="#home" className="rounded-full bg-sand px-5 py-3 text-center text-sm font-bold uppercase tracking-wider text-forest hover:opacity-90 sm:px-6">{t("exploreBd")}</a>
          <Link to="/planner" className="rounded-full border border-forest-foreground/60 px-5 py-3 text-center text-sm font-bold uppercase tracking-wider hover:bg-forest-foreground/10 sm:px-6">{t("planJourney")}</Link>
        </div>
        <a href="#home" aria-label={t("scrollDown")} className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-70"><ArrowDown className="h-5 w-5 animate-bounce" /></a>
      </div>
      <div className={`absolute inset-0 z-40 flex flex-col items-center justify-center bg-forest transition-opacity duration-700 ${loading ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={!loading}>
        <svg viewBox="0 0 120 40" className="w-40" aria-hidden>
          <path d="M2 30 Q 30 5 60 22 T 118 14" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="160" strokeDashoffset="160" style={{ animation: "dash 1s ease forwards" }} />
        </svg>
        <p className="mt-3 font-display text-lg tracking-widest">GHURI</p>
        <style>{`@keyframes dash{to{stroke-dashoffset:0}}`}</style>
      </div>
    </section>
  );
}

function HeroSearch() {
  const { t, lang } = useI18n();
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const sugg = useMemo(() => (q.length < 2 ? [] : DESTINATIONS.filter((d) => (d.name + d.bangla_name + d.district).toLowerCase().includes(q.toLowerCase())).slice(0, 6)), [q]);
  return (
    <div className="relative mx-auto -mt-10 max-w-3xl px-4">
      <form onSubmit={(e) => { e.preventDefault(); nav({ to: "/search", search: { q } }); }} className="flex items-center gap-2 rounded-full border border-border bg-card p-2 shadow-soft">
        <Search className="ml-3 h-5 w-5 text-muted-foreground" aria-hidden />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("whereTo")} aria-label={t("whereTo")} className="flex-1 bg-transparent px-2 py-2 outline-none" />
        <button className={btnPrimary}>{t("search")}</button>
      </form>
      {sugg.length > 0 && (
        <ul className="absolute inset-x-4 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          {sugg.map((d) => (
            <li key={d.slug}><Link to="/destinations/$slug" params={{ slug: d.slug }} className="flex items-center gap-3 px-5 py-3 hover:bg-muted"><MapPin className="h-4 w-4 text-river" /> <span className="font-medium">{lang === "bn" ? d.bangla_name : d.name}</span><span className="text-xs text-muted-foreground">{d.district}</span></Link></li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
        {["coxs-bazar-beach", "sajek-valley", "sundarbans", "ratargul-swamp-forest", "kuakata"].map((s) => {
          const d = DESTINATIONS.find((x) => x.slug === s); if (!d) return null;
          return <Link key={s} to="/destinations/$slug" params={{ slug: s }} className="rounded-full bg-secondary px-3 py-1.5 font-medium hover:bg-sand">{d.name}</Link>;
        })}
      </div>
    </div>
  );
}

const INSPIRE: { tag: Tag; label: Key; icon: typeof Heart }[] = [
  { tag: "couple", label: "forCouples", icon: Heart }, { tag: "family", label: "familyFriendly", icon: Users }, { tag: "budget", label: "budgetTrips", icon: Wallet },
  { tag: "adventure", label: "adventure", icon: Mountain }, { tag: "weekend", label: "weekendGetaways", icon: Clock }, { tag: "hidden", label: "hiddenGems", icon: Waves },
];

const categoryKey: Record<Category, Key> = {
  nature: "natureCategory", beach: "beachCategory", hill: "hillCategory", historical: "historicalCategory",
  religious: "religiousCategory", wildlife: "wildlifeCategory", water: "waterCategory", urban: "urbanCategory",
};
const itineraryTitles: Record<string, Key> = {
  "Sylhet tea & water": "sylhetTeaWater",
  "Coast & coral": "coastCoral",
  "Northern heritage": "northernHeritage",
};

function Home() {
  const { t, lang } = useI18n();
  const [tab, setTab] = useState<"popular" | "hidden" | "winter" | "nature">("popular");
  const featured = useMemo(() => {
    if (tab === "hidden") return DESTINATIONS.filter((d) => d.tags.includes("hidden"));
    if (tab === "winter") return DESTINATIONS.filter((d) => d.best_season.includes("winter") && d.category !== "urban");
    if (tab === "nature") return DESTINATIONS.filter((d) => ["nature", "hill", "wildlife"].includes(d.category));
    return ["coxs-bazar-beach", "sundarbans", "sajek-valley", "sreemangal-tea-gardens", "paharpur-buddhist-vihara", "kuakata", "jaflong", "lalbagh-fort"].map((s) => DESTINATIONS.find((d) => d.slug === s)!).filter(Boolean);
  }, [tab]);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div>
      <SiteHeader overlay />
      <Welcome />
      <div id="home" ref={ref} className="scroll-mt-0">
        <HeroSearch />
        <main className="mx-auto max-w-7xl px-4 md:px-8">
          <section className="mt-24">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-river">{t("eightDivisions")}</p><h2 className="mt-2 text-4xl font-semibold">{t("exploreByDivision")}</h2></div>
              <Link to="/divisions" className="text-sm font-semibold text-primary">{t("allDivisions")} →</Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {DIVISIONS.map((d) => (
                <Link key={d.id} to="/divisions/$id" params={{ id: d.id }} className="group relative aspect-[3/4] overflow-hidden rounded-2xl text-forest-foreground">
                  <img src={d.image} alt={`${d.name} division`} loading="lazy" width={1024} height={768} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 scrim" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-xs opacity-80">{byDivision(d.id).length} {t("destinationsCount")}</p>
                    <h3 className="text-2xl font-semibold">{lang === "bn" ? d.bn : d.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm opacity-85">{lang === "bn" ? d.introBn : d.intro}</p>
                    <span className="mt-3 inline-block text-xs font-bold uppercase tracking-wider">{t("exploreDivision")} →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-24">
            <h2 className="text-4xl font-semibold">{t("featuredDestinations")}</h2>
            <div className="mt-6 flex flex-wrap gap-2" role="tablist">
              {([["popular", "mostPopular"], ["hidden", "hiddenGems"], ["winter", "bestThisWinter"], ["nature", "natureAdventure"]] as const).map(([k, l]) => (
                <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === k ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{t(l)}</button>
              ))}
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{featured.slice(0, 8).map((d) => <DestinationCard key={d.slug} d={d} />)}</div>
          </section>

          <section className="mt-24">
            <h2 className="text-4xl font-semibold">{t("travelInspiration")}</h2>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {INSPIRE.map(({ tag, label, icon: Icon }) => (
                <Link key={tag} to="/destinations" search={{ tag }} className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary">
                  <Icon className="h-6 w-6 text-river" aria-hidden />
                  <p className="mt-4 font-semibold">{t(label)}</p>
                  <p className="text-xs text-muted-foreground">{DESTINATIONS.filter((d) => d.tags.includes(tag)).length} {t("places")}</p>
                </Link>
              ))}
              <Link to="/destinations" search={{ category: "historical" }} className="col-span-2 rounded-2xl bg-forest p-5 text-forest-foreground md:col-span-3 lg:col-span-6">
                <Landmark className="h-6 w-6" aria-hidden /><p className="mt-3 font-display text-2xl">{t("historicalBangladesh")}</p>
              </Link>
            </div>
          </section>

          <section className="mt-24 grid items-center gap-10 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 className="text-4xl font-semibold">{t("everyDestinationMap")}</h2>
              <p className="mt-4 text-muted-foreground">{t("mapIntro", { count: DESTINATIONS.length })}</p>
              <Link to="/map" className={`${btnPrimary} mt-6`}>{t("openFullMap")}</Link>
            </div>
            <MapView className="h-[420px]" markers={DESTINATIONS.map((d) => ({ id: d.slug, coords: d.coordinates, label: lang === "bn" ? d.bangla_name : d.name, sub: d.district, href: `/destinations/${d.slug}` }))} />
          </section>

          <section className="mt-24">
            <h2 className="text-4xl font-semibold">{t("featuredItineraries")}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {[
                { name: "Sylhet tea & water", days: 3, slugs: ["jaflong", "ratargul-swamp-forest", "sreemangal-tea-gardens"] },
                { name: "Coast & coral", days: 4, slugs: ["coxs-bazar-beach", "himchari", "inani-beach"] },
                { name: "Northern heritage", days: 3, slugs: ["paharpur-buddhist-vihara", "mahasthangarh", "kantajew-temple"] },
              ].map((it) => (
                <Link key={it.name} to="/planner" search={{ d: it.slugs.join(","), days: it.days }} className="rounded-2xl border border-border bg-card p-6 hover:border-primary">
                  <p className="text-xs font-semibold uppercase tracking-widest text-river">{t("tripDays", { count: it.days })}</p>
                  <h3 className="mt-2 text-2xl font-semibold">{t(itineraryTitles[it.name])}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{t("dhakaTo")} {it.slugs.map((s) => { const d = DESTINATIONS.find((x) => x.slug === s); return lang === "bn" ? d?.bangla_name : d?.name; }).join(" → ")}</p>
                  <p className="mt-4 text-sm font-semibold text-primary">{t("planAndCost")} →</p>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
