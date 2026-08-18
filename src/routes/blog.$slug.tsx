import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowRight, Phone } from "lucide-react";
import { SiteHeader } from "@/components/shelco/site-header";
import { SiteFooter } from "@/components/shelco/site-sections";
import { Reveal } from "@/components/shelco/motion-primitives";
import { RelatedLinks } from "@/components/shelco/related-links";
import { BLOG_POSTS, getPost } from "@/lib/blog-data";
import { getService } from "@/lib/services-data";
import { PRIMARY_PHONE } from "@/lib/contact-info";

const SITE = "https://shelco-space-wizard.lovable.app";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { slug: post.slug };
  },
  head: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) return {};
    const url = `${SITE}/blog/${post.slug}`;
    return {
      meta: [
        { title: post.metaTitle },
        { name: "description", content: post.metaDescription },
        { property: "og:title", content: post.metaTitle },
        { property: "og:description", content: post.metaDescription },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BlogPosting",
                headline: post.title,
                description: post.metaDescription,
                datePublished: post.date,
                dateModified: post.date,
                mainEntityOfPage: url,
                author: { "@type": "Organization", name: "Shelco Storage Systems Ltd" },
                publisher: { "@type": "Organization", name: "Shelco Storage Systems Ltd" },
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: SITE },
                  { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
                  { "@type": "ListItem", position: 3, name: post.title, item: url },
                ],
              },
            ],
          }),
        },
      ],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useLoaderData();
  const post = getPost(slug);
  if (!post) return null;

  const related = [
    ...post.relatedServices.map((s) => {
      const svc = getService(s);
      return { to: `/services/${svc.slug}`, label: svc.name, description: svc.subhead };
    }),
    ...post.relatedPosts
      .map((s) => BLOG_POSTS.find((p) => p.slug === s))
      .filter((p): p is (typeof BLOG_POSTS)[number] => Boolean(p))
      .map((p) => ({ to: `/blog/${p.slug}`, label: p.title, description: p.excerpt })),
    { to: "/shop", label: "Browse our products", description: "Racks, shelving, trolleys and baskets." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <article>
          <header className="border-b border-border bg-muted/50">
            <div className="mx-auto max-w-3xl px-4 py-10">
              <nav aria-label="Breadcrumb" className="text-xs font-semibold text-muted-foreground">
                <Link to="/" className="hover:text-primary">Home</Link>
                <span className="px-1.5">/</span>
                <Link to="/blog" className="hover:text-primary">Blog</Link>
              </nav>
              <span className="mt-3 inline-block text-[11px] font-bold uppercase tracking-wider text-primary">
                {post.tag}
              </span>
              <h1 className="mt-2 text-3xl font-extrabold leading-tight text-secondary sm:text-4xl">
                {post.title}
              </h1>
              <p className="mt-3 text-base text-muted-foreground">{post.excerpt}</p>
              <p className="mt-3 text-xs font-semibold text-muted-foreground">
                {new Date(post.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                · {post.minutes} min read
              </p>
            </div>
          </header>

          <div className="mx-auto max-w-3xl px-4 py-10">
            <img
              src={post.image}
              alt={post.title}
              width={1024}
              height={640}
              className="aspect-[16/9] w-full rounded-2xl object-cover shadow-lift"
            />

            <p className="mt-8 text-lg leading-relaxed text-foreground">{post.intro}</p>

            {post.sections.map((s) => (
              <section key={s.heading} className="mt-8">
                <h2 className="text-xl font-extrabold text-secondary sm:text-2xl">{s.heading}</h2>
                {s.paragraphs.map((p) => (
                  <p key={p} className="mt-3 leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
                {s.bullets ? (
                  <ul className="mt-4 space-y-2">
                    {s.bullets.map((b) => (
                      <li
                        key={b}
                        className="rounded-xl bg-muted/60 px-4 py-2.5 text-sm font-medium text-foreground"
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            <Reveal>
              <div className="mt-10 rounded-2xl border border-primary/30 bg-primary-soft p-5">
                <h2 className="text-lg font-extrabold text-secondary">The takeaway</h2>
                <p className="mt-2 text-sm text-foreground">{post.takeaway}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 rounded-lg brand-gradient px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-glow"
                  >
                    Book a free site visit <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={`tel:${PRIMARY_PHONE.tel}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-bold text-secondary"
                  >
                    <Phone className="h-4 w-4" /> {PRIMARY_PHONE.display}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </article>

        <RelatedLinks links={related} />
      </main>
      <SiteFooter />
    </div>
  );
}
