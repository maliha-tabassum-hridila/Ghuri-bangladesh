import { useEffect, useState } from "react";
import { Phone, Navigation, Globe, Loader2, AlertTriangle } from "lucide-react";
import { POI_KINDS, fetchNearby, type Poi, type PoiKind } from "@/lib/services";
import { formatKm, type LngLat } from "@/lib/geo";
import { MapView } from "./MapView";
import { EstimateBadge } from "./site";
import { useI18n, type Key } from "@/lib/i18n";

export function NearbyPanel({ center, name }: { center: LngLat; name: string }) {
  const { t, lang } = useI18n();
  const [kind, setKind] = useState<PoiKind>("hotel");
  const [radius, setRadius] = useState(8000);
  const [state, setState] = useState<{ loading: boolean; error?: string; items: Poi[] }>({ loading: true, items: [] });

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: undefined }));
    fetchNearby(center, kind, radius)
      .then((items) => alive && setState({ loading: false, items }))
      .catch((e) => alive && setState({ loading: false, items: [], error: e.message }));
    return () => { alive = false; };
  }, [center[0], center[1], kind, radius]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {POI_KINDS.map((k) => (
          <button key={k.id} onClick={() => setKind(k.id)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${kind === k.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"}`}>{t(poiLabel[k.id])}</button>
        ))}
        <select value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs sm:ml-auto" aria-label={t("searchRadius")}>
          {[2000, 5000, 8000, 15000, 25000].map((r) => <option key={r} value={r}>{t("withinKm", { km: r / 1000 })}</option>)}
        </select>
      </div>
      <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><EstimateBadge kind="live" /> {t("liveListingsNote")}</p>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1 sm:max-h-[480px]">
          {state.loading && Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />)}
          {state.error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
              <p className="flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4" /> {t("nearbyLoadError")}</p>
              <p className="mt-1 text-muted-foreground">{t("nearbyRetry")}</p>
              <button onClick={() => setRadius((r) => r)} className="mt-2 text-xs font-semibold underline" >{t("retry")}</button>
            </div>
          )}
          {!state.loading && !state.error && state.items.length === 0 && <p className="rounded-xl bg-muted p-6 text-sm text-muted-foreground">{t("noNearbyPlaces", { km: radius / 1000, name })}</p>}
          {state.items.map((p) => (
            <div key={p.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold">{p.name}</p>
                <span className="shrink-0 text-xs text-muted-foreground">{formatKm(p.distanceKm, lang)}</span>
              </div>
              {p.address && <p className="text-xs text-muted-foreground">{p.address}</p>}
              {p.hours && <p className="text-xs text-muted-foreground">{t("hoursShort")}: {p.hours}</p>}
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                {p.phone && <a href={`tel:${p.phone.split(/[;,]/)[0].trim()}`} className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-primary-foreground"><Phone className="h-3 w-3" /> {t("phone")}</a>}
                <a href={`https://www.openstreetmap.org/directions?to=${p.coords[1]},${p.coords[0]}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1"><Navigation className="h-3 w-3" /> {t("directionsExternal")}</a>
                {p.website && <a href={p.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1"><Globe className="h-3 w-3" /> {t("website")}</a>}
              </div>
            </div>
          ))}
          {state.loading && <p className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" /> {t("nearbyLoading")}</p>}
        </div>
        <MapView className="h-[320px] sm:h-[480px]" fit markers={[{ id: "c", coords: center, label: name, color: "estimate" }, ...state.items.slice(0, 40).map((p) => ({ id: p.id, coords: p.coords, label: p.name, sub: formatKm(p.distanceKm, lang), color: "river" as const }))]} />
      </div>
    </div>
  );
}

const poiLabel: Record<PoiKind, Key> = {
  hotel: "poiHotel", restaurant: "poiRestaurant", hospital: "poiHospital", pharmacy: "poiPharmacy",
  bank: "poiBank", atm: "poiAtm", police: "poiPolice", bus: "poiBus", rail: "poiRail", fuel: "poiFuel",
};
