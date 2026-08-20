import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shelco/site-header";
import { SiteFooter } from "@/components/shelco/site-sections";
import { SectionHeading, Stagger, StaggerItem } from "@/components/shelco/motion-primitives";
import { RelatedLinks } from "@/components/shelco/related-links";
import { BLOG_POSTS } from "@/lib/blog-data";
import { SERVICES } from "@/lib/services-data";

const SITE = "https://shelco-space-wizard.lovable.app";
const TITLE = "Storage Insights Blog | Racking & Shelving Guides | Shelco";
const DESCRIPTION =
  "Practical guides on warehouse racking, shop shelving, aisle width and racking safety from the Shelco engineering team in Dar es Salaam, Tanzania.";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/blog` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/blog` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Shelco Storage Insights",
          url: `${SITE}/blog`,
          blogPost: BLOG_POSTS.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: `${SITE}/blog/${p.slug}`,
            datePublished: p.date,
          })),
        }),
      },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <SectionHeading
            eyebrow="Insights"
            title="Storage know-how from our engineers"
            description="Field-tested guidance for warehouse, retail and workshop storage in Tanzania."
          />
          <Stagger className="mt-8 grid gap-4 sm:grid-cols-2">
            {BLOG_POSTS.map((p) => (
              <StaggerItem key={p.slug}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lift transition-transform hover:-translate-y-1.5"
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    width={768}
                    height={512}
                    className="h-40 w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {p.tag}
                    </span>
                    <h2 className="mt-1 text-lg font-extrabold leading-snug text-secondary group-hover:text-primary">
                      {p.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
                    <p className="mt-auto pt-3 text-[11px] font-semibold text-muted-foreground">
                      {p.minutes} min read
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <RelatedLinks
          eyebrow="Our services"
          title="Storage systems we design and install"
          links={SERVICES.map((s) => ({
            to: "/services/$slug",
            params: { slug: s.slug },
            label: s.name,
            description: s.subhead,
          }))}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
