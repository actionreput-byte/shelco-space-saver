import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/shelco/site-header";
import { SiteFooter, StatsStrip } from "@/components/shelco/site-sections";
import { SectionHeading, SocialProofStrip } from "@/components/shelco/motion-primitives";
import { ProductGrid } from "@/components/shelco/shop";
import { Testimonials } from "@/components/shelco/testimonials";
import { RelatedLinks } from "@/components/shelco/related-links";
import { SERVICES } from "@/lib/services-data";
import { BLOG_POSTS } from "@/lib/blog-data";
import { useI18n } from "@/i18n";

const TITLE = "Shop Racks, Shelves & Trolleys | Shelco Dar es Salaam";
const DESCRIPTION =
  "Warehouse racks, supermarket shelving, counter tables, trolleys and baskets in Dar es Salaam. Request a free quotation, site survey and installation.";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://shelco-space-wizard.lovable.app/shop" }],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="bg-secondary/5 py-10 sm:py-14">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading
              eyebrow={t("shop.eyebrow")}
              title={t("shop.title")}
              description={t("shop.subtitle")}
            />
            <div className="mt-6">
              <ProductGrid />
            </div>
          </div>
        </section>
        <StatsStrip />
        <div className="py-8">
          <SocialProofStrip
            quote="Stocked in Dar es Salaam, delivered and fitted by our own team at no extra cost."
            metric="Free"
            metricLabel="Survey & installation"
          />
        </div>
        <Testimonials />
        <div className="mx-auto max-w-6xl px-4 pb-12">
          <RelatedLinks
            title="Explore our services"
            links={[
              ...SERVICES.map((sv) => ({
                to: "/services/$slug",
                params: { slug: sv.slug },
                label: sv.name,
                description: sv.subhead,
              })),
              ...BLOG_POSTS.slice(0, 2).map((b) => ({
                to: "/blog/$slug",
                params: { slug: b.slug },
                label: b.title,
                description: b.excerpt,
              })),
            ]}
          />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
