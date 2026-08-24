import racking from "@/assets/service-racking.jpg";
import shelving from "@/assets/service-shelving.jpg";
import general from "@/assets/service-general.jpg";
import accessories from "@/assets/service-accessories.jpg";
import iconRacking from "@/assets/icon-racking.png";
import iconShelving from "@/assets/icon-shelving.png";
import iconGeneral from "@/assets/icon-general.png";
import iconAccessories from "@/assets/icon-accessories.png";
import iconSpace from "@/assets/icon-space.png";
import iconRoi from "@/assets/icon-roi.png";
import iconTime from "@/assets/icon-time.png";
import type { SystemKey } from "@/lib/calculators";

export type ServiceSlug =
  | "racking-solutions"
  | "shelving-solutions"
  | "general-shelving-racking"
  | "accessories";

export type ServiceData = {
  slug: ServiceSlug;
  name: string;
  quoteService: string;
  hero: string;
  icon: string;
  headline: string;
  subhead: string;
  title: string;
  description: string;
  system: SystemKey;
  benefits: { icon: string; title: string; body: string }[];
  features: string[];
  faqs: { q: string; a: string }[];
};

export const SERVICES: ServiceData[] = [
  {
    slug: "racking-solutions",
    name: "Racking Solutions",
    quoteService: "Racking Solutions",
    hero: racking,
    icon: iconRacking,
    headline: "Pallet Racking Systems for Dar es Salaam Warehouses",
    subhead:
      "Selective, drive-in, cantilever and mezzanine racking in Q235 steel — designed, manufactured and installed by Shelco.",
    title: "Pallet Racking Dar es Salaam | Warehouse Racking Systems | Shelco",
    description:
      "Heavy-duty pallet racking systems in Q235 steel for warehouses in Dar es Salaam and across Tanzania. Free site visit, load-rated design and in-house installation.",
    system: "pallet",
    benefits: [
      {
        icon: iconSpace,
        title: "Use your full height",
        body: "Racking turns unused vertical space into thousands of extra pallet positions without renting a bigger warehouse.",
      },
      {
        icon: iconRoi,
        title: "Fast payback",
        body: "Most clients recover the investment within a year through avoided rent and faster picking.",
      },
      {
        icon: iconTime,
        title: "Installed by our own teams",
        body: "Survey, drawing, manufacture and installation handled end to end — no third-party fitters.",
      },
    ],
    features: [
      "Selective pallet racking with adjustable beam levels",
      "Drive-in and double-deep racking for high-density storage",
      "Cantilever racking for pipes, timber and long loads",
      "Mezzanine floors and multi-tier picking systems",
      "Load-rated design with beam capacity labelling",
      "Safety accessories: column guards, mesh decks, pallet supports",
    ],
    faqs: [
      {
        q: "How much weight can Shelco pallet racking carry?",
        a: "Beam levels are engineered to your pallet weight — typically 1,000 kg to 3,500 kg per level. Every bay is labelled with its rated capacity.",
      },
      {
        q: "Can you install racking in an operating warehouse?",
        a: "Yes. We phase installation aisle by aisle, including night and weekend work, so your operations keep running.",
      },
      {
        q: "Do you supply drawings and layouts?",
        a: "Every quotation includes a layout drawing showing bay positions, aisle widths and pallet positions gained.",
      },
      {
        q: "How long does a racking project take?",
        a: "After the site visit, standard projects are manufactured and installed within 2–4 weeks depending on size.",
      },
    ],
  },
  {
    slug: "shelving-solutions",
    name: "Shelving Solutions",
    quoteService: "Shelving Solutions",
    hero: shelving,
    icon: iconShelving,
    headline: "Retail & Gondola Shelving for Shops and Supermarkets",
    subhead:
      "Display more stock, merchandise it better and sell faster with Shelco gondola, wall and end-cap shelving.",
    title: "Retail & Gondola Shelving Dar es Salaam | Shop Shelving | Shelco",
    description:
      "Gondola, wall and stockroom shelving for supermarkets, pharmacies and shops in Dar es Salaam. Powder-coated Q235 steel, free layout design and installation.",
    system: "gondola",
    benefits: [
      {
        icon: iconSpace,
        title: "More facings per square metre",
        body: "Optimised gondola runs and shelf pitch let you display more SKUs in the same shop floor.",
      },
      {
        icon: iconRoi,
        title: "Built for retail traffic",
        body: "Powder-coated steel that survives daily restocking, trolleys and humidity on the coast.",
      },
      {
        icon: iconTime,
        title: "Fast shop fit-outs",
        body: "Standard shelving is delivered and installed in days, so you open on schedule.",
      },
    ],
    features: [
      "Single and double-sided gondola runs",
      "Wall shelving, end caps and promotional units",
      "Adjustable shelf pitch, price rails and dividers",
      "Pharmacy, hardware and supermarket configurations",
      "Stockroom shelving matched to the shop floor",
      "Custom colours to match your brand",
    ],
    faqs: [
      {
        q: "Can shelving match our brand colours?",
        a: "Yes — gondola panels and uprights can be powder-coated in your brand colour on request.",
      },
      {
        q: "Do you do full shop layouts?",
        a: "We design the full floor plan: aisle flow, gondola runs, end caps and checkout units.",
      },
      {
        q: "Is the shelving adjustable?",
        a: "All shelf levels adjust on 25–50 mm pitch so you can re-merchandise at any time.",
      },
      {
        q: "Do you supply outside Dar es Salaam?",
        a: "Yes, we deliver and install countrywide, including Arusha, Mwanza, Dodoma and Mbeya.",
      },
    ],
  },
  {
    slug: "general-shelving-racking",
    name: "General Shelving & Racking",
    quoteService: "General Shelving & Racking",
    hero: general,
    icon: iconGeneral,
    headline: "Boltless Shelving for Offices, Workshops, Stores and Homes",
    subhead:
      "Strong, affordable slotted-angle and boltless shelving that assembles in minutes and carries real weight.",
    title: "Boltless Shelving Tanzania | Office & Workshop Storage | Shelco",
    description:
      "Boltless and slotted-angle steel shelving for offices, archives, workshops, stores and homes in Dar es Salaam. Affordable, adjustable and delivered fast.",
    system: "boltless",
    benefits: [
      {
        icon: iconSpace,
        title: "Tidy every store room",
        body: "Turn cluttered floor stacks into clean, labelled, searchable shelf levels.",
      },
      {
        icon: iconRoi,
        title: "Affordable per shelf",
        body: "The lowest cost per storage level in our range — ideal for archives and spare parts.",
      },
      {
        icon: iconTime,
        title: "Assembles in minutes",
        body: "Boltless design means no welding and no special tools; move or extend it any time.",
      },
    ],
    features: [
      "Boltless rivet shelving with 4–6 levels",
      "Slotted-angle shelving cut to your dimensions",
      "Archive and file-box shelving for offices",
      "Workshop and spare-parts shelving with bins",
      "Home garage, pantry and duka shelving",
      "Galvanised or powder-coated finishes",
    ],
    faqs: [
      {
        q: "How much does a shelf level hold?",
        a: "Standard boltless units carry 150–350 kg per level, depending on shelf width and board type.",
      },
      {
        q: "Can I get custom sizes?",
        a: "Yes — we fabricate to your room dimensions, including corner and under-stair runs.",
      },
      {
        q: "Do you sell single units?",
        a: "We supply anything from one unit for a home or duka to hundreds for a warehouse.",
      },
      {
        q: "Is installation included?",
        a: "Delivery and installation in Dar es Salaam can be included in your quotation.",
      },
    ],
  },
  {
    slug: "accessories",
    name: "Accessories",
    quoteService: "Accessories",
    hero: accessories,
    icon: iconAccessories,
    headline: "Racking Accessories, Spares and Safety Fittings",
    subhead:
      "Wire mesh decks, pallet supports, column guards, beams and dividers — keep your existing system safe and productive.",
    title: "Racking Accessories & Spares Dar es Salaam | Shelco Storage Systems",
    description:
      "Beams, wire mesh decks, pallet supports, column guards, dividers and safety fittings for pallet racking and shelving in Dar es Salaam, Tanzania.",
    system: "pallet",
    benefits: [
      {
        icon: iconSpace,
        title: "Store awkward loads",
        body: "Mesh decks and pallet supports let you store cartons, drums and odd-sized goods safely.",
      },
      {
        icon: iconRoi,
        title: "Protect your investment",
        body: "Column guards and end barriers prevent forklift damage that costs far more to repair.",
      },
      {
        icon: iconTime,
        title: "Available off the shelf",
        body: "Common beams, decks and fittings are stocked for quick collection or delivery.",
      },
    ],
    features: [
      "Box beams and connectors in all standard lengths",
      "Wire mesh decks and timber shelf panels",
      "Pallet supports and drum cradles",
      "Column guards, end-of-aisle barriers and bollards",
      "Shelf dividers, bins, and label holders",
      "Load-capacity signage and safety inspections",
    ],
    faqs: [
      {
        q: "Do your accessories fit other racking brands?",
        a: "Many do — send us photos and beam measurements and we will confirm compatibility.",
      },
      {
        q: "Can you inspect our existing racking?",
        a: "Yes, we run safety inspections and supply the replacement components needed.",
      },
      {
        q: "Are mesh decks fire-safe?",
        a: "Wire mesh decking is preferred for sprinkler compliance because water passes through it.",
      },
      {
        q: "Do you deliver small orders?",
        a: "Yes, accessories can be collected at our Nnamdi Azikiwe Ave premises or delivered anywhere in Tanzania.",
      },
    ],
  },
];

export const getService = (slug: ServiceSlug) =>
  SERVICES.find((s) => s.slug === slug) as ServiceData;
