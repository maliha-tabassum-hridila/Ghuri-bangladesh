import type { Destination } from "@/data/destinations";
import type { LngLat } from "./geo";
import { estimateMinutes, type Mode } from "./transport";
import type { RouteResult } from "./services";

export interface ItinItem { time: string; text: string }
export interface ItinDay { day: number; title: string; items: ItinItem[]; base?: string }

/** Max realistic road travel per day before forcing an overnight stop. */
export const MAX_TRAVEL_MIN_PER_DAY = 9 * 60;

const fmt = (min: number) => `${String(Math.floor(min / 60) % 24).padStart(2, "0")}:${String(Math.round(min % 60)).padStart(2, "0")}`;

/**
 * Greedy day builder: travel legs consume time, each destination consumes
 * visit time; a day ends at 19:00 with an overnight at the last location.
 * Returns the plan plus warnings when days are insufficient.
 */
export function buildItinerary(
  start: { name: string; coords: LngLat },
  stops: Destination[],
  days: number,
  mode: Mode,
  roadLegs: readonly (RouteResult | null)[],
) {
  const out: ItinDay[] = [];
  const warnings: string[] = [];
  let day = 1, clock = 7 * 60, posName = start.name;
  let cur: ItinDay = { day, title: `Day 1`, items: [{ time: fmt(clock), text: `Depart ${start.name}` }] };
  const roadMode = mode === "car" || mode === "motorcycle" || mode === "bus";
  const allLegsAvailable = roadMode && roadLegs.length === stops.length + 1 && roadLegs.every((leg) => leg !== null);
  const totalKm = allLegsAvailable ? roadLegs.reduce((sum, leg) => sum + (leg?.km ?? 0), 0) : null;
  const newDay = () => {
    cur.items.push({ time: "19:30", text: `Dinner and overnight near ${posName}` });
    cur.base = posName; out.push(cur); day++; clock = 8 * 60;
    cur = { day, title: `Day ${day}`, items: [{ time: "07:30", text: "Breakfast" }] };
  };
  for (const [index, s] of stops.entries()) {
    const leg = roadMode ? roadLegs[index] ?? null : null;
    const km = leg?.km ?? null;
    const min = leg ? mode === "car" ? leg.minutes : estimateMinutes(mode, leg.km) : null;
    if (min !== null && min > MAX_TRAVEL_MIN_PER_DAY) warnings.push(`${posName} → ${s.name} is about ${Math.round(min / 60)} h by this mode — consider an overnight stop.`);
    if (min !== null && clock + min > 18 * 60 && clock > 9 * 60) newDay();
    if (km !== null && min !== null && min > 20) {
      cur.items.push({ time: fmt(clock), text: `Travel to ${s.name} (~${Math.round(km)} km, ~${Math.round(min / 60 * 10) / 10} h)` });
      clock += min;
    } else {
      warnings.push(`Verified road distance or travel time is unavailable for ${posName} → ${s.name}.`);
      cur.items.push({ time: "", text: `Travel details unavailable for ${s.name}.` });
    }
    if (clock > 12.5 * 60 && clock < 14 * 60) { cur.items.push({ time: fmt(clock), text: "Lunch" }); clock += 60; }
    const visit = Math.max(120, s.recommended_nights * 8 * 60);
    if (s.recommended_nights > 0) cur.items.push({ time: fmt(clock), text: `Check in near ${s.name}` });
    cur.items.push({ time: fmt(clock), text: `Explore ${s.name}: ${s.attractions.slice(0, 3).join(", ")}` });
    posName = s.name;
    let remaining = visit;
    while (remaining > 0) {
      const avail = 19 * 60 - clock;
      if (remaining <= avail) { clock += remaining; remaining = 0; }
      else { remaining -= Math.max(0, avail); newDay(); cur.items.push({ time: "09:00", text: `Continue at ${s.name}: ${s.activities.join(", ")}` }); clock = 9 * 60; }
    }
  }
  // return leg
  const returnLeg = roadMode ? roadLegs[stops.length] ?? null : null;
  const backMin = returnLeg ? mode === "car" ? returnLeg.minutes : estimateMinutes(mode, returnLeg.km) : null;
  if (backMin !== null && clock + backMin > 22 * 60) newDay();
  if (returnLeg && backMin !== null) cur.items.push({ time: fmt(clock), text: `Return journey to ${start.name} (~${Math.round(returnLeg.km)} km)` });
  else {
    warnings.push(`Verified road distance or travel time is unavailable for the return journey to ${start.name}.`);
    cur.items.push({ time: "", text: `Return route details unavailable for ${start.name}.` });
  }
  out.push(cur);
  if (out.length > days) warnings.push(`This route realistically needs ${out.length} days; you selected ${days}. Remove a stop or add days.`);
  const nights = out.length - 1;
  return { days: out, warnings, totalKm, nights };
}
