import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Ruler } from "lucide-react";
import heroImg from "@/assets/hero-warehouse.jpg";
import {
  SYSTEMS,
  calculateCapacity,
  formatNumber,
  formatTzs,
  type SystemKey,
} from "@/lib/calculators";
import { useI18n } from "@/i18n";
import { CountUp } from "./motion-primitives";

type Props = { onCapacityChange?: (positions: number) => void };

export function Hero({ onCapacityChange }: Props) {
  const { t } = useI18n();
  const sysLabel = (key: SystemKey) =>
    key === "pallet"
      ? t("calc.sys.pallet")
      : key === "gondola"
        ? t("calc.sys.gondola")
        : t("calc.sys.boltless");
  const [length, setLength] = useState(40);
  const [width, setWidth] = useState(20);
  const [height, setHeight] = useState(8);
  const [aisle, setAisle] = useState(3);
  const [system, setSystem] = useState<SystemKey>("pallet");

  const result = useMemo(
    () => calculateCapacity({ length, width, height, aisleWidth: aisle, system }),
    [length, width, height, aisle, system],
  );

  const spec = SYSTEMS.find((s) => s.key === system) ?? SYSTEMS[0];

  useEffect(() => {
    onCapacityChange?.(result.positions);
  }, [result.positions, onCapacityChange]);

  const fields = [
    { label: t("calc.length"), value: length, set: setLength, step: 1 },
    { label: t("calc.width"), value: width, set: setWidth, step: 1 },
    { label: t("calc.height"), value: height, set: setHeight, step: 0.5 },
    { label: t("calc.aisle"), value: aisle, set: setAisle, step: 0.1 },
  ];


  return (
    <section id="top" className="relative overflow-hidden">
      <motion.img
        src={heroImg}
        alt={t("hero.imgAlt")}
        className="absolute inset-0 h-full w-full object-cover"
        width={1440}
        height={1026}
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
      />
      <div className="absolute inset-0 steel-gradient opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,transparent,oklch(0.2_0.03_263/0.85))]" />

      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-12 sm:pb-20 sm:pt-16 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
        <div className="text-steel-foreground">
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
            className="mt-4 max-w-xl text-base leading-relaxed text-steel-foreground/80 sm:text-lg"
          >
            {t("hero.sub")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36 }}
            className="mt-6 flex flex-wrap gap-3"
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg brand-gradient px-5 py-3 font-bold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 active:scale-95"
            >
              {t("hero.cta")} <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 rounded-2xl border border-border/40 bg-card/95 p-4 shadow-lift backdrop-blur sm:p-6 lg:mt-0"
        >
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg brand-gradient text-primary-foreground">
              <Ruler className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-extrabold">{t("calc.title")}</h2>
              <p className="text-xs text-muted-foreground">{t("calc.subtitle")}</p>

            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {SYSTEMS.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setSystem(s.key)}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                  system === s.key
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/60"
                }`}
              >
                {sysLabel(s.key)}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {fields.map((f) => (
              <label key={f.label} className="block">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {f.label}
                </span>
                <input
                  type="number"
                  min={0}
                  step={f.step}
                  value={f.value}
                  onChange={(e) => f.set(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-base font-semibold outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
                />
              </label>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <ResultTile label={t("calc.units")} value={result.bays} highlight />
            <ResultTile label={t("calc.positions")} value={result.positions} />
            <ResultTile label={t("calc.levels")} value={result.levels} />
            <ResultTile label={t("calc.load")} value={result.totalLoadKg} />
          </div>

          <div className="mt-3 rounded-xl border border-primary/40 bg-primary-soft px-3 py-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              {t("calc.price")}
            </p>
            <p className="font-display text-xl font-extrabold text-primary">
              {formatTzs(result.totalPrice)}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {result.bays} × {sysLabel(spec.key)} — {formatTzs(spec.pricePerBay)} {t("shop.vat")}
            </p>
          </div>

          <p className="mt-4 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">

            {t("calc.footnote", {
              area: formatNumber(result.floorArea),
              util: formatNumber(result.utilisation, 1),
              rows: formatNumber(result.rows),
            })}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function ResultTile({
  label,
  value,
  decimals = 0,
  highlight,
}: {
  label: string;
  value: number;
  decimals?: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        highlight
          ? "border-primary/40 bg-primary-soft"
          : "border-border bg-background"
      }`}
    >
      <div className="font-display text-2xl font-extrabold leading-none text-primary">
        <CountUp value={value} decimals={decimals} />
      </div>
      <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
