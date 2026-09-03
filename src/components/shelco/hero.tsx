import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import heroImg from "@/assets/hero-warehouse.jpg";
import { PRODUCTS } from "@/lib/products-data";
import { openWhatsApp, waLink } from "@/lib/contact-info";
import { useI18n } from "@/i18n";

const SLIDES = PRODUCTS.slice(0, 8);

export function Hero() {
  const { lang, t } = useI18n();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const go = useCallback((step: number) => {
    setDir(step);
    setIndex((i) => (i + step + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setDir(1);
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const item = SLIDES[index]!;
  const name = lang === "sw" ? item.nameSw : item.name;
  const quoteText = `Habari Shelco, I would like a quote for: ${item.name} (${item.dims})`;

  return (
    <section id="top" className="relative overflow-hidden">
      <motion.img
        src={heroImg}
        alt={t("hero.imgAlt")}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        width={1440}
        height={1026}
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
      />
      <div className="absolute inset-0 steel-gradient opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,transparent,oklch(0.2_0.03_263/0.85))]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 pb-10 pt-10 sm:pb-16 sm:pt-16 lg:grid-cols-2 lg:gap-12">
        <div className="max-w-xl text-center text-steel-foreground lg:text-left">

          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary-foreground"
          >
            {t("hero.badge")}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 text-balance-tight text-4xl font-extrabold leading-[1.02] sm:text-5xl lg:text-6xl"
          >
            {t("hero.title1")}
            <span className="block bg-clip-text text-transparent brand-gradient">
              {t("hero.title2")}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-steel-foreground/80 sm:text-lg lg:mx-0"
          >
            {t("hero.sub")}
          </motion.p>


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36 }}
            className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start"
          >

            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg brand-gradient px-5 py-3 font-bold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 active:scale-95"
            >
              {t("hero.cta")} <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#shop"
              className="inline-flex items-center gap-2 rounded-lg border border-steel-foreground/30 px-5 py-3 font-bold text-steel-foreground transition-colors hover:border-primary"
            >
              {t("shop.title")}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto w-full max-w-xl rounded-2xl border border-border/40 bg-card/95 p-3 shadow-lift backdrop-blur sm:p-5"
        >

          <div className="relative overflow-hidden rounded-xl bg-white">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.img
                key={item.id}
                src={item.image}
                alt={`${item.name} — ${item.dims}`}
                decoding="async"
                width={1024}
                height={1024}
                initial={{ opacity: 0, x: dir * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -40 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto h-52 w-full object-contain p-3 sm:h-72"
              />
            </AnimatePresence>

            <button
              type="button"
              aria-label="Previous product"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-border bg-card/90 text-secondary shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next product"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-border bg-card/90 text-secondary shadow-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-base font-extrabold text-secondary sm:text-lg">{name}</h2>
              <p className="text-xs font-semibold text-muted-foreground">{item.dims}</p>
            </div>
            <a
              href={waLink(quoteText)}
              onClick={(e) => openWhatsApp(e, quoteText)}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-lg brand-gradient px-3 py-2 text-xs font-bold text-primary-foreground shadow-glow active:scale-95"
            >
              {t("shop.order")}
            </a>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={s.name}
                onClick={() => {
                  setDir(i > index ? 1 : -1);
                  setIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-7 bg-primary" : "w-3 bg-border"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
