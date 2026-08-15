import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";
import blog4 from "@/assets/blog-4.jpg";
import { useI18n } from "@/i18n";
import { SectionHeading, Stagger, StaggerItem } from "./motion-primitives";

const POSTS = [
  { image: blog1, key: "blog.b1", minutes: 5 },
  { image: blog2, key: "blog.b2", minutes: 4 },
  { image: blog3, key: "blog.b3", minutes: 6 },
  { image: blog4, key: "blog.b4", minutes: 4 },
] as const;

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
        {POSTS.map((p) => {
          const title = t(`${p.key}.title` as "blog.b1.title");
          return (
            <StaggerItem key={p.key}>
              <article className="group h-full overflow-hidden rounded-2xl border border-border bg-card shadow-lift transition-transform duration-300 hover:-translate-y-1.5">
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
                  <h3 className="mt-1 text-sm font-extrabold leading-snug sm:text-base">
                    {title}
                  </h3>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    {p.minutes} {t("blog.read")}
                  </p>
                </div>
              </article>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}
