import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Page, inputCls, btnPrimary } from "@/components/site";
import { useI18n } from "@/lib/i18n";

const schema = z.object({ name: z.string().trim().min(1).max(80), email: z.string().trim().email().max(200), message: z.string().trim().min(10).max(2000) });

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact & Feedback — GHURI Bangladesh" },
    { name: "description", content: "Send feedback or correct destination information." },
    { property: "og:title", content: "Contact — GHURI" },
    { property: "og:description", content: "Feedback and corrections." },
  ] }),
  component: () => {
    const { t } = useI18n();
    const [f, setF] = useState({ name: "", email: "", message: "" });
    const [err, setErr] = useState<Record<string, string>>({});
    const [ok, setOk] = useState(false);
    const submit = (e: React.FormEvent) => {
      e.preventDefault();
      const r = schema.safeParse(f);
      if (!r.success) {
        setErr(Object.fromEntries(r.error.issues.map((i) => {
          const field = String(i.path[0]);
          const message = field === "name"
            ? i.code === "too_small" ? t("nameRequired") : t("maxLength", { count: 80 })
            : field === "email"
              ? i.code === "too_big" ? t("maxLength", { count: 200 }) : t("validEmail")
              : i.code === "too_small" ? t("minMessage") : t("maxLength", { count: 2000 });
          return [field, message];
        })));
        return;
      }
      setErr({});
      window.location.href = `mailto:feedback@ghuri.example?subject=${encodeURIComponent(t("feedbackSubject", { name: r.data.name }))}&body=${encodeURIComponent(`${r.data.message}\n\n${t("replyTo")}: ${r.data.email}`)}`;
      setOk(true);
    };
    return (
      <Page kicker={t("contact")} title={t("feedbackCorrections")} intro={t("contactIntro")}>
        <form onSubmit={submit} className="max-w-xl space-y-4" noValidate>
          {(["name", "email"] as const).map((k) => <label key={k} className="block text-sm font-semibold capitalize">{t(k)}<input type={k === "email" ? "email" : "text"} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className={`${inputCls} mt-1`} />{err[k] && <span className="text-xs text-destructive">{err[k]}</span>}</label>)}
          <label className="block text-sm font-semibold">{t("message")}<textarea rows={6} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} className={`${inputCls} mt-1`} />{err.message && <span className="text-xs text-destructive">{err.message}</span>}</label>
          <button className={btnPrimary}>{t("send")}</button>
          {ok && <p className="text-sm text-verified">{t("emailReady")}</p>}
        </form>
      </Page>
    );
  },
});
