import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Phone } from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteHeader } from "@/components/shelco/site-header";
import { SiteFooter, StatsStrip } from "@/components/shelco/site-sections";
import {
  CountUp,
  Reveal,
  SectionHeading,
  SocialProofStrip,
  Stagger,
  StaggerItem,
} from "@/components/shelco/motion-primitives";
import { Portfolio } from "@/components/shelco/portfolio";
import { Testimonials } from "@/components/shelco/testimonials";
import { calculateCapacity, formatNumber } from "@/lib/calculators";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/i18n";
import { localizeService } from "@/lib/services-data.sw";
import type { ServiceData } from "@/lib/services-data";

function CapacityMiniInner({ system }: { system: ServiceData["system"] }) {
  const [length, setLength] = useState(30);
  const [width, setWidth] = useState(20);
  const [height, setHeight] = useState(6);
  const [aisle, setAisle] = useState(2.8);

  const result = useMemo(
    () => calculateCapacity({ length, width, height, aisleWidth: aisle, system }),
    [length, width, height, aisle, system],
  );

  const field = (
    label: string,
    value: number,
    set: (n: number) => void,
    step = 1,
  ) => (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <input
        type="number"
        inputMode="decimal"
        step={step}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-base font-semibold text-foreground outline-none focus:border-primary"
      />
    </label>
  );

  return (
    <div className="rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur sm:p-5">
      <p className="text-sm font-bold text-secondary">{t("svc.calcTitle")}</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {field(t("calc.length"), length, setLength)}
        {field(t("calc.width"), width, setWidth)}
        {field(t("calc.height"), height, setHeight, 0.5)}
        {field(t("calc.aisle"), aisle, setAisle, 0.1)}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-muted/70 p-3">
          <p className="text-lg font-extrabold text-primary">
            <CountUp value={result.positions} />
          </p>
          <p className="text-[11px] font-semibold text-muted-foreground">{t("svc.positions")}</p>
        </div>
        <div className="rounded-xl bg-muted/70 p-3">
          <p className="text-lg font-extrabold text-primary">
            <CountUp value={result.bays} />
          </p>
          <p className="text-[11px] font-semibold text-muted-foreground">{t("svc.bays")}</p>
        </div>
        <div className="rounded-xl bg-muted/70 p-3">
          <p className="text-lg font-extrabold text-primary">
            {formatNumber(result.storageVolume)}
          </p>
          <p className="text-[11px] font-semibold text-muted-foreground">{t("svc.volume")}</p>
        </div>
      </div>
      <a
        href="#booking"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg brand-gradient px-4 py-3 font-bold text-primary-foreground shadow-glow"
      >
        {t("svc.layoutCta")} <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}

function BookingForm({ service }: { service: string }) {
  const { t } = useI18n();
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <section id="booking" className="bg-secondary/5 py-14">
      <div className="mx-auto max-w-3xl px-4">
        <SectionHeading
          eyebrow={t("svc.bookEyebrow")}
          title={t("svc.bookTitle")}
          description={t("svc.bookDesc")}
        />
        <Reveal>
          <form
            className="mt-6 grid gap-3 rounded-2xl border border-border bg-card p-5 shadow-lg sm:grid-cols-2"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const data = new FormData(form);
              setSending(true);
              const { error } = await supabase.from("quote_requests").insert({
                name: String(data.get("name") ?? ""),
                phone: String(data.get("phone") ?? ""),
                email: String(data.get("email") ?? "") || null,
                company: String(data.get("company") ?? "") || null,
                service,
                message: String(data.get("message") ?? "") || null,
              });
              setSending(false);
              if (error) {
                toast.error(t("svc.error"));
                return;
              }
              setDone(true);
              form.reset();
              toast.success(t("form.sent"));
            }}
          >
            <input
              name="name"
              required
              placeholder={t("form.name")}
              className="rounded-lg border border-border bg-background px-3 py-3 outline-none focus:border-primary"
            />
            <input
              name="phone"
              required
              type="tel"
              placeholder={t("form.phone")}
              className="rounded-lg border border-border bg-background px-3 py-3 outline-none focus:border-primary"
            />
            <input
              name="email"
              type="email"
              placeholder={t("form.email")}
              className="rounded-lg border border-border bg-background px-3 py-3 outline-none focus:border-primary"
            />
            <input
              name="company"
              placeholder={t("form.company")}
              className="rounded-lg border border-border bg-background px-3 py-3 outline-none focus:border-primary"
            />
            <textarea
              name="message"
              rows={4}
              placeholder={t("form.message")}
              className="rounded-lg border border-border bg-background px-3 py-3 outline-none focus:border-primary sm:col-span-2"
            />
            <button
              type="submit"
              disabled={sending}
              className="rounded-lg brand-gradient px-4 py-3 font-bold text-primary-foreground shadow-glow disabled:opacity-60 sm:col-span-2"
            >
              {sending ? t("svc.sending") : t("cta.book")}
            </button>
            {done ? (
              <p className="text-sm font-semibold text-primary sm:col-span-2">{t("form.sent")}</p>
            ) : null}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

export function ServiceLanding({ service: base }: { service: ServiceData }) {
  const { lang, t } = useI18n();
  const service = localizeService(base, lang);
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden">
          <img
            src={service.hero}
            alt={`${service.name} installed by Shelco in Dar es Salaam`}
            width={1440}
            height={900}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/85 via-secondary/70 to-secondary/90" />
          <div className="relative mx-auto grid max-w-6xl gap-6 px-4 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
                {service.name}
              </span>
              <h1 className="mt-3 text-3xl font-extrabold leading-tight text-primary-foreground sm:text-4xl lg:text-5xl">
                {service.headline}
              </h1>
              <p className="mt-3 max-w-xl text-base text-primary-foreground/85">
                {service.subhead}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="#booking"
                  className="inline-flex items-center gap-2 rounded-lg brand-gradient px-5 py-3 font-bold text-primary-foreground shadow-glow"
                >
                  {t("svc.freeVisit")} <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="tel:+255767224466"
                  className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/40 px-5 py-3 font-bold text-primary-foreground"
                >
                  <Phone className="h-4 w-4" /> +255 767 224 466
                </a>
              </div>
            </motion.div>
            <CapacityMini system={service.system} />
          </div>
        </section>

        <StatsStrip />

        <div className="py-8">
          <SocialProofStrip
            quote={t("sp1.quote")}
            metric="420+"
            metricLabel={t("sp1.label")}
          />
        </div>

        <section className="py-14">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading
              eyebrow={t("svc.whatEyebrow")}
              title={t("svc.whatTitle", { name: service.name })}
              description={t("svc.whatDesc")}
            />
            <Stagger className="mt-8 grid gap-4 sm:grid-cols-3">
              {service.benefits.map((b) => (
                <StaggerItem key={b.title}>
                  <div className="h-full rounded-2xl border border-border bg-card p-5 shadow-sm transition-transform hover:-translate-y-1">
                    <img
                      src={b.icon}
                      alt=""
                      loading="lazy"
                      width={96}
                      height={96}
                      className="h-14 w-14 object-contain"
                    />
                    <h3 className="mt-3 text-lg font-bold text-secondary">{b.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{b.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal>
              <ul className="mt-8 grid gap-2 sm:grid-cols-2">
                {service.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 rounded-xl bg-muted/60 px-4 py-3 text-sm font-medium text-foreground"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <div className="pb-8">
          <SocialProofStrip
            quote={t("sp3.quote")}
            metric="100%"
            metricLabel={t("sp3.label")}
          />
        </div>

        <Portfolio />
        <Testimonials />

        <section className="py-14">
          <div className="mx-auto max-w-3xl px-4">
            <SectionHeading eyebrow={t("svc.faqEyebrow")} title={t("faq.title")} />
            <Reveal>
              <Accordion type="single" collapsible className="mt-6">
                {service.faqs.map((faq) => (
                  <AccordionItem key={faq.q} value={faq.q}>
                    <AccordionTrigger className="text-left font-bold text-secondary">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {t("svc.more")}{" "}
              <Link to="/services" className="font-bold text-primary">
                {t("svc.seeAll")}
              </Link>
            </p>
          </div>
        </section>

        <BookingForm service={service.quoteService} />
      </main>
      <SiteFooter />
    </div>
  );
}

export function serviceJsonLd(service: ServiceData, url: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: service.name,
        serviceType: service.name,
        description: service.description,
        url,
        areaServed: { "@type": "Place", name: "Dar es Salaam, Tanzania" },
        provider: {
          "@type": "LocalBusiness",
          name: "Shelco Storage Systems Ltd",
          telephone: "+255767224466",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Mwakalinga Road, Changombe",
            addressLocality: "Dar es Salaam",
            addressCountry: "TZ",
          },
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: service.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };
}
