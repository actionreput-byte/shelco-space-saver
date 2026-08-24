import { useState, type FormEvent } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { Reveal, SectionHeading } from "./motion-primitives";
import { ADDRESS, COMPANY_NAME, EMAILS, MAPS_URL, PHONES } from "@/lib/contact-info";

export function Contact() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    toast.success(t("contact.toast"), { description: t("contact.toastDesc") });
  };

  return (
    <section id="contact" className="bg-muted/60 py-10 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow={t("contact.eyebrow")}
          title={t("contact.title")}
          description={t("contact.desc")}
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-border bg-card p-5 shadow-lift">
              <h3 className="text-lg font-extrabold">{COMPANY_NAME.toUpperCase()}</h3>

              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="min-w-0">
                    {ADDRESS.street}, {ADDRESS.city}, {ADDRESS.country}
                    <br />
                    <span className="text-muted-foreground">
                      {ADDRESS.poBox}, {ADDRESS.city}
                    </span>
                  </span>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="min-w-0">
                    {PHONES.map((p) => (
                      <a
                        key={p.tel}
                        href={`tel:${p.tel}`}
                        className="block font-semibold hover:text-primary"
                      >
                        {p.display}
                      </a>
                    ))}
                  </span>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="min-w-0 break-words">
                    {EMAILS.map((email) => (
                      <a
                        key={email}
                        href={`mailto:${email}`}
                        className="block font-semibold hover:text-primary"
                      >
                        {email}
                      </a>
                    ))}
                  </span>
                </li>
              </ul>

              <a
                href={MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-bold transition-colors hover:border-primary hover:text-primary"
              >
                {t("contact.maps")}
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <form
              onSubmit={onSubmit}
              className="h-full rounded-2xl border border-border bg-card p-5 shadow-lift"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label={t("form.name")} name="name" required />
                <Field label={t("form.phone")} name="phone" type="tel" required />
                <div className="sm:col-span-2">
                  <Field label={t("form.email")} name="email" type="email" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      {t("contact.need")}
                    </span>
                    <textarea
                      name="message"
                      rows={4}
                      required
                      className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg brand-gradient px-5 py-3 font-bold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 active:scale-95"
              >
                {sent ? t("contact.sentBtn") : t("contact.send")}
                <Send className="h-4 w-4" />
              </button>
              <p className="mt-3 text-xs text-muted-foreground">{t("contact.note")}</p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
      />
    </label>
  );
}
