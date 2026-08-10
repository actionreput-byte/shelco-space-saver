import iconRacking from "@/assets/icon-racking.png";
import iconShelving from "@/assets/icon-shelving.png";
import iconGeneral from "@/assets/icon-general.png";
import iconAccessories from "@/assets/icon-accessories.png";
import { SectionHeading, Stagger, StaggerItem } from "./motion-primitives";

const SERVICES = [
  {
    icon: iconRacking,
    title: "Racking Solutions",
    body: "Our racking systems are Dexion style, manufactured with high-grade Q235 steel and feature a robust boltless design. This makes them ideal for heavy-duty applications, such as storing palletized cargo in large warehouses, ensuring stability and durability.",
  },
  {
    icon: iconShelving,
    title: "Shelving Solutions",
    body: "Our commercial gondola shelving is a versatile boltless system, perfectly suited for small to medium merchandising needs. It provides an organized and attractive way to display goods, making it an excellent choice for retail outlets and supermarkets.",
  },
  {
    icon: iconGeneral,
    title: "General Shelving & Racking",
    body: "We provide racking and shelving solutions for every walk of life — from a basic metal shelf for books and files at home or the office, to slotted angle racks for the garage, boltless metal racks for retail outlets and heavy-duty pallet racks for warehouses.",
  },
  {
    icon: iconAccessories,
    title: "Accessories",
    body: "We stock a wide range of high-quality racking, supermarket and related accessories to complement your storage system.",
  },
];

export function Services() {
  return (
    <section id="services" className="bg-muted/60 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Services"
          title="Storage systems built in Q235 steel"
          description="Four core solution families, engineered for Tanzanian warehouses, retail floors, workshops and homes."
        />

        <Stagger className="grid gap-4 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <StaggerItem key={s.title}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-lift transition-transform duration-300 hover:-translate-y-1.5">
                <span className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary-soft transition-transform duration-500 group-hover:scale-150" />
                <img
                  src={s.icon}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  width={768}
                  height={768}
                  className="relative h-24 w-24 object-contain transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-3"
                />
                <h3 className="relative mt-3 text-xl font-extrabold">{s.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
