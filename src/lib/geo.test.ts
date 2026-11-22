import { describe, expect, it } from "vitest";
import { estimateRoadKm, formatDuration, formatKm, haversineKm, type LngLat } from "./geo";

describe("road distance", () => {
  it("does not turn straight-line coordinates into a road-distance estimate", () => {
    const from: LngLat = [90.4125, 23.8103];
    const to: LngLat = [91.797, 22.3569];

    expect(haversineKm(from, to)).toBeGreaterThan(0);
    expect(estimateRoadKm(from, to)).toBeNull();
  });

  it("formats transport measurements in Bangla when selected", () => {
    expect(formatKm(2.4, "bn")).toBe("২.৪ কিমি");
    expect(formatDuration(90, "bn")).toBe("১ ঘণ্টা ৩০ মিনিট");
  });
});
