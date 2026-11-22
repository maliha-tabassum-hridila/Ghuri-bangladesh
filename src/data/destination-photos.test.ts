import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DESTINATIONS } from "./destinations";
import { DESTINATION_PHOTOS, getDestinationPhoto } from "./destination-photos";

describe("destination photos", () => {
  it("records a photo or explicit unavailable status for every destination", () => {
    expect(Object.keys(DESTINATION_PHOTOS).sort()).toEqual(DESTINATIONS.map((d) => d.slug).sort());
  });

  it("keeps verified images unique and records their attribution and reuse terms", () => {
    const photos = Object.values(DESTINATION_PHOTOS).filter(
      (photo) => photo.status === "available",
    );

    expect(new Set(photos.map((photo) => photo.src)).size).toBe(photos.length);
    for (const photo of photos) {
      expect(photo.src).toMatch(/^\/destination-photos\//);
      expect(existsSync(join(process.cwd(), "public", photo.src.slice(1)))).toBe(true);
      expect(photo.sourceUrl).toContain("commons.wikimedia.org/wiki/File:");
      expect(photo.fileName).toBeTruthy();
      expect(photo.creator).toBeTruthy();
      expect(photo.license).toBeTruthy();
      expect(photo.licenseUrl).toMatch(/creativecommons\.org\/(licenses|publicdomain)\//);
      expect(photo.attribution).toContain(photo.creator);
      expect(photo.attribution).toContain(photo.fileName);
      expect(photo.attribution).toContain(photo.changes);
    }
  });

  it("uses the consistent placeholder without invented credits for unavailable photos", () => {
    const photos = Object.values(DESTINATION_PHOTOS).filter(
      (photo) => photo.status === "unavailable",
    );
    const fallback = getDestinationPhoto({ slug: "unknown-destination" });

    expect(fallback).toEqual({
      status: "unavailable",
      src: "/destination-photo-unavailable.svg",
      sourceUrl: null,
      fileName: null,
      creator: null,
      license: null,
      licenseUrl: null,
      changes: null,
      attribution: null,
    });
    expect(existsSync(join(process.cwd(), "public", fallback.src.slice(1)))).toBe(true);
    for (const photo of photos) {
      expect(photo.src).toBe("/destination-photo-unavailable.svg");
      expect(photo.sourceUrl).toBeNull();
      expect(photo.creator).toBeNull();
      expect(photo.license).toBeNull();
      expect(photo.changes).toBeNull();
      expect(photo.attribution).toBeNull();
    }
  });
});
