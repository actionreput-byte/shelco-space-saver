import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Gift, Sparkles, Ticket } from "lucide-react";
import { openWhatsApp, waLink } from "@/lib/contact-info";
import { Reveal } from "@/components/shelco/motion-primitives";

type Prize = {
  label: string;
  code: string;
  fill: string;
  text: string;
  /** Display-only segments can never be won. */
  winnable: boolean;
};

const PRIZES: Prize[] = [
  { label: "FREE DELIVERY", code: "SHELCOFD", fill: "var(--wheel-a)", text: "var(--wheel-on-dark)", winnable: true },
  { label: "5% OFF", code: "SHELCO5", fill: "var(--wheel-b)", text: "var(--wheel-on-light)", winnable: false },
  { label: "FREE SURVEY", code: "SHELCOFS", fill: "var(--wheel-a)", text: "var(--wheel-on-dark)", winnable: true },
  { label: "FREE FITTING", code: "SHELCOFI", fill: "var(--wheel-b)", text: "var(--wheel-on-light)", winnable: true },
  { label: "5% OFF", code: "SHELCO5B", fill: "var(--wheel-a)", text: "var(--wheel-on-dark)", winnable: false },
  { label: "FREE SHIPPING", code: "SHELCOSH", fill: "var(--wheel-b)", text: "var(--wheel-on-light)", winnable: true },
  { label: "FREE LAYOUT", code: "SHELCOLP", fill: "var(--wheel-a)", text: "var(--wheel-on-dark)", winnable: true },
  { label: "FREE ASSEMBLY", code: "SHELCOFA", fill: "var(--wheel-b)", text: "var(--wheel-on-light)", winnable: true },
];


const WINNABLE = PRIZES.map((p, i) => ({ p, i })).filter(({ p }) => p.winnable);

const SEG = 360 / PRIZES.length;
const STORAGE_KEY = "shelco-tombola-prize";

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const;
}

function slicePath(index: number) {
  const start = index * SEG;
  const end = start + SEG;
  const [x1, y1] = polar(100, 100, 92, start);
  const [x2, y2] = polar(100, 100, 92, end);
  return `M100 100 L${x1} ${y1} A92 92 0 0 1 ${x2} ${y2} Z`;
}

const BULBS = Array.from({ length: 16 }, (_, i) => polar(100, 100, 97, (360 / 16) * i));

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
    const pick = WINNABLE[Math.floor(Math.random() * WINNABLE.length)]!;
    const target = 360 * 6 + (360 - (pick.i * SEG + SEG / 2));
    setAngle(target);
    timer.current = setTimeout(() => {
      setPrize(pick.p);
      setSpinning(false);
      try {
        window.localStorage.setItem(STORAGE_KEY, pick.p.code);
      } catch {
        /* ignore */
      }
    }, 4600);
  }, [prize, spinning]);

  return (
    <section id="tombola" className="tombola-stage relative overflow-hidden py-20">
      <div className="tombola-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
        <Reveal>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Roue de la Fortune
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight text-steel-foreground sm:text-4xl">
              Spin &amp; win a free service on your next project
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-steel-foreground/75">
              One free spin per visitor. Every ticket is a complimentary service — free delivery,
              free shipping, a free site survey, free layout plan, free fitting or free assembly on
              your racking and shelving order in Dar es Salaam.
            </p>

            {prize ? (
              <div className="mt-7 overflow-hidden rounded-2xl border border-primary/40 bg-white/5 p-6 backdrop-blur-md">
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                  <Ticket className="h-4 w-4" /> Your winning ticket
                </p>
                <p className="mt-3 font-display text-3xl font-extrabold text-steel-foreground">
                  {prize.label}
                </p>
                <p className="mt-2 text-sm text-steel-foreground/70">
                  Code{" "}
                  <span className="rounded-md bg-primary/15 px-2 py-0.5 font-bold text-primary">
                    {prize.code}
                  </span>{" "}
                  — quote it when you request your quotation.
                </p>
                <a
                  href={waLink(
                    `Habari Shelco! I won "${prize.label}" on the tombola (code ${prize.code}). I would like a quotation.`,
                  )}
                  onClick={(e) =>
                    openWhatsApp(
                      e,
                      `Habari Shelco! I won "${prize.label}" on the tombola (code ${prize.code}). I would like a quotation.`,
                    )
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl brand-gradient px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow active:scale-95"
                >
                  <Gift className="h-4 w-4" /> Claim on WhatsApp
                </a>
              </div>
            ) : (
              <button
                type="button"
                onClick={spin}
                disabled={spinning}
                className="mt-7 inline-flex items-center gap-2 rounded-xl brand-gradient px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition active:scale-95 disabled:opacity-70"
              >
                <Sparkles className="h-4 w-4" />
                {spinning ? "Spinning…" : "Spin the wheel"}
              </button>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-2">
              <div className="h-0 w-0 border-x-[13px] border-t-[26px] border-x-transparent border-t-primary drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)]" />
            </div>
            <motion.div
              animate={{ rotate: angle }}
              transition={{ duration: 4.6, ease: [0.17, 0.85, 0.25, 1] }}
              className="wheel-ring rounded-full p-2.5"
            >
              <svg viewBox="0 0 200 200" className="h-full w-full">
                <defs>
                  <radialGradient id="wheelSheen" cx="35%" cy="25%" r="75%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
                    <stop offset="55%" stopColor="#fff" stopOpacity="0.04" />
                    <stop offset="100%" stopColor="#000" stopOpacity="0.28" />
                  </radialGradient>
                  <radialGradient id="hubSheen" cx="35%" cy="28%" r="70%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {PRIZES.map((p, i) => {
                  const a = i * SEG + SEG / 2;
                  const [tx, ty] = polar(100, 100, 58, a);
                  const rot = a > 90 && a < 270 ? a + 180 : a;
                  return (
                    <g key={p.code}>
                      <path
                        d={slicePath(i)}
                        fill={p.fill}
                        stroke="var(--wheel-edge)"
                        strokeWidth="0.7"
                      />
                      <text
                        x={tx}
                        y={ty}
                        fill={p.text}
                        fontSize="7.4"
                        fontWeight="800"
                        letterSpacing="0.4"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${rot} ${tx} ${ty})`}
                      >
                        {p.label}
                      </text>
                    </g>
                  );
                })}

                <circle cx="100" cy="100" r="92" fill="url(#wheelSheen)" pointerEvents="none" />
                <circle
                  cx="100"
                  cy="100"
                  r="92"
                  fill="none"
                  stroke="var(--wheel-edge)"
                  strokeWidth="2"
                />
                {BULBS.map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="2.1" fill="var(--wheel-on-dark)" opacity="0.85" />
                ))}

                <circle
                  cx="100"
                  cy="100"
                  r="17"
                  fill="var(--wheel-hub)"
                  stroke="var(--wheel-edge)"
                  strokeWidth="1.6"
                />
                <circle cx="100" cy="100" r="17" fill="url(#hubSheen)" />
              </svg>
            </motion.div>
            <button
              type="button"
              onClick={spin}
              disabled={spinning || !!prize}
              aria-label="Spin the wheel"
              className="absolute left-1/2 top-1/2 z-10 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full brand-gradient text-[10px] font-extrabold uppercase tracking-wide text-primary-foreground shadow-glow ring-4 ring-white/20 transition active:scale-95 disabled:opacity-70"
            >
              Spin
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
