import blog1 from "@/assets/blog-1.jpg";
import blog2 from "@/assets/blog-2.jpg";
import blog3 from "@/assets/blog-3.jpg";
import blog4 from "@/assets/blog-4.jpg";
import type { ServiceSlug } from "@/lib/services-data";

export type BlogSection = { heading: string; paragraphs: string[]; bullets?: string[] };

export type BlogPost = {
  slug: string;
  /** i18n key prefix used by the homepage teaser grid */
  key: "blog.b1" | "blog.b2" | "blog.b3" | "blog.b4";
  image: string;
  minutes: number;
  tag: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  date: string;
  intro: string;
  sections: BlogSection[];
  takeaway: string;
  relatedServices: ServiceSlug[];
  relatedPosts: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "warehouse-vertical-space-racking",
    key: "blog.b1",
    image: blog1,
    minutes: 5,
    tag: "Space planning",
    title: "Stop paying rent for empty air above your racking",
    metaTitle: "Warehouse Vertical Space: Stop Paying Rent for Empty Air | Shelco",
    metaDescription:
      "How Dar es Salaam warehouses recover 40-60% more pallet positions by using clear height instead of renting extra floor space. Practical steps from Shelco engineers.",
    excerpt:
      "Most warehouses in Dar es Salaam rent floor area but store goods barely two metres high. Here is how to convert that unused height into pallet positions.",
    date: "2026-02-10",
    intro:
      "Warehouse rent in Dar es Salaam is charged per square metre of floor, but goods are stored in cubic metres. If your building has 8 metres of clear height and your stock sits 2.4 metres high, you are paying for roughly two thirds of a building you never use. Racking is the cheapest way to buy that space back.",
    sections: [
      {
        heading: "Measure the height you actually have",
        paragraphs: [
          "Clear height is the distance from the finished floor to the lowest obstruction — a roof truss, sprinkler head, light fitting or crane beam — not to the apex of the roof. Measure it in several places, because coastal warehouses often slope for drainage.",
          "Subtract 300–500 mm for pallet overhang and safe lifting clearance above the top beam. What remains is the height available for beam levels.",
        ],
        bullets: [
          "Measure clear height at four points and use the lowest reading",
          "Note sprinkler, lighting and roller-shutter heights",
          "Record the floor slab condition — racking needs a level, load-rated slab",
        ],
      },
      {
        heading: "Match beam levels to your pallet profile",
        paragraphs: [
          "Beam pitch should follow the height of your loaded pallet plus around 150 mm for lift clearance. Mixing two pitches on the same run — for example short cartons low down and tall drums at the top — usually wins more positions than one uniform setting.",
          "A typical 8 m clear-height bay carries four beam levels plus a floor level. Compared with block-stacking two pallets high, that is a 150% increase in positions on the same footprint.",
        ],
      },
      {
        heading: "Check the forklift before you buy racking",
        paragraphs: [
          "There is no point designing 9 m of racking for a truck that lifts 4.5 m. Confirm the mast lift height, the residual capacity at full height, and the minimum aisle the truck needs to turn with a loaded pallet.",
          "Where the existing truck is the limit, a reach truck or a narrow-aisle configuration often costs less than renting a second warehouse.",
        ],
      },
      {
        heading: "Do the rent maths before the racking maths",
        paragraphs: [
          "Take your monthly rent per square metre, multiply by the floor area you would need to rent to hold the same pallets on the ground, and compare it with the one-off cost of racking. In most projects we survey, the racking pays for itself in under twelve months of avoided rent.",
        ],
      },
    ],
    takeaway:
      "Before signing a bigger lease, measure your clear height. A load-rated racking layout usually buys back more capacity than a second building — at a fraction of the annual cost.",
    relatedServices: ["racking-solutions", "accessories"],
    relatedPosts: ["aisle-width-warehouse-capacity", "racking-inspection-checklist"],
  },
  {
    slug: "racking-inspection-checklist",
    key: "blog.b2",
    image: blog2,
    minutes: 6,
    tag: "Safety",
    title: "The racking inspection checklist every warehouse needs",
    metaTitle: "Racking Safety Inspection Checklist for Warehouses | Shelco Tanzania",
    metaDescription:
      "A practical weekly and annual pallet racking inspection checklist: damage classes, beam deflection, load signage and repair rules for Tanzanian warehouses.",
    excerpt:
      "Racking rarely collapses without warning. This checklist covers the weekly walk-round and the annual expert inspection that catch damage early.",
    date: "2026-02-24",
    intro:
      "Almost every racking failure we are called out to started as a small forklift knock that nobody logged. A structured inspection routine costs nothing but attention, and it is the single highest-return safety habit a warehouse can build.",
    sections: [
      {
        heading: "The weekly walk-round",
        paragraphs: [
          "Nominate one person — usually the store supervisor — to walk every aisle once a week with a clipboard or phone form. They are looking for changes, not perfection.",
        ],
        bullets: [
          "Bent, dented or twisted uprights, especially in the bottom 1 metre",
          "Beams that are not fully seated, or missing safety pins and clips",
          "Beam deflection greater than roughly 1/200 of the span under load",
          "Loose, cracked or missing floor-fixing bolts and shims",
          "Damaged or missing wire mesh decks and pallet supports",
          "Pallets overhanging the beams or stacked over the rated load",
        ],
      },
      {
        heading: "Classify the damage before you decide",
        paragraphs: [
          "Use a simple three-colour system. Green means monitor and record. Amber means the component must be replaced within four weeks and the location may stay loaded. Red means offload the bay immediately, barrier it off and replace the component before reloading.",
          "Never straighten a bent upright or weld a repair plate onto cold-formed racking steel. The section loses its rated capacity and the repair hides the crack that follows.",
        ],
      },
      {
        heading: "The annual expert inspection",
        paragraphs: [
          "Once a year, an inspection should be carried out by someone independent of daily operations who can read load charts and confirm that the installed configuration still matches the design drawing. Beam levels get moved over time and capacity changes with them.",
          "The report should list every location by aisle, bay and level, with a photograph and a damage class for each finding, plus a re-inspection date.",
        ],
      },
      {
        heading: "Prevention pays better than repair",
        paragraphs: [
          "Column guards at aisle ends, end-of-aisle barriers, and floor markings that keep pallets square cost a small fraction of a replaced frame — and far less than a day of lost operations.",
          "Load-capacity signage at each run matters too: staff cannot respect a limit that is not written on the rack.",
        ],
      },
    ],
    takeaway:
      "Log every knock, classify it honestly, and replace damaged components rather than repairing them. Weekly walk-rounds plus one annual expert inspection keep a warehouse both legal and running.",
    relatedServices: ["accessories", "racking-solutions"],
    relatedPosts: ["warehouse-vertical-space-racking", "aisle-width-warehouse-capacity"],
  },
  {
    slug: "gondola-shelving-layouts-that-sell",
    key: "blog.b3",
    image: blog3,
    minutes: 6,
    tag: "Retail",
    title: "Gondola shelving layouts that lift shop-floor sales",
    metaTitle: "Gondola Shelving Layouts That Increase Shop Sales | Shelco Dar es Salaam",
    metaDescription:
      "Aisle flow, shelf pitch, eye-level zoning and end caps: how supermarket and duka owners in Tanzania lay out gondola shelving to sell more per square metre.",
    excerpt:
      "The same stock sells differently depending on where it sits. Here is how to plan gondola runs, sight lines and end caps for a Tanzanian shop floor.",
    date: "2026-03-08",
    intro:
      "A shop floor is a sales tool, not a storeroom. Shelving decides what customers see, how far they walk and how quickly staff can restock. These are the layout rules we apply when designing supermarket and duka fit-outs.",
    sections: [
      {
        heading: "Plan the walk before the shelves",
        paragraphs: [
          "Draw the path a customer takes from the door to the till. Most shoppers turn right on entry, so the first run on the right earns the highest-margin impulse lines.",
          "Keep the main circulation aisle at 1.8–2.2 m so two trolleys can pass, and secondary aisles at 1.2–1.5 m. Anything narrower and customers avoid the aisle when someone is restocking.",
        ],
      },
      {
        heading: "Zone each gondola by height",
        paragraphs: [
          "Shelf height changes sales more than shelf width. Treat every bay as four zones and merchandise accordingly.",
        ],
        bullets: [
          "Above 1.6 m: stock display, light packaging, brand blocks",
          "1.2–1.6 m (eye level): highest margin and promoted lines",
          "0.8–1.2 m (reach level): everyday staples and refills",
          "Below 0.8 m: bulk packs, heavy items, children's products",
        ],
      },
      {
        heading: "Set shelf pitch to your packaging, not to habit",
        paragraphs: [
          "Measure your tallest fast-moving pack, add 40 mm, and set the pitch from that. Shelves set too far apart waste a whole level per bay; set too close, staff force stock and facings collapse.",
          "Adjustable 25–50 mm pitch lets you re-merchandise seasonally without buying new shelving.",
        ],
      },
      {
        heading: "Use end caps and sight lines deliberately",
        paragraphs: [
          "End caps are the most valuable square metre in the shop. Reserve them for promotions with a clear price message, and change them at least monthly so regular customers notice.",
          "Keep gondola runs low enough — typically 1.6–1.8 m — near the entrance and the tills so staff can see across the floor. Visibility reduces shrinkage and helps customers orient themselves.",
        ],
      },
      {
        heading: "Design the stockroom to match the floor",
        paragraphs: [
          "Restocking speed is a layout problem. Mirror the shop-floor categories in the stockroom shelving so staff pick a full trolley in one pass instead of walking the room twice.",
        ],
      },
    ],
    takeaway:
      "Design the customer walk first, zone every bay by height, and keep pitch adjustable. Those three decisions typically lift sales per square metre more than adding stock.",
    relatedServices: ["shelving-solutions", "general-shelving-racking"],
    relatedPosts: ["aisle-width-warehouse-capacity", "warehouse-vertical-space-racking"],
  },
  {
    slug: "aisle-width-warehouse-capacity",
    key: "blog.b4",
    image: blog4,
    minutes: 5,
    tag: "Design",
    title: "Aisle width: the number that decides your capacity",
    metaTitle: "Warehouse Aisle Width vs Storage Capacity Explained | Shelco",
    metaDescription:
      "Wide aisle, narrow aisle or very narrow aisle? How aisle width trades against pallet positions, forklift choice and picking speed in Tanzanian warehouses.",
    excerpt:
      "Every 300 mm you take out of an aisle turns into pallet positions — until picking slows down. Here is how to find the right balance.",
    date: "2026-03-22",
    intro:
      "Aisle width is the quiet decision that fixes your warehouse capacity for the next decade. Get it wrong on the wide side and you store air; get it wrong on the narrow side and your existing forklift cannot work the racking.",
    sections: [
      {
        heading: "The three standard configurations",
        paragraphs: [
          "Each configuration trades floor efficiency against equipment cost and picking speed.",
        ],
        bullets: [
          "Wide aisle (3.0–3.5 m): works with any counterbalance forklift, lowest equipment cost, lowest density",
          "Narrow aisle (2.4–2.8 m): needs a reach truck, typically 20–25% more pallet positions",
          "Very narrow aisle (1.6–1.9 m): needs guided turret trucks and a very flat floor, highest density",
        ],
      },
      {
        heading: "Work backwards from the truck, not the drawing",
        paragraphs: [
          "Every forklift has a published right-angle stack aisle figure. Take that number, add the pallet length, then add 150–200 mm of operating clearance. That is your real minimum aisle — designing tighter guarantees damaged frames.",
          "If you plan to buy a different truck within two years, design for that truck now. Re-spacing racking later means dismantling and re-drilling the floor.",
        ],
      },
      {
        heading: "Density is not the only metric",
        paragraphs: [
          "Narrow aisles store more but slow down each pick, and they force single-truck working in each aisle. For a fast-moving distribution operation, throughput per hour may be worth more than the extra positions.",
          "A common compromise is a mixed layout: wide aisles for fast movers near the dispatch door, narrow aisles for slow-moving bulk at the back.",
        ],
      },
      {
        heading: "Do not forget the floor and the cross aisles",
        paragraphs: [
          "Narrow-aisle trucks demand a flat, load-rated slab; on a poor floor the mast sway alone will strike the racking. Plan cross aisles roughly every 25–30 m so staff and pallet trucks are not forced to travel a full run to change aisle.",
        ],
      },
    ],
    takeaway:
      "Pick the truck first, calculate the minimum safe aisle from its stacking figure, then let the layout follow. That order avoids the most expensive mistake in warehouse design.",
    relatedServices: ["racking-solutions", "shelving-solutions"],
    relatedPosts: ["warehouse-vertical-space-racking", "racking-inspection-checklist"],
  },
];

export const getPost = (slug: string) => BLOG_POSTS.find((p) => p.slug === slug);
