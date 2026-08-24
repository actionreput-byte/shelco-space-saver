import iconSpace from "@/assets/icon-space.png";
import iconRoi from "@/assets/icon-roi.png";
import iconTime from "@/assets/icon-time.png";
import { useI18n } from "@/i18n";
import { Reveal, SectionHeading, Stagger, StaggerItem } from "./motion-primitives";

const PILLARS = [
  { icon: iconSpace, key: "about.p1" },
  { icon: iconRoi, key: "about.p2" },
  { icon: iconTime, key: "about.p3" },
] as const;

export function About() {
  const { t } = useI18n();

  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-10 sm:py-20">
      <SectionHeading
        eyebrow={t("about.eyebrow")}
        title={t("about.title")}
        description={t("about.desc")}
      />

      <Stagger className="grid gap-4 sm:grid-cols-3">
        {PILLARS.map((p) => (
          <StaggerItem key={p.key}>
            <article className="group h-full rounded-2xl border border-border bg-card p-5 shadow-lift transition-transform duration-300 hover:-translate-y-1.5">
              <img
                src={p.icon}
                alt=""
                aria-hidden="true"
                loading="lazy"
                width={768}
                height={768}
                className="h-20 w-20 object-contain float-slow"
              />
              <h3 className="mt-3 text-lg font-extrabold">
                {t(`${p.key}.title` as "about.p1.title")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(`${p.key}.body` as "about.p1.body")}
              </p>
            </article>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal delay={0.1} className="mt-6">
        <div className="rounded-2xl steel-gradient p-6 text-steel-foreground shadow-lift">
          <p className="text-base leading-relaxed">{t("about.note")}</p>
        </div>
      </Reveal>
    </section>
  );
}
