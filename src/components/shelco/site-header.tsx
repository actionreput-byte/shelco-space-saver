import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { LogIn, Menu, Phone, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logoAsset from "@/assets/shelco-logo.asset.json";

const NAV = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "ROI", href: "#roi" },
  { label: "Projects", href: "#portfolio" },
  { label: "Insights", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
        <a href="#top" className="flex min-w-0 items-center">
          <img
            src={logoAsset.url}
            alt="Shelco Storage Systems logo"
            className="h-9 w-auto sm:h-11"
            width={220}
            height={64}
          />
        </a>

        <div className="flex shrink-0 items-center gap-2">
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-foreground/80 transition-colors hover:text-primary"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <Link
            to={user ? "/app" : "/auth"}
            className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-bold text-secondary transition-colors hover:border-primary hover:text-primary sm:inline-flex"
          >
            <LogIn className="h-4 w-4" />
            {user ? "My dashboard" : "Client portal"}
          </Link>
          <a
            href="tel:+255767224466"
            className="inline-flex items-center gap-2 rounded-lg brand-gradient px-3 py-2 text-sm font-bold text-primary-foreground shadow-glow transition-transform active:scale-95"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Call us</span>
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
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
