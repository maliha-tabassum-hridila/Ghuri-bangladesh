import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/site";
import { DIVISIONS } from "@/data/divisions";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About Bangladesh & GHURI — Travel Guide" },
    { name: "description", content: "Key facts about Bangladesh for travellers and how GHURI sources its information." },
    { property: "og:title", content: "About Bangladesh — GHURI" },
    { property: "og:description", content: "Travel facts and our data sources." },
  ] }),
  component: () => {
    const { t } = useI18n();
    return <Page kicker={t("about")} title={t("aboutTitle")} intro={t("aboutPageIntro")}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[[t("capital"), "Dhaka"], [t("currency"), "Bangladeshi Taka (৳ BDT)"], [t("language"), "Bangla (Bengali)"], [t("divisions"), String(DIVISIONS.length)], [t("emergency"), "999"], [t("timeZone"), "UTC+6"], [t("unescoSites"), "Sundarbans, Bagerhat, Paharpur"], [t("plug"), "Type C / D / G, 220V"]].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-border bg-card p-5"><p className="text-xs uppercase text-muted-foreground">{k}</p><p className="mt-1 text-lg font-semibold">{v}</p></div>
        ))}
      </div>
      <section className="mt-12 max-w-3xl space-y-4">
        <h2 className="text-3xl font-semibold">{t("informationPolicy")}</h2>
        <p className="text-muted-foreground">{t("aboutDataPolicy")}</p>
        <p className="text-muted-foreground">{t("usefulOfficialLinks")} <a className="text-river underline" href="https://tourismboard.gov.bd" target="_blank" rel="noopener noreferrer">Bangladesh Tourism Board</a>, <a className="text-river underline" href="https://parjatan.gov.bd" target="_blank" rel="noopener noreferrer">Parjatan Corporation</a>, <a className="text-river underline" href="https://railway.gov.bd" target="_blank" rel="noopener noreferrer">Bangladesh Railway</a>.</p>
        <Link to="/contact" className="font-semibold text-primary underline">{t("reportCorrection")} →</Link>
      </section>
    </Page>;
  },
});
