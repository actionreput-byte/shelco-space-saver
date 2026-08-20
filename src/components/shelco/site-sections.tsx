import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import QRCode from "qrcode";
import logoAsset from "@/assets/shelco-logo.asset.json";
import { useI18n } from "@/i18n";
import { SERVICES } from "@/lib/services-data";
import { BLOG_POSTS } from "@/lib/blog-data";
import { ADDRESS_LINE, EMAILS, PHONES } from "@/lib/contact-info";
import { CountUp, Reveal } from "./motion-primitives";

const SITE = "https://shelco-space-wizard.lovable.app";

const STATS = [
  { value: 420, suffix: "+", key: "stats.installs" },
  { value: 38000, suffix: "+", key: "stats.positions" },
  { value: 12, suffix: "", key: "stats.years" },
  { value: 94, suffix: "%", key: "stats.repeat" },
] as const;

const MARQUEE = [
  "sector.warehousing",
  "sector.supermarkets",
  "sector.pharma",
  "sector.spares",
  "sector.logistics",
  "sector.manufacturing",
  "sector.cold",
  "sector.hardware",
] as const;

export function StatsStrip() {
  const { t } = useI18n();
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.key} delay={i * 0.08}>
            <div>
              <div className="font-display text-3xl font-extrabold text-primary sm:text-4xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t(s.key)}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function SectorMarquee() {
  const { t } = useI18n();
  return (
    <div className="overflow-hidden border-y border-border bg-muted/60 py-3">
      <div className="marquee-track flex w-max gap-8 whitespace-nowrap">
        {[...MARQUEE, ...MARQUEE].map((m, i) => (
          <span
            key={`${m}-${i}`}
            className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground"
          >
            {t(m)}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    const target = window.location.origin || SITE;
    void QRCode.toDataURL(target, {
      width: 320,
      margin: 1,
      color: { dark: "#1f2a44", light: "#ffffff" },
    }).then(setQr);
  }, []);

  return (
    <footer className="steel-gradient text-steel-foreground">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <img
            src={logoAsset.url}
            alt="Shelco Storage Systems"
            loading="lazy"
            width={220}
            height={64}
            className="h-10 w-auto rounded bg-background p-1"
          />
          <p className="mt-3 text-sm text-steel-foreground/75">{t("footer.tagline")}</p>
        </div>
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider">
            {t("footer.explore")}
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-steel-foreground/80">
            <li><a className="hover:text-primary" href="/#about">{t("nav.about")}</a></li>
            <li><Link className="hover:text-primary" to="/services">{t("nav.services")}</Link></li>
            <li><Link className="hover:text-primary" to="/shop">{t("nav.shop")}</Link></li>
            <li><a className="hover:text-primary" href="/#portfolio">{t("nav.projects")}</a></li>
            <li><Link className="hover:text-primary" to="/blog">{t("nav.insights")}</Link></li>
            <li><Link className="hover:text-primary" to="/get-app">{t("nav.getApp")}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider">
            {t("nav.services")}
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-steel-foreground/80">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link className="hover:text-primary" to="/services/$slug" params={{ slug: s.slug }}>
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
          <h3 className="mt-5 text-sm font-extrabold uppercase tracking-wider">
            {t("nav.insights")}
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-steel-foreground/80">
            {BLOG_POSTS.map((p) => (
              <li key={p.slug}>
                <Link className="hover:text-primary" to="/blog/$slug" params={{ slug: p.slug }}>
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider">
            {t("footer.contact")}
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-steel-foreground/80">
            <li>{ADDRESS_LINE}</li>
            {PHONES.map((p) => (
              <li key={p.tel}>
                <a className="hover:text-primary" href={`tel:${p.tel}`}>{p.display}</a>
              </li>
            ))}
            {EMAILS.map((email) => (
              <li key={email} className="break-words">
                <a className="hover:text-primary" href={`mailto:${email}`}>{email}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider">{t("footer.qr")}</h3>
          <div className="mt-3 flex items-center gap-3">
            <div className="rounded-xl bg-background p-2">
              {qr ? (
                <img
                  src={qr}
                  alt={t("footer.qrHint")}
                  width={104}
                  height={104}
                  className="h-[104px] w-[104px]"
                />
              ) : (
                <div className="h-[104px] w-[104px] animate-pulse rounded-lg bg-muted" />
              )}
            </div>
            <div className="min-w-0 text-sm text-steel-foreground/80">
              <p>{t("footer.qrHint")}</p>
              <Link to="/get-app" className="mt-2 inline-block font-bold text-primary hover:underline">
                {t("footer.qrLink")}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-steel-foreground/15 px-4 py-4 text-center text-xs text-steel-foreground/60">
        © {new Date().getFullYear()} Shelco Storage Systems Ltd. {t("footer.rights")}
      </div>
    </footer>
  );
}
