import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Reveals once the element enters the viewport — and immediately if it has
 * already been scrolled past (fast mobile scrolling used to leave content
 * stuck at opacity 0).
 */
function useRevealed<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting || e.boundingClientRect.bottom < 0) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0 },
    );
    io.observe(el);
    const safety = window.setTimeout(() => setShown(true), 6000);
    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, []);

  return { ref, shown };
}

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const { ref, shown } = useRevealed<HTMLDivElement>();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { ref, shown } = useRevealed<HTMLDivElement>();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={shown ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 28, scale: 0.98 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.4 });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 90, damping: 20, mass: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);

  useEffect(() => spring.on("change", (v) => setDisplay(v)), [spring]);

  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(display);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export function SocialProofStrip({
  quote,
  metric,
  metricLabel,
}: {
  quote: string;
  metric: string;
  metricLabel: string;
}) {
  return (
    <Reveal className="px-4">
      <div className="mx-auto flex max-w-5xl grid-cols-[minmax(0,1fr)_auto] flex-col items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-lift sm:grid sm:items-center sm:gap-6 sm:p-5">
        <p className="min-w-0 text-sm leading-snug text-muted-foreground">
          <span className="mr-2 inline-block h-2 w-2 shrink-0 rounded-full bg-primary align-middle" />
          {quote}
        </p>
        <div className="shrink-0 text-left sm:text-right">
          <div className="font-display text-2xl font-extrabold text-primary">
            {metric}
          </div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {metricLabel}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal
      className={cn("mb-8", align === "center" && "text-center mx-auto max-w-2xl")}
    >
      <span className="inline-flex items-center rounded-full bg-primary-soft px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-accent-foreground">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-balance-tight text-3xl font-extrabold leading-[1.05] sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
