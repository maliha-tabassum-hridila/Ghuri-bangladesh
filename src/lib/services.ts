/** Live data from public OpenStreetMap services. All keyless; results cached in memory. */
import type { LngLat } from "./geo";
import { haversineKm } from "./geo";

export type PoiKind = "hotel" | "restaurant" | "hospital" | "pharmacy" | "bank" | "atm" | "police" | "bus" | "rail" | "fuel";

export const POI_KINDS: { id: PoiKind; label: string; query: string }[] = [
  { id: "hotel", label: "Hotels & resorts", query: 'nwr["tourism"~"hotel|resort|guest_house|motel|hostel"]' },
  { id: "restaurant", label: "Restaurants & cafés", query: 'nwr["amenity"~"restaurant|cafe|fast_food"]' },
  { id: "hospital", label: "Hospitals & clinics", query: 'nwr["amenity"~"hospital|clinic|doctors"]' },
  { id: "pharmacy", label: "Pharmacies", query: 'nwr["amenity"="pharmacy"]' },
  { id: "bank", label: "Banks", query: 'nwr["amenity"="bank"]' },
  { id: "atm", label: "ATMs", query: 'nwr["amenity"="atm"]' },
  { id: "police", label: "Police", query: 'nwr["amenity"="police"]' },
  { id: "bus", label: "Bus stations", query: 'nwr["amenity"="bus_station"]' },
  { id: "rail", label: "Railway stations", query: 'nwr["railway"="station"]' },
  { id: "fuel", label: "Fuel stations", query: 'nwr["amenity"="fuel"]' },
];

export interface Poi {
  id: string;
  kind: PoiKind;
  name: string;
  coords: LngLat;
  distanceKm: number;
  address?: string;
  phone?: string;
  website?: string;
  hours?: string;
}

const cache = new Map<string, unknown>();

export async function fetchNearby(center: LngLat, kind: PoiKind, radiusM = 8000): Promise<Poi[]> {
  const key = `poi:${kind}:${center.join(",")}:${radiusM}`;
  if (cache.has(key)) return cache.get(key) as Poi[];
  const q = POI_KINDS.find((k) => k.id === kind)!.query;
  const body = `[out:json][timeout:25];(${q}(around:${radiusM},${center[1]},${center[0]}););out center 60;`;
  const res = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: "data=" + encodeURIComponent(body), headers: { "Content-Type": "application/x-www-form-urlencoded" } });
  if (!res.ok) throw new Error(`OpenStreetMap service returned ${res.status}`);
  const json = (await res.json()) as { elements: any[] };
  const pois: Poi[] = json.elements
    .map((e) => {
      const lat = e.lat ?? e.center?.lat;
      const lon = e.lon ?? e.center?.lon;
      if (lat == null) return null;
      const t = e.tags ?? {};
      const coords: LngLat = [lon, lat];
      const addr = [t["addr:housenumber"], t["addr:street"], t["addr:city"]].filter(Boolean).join(", ");
      return {
        id: `${e.type}/${e.id}`, kind, coords,
        name: t["name:en"] || t.name || "Unnamed (no name on OpenStreetMap)",
        distanceKm: haversineKm(center, coords),
        address: addr || undefined,
        phone: t.phone || t["contact:phone"] || undefined,
        website: t.website || t["contact:website"] || undefined,
        hours: t.opening_hours || undefined,
      } as Poi;
    })
    .filter(Boolean)
    .sort((a, b) => a!.distanceKm - b!.distanceKm) as Poi[];
  cache.set(key, pois);
  return pois;
}

export interface GeoResult { name: string; coords: LngLat }
export async function geocode(q: string): Promise<GeoResult[]> {
  const key = `geo:${q}`;
  if (cache.has(key)) return cache.get(key) as GeoResult[];
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=bd&limit=5&q=${encodeURIComponent(q)}`, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("Place search failed");
  const out = ((await res.json()) as any[]).map((r) => ({ name: r.display_name as string, coords: [Number(r.lon), Number(r.lat)] as LngLat }));
  cache.set(key, out);
  return out;
}

export interface RouteResult { km: number; minutes: number; geometry: LngLat[]; source: "live" }
/** Live road routing via the public OSRM server (car profile). */
export async function fetchRoute(a: LngLat, b: LngLat, alternatives = true): Promise<RouteResult[]> {
  const key = `route:${a}:${b}`;
  if (cache.has(key)) return cache.get(key) as RouteResult[];
  const url = `https://router.project-osrm.org/route/v1/driving/${a[0]},${a[1]};${b[0]},${b[1]}?overview=full&geometries=geojson&alternatives=${alternatives}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Routing service unavailable");
  const json = await res.json();
  if (json.code !== "Ok") throw new Error("No road route found");
  const out: RouteResult[] = json.routes.map((r: any) => ({ km: r.distance / 1000, minutes: r.duration / 60, geometry: r.geometry.coordinates, source: "live" }));
  cache.set(key, out);
  return out;
}
