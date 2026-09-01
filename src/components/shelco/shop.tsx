import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Phone, ShoppingCart } from "lucide-react";
import {
  Reveal,
  SectionHeading,
  Stagger,
  StaggerItem,
} from "@/components/shelco/motion-primitives";
import { CATEGORIES, FREE_SERVICES, PRODUCTS, type ProductCategory } from "@/lib/products-data";
import { useI18n } from "@/i18n";
import { PRIMARY_PHONE, openWhatsApp, waLink } from "@/lib/contact-info";

export function ProductGrid({ limit }: { limit?: number }) {
  const { lang, t } = useI18n();
  const [active, setActive] = useState<ProductCategory | "all">("all");

  const items = useMemo(() => {
    const list = active === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active);
    return limit ? list.slice(0, limit) : list;
  }, [active, limit]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActive("all")}
          className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
            active === "all"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-muted-foreground hover:border-primary/60"
          }`}
        >
          {t("shop.all")}
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setActive(c.key)}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
              active === c.key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/60"
            }`}
          >
            {lang === "sw" ? c.labelSw : c.label}
          </button>
        ))}
      </div>

      <Stagger className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {items.map((p) => (
          <StaggerItem key={p.id}>
            <motion.article
              whileHover={{ y: -4 }}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <div className="aspect-square overflow-hidden bg-white">
                <motion.img
                  src={p.image}
                  alt={`${p.name} — ${p.dims}`}
                  loading="lazy"
                  width={2048}
                  height={2048}
                  className="h-full w-full object-contain p-3"
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className="flex flex-1 flex-col gap-1.5 border-t border-border p-3">
                <h3 className="text-sm font-extrabold leading-tight text-secondary">
                  {lang === "sw" ? p.nameSw : p.name}
                </h3>
                <p className="text-[11px] font-semibold text-muted-foreground">{p.dims}</p>
                <p className="text-[11px] text-muted-foreground">
                  {lang === "sw" ? p.notesSw : p.notes}
                </p>
                <p className="mt-auto pt-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("shop.quote")}
                </p>
                <a
                  href={waLink(
                    `Habari Shelco, I would like a quote for: ${p.name} (${p.dims})`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg brand-gradient px-3 py-2 text-xs font-bold text-primary-foreground shadow-glow active:scale-95"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  {t("shop.order")}
                </a>
              </div>
            </motion.article>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {FREE_SERVICES.map((s) => (
            <li
              key={s.en}
              className="rounded-xl border border-primary/30 bg-primary-soft px-3 py-2.5 text-sm font-bold text-secondary"
            >
              {lang === "sw" ? s.sw : s.en}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}

export function ShopSection() {
  const { t } = useI18n();
  return (
    <section id="shop" className="bg-muted/40 py-10">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow={t("shop.eyebrow")}
          title={t("shop.title")}
          description={t("shop.subtitle")}
        />
        <div className="mt-6">
          <ProductGrid />
        </div>
        <Reveal>
          <a
            href={`tel:${PRIMARY_PHONE.tel}`}
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 font-bold text-secondary"
          >
            <Phone className="h-4 w-4" /> {t("cta.call")}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
