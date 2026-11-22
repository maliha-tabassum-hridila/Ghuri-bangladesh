import { useEffect, useRef } from "react";
import type { LngLat } from "@/lib/geo";
import { useI18n } from "@/lib/i18n";

export interface MapMarker { id: string; coords: LngLat; label: string; sub?: string; href?: string; color?: "primary" | "river" | "estimate" }
interface Props {
  markers: MapMarker[];
  lines?: LngLat[][];
  center?: LngLat;
  zoom?: number;
  fit?: boolean;
  className?: string;
  user?: LngLat | null;
}

const COLORS = { primary: "#1f5a43", river: "#2f78a8", estimate: "#d39a2c" };

/** MapLibre map using keyless OpenFreeMap tiles. Loaded only in the browser. */
export function MapView({ markers, lines = [], center = [90.35, 23.7], zoom = 6.2, fit = false, className = "h-96", user }: Props) {
  const { t } = useI18n();
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const libRef = useRef<any>(null);
  const markerObjs = useRef<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [lib, worker] = await Promise.all([import("maplibre-gl"), import("maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url")]);
      const maplibregl = (lib as any).default ?? lib;
      if (maplibregl.setWorkerUrl) maplibregl.setWorkerUrl((worker as any).default);
      if (cancelled || !el.current) return;
      libRef.current = maplibregl;
      const map = new maplibregl.Map({ container: el.current, style: "https://tiles.openfreemap.org/styles/liberty", center, zoom, attributionControl: { compact: true } });
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
      mapRef.current = map;
      map.on("load", () => { map.getContainer().dataset.ready = "1"; draw(); });
    })();
    return () => { cancelled = true; mapRef.current?.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function draw() {
    const map = mapRef.current, ml = libRef.current;
    if (!map || !ml || !map.isStyleLoaded()) return;
    markerObjs.current.forEach((m) => m.remove());
    markerObjs.current = [];
    for (const m of markers) {
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", m.label);
      dot.style.cssText = `width:16px;height:16px;border-radius:999px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.35);cursor:pointer;background:${COLORS[m.color ?? "primary"]}`;
      const html = `<div style="font-family:Manrope,sans-serif;min-width:160px"><strong>${escape(m.label)}</strong>${m.sub ? `<div style="font-size:12px;opacity:.7">${escape(m.sub)}</div>` : ""}${m.href ? `<a href="${m.href}" style="font-size:12px;color:${COLORS.river};font-weight:600">${escape(t("open"))} →</a>` : ""}</div>`;
      markerObjs.current.push(new ml.Marker({ element: dot }).setLngLat(m.coords).setPopup(new ml.Popup({ offset: 12 }).setHTML(html)).addTo(map));
    }
    if (user) {
      const u = document.createElement("div");
      u.style.cssText = `width:14px;height:14px;border-radius:999px;background:${COLORS.river};outline:6px solid color-mix(in oklab, ${COLORS.river} 30%, transparent)`;
      markerObjs.current.push(new ml.Marker({ element: u }).setLngLat(user).addTo(map));
    }
    const fc = { type: "FeatureCollection", features: lines.map((coordinates, i) => ({ type: "Feature", properties: { i }, geometry: { type: "LineString", coordinates } })) };
    if (map.getSource("lines")) map.getSource("lines").setData(fc);
    else {
      map.addSource("lines", { type: "geojson", data: fc });
      map.addLayer({ id: "lines-alt", type: "line", source: "lines", filter: [">", ["get", "i"], 0], paint: { "line-color": "#8a9a90", "line-width": 4, "line-dasharray": [2, 2] } });
      map.addLayer({ id: "lines-main", type: "line", source: "lines", filter: ["==", ["get", "i"], 0], paint: { "line-color": COLORS.river, "line-width": 5 } });
    }
    const pts = [...markers.map((m) => m.coords), ...lines.flat(), ...(user ? [user] : [])];
    if (fit && pts.length > 1) {
      const b = new ml.LngLatBounds(pts[0], pts[0]);
      pts.forEach((p) => b.extend(p));
      map.fitBounds(b, { padding: 60, maxZoom: 13, duration: 600 });
    } else if (pts.length === 1) map.easeTo({ center: pts[0], zoom: Math.max(zoom, 11) });
  }

  useEffect(() => { draw(); });

  return <div ref={el} className={`w-full overflow-hidden rounded-2xl bg-muted ${className}`} role="region" aria-label={t("interactiveMap")} />;
}

function escape(s: string) { return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!); }
