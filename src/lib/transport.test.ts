import { describe, expect, it } from "vitest";
import { estimateFare, estimateMinutes, getMode } from "./transport";

describe("route-specific transport estimates", () => {
  it.each(["train", "launch"] as const)(
    "%s fares and times remain unavailable even when given a road distance",
    (mode) => {
      expect(getMode(mode).perKm).toBeNull();
      expect(getMode(mode).avgKmh).toBeNull();
      expect(estimateFare(mode, 250, 2)).toBeNull();
      expect(estimateMinutes(mode, 250)).toBeNull();
    },
  );

  it("does not calculate fares or times when road distance is unavailable", () => {
    expect(estimateFare("bus", null, 2)).toBeNull();
    expect(estimateMinutes("car", null)).toBeNull();
  });
});
