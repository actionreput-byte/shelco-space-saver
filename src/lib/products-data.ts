import rack1m from "@/assets/products/rack-1m.jpg.asset.json";
import rack15m from "@/assets/products/rack-15m.jpg.asset.json";
import rack2m from "@/assets/products/rack-2m.jpg.asset.json";
import shelfSingle from "@/assets/products/shelf-single.jpg.asset.json";
import shelfDouble from "@/assets/products/shelf-double.jpg.asset.json";
import trolleyPush from "@/assets/products/trolley-push.jpg.asset.json";
import trolleyPlastic from "@/assets/products/trolley-plastic.jpg.asset.json";
import basketMetal from "@/assets/products/basket-metal.jpg.asset.json";
import basketPlastic from "@/assets/products/basket-plastic.jpg.asset.json";
import counterTable from "@/assets/products/counter-table.jpg.asset.json";

export type ProductCategory = "warehouse" | "supermarket" | "accessories";

export type Product = {
  id: string;
  name: string;
  nameSw: string;
  category: ProductCategory;
  image: string;
  duty?: "light" | "medium";
  dims: string;
  /** metres */
  height?: number;
  length?: number;
  depth?: number;
  levels?: number;
  /** kg carried per level (racks/shelves) */
  loadPerLevel?: number;
  notes: string;
  notesSw: string;
};

export const CATEGORIES: {
  key: ProductCategory;
  label: string;
  labelSw: string;
}[] = [
  { key: "warehouse", label: "Warehouse racks", labelSw: "Rack za ghala" },
  { key: "supermarket", label: "Supermarket shelves", labelSw: "Shelf za duka" },
  { key: "accessories", label: "Accessories", labelSw: "Vifaa vya ziada" },
];

export const PRODUCTS: Product[] = [
  {
    id: "rack-light-1m",
    name: "Light duty rack — 1 m",
    nameSw: "Rack nyepesi — 1 m",
    category: "warehouse",
    image: rack1m.url,
    duty: "light",
    dims: "H 2.5 m × L 1 m × D 0.5 m",
    height: 2.5,
    length: 1,
    depth: 0.5,
    levels: 4,
    loadPerLevel: 90,
    notes: "4 levels, carries 90 kg per level.",
    notesSw: "Ngazi 4, hubeba kilo 90 kila ngazi.",
  },
  {
    id: "rack-medium-1m",
    name: "Medium duty rack — 1 m",
    nameSw: "Rack ya wastani — 1 m",
    category: "warehouse",
    image: rack1m.url,
    duty: "medium",
    dims: "H 2.5 m × L 1 m × D 0.5 m",
    height: 2.5,
    length: 1,
    depth: 0.5,
    levels: 4,
    loadPerLevel: 110,
    notes: "4 levels, carries 110 kg per level.",
    notesSw: "Ngazi 4, hubeba kilo 110 kila ngazi.",
  },
  {
    id: "rack-light-15m",
    name: "Light duty rack — 1.5 m",
    nameSw: "Rack nyepesi — 1.5 m",
    category: "warehouse",
    image: rack15m.url,
    duty: "light",
    dims: "H 2.5 m × L 1.5 m × D 0.5 m",
    height: 2.5,
    length: 1.5,
    depth: 0.5,
    levels: 4,
    loadPerLevel: 110,
    notes: "4 levels, carries 110 kg per level.",
    notesSw: "Ngazi 4, hubeba kilo 110 kila ngazi.",
  },
  {
    id: "rack-light-2m",
    name: "Light duty rack — 2 m",
    nameSw: "Rack nyepesi — 2 m",
    category: "warehouse",
    image: rack2m.url,
    duty: "light",
    dims: "H 2.5 m × L 2 m × D 0.5 m",
    height: 2.5,
    length: 2,
    depth: 0.5,
    levels: 4,
    loadPerLevel: 170,
    notes: "4 levels, carries 170 kg per level.",
    notesSw: "Ngazi 4, hubeba kilo 170 kila ngazi.",
  },
  {
    id: "rack-medium-2m",
    name: "Medium duty rack — 2 m",
    nameSw: "Rack ya wastani — 2 m",
    category: "warehouse",
    image: rack2m.url,
    duty: "medium",
    dims: "H 2.5 m × L 2 m × D 0.5 m",
    height: 2.5,
    length: 2,
    depth: 0.5,
    levels: 4,
    loadPerLevel: 220,
    notes: "4 levels, carries 220 kg per level.",
    notesSw: "Ngazi 4, hubeba kilo 220 kila ngazi.",
  },
  {
    id: "shelf-single",
    name: "Single side shelf",
    nameSw: "Shelf ya upande mmoja",
    category: "supermarket",
    image: shelfSingle.url,
    dims: "H 180 cm × L 90 cm × D 45 cm (6ft × 3ft × 1.49ft)",
    height: 1.8,
    length: 0.9,
    depth: 0.45,
    levels: 5,
    loadPerLevel: 150,
    notes: "Carries 150 kg separately. Ideal for supermarket aisles and walls.",
    notesSw: "Hubeba kilo 150. Nzuri kwa duka kubwa na kuta.",
  },
  {
    id: "shelf-double",
    name: "Double side shelf",
    nameSw: "Shelf ya pande mbili",
    category: "supermarket",
    image: shelfDouble.url,
    dims: "H 180 cm × L 90 cm × D 90 cm (6ft × 3ft × 2.98ft)",
    height: 1.8,
    length: 0.9,
    depth: 0.9,
    levels: 5,
    loadPerLevel: 300,
    notes: "Carries 300 kg separately. Best for centre gondola runs.",
    notesSw: "Hubeba kilo 300. Bora kwa safu za katikati.",
  },
  {
    id: "counter-table",
    name: "Counter table",
    nameSw: "Meza ya kaunta",
    category: "supermarket",
    image: counterTable.url,
    dims: "H 100 cm × L 120 cm × D 120 cm",
    height: 1,
    length: 1.2,
    depth: 1.2,
    notes: "L-shaped checkout counter for supermarkets and shops.",
    notesSw: "Kaunta ya malipo yenye umbo la L kwa maduka.",
  },
  {
    id: "trolley-push",
    name: "Pushing trolley",
    nameSw: "Toroli ya kusukuma",
    category: "accessories",
    image: trolleyPush.url,
    dims: "Chrome steel shopping trolley",
    notes: "Heavy-gauge chrome trolley for supermarket floors.",
    notesSw: "Toroli imara ya chuma kwa maduka makubwa.",
  },
  {
    id: "trolley-plastic",
    name: "Plastic trolley",
    nameSw: "Toroli ya plastiki",
    category: "accessories",
    image: trolleyPlastic.url,
    dims: "Available in red and blue",
    notes: "Wheeled plastic basket trolley with long handle.",
    notesSw: "Kikapu cha plastiki chenye magurudumu na mpini mrefu.",
  },
  {
    id: "basket-metal",
    name: "Metal basket",
    nameSw: "Kikapu cha chuma",
    category: "accessories",
    image: basketMetal.url,
    dims: "Chrome hand basket",
    notes: "Durable chrome hand basket with folding handles.",
    notesSw: "Kikapu imara cha chuma chenye mipini inayokunjika.",
  },
  {
    id: "basket-plastic",
    name: "Plastic basket",
    nameSw: "Kikapu cha plastiki",
    category: "accessories",
    image: basketPlastic.url,
    dims: "Red plastic hand basket",
    notes: "Light hand basket for quick shopping trips.",
    notesSw: "Kikapu chepesi kwa manunuzi ya haraka.",
  },
];

export const FREE_SERVICES = [
  { en: "Free site survey in Dar es Salaam", sw: "Ukaguzi wa eneo bure Dar es Salaam" },
  {
    en: "Free installation & fitting in Dar es Salaam",
    sw: "Ufungaji bure ndani ya Dar es Salaam",
  },
];
