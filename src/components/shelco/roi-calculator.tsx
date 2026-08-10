import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { TrendingUp } from "lucide-react";
import { calculateRoi, formatNumber, formatTzs } from "@/lib/calculators";
import { CountUp, Reveal, SectionHeading } from "./motion-primitives";

export function RoiCalculator({ suggestedGain }: { suggestedGain?: number }) {
  const [rentPerSqm, setRentPerSqm] = useState(12000);
  const [area, setArea] = useState(800);
  const [investment, setInvestment] = useState(45000000);
  const [labourCost, setLabourCost] = useState(3500000);
  const [gain, setGain] = useState(55);

  const result = useMemo(
    () =>
      calculateRoi({ rentPerSqm, area, investment, capacityGain: gain, labourCost }),
    [rentPerSqm, area, investment, gain, labourCost],
  );

  const inputs = [
    { label: "Rent per m² / month (TZS)", value: rentPerSqm, set: setRentPerSqm, step: 500 },
    { label: "Facility area (m²)", value: area, set: setArea, step: 10 },
    { label: "System investment (TZS)", value: investment, set: setInvestment, step: 1000000 },
    { label: "Monthly handling labour (TZS)", value: labourCost, set: setLabourCost, step: 100000 },
  ];

  const barWidth = Math.max(4, Math.min(100, result.roiPercent / 5));

  return (
    <section id="roi" className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
      <SectionHeading
        eyebrow="ROI calculator"
        title="See what better space utilisation pays back"
        description={
          suggestedGain
            ? `Based on your capacity estimate of ${formatNumber(suggestedGain)} storage positions, most sites unlock 40–70% more usable capacity.`
            : "Model the payback of a Shelco racking or shelving installation before you commit."
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Reveal>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-lift">
            <div className="grid grid-cols-2 gap-3">
              {inputs.map((f) => (
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

            <label className="mt-5 block">
              <span className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <span>Extra capacity unlocked</span>
                <span className="text-primary">{gain}%</span>
              </span>
              <input
                type="range"
                min={10}
                max={150}
                step={5}
                value={gain}
                onChange={(e) => setGain(Number(e.target.value))}
                className="mt-2 w-full accent-primary"
              />
            </label>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="h-full rounded-2xl steel-gradient p-5 text-steel-foreground shadow-lift">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg brand-gradient text-primary-foreground">
                <TrendingUp className="h-4 w-4" />
              </span>
              <h3 className="text-lg font-extrabold">Your projected return</h3>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Metric
                label="Monthly benefit"
                value={<CountUp value={result.monthlyBenefit} prefix="TZS " />}
              />
              <Metric
                label="Payback"
                value={
                  <>
                    <CountUp value={result.paybackMonths} decimals={1} /> mo
                  </>
                }
              />
              <Metric
                label="3-year net gain"
                value={<CountUp value={result.threeYearNet} prefix="TZS " />}
              />
              <Metric
                label="3-year ROI"
                value={
                  <>
                    <CountUp value={result.roiPercent} decimals={0} />%
                  </>
                }
              />
            </div>

            <div className="mt-5">
              <div className="h-3 w-full overflow-hidden rounded-full bg-steel-foreground/15">
                <motion.div
                  className="h-full brand-gradient"
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-steel-foreground/75">
                Space saving {formatTzs(result.spaceSavingPerMonth)}/month plus
                handling saving {formatTzs(result.labourSavingPerMonth)}/month
                against rent of {formatTzs(result.monthlyRent)}/month.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-steel-foreground/15 bg-steel-foreground/10 p-3">
      <div className="font-display text-xl font-extrabold leading-tight">
        {value}
      </div>
      <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-steel-foreground/70">
        {label}
      </div>
    </div>
  );
}
