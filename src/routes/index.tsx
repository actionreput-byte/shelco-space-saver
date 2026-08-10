import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { SiteHeader } from "@/components/shelco/site-header";
import { Hero } from "@/components/shelco/hero";
import { About } from "@/components/shelco/about";
import { Services } from "@/components/shelco/services";
import { RoiCalculator } from "@/components/shelco/roi-calculator";
import { Portfolio } from "@/components/shelco/portfolio";
import { Testimonials } from "@/components/shelco/testimonials";
import { Blog } from "@/components/shelco/blog";
import { Contact } from "@/components/shelco/contact";
import {
  SectorMarquee,
  SiteFooter,
  StatsStrip,
} from "@/components/shelco/site-sections";
import { SocialProofStrip } from "@/components/shelco/motion-primitives";

const TITLE = "Shelco Storage Systems | Racking & Shelving Dar es Salaam";
const DESCRIPTION =
  "Dexion-style pallet racking, gondola shelving and boltless storage systems in Q235 steel. Free space audit and capacity calculator for Dar es Salaam businesses.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [positions, setPositions] = useState(0);
  const handleCapacity = useCallback((p: number) => setPositions(p), []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero onCapacityChange={handleCapacity} />
        <StatsStrip />

        <div className="py-8">
          <SocialProofStrip
            quote="Warehouse, retail and workshop operators across Tanzania rely on Shelco steel every day."
            metric="420+"
            metricLabel="Projects installed"
          />
        </div>

        <About />

        <div className="pb-8">
          <SocialProofStrip
            quote="Rated 4.9 out of 5 by clients for build quality, fitting and after-sales support."
            metric="4.9/5"
            metricLabel="Average client rating"
          />
        </div>

        <Services />
        <SectorMarquee />

        <div className="py-8">
          <SocialProofStrip
            quote="Every system is manufactured in high-grade Q235 steel and installed by our own fitting teams."
            metric="100%"
            metricLabel="In-house installation"
          />
        </div>

        <RoiCalculator suggestedGain={positions} />

        <div className="pb-8">
          <SocialProofStrip
            quote="Clients typically recover their investment within the first year of operation."
            metric="< 12 mo"
            metricLabel="Typical payback"
          />
        </div>

        <Portfolio />
        <Testimonials />

        <div className="pb-8">
          <SocialProofStrip
            quote="From a single home shelf to a full warehouse fit-out — same engineering standard."
            metric="38,000+"
            metricLabel="Pallet positions built"
          />
        </div>

        <Blog />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}
