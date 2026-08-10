import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import { SectionHeading, Stagger, StaggerItem } from "./motion-primitives";

const PROJECTS = [
  {
    image: portfolio1,
    sector: "Beverage distributor",
    area: "Kurasini, Dar es Salaam",
    scope: "Heavy-duty Dexion-style pallet racking, 6 levels high",
    result: "+68% pallet positions in the same footprint",
  },
  {
    image: portfolio2,
    sector: "Retail supermarket chain",
    area: "Kariakoo, Dar es Salaam",
    scope: "Boltless gondola shelving across three trading floors",
    result: "Restock time cut by roughly a third",
  },
  {
    image: portfolio3,
    sector: "Spare parts importer",
    area: "Changombe, Dar es Salaam",
    scope: "Slotted angle and boltless metal racks with bin locations",
    result: "Order picking accuracy up, searching almost eliminated",
  },
];

export function Portfolio() {
  return (
    <section id="portfolio" className="bg-muted/60 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Selected projects"
          title="Installations across Dar es Salaam"
          description="Client names are withheld for confidentiality. The steel, the layouts and the results are all ours."
        />

        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => (
            <StaggerItem key={p.sector}>
              <article className="group h-full overflow-hidden rounded-2xl border border-border bg-card shadow-lift">
                <div className="overflow-hidden">
                  <img
                    src={p.image}
                    alt={`${p.scope} installation`}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="h-44 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    {p.area}
                  </span>
                  <h3 className="mt-1 text-lg font-extrabold">{p.sector}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.scope}</p>
                  <p className="mt-3 rounded-lg bg-primary-soft px-3 py-2 text-sm font-semibold text-accent-foreground">
                    {p.result}
                  </p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
