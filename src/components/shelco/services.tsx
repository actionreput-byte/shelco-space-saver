import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import iconRacking from "@/assets/icon-racking.png";
import iconShelving from "@/assets/icon-shelving.png";
import iconGeneral from "@/assets/icon-general.png";
import iconAccessories from "@/assets/icon-accessories.png";
import { useI18n } from "@/i18n";
import { SectionHeading, Stagger, StaggerItem } from "./motion-primitives";

const SERVICES = [
  { icon: iconRacking, key: "services.s1", slug: "racking-solutions" },
  { icon: iconShelving, key: "services.s2", slug: "shelving-solutions" },
  { icon: iconGeneral, key: "services.s3", slug: "general-shelving-racking" },
  { icon: iconAccessories, key: "services.s4", slug: "accessories" },
] as const;

export function Services() {
  const { t } = useI18n();

  return (
    <section id="services" className="bg-muted/60 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow={t("services.eyebrow")}
          title={t("services.title")}
          description={t("services.desc")}
        />

        <Stagger className="grid gap-4 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <StaggerItem key={s.key}>
              <Link
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-lift transition-transform duration-300 hover:-translate-y-1.5"
              >
                <span className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary-soft transition-transform duration-500 group-hover:scale-150" />
                <img
                  src={s.icon}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  width={768}
                  height={768}
                  className="relative h-24 w-24 object-contain transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-3"
                />
                <h3 className="relative mt-3 text-xl font-extrabold">
                  {t(`${s.key}.title` as "services.s1.title")}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`${s.key}.body` as "services.s1.body")}
                </p>
                <span className="relative mt-4 inline-flex items-center gap-2 font-bold text-primary">
                  Learn more
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
