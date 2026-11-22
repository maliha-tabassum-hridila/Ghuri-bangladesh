import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Page, inputCls, btnGhost } from "@/components/site";
import { DESTINATIONS, getDestination } from "@/data/destinations";
import { NearbyPanel } from "@/components/NearbyPanel";
import type { LngLat } from "@/lib/geo";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/nearby")({
  validateSearch: (s: Record<string, unknown>): { d?: string } => ({ d: typeof s.d === "string" ? s.d : undefined }),
  head: () => ({ meta: [
    { title: "Nearby Hotels, Hospitals & Services — GHURI Bangladesh" },
    { name: "description", content: "Find hotels, restaurants, hospitals, pharmacies, ATMs and police near any destination, live from OpenStreetMap." },
    { property: "og:title", content: "Nearby Services Finder — GHURI" },
    { property: "og:description", content: "Essential services near Bangladesh destinations." },
  ] }),
  component: () => {
    const { t, lang } = useI18n();
    const s = Route.useSearch();
    const [slug, setSlug] = useState(s.d && getDestination(s.d) ? s.d : "coxs-bazar-beach");
    const [me, setMe] = useState<LngLat | null>(null);
    const d = getDestination(slug)!;
    return (
      <Page kicker={t("nearbyFinder")} title={t("whatsAround")} intro={t("nearbyIntro")}>
        <div className="mb-6 flex flex-wrap gap-3">
          <select value={me ? "" : slug} onChange={(e) => { setMe(null); setSlug(e.target.value); }} className={`${inputCls} max-w-sm`} aria-label={t("destinations")}>
            {me && <option value="">{t("myLocation")}</option>}
            {DESTINATIONS.map((x) => <option key={x.slug} value={x.slug}>{lang === "bn" ? x.bangla_name : x.name} — {x.district}</option>)}
          </select>
          <button className={btnGhost} onClick={() => navigator.geolocation?.getCurrentPosition((p) => setMe([p.coords.longitude, p.coords.latitude]))}>{t("nearMe")}</button>
        </div>
        <NearbyPanel center={me ?? d.coordinates} name={me ? t("myLocation").toLowerCase() : lang === "bn" ? d.bangla_name : d.name} />
      </Page>
    );
  },
});
