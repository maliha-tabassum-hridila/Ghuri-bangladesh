import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/site";
import { DIVISIONS } from "@/data/divisions";
import { byDivision } from "@/data/destinations";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/divisions/")({
  head: () => ({ meta: [
    { title: "All 8 Divisions of Bangladesh — GHURI" },
    { name: "description", content: "Dhaka, Chattogram, Sylhet, Rajshahi, Khulna, Barishal, Rangpur and Mymensingh — explore each division's destinations." },
    { property: "og:title", content: "Divisions of Bangladesh — GHURI" },
    { property: "og:description", content: "Explore Bangladesh division by division." },
  ] }),
  component: () => {
    const { t, lang } = useI18n();
    return (
      <Page kicker={t("bangladesh")} title={t("eightJourneys")}>
        <div className="grid gap-6 md:grid-cols-2">
          {DIVISIONS.map((d) => (
            <Link key={d.id} to="/divisions/$id" params={{ id: d.id }} className="group grid overflow-hidden rounded-2xl border border-border bg-card sm:grid-cols-2">
              <img src={d.image} alt={`${d.name} division`} loading="lazy" width={1024} height={768} className="aspect-[4/3] h-full w-full object-cover" />
              <div className="p-6">
                <p className="text-xs text-muted-foreground">{byDivision(d.id).length} {t("destinationsCount")}</p>
                <h2 className="mt-1 text-3xl font-semibold">{lang === "bn" ? d.bn : d.name}</h2>
                <p className="mt-2 text-muted-foreground">{lang === "bn" ? d.introBn : d.intro}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-primary group-hover:underline">{t("exploreDivision")} →</span>
              </div>
            </Link>
          ))}
        </div>
      </Page>
    );
  },
});
