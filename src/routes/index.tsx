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
import { ShopSection } from "@/components/shelco/shop";
import { Tombola } from "@/components/shelco/tombola";

import { Contact } from "@/components/shelco/contact";
import {
  SectorMarquee,
  SiteFooter,
  StatsStrip,
} from "@/components/shelco/site-sections";
import { SocialProofStrip } from "@/components/shelco/motion-primitives";
import { useI18n } from "@/i18n";

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
  const { t } = useI18n();
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
            quote={t("sp1.quote")}
            metric="420+"
            metricLabel={t("sp1.label")}
          />
        </div>

        <About />

        <div className="pb-8">
          <SocialProofStrip
            quote={t("sp2.quote")}
            metric="4.9/5"
            metricLabel={t("sp2.label")}
          />
        </div>

        <Services />
        <Tombola />
        <ShopSection />
        <SectorMarquee />


        <div className="py-8">
          <SocialProofStrip
            quote={t("sp3.quote")}
            metric="100%"
            metricLabel={t("sp3.label")}
          />
        </div>

        <RoiCalculator suggestedGain={positions} />

        <div className="pb-8">
          <SocialProofStrip
            quote={t("sp4.quote")}
            metric="< 12 mo"
            metricLabel={t("sp4.label")}
          />
        </div>

        <Portfolio />
        <Testimonials />

        <div className="pb-8">
          <SocialProofStrip
            quote={t("sp5.quote")}
            metric="38,000+"
            metricLabel={t("sp5.label")}
          />
        </div>

        <Blog />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}
