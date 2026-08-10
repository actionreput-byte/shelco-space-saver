import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import person1 from "@/assets/person-1.jpg";
import person2 from "@/assets/person-2.jpg";
import person3 from "@/assets/person-3.jpg";
import { SectionHeading } from "./motion-primitives";

const TESTIMONIALS = [
  {
    photo: person1,
    name: "Joseph M.",
    role: "Operations Director, beverage distribution",
    location: "Kurasini",
    quote:
      "Shelco redesigned our whole warehouse layout. We now hold almost 70% more pallets in the same building, and the racking has not moved a millimetre since installation.",
  },
  {
    photo: person2,
    name: "Neema K.",
    role: "Retail Manager, supermarket group",
    location: "Kariakoo",
    quote:
      "The gondola shelving transformed our shop floor. Products display beautifully, restocking is faster, and our customers can finally find everything.",
  },
  {
    photo: person3,
    name: "Hamisi S.",
    role: "Warehouse Manager, spare parts",
    location: "Changombe",
    quote:
      "From the site survey to installation the team was professional. The steel quality is genuinely heavy duty — exactly what we needed for engine parts.",
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const go = (next: number) => {
    setDir(next > index || (index === TESTIMONIALS.length - 1 && next === 0) ? 1 : -1);
    setIndex((next + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  useEffect(() => {
    const t = setInterval(() => {
      setDir(1);
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 6500);
    return () => clearInterval(t);
  }, []);

  const item = TESTIMONIALS[index]!;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
      <SectionHeading
        eyebrow="Client voices"
        title="Trusted by businesses across Tanzania"
        align="center"
      />

      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-lift">
        <Quote className="absolute right-5 top-5 h-10 w-10 text-primary-soft" />
        <AnimatePresence mode="wait" custom={dir}>
          <motion.figure
            key={index}
            custom={dir}
            initial={{ opacity: 0, x: dir * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -60 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(index + 1);
              if (info.offset.x > 60) go(index - 1);
            }}
          >
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <blockquote className="mt-4 text-lg leading-relaxed">
              “{item.quote}”
            </blockquote>
            <figcaption className="mt-5 flex min-w-0 items-center gap-3">
              <img
                src={item.photo}
                alt={`${item.name}, ${item.role}`}
                loading="lazy"
                width={640}
                height={640}
                className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-primary/40"
              />
              <div className="min-w-0">
                <div className="truncate font-extrabold">{item.name}</div>
                <div className="truncate text-sm text-muted-foreground">
                  {item.role} · {item.location}
                </div>
              </div>
            </figcaption>
          </motion.figure>
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-2">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.name}
                type="button"
                aria-label={`Show testimonial from ${t.name}`}
                onClick={() => go(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-8 bg-primary" : "w-2 bg-border"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => go(index - 1)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-border transition-colors hover:border-primary hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => go(index + 1)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-border transition-colors hover:border-primary hover:text-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
