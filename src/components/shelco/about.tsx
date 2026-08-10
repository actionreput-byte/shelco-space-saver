import iconSpace from "@/assets/icon-space.png";
import iconRoi from "@/assets/icon-roi.png";
import iconTime from "@/assets/icon-time.png";
import { Reveal, SectionHeading, Stagger, StaggerItem } from "./motion-primitives";

const PILLARS = [
  {
    icon: iconSpace,
    title: "Optimising space",
    body: "We help you make the most of your available square footage, allowing you to store more inventory.",
  },
  {
    icon: iconRoi,
    title: "Maximising ROI",
    body: "By utilising your space efficiently, we ensure you get a better return on your investment.",
  },
  {
    icon: iconTime,
    title: "Saving time",
    body: "Organised systems give easy access to materials, streamlining operations and saving valuable time.",
  },
];

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
      <SectionHeading
        eyebrow="About us"
        title="About Shelco Storage Systems"
        description="Our mission is simple: to deliver efficient storage and maximise space utilisation. We partner with you to organise and store your products in the most cost-effective way possible."
      />

      <Stagger className="grid gap-4 sm:grid-cols-3">
        {PILLARS.map((p) => (
          <StaggerItem key={p.title}>
            <article className="group h-full rounded-2xl border border-border bg-card p-5 shadow-lift transition-transform duration-300 hover:-translate-y-1.5">
              <img
                src={p.icon}
                alt=""
                aria-hidden="true"
                loading="lazy"
                width={768}
                height={768}
                className="h-20 w-20 object-contain float-slow"
              />
              <h3 className="mt-3 text-lg font-extrabold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </article>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal delay={0.1} className="mt-6">
        <div className="rounded-2xl steel-gradient p-6 text-steel-foreground shadow-lift">
          <p className="text-base leading-relaxed">
            From a single shelf in your home to a complex pallet racking system
            in a large warehouse, we provide the perfect solution for any
            storage need — designed, delivered and installed from Changombe,
            Dar es Salaam.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
