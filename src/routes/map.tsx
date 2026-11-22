import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LocateFixed } from "lucide-react";
import { SiteHeader, inputCls, btnGhost } from "@/components/site";
import { DESTINATIONS, CATEGORIES } from "@/data/destinations";
import { DIVISIONS } from "@/data/divisions";
import { MapView } from "@/components/MapView";
import type { LngLat } from "@/lib/geo";
import { useI18n, type Key } from "@/lib/i18n";
import type { Category } from "@/data/destinations";

export const Route = createFileRoute("/map")({
  head: () => ({ meta: [
    { title: "Interactive Bangladesh Travel Map — GHURI" },
    { name: "description", content: "Every GHURI destination on an interactive map with category and division filters." },
    { property: "og:title", content: "Bangladesh Travel Map — GHURI" },
    { property: "og:description", content: "Zoom, filter and explore Bangladesh destinations." },
  ] }),
  component: () => {
    const { t, lang } = useI18n();
    const [cat, setCat] = useState("");
    const [div, setDiv] = useState("");
    const [q, setQ] = useState("");
    const [me, setMe] = useState<LngLat | null>(null);
    const list = DESTINATIONS.filter((d) => (!cat || d.category === cat) && (!div || d.division === div) && (!q || `${d.name} ${d.bangla_name} ${d.district}`.toLowerCase().includes(q.toLowerCase())));
    return (
      <div className="flex h-[100svh] flex-col">
        <SiteHeader />
        <div className="relative flex-1">
          <MapView className="h-full rounded-none" fit user={me} markers={list.map((d) => ({ id: d.slug, coords: d.coordinates, label: lang === "bn" ? d.bangla_name : d.name, sub: `${d.district} · ${t(categoryKey[d.category])}`, href: `/destinations/${d.slug}` }))} />
          <div className="absolute left-3 top-3 z-10 w-[min(340px,calc(100%-4rem))] space-y-2 rounded-2xl glass border border-border p-3 shadow-soft">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("searchDestinations")} className={inputCls} aria-label={t("searchMap")} />
            <div className="grid grid-cols-2 gap-2">
              <select value={div} onChange={(e) => setDiv(e.target.value)} className={inputCls} aria-label={t("division")}><option value="">{t("allDivisions")}</option>{DIVISIONS.map((d) => <option key={d.id} value={d.id}>{lang === "bn" ? d.bn : d.name}</option>)}</select>
              <select value={cat} onChange={(e) => setCat(e.target.value)} className={`${inputCls} capitalize`} aria-label={t("category")}><option value="">{t("allCategories")}</option>{CATEGORIES.map((c) => <option key={c} value={c}>{t(categoryKey[c])}</option>)}</select>
            </div>
            <div className="flex items-center justify-between text-xs"><span>{t("mapPlacesCount", { count: list.length })}</span>
              <button className={`${btnGhost} px-3 py-1.5 text-xs`} onClick={() => navigator.geolocation?.getCurrentPosition((p) => setMe([p.coords.longitude, p.coords.latitude]))}><LocateFixed className="h-3 w-3" /> {t("myLocation")}</button></div>
          </div>
        </div>
      </div>
    );
  },
});

const categoryKey: Record<Category, Key> = {
  nature: "natureCategory", beach: "beachCategory", hill: "hillCategory", historical: "historicalCategory",
  religious: "religiousCategory", wildlife: "wildlifeCategory", water: "waterCategory", urban: "urbanCategory",
};
