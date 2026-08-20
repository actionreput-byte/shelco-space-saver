import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/shelco/site-header";
import { SiteFooter, StatsStrip } from "@/components/shelco/site-sections";
import {
  Reveal,
  SectionHeading,
  SocialProofStrip,
  Stagger,
  StaggerItem,
} from "@/components/shelco/motion-primitives";
import { SERVICES } from "@/lib/services-data";
import { BLOG_POSTS } from "@/lib/blog-data";
import { RelatedLinks } from "@/components/shelco/related-links";

const TITLE = "Storage Services | Racking, Shelving & Accessories | Shelco Dar es Salaam";
const DESCRIPTION =
  "Explore Shelco storage services in Dar es Salaam: pallet racking, retail and gondola shelving, boltless shelving and racking accessories. Free site visit and quotation.";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://shelco-space-wizard.lovable.app/services" }],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="bg-secondary/5 py-14">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading
              eyebrow="Our services"
              title="Storage systems engineered for Tanzania"
              description="From a single boltless shelf to a full warehouse racking fit-out — designed, manufactured and installed by Shelco."
            />
            <Stagger className="mt-8 grid gap-4 sm:grid-cols-2">
              {SERVICES.map((service) => (
                <StaggerItem key={service.slug}>
                  <Link
                    to="/services/$slug"
                    params={{ slug: service.slug }}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-transform hover:-translate-y-1"
                  >
                    <img
                      src={service.hero}
                      alt={`${service.name} by Shelco Storage Systems`}
                      loading="lazy"
                      width={1440}
                      height={900}
                      className="h-44 w-full object-cover"
                    />
                    <div className="flex flex-1 flex-col p-5">
                      <img
                        src={service.icon}
                        alt=""
                        loading="lazy"
                        width={96}
                        height={96}
                        className="h-12 w-12 object-contain"
                      />
                      <h2 className="mt-3 text-xl font-extrabold text-secondary">
                        {service.name}
                      </h2>
                      <p className="mt-1 flex-1 text-sm text-muted-foreground">
                        {service.subhead}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 font-bold text-primary">
                        Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        <StatsStrip />

        <div className="py-8">
          <Reveal>
            <SocialProofStrip
              quote="Rated 4.9 out of 5 by clients for build quality, fitting and after-sales support."
              metric="4.9/5"
              metricLabel="Average client rating"
            />
          </Reveal>
        </div>
      </main>
      <div className="mx-auto max-w-6xl px-4 pb-12">
        <RelatedLinks
          title="Storage guides from our engineers"
          links={BLOG_POSTS.map((b) => ({
            to: "/blog/$slug",
            params: { slug: b.slug },
            label: b.title,
            description: b.excerpt,
          }))}
        />
      </div>
      <SiteFooter />
    </div>
  );
}
