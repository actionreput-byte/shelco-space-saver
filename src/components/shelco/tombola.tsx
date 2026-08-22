import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Gift, Sparkles, Ticket } from "lucide-react";
import { waLink } from "@/lib/contact-info";
import { Reveal } from "@/components/shelco/motion-primitives";

type Prize = {
  label: string;
  code: string;
  fill: string;
  text: string;
};

const PRIZES: Prize[] = [
  { label: "5% OFF", code: "SHELCO5", fill: "var(--wheel-a)", text: "var(--wheel-on-dark)" },
  { label: "FREE DELIVERY", code: "SHELCOFD", fill: "var(--wheel-b)", text: "var(--wheel-on-light)" },
  { label: "10% OFF", code: "SHELCO10", fill: "var(--wheel-c)", text: "var(--wheel-on-dark)" },
  { label: "FREE SURVEY", code: "SHELCOFS", fill: "var(--wheel-d)", text: "var(--wheel-on-light)" },
  { label: "7% OFF", code: "SHELCO7", fill: "var(--wheel-a)", text: "var(--wheel-on-dark)" },
  { label: "FREE FITTING", code: "SHELCOFI", fill: "var(--wheel-b)", text: "var(--wheel-on-light)" },
  { label: "15% OFF", code: "SHELCO15", fill: "var(--wheel-c)", text: "var(--wheel-on-dark)" },
  { label: "BONUS SHELF", code: "SHELCOBS", fill: "var(--wheel-d)", text: "var(--wheel-on-light)" },
];

const SEG = 360 / PRIZES.length;
const STORAGE_KEY = "shelco-tombola-prize";

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const;
}

function slicePath(index: number) {
  const start = index * SEG;
  const end = start + SEG;
  const [x1, y1] = polar(100, 100, 96, start);
  const [x2, y2] = polar(100, 100, 96, end);
  return `M100 100 L${x1} ${y1} A96 96 0 0 1 ${x2} ${y2} Z`;
}

export function Tombola() {
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState<Prize | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      const found = PRIZES.find((p) => p.code === saved);
      if (found) {
        setPrize(found);
        setAngle(360 - (PRIZES.indexOf(found) * SEG + SEG / 2));
      }
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const spin = useCallback(() => {
    if (spinning || prize) return;
    setSpinning(true);
    const index = Math.floor(Math.random() * PRIZES.length);
    const target = 360 * 6 + (360 - (index * SEG + SEG / 2));
    setAngle(target);
    timer.current = setTimeout(() => {
      const won = PRIZES[index]!;
      setPrize(won);
      setSpinning(false);
      try {
        window.localStorage.setItem(STORAGE_KEY, won.code);
      } catch {
        /* ignore */
      }
    }, 4600);
  }, [prize, spinning]);

  return (
    <section id="tombola" className="tombola-stage relative overflow-hidden py-16">
      <div className="tombola-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
        <Reveal>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Tombola
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight text-steel-foreground sm:text-4xl">
              Roue de la Fortune — spin &amp; win your discount
            </h2>
            <p className="mt-3 max-w-md text-sm text-steel-foreground/75">
              One free spin per visitor. Win a discount ticket, free delivery, a free site survey or
              free installation on your next racking or shelving order in Dar es Salaam.
            </p>

            {prize ? (
              <div className="mt-6 rounded-2xl border border-primary/40 bg-primary/10 p-5 backdrop-blur">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                  <Ticket className="h-4 w-4" /> Your ticket
                </p>
                <p className="mt-2 font-display text-3xl font-extrabold text-steel-foreground">
                  {prize.label}
                </p>
                <p className="mt-1 text-sm text-steel-foreground/70">
                  Code <span className="font-bold text-primary">{prize.code}</span> — quote it when
                  you request your quotation.
                </p>
                <a
                  href={waLink(
                    `Habari Shelco! I won "${prize.label}" on the tombola (code ${prize.code}). I would like a quotation.`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl brand-gradient px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow active:scale-95"
                >
                  <Gift className="h-4 w-4" /> Claim on WhatsApp
                </a>
              </div>
            ) : (
              <button
                type="button"
                onClick={spin}
                disabled={spinning}
                className="mt-6 inline-flex items-center gap-2 rounded-xl brand-gradient px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow transition active:scale-95 disabled:opacity-70"
              >
                <Sparkles className="h-4 w-4" />
                {spinning ? "Spinning…" : "Spin the wheel"}
              </button>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1">
              <div className="h-0 w-0 border-x-[14px] border-t-[24px] border-x-transparent border-t-primary drop-shadow" />
            </div>
            <motion.div
              animate={{ rotate: angle }}
              transition={{ duration: 4.6, ease: [0.17, 0.85, 0.25, 1] }}
              className="wheel-ring rounded-full p-2"
            >
              <svg viewBox="0 0 200 200" className="h-full w-full">
                {PRIZES.map((p, i) => (
                  <g key={p.code}>
                    <path d={slicePath(i)} fill={p.fill} stroke="var(--wheel-edge)" strokeWidth="0.8" />
                    <text
                      x="100"
                      y="100"
                      fill={p.text}
                      fontSize="8.5"
                      fontWeight="800"
                      textAnchor="middle"
                      transform={`rotate(${i * SEG + SEG / 2} 100 100) translate(0 -55)`}
                    >
                      {p.label}
                    </text>
                  </g>
                ))}
                <circle cx="100" cy="100" r="14" fill="var(--wheel-hub)" stroke="var(--wheel-edge)" strokeWidth="1.5" />
              </svg>
            </motion.div>
            <button
              type="button"
              onClick={spin}
              disabled={spinning || !!prize}
              aria-label="Spin the wheel"
              className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full brand-gradient text-[10px] font-extrabold uppercase tracking-wide text-primary-foreground shadow-glow disabled:opacity-70"
            >
              Spin
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
