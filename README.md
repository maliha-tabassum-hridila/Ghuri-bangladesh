# GHURI Bangladesh

Explore Bangladesh. Discover More. Travel Smarter.

## Run
```
bun install
bun run dev        # http://localhost:8080
bunx vitest run    # budget engine tests
bun run build
```

## Structure
- `src/data/` – destinations (`destinations.ts`) and divisions. Add a destination by appending one record; every page reads from this list. Each record lists `source_urls` and `last_verified`.
- `src/lib/` – pure logic: `budget.ts` (cost engine), `itinerary.ts` (day planner), `transport.ts` (fare/time estimate model), `geo.ts`, `services.ts` (live OpenStreetMap services), `i18n.tsx` (English/Bangla), `saved.ts` (on-device storage).
- `src/components/` – MapView (MapLibre), NearbyPanel, BudgetPanel, shared site UI.
- `src/routes/` – one file per page.

## External services (no API keys needed)
| Feature | Service | Notes |
|---|---|---|
| Map tiles | OpenFreeMap | keyless |
| Nearby places | OpenStreetMap Overpass API | public, rate limited; cached per session |
| Place search | Nominatim | public, 1 req/s policy |
| Road routing | OSRM demo server | car profile only; for production host your own OSRM or use a keyed provider via a server function |

To use a keyed provider (e.g. Google Places), add the key as a server secret and call it from a `createServerFn` — never from the browser.

## Data honesty
- Entry fees and opening hours are `null` unless officially published → UI shows "Not verified".
- Fares/times are estimates (per-km range × distance) and labelled as such with a review date.
- Business listings come live from OSM; phone numbers appear only when present there.
- Destination photos are selected individually. Available photographs are stored
  in `public/destination-photos/`, with source, creator, licence, attribution
  and image-change details recorded in `src/data/destination-photos.ts`;
  unverified images use a labelled placeholder instead of a regional or unrelated
  photograph.

## Deploy
Click Publish in Lovable, or `bun run build` and deploy the output to a Cloudflare Workers–compatible host.
