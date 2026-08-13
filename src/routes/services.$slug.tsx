import { createFileRoute, notFound } from "@tanstack/react-router";
import { ServiceLanding, serviceJsonLd } from "@/components/shelco/service-landing";
import { SERVICES, type ServiceData, type ServiceSlug } from "@/lib/services-data";

const SITE = "https://shelco-space-wizard.lovable.app";

function findService(slug: string): ServiceData | undefined {
  return SERVICES.find((s) => s.slug === (slug as ServiceSlug));
}

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = findService(params.slug);
    if (!service) throw notFound();
    return { slug: service.slug };
  },
  head: ({ params }) => {
    const service = findService(params.slug);
    if (!service) return {};
    const url = `${SITE}/services/${service.slug}`;
    return {
      meta: [
        { title: service.title },
        { name: "description", content: service.description },
        { property: "og:title", content: service.title },
        { property: "og:description", content: service.description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(serviceJsonLd(service, url)),
        },
      ],
    };
  },
  component: ServicePage,
});

function ServicePage() {
  const { slug } = Route.useLoaderData();
  const service = findService(slug);
  if (!service) return null;
  return <ServiceLanding service={service} />;
}
