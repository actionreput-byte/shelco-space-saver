import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, Share, Smartphone } from "lucide-react";
import QRCode from "qrcode";
import { SiteHeader } from "@/components/shelco/site-header";
import { SiteFooter } from "@/components/shelco/site-sections";
import { Reveal, SectionHeading } from "@/components/shelco/motion-primitives";
import { useI18n } from "@/i18n";

const SITE = "https://shelco-space-wizard.lovable.app";
const TITLE = "Install the Shelco App | Order & Track Storage Systems";
const DESCRIPTION =
  "Scan the QR code to install the Shelco Storage Systems app on your phone — place orders, track deliveries, chat with our team and receive promotions.";

export const Route = createFileRoute("/get-app")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/get-app` }],
  }),
  component: GetApp,
});

function GetApp() {
  const { t } = useI18n();
  const [qr, setQr] = useState<string | null>(null);
  const [url, setUrl] = useState(SITE);

  useEffect(() => {
    const target = window.location.origin || SITE;
    setUrl(target);
    void QRCode.toDataURL(target, {
      width: 512,
      margin: 1,
      color: { dark: "#1f2a44", light: "#ffffff" },
    }).then(setQr);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="py-14">
          <div className="mx-auto max-w-4xl px-4">
            <SectionHeading
              eyebrow="Shelco app"
              title={t("app.title")}
              description={t("app.subtitle")}
            />

            <Reveal>
              <div className="mt-8 grid gap-6 rounded-2xl border border-border bg-card p-6 shadow-lg sm:grid-cols-[auto_1fr] sm:items-center">
                <div className="mx-auto rounded-2xl border border-border bg-background p-3">
                  {qr ? (
                    <img
                      src={qr}
                      alt="QR code to install the Shelco app"
                      width={220}
                      height={220}
                      className="h-[220px] w-[220px]"
                    />
                  ) : (
                    <div className="h-[220px] w-[220px] animate-pulse rounded-xl bg-muted" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Point your camera at</p>
                  <p className="break-all font-bold text-secondary">{url}</p>
                  <ul className="mt-4 space-y-2 text-sm text-foreground">
                    <li className="flex gap-2">
                      <Smartphone className="h-4 w-4 shrink-0 text-primary" /> Place orders and
                      request quotations
                    </li>
                    <li className="flex gap-2">
                      <Download className="h-4 w-4 shrink-0 text-primary" /> Track your order status
                      and invoices
                    </li>
                    <li className="flex gap-2">
                      <Share className="h-4 w-4 shrink-0 text-primary" /> Chat with our AI assistant
                      and see promotions
                    </li>
                  </ul>
                </div>
              </div>
            </Reveal>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Reveal>
                <div className="h-full rounded-2xl border border-border bg-card p-5">
                  <h2 className="text-lg font-extrabold text-secondary">{t("app.android")}</h2>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
                    <li>Open the site in Chrome.</li>
                    <li>Tap the ⋮ menu (top right).</li>
                    <li>Choose “Install app” or “Add to Home screen”.</li>
                    <li>Confirm — the Shelco icon appears on your home screen.</li>
                  </ol>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="h-full rounded-2xl border border-border bg-card p-5">
                  <h2 className="text-lg font-extrabold text-secondary">{t("app.ios")}</h2>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
                    <li>Open the site in Safari.</li>
                    <li>Tap the Share button.</li>
                    <li>Scroll and tap “Add to Home Screen”.</li>
                    <li>Tap “Add” — Shelco installs like an app.</li>
                  </ol>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
