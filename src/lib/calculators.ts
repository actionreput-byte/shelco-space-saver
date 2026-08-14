export type SystemKey = "pallet" | "gondola" | "boltless";

export type SystemSpec = {
  key: SystemKey;
  label: string;
  /** Depth of one bay, metres */
  bayDepth: number;
  /** Width of one bay, metres */
  bayWidth: number;
  /** Vertical pitch between load levels, metres */
  levelPitch: number;
  /** Clearance kept below the roof, metres */
  topClearance: number;
  /** Storage positions per level in one bay */
  positionsPerLevel: number;
  positionLabel: string;
  /** Typical stored volume per position, cubic metres */
  volumePerPosition: number;
  /** Levels supplied as standard with the catalogue unit */
  standardLevels: number;
  /** Rated load per level, kg */
  loadPerLevel: number;
  /** Catalogue price per bay, TZS VAT inclusive */
  pricePerBay: number;
};

/**
 * Specs mirror the Shelco catalogue: warehouse racks are H2.5m × D0.5m with
 * 4 levels, supermarket gondolas are H1.8m × L0.9m.
 */
export const SYSTEMS = [
  {
    key: "pallet",
    label: "Medium duty rack (2 m)",
    bayDepth: 0.5,
    bayWidth: 2,
    levelPitch: 0.625,
    topClearance: 0,
    positionsPerLevel: 1,
    positionLabel: "shelf levels",
    volumePerPosition: 0.6,
    standardLevels: 4,
    loadPerLevel: 220,
    pricePerBay: 950000,
  },
  {
    key: "gondola",
    label: "Supermarket shelving",
    bayDepth: 0.45,
    bayWidth: 0.9,
    levelPitch: 0.36,
    topClearance: 0,
    positionsPerLevel: 1,
    positionLabel: "shelf levels",
    volumePerPosition: 0.14,
    standardLevels: 5,
    loadPerLevel: 150,
    pricePerBay: 450000,
  },
  {
    key: "boltless",
    label: "Light duty rack (2 m)",
    bayDepth: 0.5,
    bayWidth: 2,
    levelPitch: 0.625,
    topClearance: 0,
    positionsPerLevel: 1,
    positionLabel: "shelf levels",
    volumePerPosition: 0.6,
    standardLevels: 4,
    loadPerLevel: 170,
    pricePerBay: 750000,
  },
] as const satisfies readonly SystemSpec[];

export type CapacityInput = {
  length: number;
  width: number;
  height: number;
  aisleWidth: number;
  system: SystemKey;
};

export type CapacityResult = {
  floorArea: number;
  usableArea: number;
  rows: number;
  baysPerRow: number;
  bays: number;
  levels: number;
  positions: number;
  storageVolume: number;
  utilisation: number;
  /** Total rated load of the system, kg */
  totalLoadKg: number;
  /** Indicative catalogue cost, TZS VAT inclusive */
  totalPrice: number;
};

const clampPositive = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function calculateCapacity(input: CapacityInput): CapacityResult {
  const spec: SystemSpec =
    SYSTEMS.find((s) => s.key === input.system) ?? SYSTEMS[0];
  const length = clampPositive(input.length);
  const width = clampPositive(input.width);
  const height = clampPositive(input.height);
  const aisle = clampPositive(input.aisleWidth);

  const floorArea = length * width;
  if (!floorArea || !height) {
    return {
      floorArea: 0,
      usableArea: 0,
      rows: 0,
      baysPerRow: 0,
      bays: 0,
      levels: 0,
      positions: 0,
      storageVolume: 0,
      utilisation: 0,
      totalLoadKg: 0,
      totalPrice: 0,
    };
  }

  // Rows are laid back-to-back in pairs, separated by an aisle.
  const moduleDepth = spec.bayDepth * 2 + aisle;
  const modules = Math.max(0, Math.floor((width - 0.6) / moduleDepth));
  const rows = modules * 2;
  const baysPerRow = Math.max(0, Math.floor((length - 0.6) / spec.bayWidth));
  const bays = rows * baysPerRow;
  // Catalogue units ship with a fixed number of levels; taller rooms simply
  // allow the standard unit to stand, they do not add free levels.
  const fits = height >= spec.levelPitch * spec.standardLevels;
  const levels = fits
    ? spec.standardLevels
    : Math.max(1, Math.floor(height / spec.levelPitch));
  const positions = bays * levels * spec.positionsPerLevel;
  const usableArea = bays * spec.bayWidth * spec.bayDepth;
  const storageVolume = positions * spec.volumePerPosition;

  return {
    floorArea,
    usableArea,
    rows,
    baysPerRow,
    bays,
    levels,
    positions,
    storageVolume,
    utilisation: floorArea ? Math.min(100, (usableArea / floorArea) * 100) : 0,
    totalLoadKg: positions * spec.loadPerLevel,
    totalPrice: bays * spec.pricePerBay,
  };
}


export type RoiInput = {
  /** Monthly rent per square metre, TZS */
  rentPerSqm: number;
  /** Floor area of the facility, square metres */
  area: number;
  /** Investment in the storage system, TZS */
  investment: number;
  /** Extra effective capacity unlocked, percent */
  capacityGain: number;
  /** Monthly labour spend on handling and searching, TZS */
  labourCost: number;
};

export type RoiResult = {
  monthlyRent: number;
  spaceSavingPerMonth: number;
  labourSavingPerMonth: number;
  monthlyBenefit: number;
  paybackMonths: number;
  threeYearNet: number;
  roiPercent: number;
};

export function calculateRoi(input: RoiInput): RoiResult {
  const rentPerSqm = clampPositive(input.rentPerSqm);
  const area = clampPositive(input.area);
  const investment = clampPositive(input.investment);
  const gain = Math.max(0, Math.min(300, input.capacityGain || 0));
  const labour = clampPositive(input.labourCost);

  const monthlyRent = rentPerSqm * area;
  // Extra capacity avoids renting the equivalent extra floor space.
  const spaceSavingPerMonth = monthlyRent * (gain / 100);
  // Organised access typically removes a share of handling time.
  const labourSavingPerMonth = labour * 0.18;
  const monthlyBenefit = spaceSavingPerMonth + labourSavingPerMonth;
  const paybackMonths = monthlyBenefit > 0 ? investment / monthlyBenefit : 0;
  const threeYearNet = monthlyBenefit * 36 - investment;
  const roiPercent = investment > 0 ? (threeYearNet / investment) * 100 : 0;

  return {
    monthlyRent,
    spaceSavingPerMonth,
    labourSavingPerMonth,
    monthlyBenefit,
    paybackMonths,
    threeYearNet,
    roiPercent,
  };
}

export const formatNumber = (n: number, digits = 0) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(Number.isFinite(n) ? n : 0);

export const formatTzs = (n: number) =>
  `TZS ${formatNumber(Math.round(Number.isFinite(n) ? n : 0))}`;
