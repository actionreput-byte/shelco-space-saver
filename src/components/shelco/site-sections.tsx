import logoAsset from "@/assets/shelco-logo.asset.json";
import { CountUp, Reveal } from "./motion-primitives";

const STATS = [
  { value: 420, suffix: "+", label: "Installations delivered" },
  { value: 38000, suffix: "+", label: "Pallet positions built" },
  { value: 12, suffix: "", label: "Years in Dar es Salaam" },
  { value: 94, suffix: "%", label: "Clients who order again" },
];

const MARQUEE = [
  "Warehousing",
  "Supermarkets",
  "Pharmaceuticals",
  "Spare parts",
  "Logistics",
  "Manufacturing",
  "Cold chain",
  "Hardware retail",
];

export function StatsStrip() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div>
              <div className="font-display text-3xl font-extrabold text-primary sm:text-4xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {s.label}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function SectorMarquee() {
  return (
    <div className="overflow-hidden border-y border-border bg-muted/60 py-3">
      <div className="marquee-track flex w-max gap-8 whitespace-nowrap">
        {[...MARQUEE, ...MARQUEE].map((m, i) => (
          <span
            key={`${m}-${i}`}
            className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground"
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="steel-gradient text-steel-foreground">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3">
        <div>
          <img
            src={logoAsset.url}
            alt="Shelco Storage Systems"
            loading="lazy"
            width={220}
            height={64}
            className="h-10 w-auto rounded bg-background p-1"
          />
          <p className="mt-3 text-sm text-steel-foreground/75">
            Efficient storage and maximum space utilisation for Tanzanian
            businesses.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider">
            Explore
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-steel-foreground/80">
            <li><a className="hover:text-primary" href="#about">About</a></li>
            <li><a className="hover:text-primary" href="#services">Services</a></li>
            <li><a className="hover:text-primary" href="#portfolio">Projects</a></li>
            <li><a className="hover:text-primary" href="#blog">Insights</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider">
            Contact
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-steel-foreground/80">
            <li>Changombe, Mwakalinga Road, Dar-es-Salaam</li>
            <li><a className="hover:text-primary" href="tel:+255767224466">+255-767-224466</a></li>
            <li><a className="hover:text-primary" href="mailto:sales@shelcosystems.com">sales@shelcosystems.com</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-steel-foreground/15 px-4 py-4 text-center text-xs text-steel-foreground/60">
        © {new Date().getFullYear()} Shelco Storage Systems Ltd. All rights
        reserved.
      </div>
    </footer>
  );
}
