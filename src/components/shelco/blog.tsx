import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n";
import { BLOG_POSTS } from "@/lib/blog-data";
import { SectionHeading, Stagger, StaggerItem } from "./motion-primitives";

export function Blog() {
  const { t } = useI18n();

  return (
    <section id="blog" className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
      <SectionHeading
        eyebrow={t("blog.eyebrow")}
        title={t("blog.title")}
        description={t("blog.desc")}
      />

      <Stagger className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {BLOG_POSTS.map((p) => {
          const title = t(`${p.key}.title` as "blog.b1.title");
          return (
            <StaggerItem key={p.slug}>
              <Link
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="group block h-full overflow-hidden rounded-2xl border border-border bg-card shadow-lift transition-transform duration-300 hover:-translate-y-1.5"
              >
                <img
                  src={p.image}
                  alt={title}
                  loading="lazy"
                  width={768}
                  height={512}
                  className="h-28 w-full object-cover transition-transform duration-700 group-hover:scale-110 sm:h-36"
                />
                <div className="p-3 sm:p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    {t(`${p.key}.tag` as "blog.b1.tag")}
                  </span>
                  <h3 className="mt-1 text-sm font-extrabold leading-snug group-hover:text-primary sm:text-base">
                    {title}
                  </h3>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    {p.minutes} {t("blog.read")}
                  </p>
                </div>
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>

      <div className="mt-6 text-center">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-bold text-secondary transition-colors hover:border-primary hover:text-primary"
        >
          {t("blog.title")} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
