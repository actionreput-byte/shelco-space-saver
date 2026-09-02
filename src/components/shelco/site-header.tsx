import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Globe, LogIn, Menu, Phone, Smartphone, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n";
import { SERVICES } from "@/lib/services-data";
import { PRIMARY_PHONE } from "@/lib/contact-info";
import logoAsset from "@/assets/shelco-logo.png.asset.json";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { user } = useAuth();
  const { lang, setLang, t } = useI18n();

  const NAV = [
    { label: t("nav.shop"), href: "/shop" },
    { label: t("nav.about"), href: "/#about" },
    { label: t("nav.roi"), href: "/#roi" },
    { label: t("nav.projects"), href: "/#portfolio" },
    { label: t("nav.insights"), href: "/blog" },
    { label: t("nav.contact"), href: "/#contact" },
  ];


  const LangToggle = ({ className = "" }: { className?: string }) => (
    <button
      type="button"
      onClick={() => setLang(lang === "en" ? "sw" : "en")}
      aria-label="Switch language"
      className={`inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-2 text-xs font-bold uppercase text-secondary transition-colors hover:border-primary hover:text-primary ${className}`}
    >
      <Globe className="h-4 w-4" />
      {lang === "en" ? "EN" : "SW"}
    </button>
  );

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
        <Link to="/" className="flex min-w-0 items-center">
          <img
            src={logoAsset.url}
            alt="Shelco Storage Systems logo"
            className="h-9 w-auto sm:h-11"
            width={220}
            height={64}
          />
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <nav className="hidden items-center gap-6 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <Link
                to="/services"
                className="inline-flex items-center gap-1 text-sm font-semibold text-foreground/80 transition-colors hover:text-primary"
              >
                {t("nav.services")}
                <ChevronDown className="h-4 w-4" />
              </Link>
              <AnimatePresence>
                {servicesOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-full w-64 rounded-xl border border-border bg-card p-2 shadow-xl"
                  >
                    <Link
                      to="/services"
                      className="block rounded-lg px-3 py-2 text-sm font-bold text-primary hover:bg-muted"
                    >
                      {t("nav.allServices")}
                    </Link>
                    {SERVICES.map((service) => (
                      <Link
                        key={service.slug}
                        to="/services/$slug"
                        params={{ slug: service.slug }}
                        className="block rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted hover:text-primary"
                      >
                        {service.name}
                      </Link>
                    ))}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-foreground/80 transition-colors hover:text-primary"
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/get-app"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/80 transition-colors hover:text-primary"
            >
              <Smartphone className="h-4 w-4" />
              {t("nav.getApp")}
            </Link>
          </nav>
          <LangToggle />
          <Link
            to={user ? "/app" : "/auth"}
            className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-bold text-secondary transition-colors hover:border-primary hover:text-primary sm:inline-flex"
          >
            <LogIn className="h-4 w-4" />
            {user ? t("cta.dashboard") : t("cta.portal")}
          </Link>
          <a
            href={`tel:${PRIMARY_PHONE.tel}`}
            className="inline-flex items-center gap-2 rounded-lg brand-gradient px-3 py-2 text-sm font-bold text-primary-foreground shadow-glow transition-transform active:scale-95"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">{t("cta.call")}</span>
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-secondary lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border bg-card lg:hidden"
          >
            <ul className="mx-auto max-w-6xl px-4 py-2">
              <li>
                <button
                  type="button"
                  onClick={() => setServicesOpen((v) => !v)}
                  className="flex w-full items-center justify-between border-b border-border/60 py-3 font-semibold text-foreground"
                >
                  {t("nav.services")}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {servicesOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <Link
                        to="/services"
                        onClick={() => setOpen(false)}
                        className="block border-b border-border/40 py-2.5 pl-3 text-sm font-bold text-primary"
                      >
                        {t("nav.allServices")}
                      </Link>
                      {SERVICES.map((service) => (
                        <Link
                          key={service.slug}
                          to="/services/$slug"
                          params={{ slug: service.slug }}
                          onClick={() => setOpen(false)}
                          className="block border-b border-border/40 py-2.5 pl-3 text-sm font-semibold text-foreground"
                        >
                          {service.name}
                        </Link>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
              {NAV.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-border/60 py-3 font-semibold text-foreground"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
              <li>
                <Link
                  to="/get-app"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 border-b border-border/60 py-3 font-semibold text-foreground"
                >
                  <Smartphone className="h-4 w-4" />
                  {t("nav.getApp")}
                </Link>
              </li>
              <li className="grid grid-cols-2 gap-2 py-3">
                <Link
                  to={user ? "/app" : "/auth"}
                  onClick={() => setOpen(false)}
                  className="rounded-lg brand-gradient px-3 py-2.5 text-center text-sm font-bold text-primary-foreground"
                >
                  {user ? t("cta.dashboard") : t("cta.portal")}
                </Link>
                <Link
                  to="/auth"
                  search={{ mode: "staff" }}
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-border px-3 py-2.5 text-center text-sm font-bold text-secondary"
                >
                  {t("cta.staff")}
                </Link>
              </li>
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
