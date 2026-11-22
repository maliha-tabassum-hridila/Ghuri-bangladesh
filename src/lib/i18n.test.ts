import { describe, expect, it } from "vitest";
import { DESTINATIONS } from "@/data/destinations";
import { auditRecommendedDurations, auditTranslations, translate, translateDuration } from "./i18n";

describe("bilingual translations", () => {
  it("has a non-empty English and Bangla value for every key", () => {
    expect(auditTranslations()).toEqual([]);
  });

  it("translates in both directions and interpolates values", () => {
    expect(translate("en", "fareFor", { count: 3 })).toBe("Fare for 3");
    expect(translate("bn", "fareFor", { count: 3 })).toBe("3 জনের ভাড়া");
    expect(translate("bn", "welcome")).toBe("বাংলাদেশে স্বাগতম");
  });

  it("translates every destination's recommended duration", () => {
    const durations = DESTINATIONS.map((destination) => destination.recommended_duration);
    expect(auditRecommendedDurations(durations)).toEqual([]);
    expect(translateDuration("bn", "Half day")).toBe("অর্ধদিবস");
  });

  it("provides Bangla safety notes wherever a seasonal warning exists", () => {
    expect(DESTINATIONS.filter((destination) => destination.seasonal_warning && !destination.seasonal_warning_bn).map((destination) => destination.slug)).toEqual([]);
  });
});
