import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter, DestinationCard } from "@/components/site";
import { getDivision } from "@/data/divisions";
import { byDivision, CATEGORIES } from "@/data/destinations";
import { MapView } from "@/components/MapView";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/divisions/$id")({
  loader: ({ params }) => { const d = getDivision(params.id); if (!d) throw notFound(); return { id: d.id }; },
  head: ({ loaderData }) => {
    const d = loaderData && getDivision(loaderData.id);
    return { meta: d ? [
      { title: `${d.name} Division travel guide — GHURI Bangladesh` },
      { name: "description", content: d.intro },
      { property: "og:title", content: `${d.name} Division — GHURI` },
      { property: "og:description", content: d.intro },
    ] : [{ title: "Division not found" }, { name: "robots", content: "noindex" }] };
  },
  component: DivisionPage,
});

function DivisionPage() {
  const { id } = Route.useLoaderData();
  const d = getDivision(id)!;
  const { lang, t } = useI18n();
  const [cat, setCat] = useState("");
  const all = byDivision(id);
  const list = all.filter((x) => !cat || x.category === cat);
  const cats = CATEGORIES.filter((c) => all.some((x) => x.category === c));
  return (
    <div>
      <SiteHeader />
      <section className="relative h-[50svh] min-h-[320px] max-h-[620px] overflow-hidden text-forest-foreground sm:min-h-[360px]">
        <img src={d.image} alt={`${d.name} division`} className="absolute inset-0 h-full w-full object-cover" width={1024} height={768} />
        <div className="absolute inset-0 scrim" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 md:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] opacity-80">{t("division")}</p>
          <h1 className="text-4xl font-semibold sm:text-5xl md:text-7xl">{lang === "bn" ? d.bn : d.name}</h1>
          <p className="mt-3 max-w-2xl text-lg opacity-90">{lang === "bn" ? d.introBn : d.intro}</p>
        </div>
      </section>
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setCat("")} className={`rounded-full px-4 py-2 text-sm font-semibold ${!cat ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{t("all")} ({all.length})</button>
          {cats.map((c) => <button key={c} onClick={() => setCat(c)} className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${cat === c ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{t(({ nature: "natureCategory", beach: "beachCategory", hill: "hillCategory", historical: "historicalCategory", religious: "religiousCategory", wildlife: "wildlifeCategory", water: "waterCategory", urban: "urbanCategory" } as const)[c])}</button>)}
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="grid gap-6 sm:grid-cols-2">{list.map((x) => <DestinationCard key={x.slug} d={x} />)}</div>
          <div className="lg:sticky lg:top-20 lg:self-start"><MapView className="h-[520px]" fit markers={list.map((x) => ({ id: x.slug, coords: x.coordinates, label: lang === "bn" ? x.bangla_name : x.name, sub: x.district, href: `/destinations/${x.slug}` }))} /></div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
