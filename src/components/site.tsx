import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, X, Heart, User, Search, Compass } from "lucide-react";
import { useI18n, type Key } from "@/lib/i18n";
import { getDivision } from "@/data/divisions";
import type { Category, Destination } from "@/data/destinations";
import { getDestinationPhoto, type DestinationPhoto } from "@/data/destination-photos";
import { useFavourites } from "@/lib/saved";

const NAV: { to: string; k: Key }[] = [
  { to: "/", k: "home" }, { to: "/destinations", k: "explore" }, { to: "/divisions", k: "divisions" },
  { to: "/planner", k: "planner" }, { to: "/map", k: "map" }, { to: "/route-finder", k: "route" }, { to: "/about", k: "about" },
];

const CATEGORY_KEYS: Record<Category, Key> = {
  nature: "natureCategory", beach: "beachCategory", hill: "hillCategory", historical: "historicalCategory",
  religious: "religiousCategory", wildlife: "wildlifeCategory", water: "waterCategory", urban: "urbanCategory",
};

export function LangToggle() {
  const { lang, setLang, t } = useI18n();
  return (
    <button onClick={() => setLang(lang === "en" ? "bn" : "en")} className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted" aria-label={t("switchLanguage")}>
      {lang === "en" ? "বাংলা" : "English"}
    </button>
  );
}

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!overlay) return;
    const updateScrolled = () => setScrolled(window.scrollY > 40);
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, [overlay]);

  const headerClass = overlay
    ? `fixed inset-x-0 top-0 z-50 transition-colors ${scrolled || open ? "glass border-b border-border text-foreground" : "text-forest-foreground"}`
    : "sticky top-0 z-50 glass border-b border-border";

  return (
    <header className={headerClass}>
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-3 sm:gap-4 sm:px-4 md:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-2 font-display text-lg font-semibold sm:text-xl">
          <Compass className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" aria-hidden />
          <span>GHURI</span>
          <span className="hidden font-sans text-[10px] tracking-[0.2em] opacity-70 min-[390px]:inline min-[390px]:text-xs sm:tracking-[0.3em]">BANGLADESH</span>
        </Link>
        <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label={t("mainNavigation")}>
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="rounded-full px-3 py-1.5 text-sm font-medium opacity-85 hover:opacity-100" activeProps={{ className: "rounded-full px-3 py-1.5 text-sm font-semibold underline underline-offset-8 decoration-2" }} activeOptions={{ exact: n.to === "/" }}>
              {t(n.k)}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-2">
          <Link to="/search" aria-label={t("search")} className="rounded-full p-2 hover:bg-muted/30"><Search className="h-5 w-5" /></Link>
          <Link to="/saved" aria-label={t("saved")} className="hidden rounded-full p-2 hover:bg-muted/30 sm:block"><Heart className="h-5 w-5" /></Link>
          <Link to="/profile" aria-label={t("profile")} className="hidden rounded-full p-2 hover:bg-muted/30 sm:block"><User className="h-5 w-5" /></Link>
          <span className="hidden md:inline"><LangToggle /></span>
          <button className="rounded-full p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label={t("menu")} aria-expanded={open} aria-controls="mobile-navigation">{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      {open && (
        <nav id="mobile-navigation" className="max-h-[70svh] overflow-y-auto border-t border-border bg-background px-4 py-3 text-foreground lg:hidden" aria-label={t("mobileNavigation")}>
          {[...NAV, { to: "/budget", k: "budget" as Key }, { to: "/seasons", k: "seasons" as Key }, { to: "/nearby", k: "nearby" as Key }, { to: "/saved", k: "saved" as Key }, { to: "/profile", k: "profile" as Key }, { to: "/contact", k: "contact" as Key }].map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 font-medium hover:bg-muted">{t(n.k)}</Link>
          ))}
          <div className="px-3 pt-2 md:hidden"><LangToggle /></div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  const cols: [Key | null, [string, Key][]][] = [
    ["exploreSection", [["/destinations", "explore"], ["/divisions", "divisions"], ["/seasons", "seasons"], ["/map", "map"]]],
    ["planSection", [["/planner", "planner"], ["/budget", "budget"], ["/route-finder", "route"], ["/nearby", "nearby"]]],
    [null, [["/about", "about"], ["/contact", "contact"], ["/saved", "saved"], ["/profile", "profile"]]],
  ];
  return (
    <footer className="mt-24 bg-forest text-forest-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        <div>
          <p className="font-display text-2xl">GHURI Bangladesh</p>
          <p className="mt-2 text-sm opacity-75">{t("tagline")}</p>
          <p className="mt-4 text-xs opacity-60">{t("footerDisclosure")}</p>
        </div>
        {cols.map(([h, links]) => (
          <div key={h ?? "ghuri"}>
            <p className="text-xs font-semibold uppercase tracking-widest opacity-60">{h ? t(h) : "GHURI"}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {links.map(([to, k]) => <li key={to}><Link to={to} className="opacity-85 hover:opacity-100">{t(k)}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-forest-foreground/15 py-5 text-center text-xs opacity-60">{t("emergencyFooter")} · © 2026 GHURI Bangladesh</div>
    </footer>
  );
}

export function Page({ children, title, kicker, intro }: { children: ReactNode; title?: string; kicker?: string; intro?: string }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pt-10 md:px-8">
        {title && (
          <div className="mb-10 max-w-3xl animate-rise">
            {kicker && <p className="text-xs font-semibold uppercase tracking-[0.25em] text-river">{kicker}</p>}
            <h1 className="mt-2 break-words text-3xl font-semibold sm:text-4xl md:text-5xl">{title}</h1>
            {intro && <p className="mt-4 text-lg text-muted-foreground">{intro}</p>}
          </div>
        )}
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

export function EstimateBadge({ kind = "estimate", children }: { kind?: "estimate" | "live" | "verified" | "unverified"; children?: ReactNode }) {
  const styles = { estimate: "bg-estimate text-forest border-estimate", live: "bg-river/10 text-river border-river/30", verified: "bg-verified/10 text-verified border-verified/30", unverified: "bg-muted text-muted-foreground border-border" };
  const label = { estimate: "estimate", live: "live", verified: "verified", unverified: "notVerified" } as const;
  const { t } = useI18n();
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${styles[kind]}`}>{children ?? t(label[kind])}</span>;
}

export function DestinationPhotoCredit({
  photo,
  className = "",
}: {
  photo: DestinationPhoto;
  className?: string;
}) {
  const { t } = useI18n();
  if (photo.status === "unavailable") {
    return (
      <p className={className}>
        {t("photoUnavailable")}
      </p>
    );
  }

  return (
    <p className={className}>
      {t("photoCredit")}{" "}
      <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
        {photo.fileName} — {photo.creator}
      </a>{" "}
      —{" "}
      <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline">
        {photo.license}
      </a>{" "}
      — {photo.changes}
    </p>
  );
}

export function DestinationCard({ d }: { d: Destination }) {
  const { lang, t } = useI18n();
  const { has, toggle } = useFavourites();
  const div = getDivision(d.division)!;
  const photo = getDestinationPhoto(d);
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:-translate-y-1">
      <figure>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={photo.src}
            alt={photo.status === "available" ? `${d.name} destination photograph` : ""}
            loading="lazy"
            width={1024}
            height={768}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold capitalize">{t(CATEGORY_KEYS[d.category])}</span>
          <button onClick={() => toggle(d.slug)} aria-label={has(d.slug) ? t("removeSaved") : t("saveDestination")} className="absolute right-3 top-3 rounded-full bg-background/90 p-2">
            <Heart className={`h-4 w-4 ${has(d.slug) ? "fill-destructive text-destructive" : ""}`} />
          </button>
        </div>
        <figcaption className="px-5 pt-2 text-[10px] leading-relaxed text-muted-foreground">
          <DestinationPhotoCredit photo={photo} />
        </figcaption>
      </figure>
      <div className="p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{d.district} · {lang === "bn" ? div.bn : div.name}</p>
        <h3 className="mt-1 text-xl font-semibold">{lang === "bn" ? d.bangla_name : d.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{d.description}</p>
        <Link to="/destinations/$slug" params={{ slug: d.slug }} className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline">{t("viewDetails")} →</Link>
      </div>
    </article>
  );
}

export const inputCls = "w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";
export const btnPrimary = "inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50";
export const btnGhost = "inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-muted";
