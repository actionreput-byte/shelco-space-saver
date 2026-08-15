import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import { useI18n } from "@/i18n";
import { SectionHeading, Stagger, StaggerItem } from "./motion-primitives";

const PROJECTS = [
  { image: portfolio1, key: "portfolio.p1", area: "Kurasini, Dar es Salaam" },
  { image: portfolio2, key: "portfolio.p2", area: "Kariakoo, Dar es Salaam" },
  { image: portfolio3, key: "portfolio.p3", area: "Changombe, Dar es Salaam" },
] as const;

export function Portfolio() {
  const { t } = useI18n();

  return (
    <section id="portfolio" className="bg-muted/60 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow={t("portfolio.eyebrow")}
          title={t("portfolio.title")}
          description={t("portfolio.desc")}
        />

        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => {
            const scope = t(`${p.key}.scope` as "portfolio.p1.scope");
            return (
              <StaggerItem key={p.key}>
                <article className="group h-full overflow-hidden rounded-2xl border border-border bg-card shadow-lift">
                  <div className="overflow-hidden">
                    <img
                      src={p.image}
                      alt={scope}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="h-44 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                      {p.area}
                    </span>
                    <h3 className="mt-1 text-lg font-extrabold">
                      {t(`${p.key}.sector` as "portfolio.p1.sector")}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">{scope}</p>
                    <p className="mt-3 rounded-lg bg-primary-soft px-3 py-2 text-sm font-semibold text-accent-foreground">
                      {t(`${p.key}.result` as "portfolio.p1.result")}
                    </p>
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
