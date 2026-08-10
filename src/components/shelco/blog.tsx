import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";
import blog4 from "@/assets/blog-4.jpg";
import { SectionHeading, Stagger, StaggerItem } from "./motion-primitives";

const POSTS = [
  {
    image: blog1,
    tag: "Space planning",
    title: "Stop paying rent for empty air above your racking",
    minutes: 5,
  },
  {
    image: blog2,
    tag: "Safety",
    title: "The racking inspection checklist every warehouse needs",
    minutes: 4,
  },
  {
    image: blog3,
    tag: "Retail",
    title: "Gondola shelving layouts that lift shop-floor sales",
    minutes: 6,
  },
  {
    image: blog4,
    tag: "Design",
    title: "Aisle width: the number that decides your capacity",
    minutes: 4,
  },
];

export function Blog() {
  return (
    <section id="blog" className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
      <SectionHeading
        eyebrow="Insights"
        title="Storage know-how from our engineers"
        description="Practical guidance for warehouse, retail and workshop operators in Tanzania."
      />

      <Stagger className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {POSTS.map((p) => (
          <StaggerItem key={p.title}>
            <article className="group h-full overflow-hidden rounded-2xl border border-border bg-card shadow-lift transition-transform duration-300 hover:-translate-y-1.5">
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                width={768}
                height={512}
                className="h-28 w-full object-cover transition-transform duration-700 group-hover:scale-110 sm:h-36"
              />
              <div className="p-3 sm:p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {p.tag}
                </span>
                <h3 className="mt-1 text-sm font-extrabold leading-snug sm:text-base">
                  {p.title}
                </h3>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {p.minutes} min read
                </p>
              </div>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
