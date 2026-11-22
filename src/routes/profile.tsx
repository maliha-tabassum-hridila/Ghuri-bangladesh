import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, inputCls, btnGhost, LangToggle } from "@/components/site";
import { useStore, useFavourites, useTrips } from "@/lib/saved";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [
    { title: "Profile & Settings — GHURI Bangladesh" },
    { name: "description", content: "Your travel profile, language and saved data." },
    { property: "og:title", content: "Profile — GHURI" },
    { property: "og:description", content: "Travel profile and settings." },
  ] }),
  component: () => {
    const { t } = useI18n();
    const [name, setName] = useStore("ghuri-name", "");
    const [home, setHome] = useStore("ghuri-home", "Dhaka");
    const { favs } = useFavourites();
    const [trips] = useTrips();
    return (
      <Page kicker={t("profile")} title={name ? t("helloName", { name }) : t("travelProfile")} intro={t("guestProfile")}>
        <div className="grid max-w-3xl gap-6 md:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
            <label className="block text-xs font-semibold">{t("displayName")}<input value={name} maxLength={40} onChange={(e) => setName(e.target.value)} className={`${inputCls} mt-1`} /></label>
            <label className="block text-xs font-semibold">{t("homeCity")}<input value={home} maxLength={40} onChange={(e) => setHome(e.target.value)} className={`${inputCls} mt-1`} /></label>
            <div className="flex items-center justify-between text-sm">{t("language")} <LangToggle /></div>
          </div>
          <div className="space-y-3 rounded-2xl bg-forest p-5 text-forest-foreground">
            <p className="font-display text-4xl">{favs.length}</p><p className="text-sm opacity-80">{t("savedDestinations")}</p>
            <p className="font-display text-4xl">{trips.length}</p><p className="text-sm opacity-80">{t("savedTrips")}</p>
            <Link to="/saved" className="inline-block text-sm font-semibold underline">{t("viewSaved")} →</Link>
          </div>
        </div>
        <button className={`${btnGhost} mt-6`} onClick={() => { ["ghuri-favs", "ghuri-trips", "ghuri-name", "ghuri-home", "ghuri-recent"].forEach((k) => localStorage.removeItem(k)); location.reload(); }}>{t("clearData")}</button>
        <p className="mt-6 max-w-2xl text-sm text-muted-foreground">{t("cloudUnavailable")}</p>
      </Page>
    );
  },
});
