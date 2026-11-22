import { describe, expect, it } from "vitest";
import { getDestination } from "@/data/destinations";
import type { RouteResult } from "./services";
import { buildItinerary } from "./itinerary";

const stop = getDestination("coxs-bazar-beach")!;
const start = { name: "Dhaka", coords: [90.4125, 23.8103] as [number, number] };
const route = (km: number): RouteResult => ({ km, minutes: km, geometry: [start.coords, stop.coordinates], source: "live" });

describe("itinerary transport distances", () => {
  it("does not derive road distance when routed legs are unavailable", () => {
    const result = buildItinerary(start, [stop], 3, "bus", [null, null]);
    expect(result.totalKm).toBeNull();
    expect(result.warnings.some((warning) => warning.includes("unavailable"))).toBe(true);
    expect(result.days.flatMap((day) => day.items).some((item) => item.text.includes("km"))).toBe(false);
  });

  it("uses only supplied routed road distances", () => {
    const result = buildItinerary(start, [stop], 3, "car", [route(310), route(310)]);
    expect(result.totalKm).toBe(620);
  });

  it.each(["train", "launch"] as const)("never applies a road route to %s", (mode) => {
    const result = buildItinerary(start, [stop], 3, mode, [route(310), route(310)]);
    expect(result.totalKm).toBeNull();
  });
});
