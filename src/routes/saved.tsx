import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { Page, DestinationCard, btnPrimary } from "@/components/site";
import { getDestination } from "@/data/destinations";
import { useFavourites, useTrips } from "@/lib/saved";
import { formatBDT } from "@/lib/budget";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [
    { title: "Saved Destinations & Trips — GHURI Bangladesh" },
    { name: "description", content: "Your saved destinations and itineraries." },
    { property: "og:title", content: "Saved — GHURI" },
    { property: "og:description", content: "Your saved places and trips." },
  ] }),
  component: () => {
    const { t, lang } = useI18n();
    const { favs } = useFavourites();
    const [trips, setTrips] = useTrips();
    const list = favs.map(getDestination).filter(Boolean) as NonNullable<ReturnType<typeof getDestination>>[];
    return (
      <Page kicker={t("saved")} title={t("savedTitle")} intro={t("savedDeviceNote")}>
        <h2 className="text-2xl font-semibold">{t("destinations")} ({list.length})</h2>
        {list.length === 0 ? <p className="mt-4 rounded-2xl bg-muted p-8 text-muted-foreground">{t("tapHeart")} <Link to="/destinations" className="font-semibold text-primary underline">{t("browseDestinations")}</Link></p> :
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{list.map((d) => <DestinationCard key={d.slug} d={d} />)}</div>}
        <h2 className="mt-12 text-2xl font-semibold">{t("tripsHistory")} ({trips.length})</h2>
        {trips.length === 0 ? <p className="mt-4 rounded-2xl bg-muted p-8 text-muted-foreground">{t("noSavedTrips")} <Link to="/planner" className="font-semibold text-primary underline">{t("planOne")}</Link></p> :
          <ul className="mt-4 space-y-3">{[...trips].reverse().map((trip) => (
            <li key={trip.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4">
              <div className="flex-1"><p className="font-semibold">{trip.name}</p><p className="text-xs text-muted-foreground">{lang === "bn" ? `${trip.days} দিন · ${trip.travellers} জন ভ্রমণকারী · আনু. ${formatBDT(trip.total, lang)}` : `${trip.days} days · ${trip.travellers} travellers · est. ${formatBDT(trip.total, lang)}`} · {new Date(trip.createdAt).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US")}</p></div>
              <Link to="/planner" search={{ d: trip.slugs.join(","), days: trip.days }} className={btnPrimary}>{t("open")}</Link>
              <button aria-label={t("deleteTrip")} onClick={() => setTrips((p) => p.filter((x) => x.id !== trip.id))}><Trash2 className="h-4 w-4" /></button>
            </li>))}</ul>}
      </Page>
    );
  },
});
