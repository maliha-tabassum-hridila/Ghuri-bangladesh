<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- Destination/division content lives only in `src/data/*`; pages derive from it (no per-page hardcoding).
- Business logic (budget, itinerary, transport estimates) stays in pure modules in `src/lib/` with vitest tests — UI only renders.
- Maps use MapLibre + OpenFreeMap loaded via dynamic import in `MapView` so SSR never touches maplibre.
- Live external data (Overpass, Nominatim, OSRM) goes through `src/lib/services.ts` with in-memory caching; keyless public services only from the browser.
- Any unverified number must be shown with an Estimate/Not verified label.
