export type LngLat = [number, number];

export function haversineKm(a: LngLat, b: LngLat): number {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLng = toRad(b[0] - a[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Coordinates alone cannot establish road distance. Use a routed road result
 * (for example, OSRM) instead of deriving one from straight-line distance.
 */
export const estimateRoadKm = (_a: LngLat, _b: LngLat): null => null;

export const formatKm = (km: number, lang: "en" | "bn" = "en") => {
  const number = new Intl.NumberFormat(lang === "bn" ? "bn-BD" : "en-IN", {
    minimumFractionDigits: km < 10 ? 1 : 0,
    maximumFractionDigits: km < 10 ? 1 : 0,
  }).format(km < 10 ? km : Math.round(km));
  return lang === "bn" ? `${number} কিমি` : `${number} km`;
};

export const formatDuration = (min: number, lang: "en" | "bn" = "en") => {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  const numbers = new Intl.NumberFormat(lang === "bn" ? "bn-BD" : "en-IN");
  if (lang === "bn") return h ? `${numbers.format(h)} ঘণ্টা${m ? ` ${numbers.format(m)} মিনিট` : ""}` : `${numbers.format(m)} মিনিট`;
  return h ? `${h} h ${m ? `${m} min` : ""}`.trim() : `${m} min`;
};
