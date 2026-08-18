import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "./motion-primitives";

export type RelatedLink = { to: string; label: string; description?: string };

/**
 * Internal linking block (net-linking) — used across services, blog posts and
 * the shop so every page passes authority to the pages we want indexed.
 */
export function RelatedLinks({
  title = "Explore more",
  eyebrow = "Keep reading",
  links,
}: {
  title?: string;
  eyebrow?: string;
  links: RelatedLink[];
}) {
  if (links.length === 0) return null;
  return (
    <section className="border-t border-border bg-muted/40 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-4 shadow-sm transition-transform hover:-translate-y-1 hover:border-primary/60"
              >
                <span className="flex items-center gap-1.5 font-bold text-secondary group-hover:text-primary">
                  {l.label}
                  <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
                </span>
                {l.description ? (
                  <span className="mt-1 text-sm text-muted-foreground">{l.description}</span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
