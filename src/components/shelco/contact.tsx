import { useState, type FormEvent } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { Reveal, SectionHeading } from "./motion-primitives";

export function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    toast.success("Request received", {
      description: "Our team will call you back from Changombe shortly.",
    });
  };

  return (
    <section id="contact" className="bg-muted/60 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Contact"
          title="Request a free storage assessment"
          description="Tell us about your space and we will size the right racking or shelving system for it."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-border bg-card p-5 shadow-lift">
              <h3 className="text-lg font-extrabold">
                SHELCO STORAGE SYSTEMS LTD
              </h3>

              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="min-w-0">
                    Changombe, Mwakalinga Road, Dar-es-Salaam, Tanzania
                    <br />
                    <span className="text-muted-foreground">
                      P.O. Box 100053, Dar-es-Salaam
                    </span>
                  </span>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="min-w-0">
                    <a
                      href="tel:+255767224466"
                      className="block font-semibold hover:text-primary"
                    >
                      +255-767-224466
                    </a>
                    <a
                      href="tel:+255683809809"
                      className="block font-semibold hover:text-primary"
                    >
                      +255-683-809809
                    </a>
                  </span>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="min-w-0 break-words">
                    <a
                      href="mailto:sales@shelcosystems.com"
                      className="block font-semibold hover:text-primary"
                    >
                      sales@shelcosystems.com
                    </a>
                    <a
                      href="mailto:sales1.shelcosystems@gmail.com"
                      className="block font-semibold hover:text-primary"
                    >
                      sales1.shelcosystems@gmail.com
                    </a>
                  </span>
                </li>
              </ul>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Mwakalinga+Road+Changombe+Dar+es+Salaam"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-bold transition-colors hover:border-primary hover:text-primary"
              >
                Open in Maps
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <form
              onSubmit={onSubmit}
              className="h-full rounded-2xl border border-border bg-card p-5 shadow-lift"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Full name" name="name" required />
                <Field label="Phone" name="phone" type="tel" required />
                <div className="sm:col-span-2">
                  <Field label="Email" name="email" type="email" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      What do you need to store?
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
                {sent ? "Request sent" : "Send request"}
                <Send className="h-4 w-4" />
              </button>
              <p className="mt-3 text-xs text-muted-foreground">
                Prefer to talk? Call +255-767-224466 — we answer during working
                hours.
              </p>
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
