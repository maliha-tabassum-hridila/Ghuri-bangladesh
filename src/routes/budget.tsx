import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Page, inputCls } from "@/components/site";
import { BudgetPanel } from "@/components/BudgetPanel";
import type { Style } from "@/lib/budget";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/budget")({
  head: () => ({ meta: [
    { title: "Trip Budget Calculator (BDT) — GHURI Bangladesh" },
    { name: "description", content: "Calculate group and per-person trip costs in Taka with editable prices and room sharing." },
    { property: "og:title", content: "Trip Budget Calculator — GHURI" },
    { property: "og:description", content: "Group and per-person travel costs for Bangladesh trips." },
  ] }),
  component: () => {
    const { t } = useI18n();
    const [travellers, setTravellers] = useState(4);
    const [days, setDays] = useState(3);
    const [sites, setSites] = useState(4);
    const [style, setStyle] = useState<Style>("standard");
    return (
      <Page kicker={t("calculator")} title={t("tripBudgetCalculator")} intro={t("calculatorIntro")}>
        <div className="mb-6 grid max-w-md grid-cols-2 gap-3">
          <label className="text-xs font-semibold">{t("daysInput")}<input type="number" min={1} max={30} value={days} onChange={(e) => setDays(Math.max(1, Math.min(30, Number(e.target.value) || 1)))} className={`${inputCls} mt-1`} /></label>
          <label className="text-xs font-semibold">{t("sitesWithTickets")}<input type="number" min={0} max={40} value={sites} onChange={(e) => setSites(Math.max(0, Number(e.target.value) || 0))} className={`${inputCls} mt-1`} /></label>
        </div>
        <BudgetPanel travellers={travellers} setTravellers={setTravellers} days={days} nights={days - 1} sites={sites} transportGroupTotal={8000} style={style} setStyle={setStyle} />
      </Page>
    );
  },
});
