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
};

export const SYSTEMS = [
  {
    key: "pallet",
    label: "Pallet racking",
    bayDepth: 1.1,
    bayWidth: 2.7,
    levelPitch: 1.65,
    topClearance: 0.6,
    positionsPerLevel: 2,
    positionLabel: "pallet positions",
    volumePerPosition: 1.6,
  },
  {
    key: "gondola",
    label: "Gondola shelving",
    bayDepth: 0.5,
    bayWidth: 1.25,
    levelPitch: 0.42,
    topClearance: 0.3,
    positionsPerLevel: 1,
    positionLabel: "shelf bays",
    volumePerPosition: 0.26,
  },
  {
    key: "boltless",
    label: "Boltless metal racks",
    bayDepth: 0.6,
    bayWidth: 1.8,
    levelPitch: 0.6,
    topClearance: 0.3,
    positionsPerLevel: 1,
    positionLabel: "shelf levels",
    volumePerPosition: 0.65,
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
    };
  }

  // Rows are laid back-to-back in pairs, separated by an aisle.
  const moduleDepth = spec.bayDepth * 2 + aisle;
  const modules = Math.max(0, Math.floor((width - 0.6) / moduleDepth));
  const rows = modules * 2;
  const baysPerRow = Math.max(0, Math.floor((length - 0.6) / spec.bayWidth));
  const bays = rows * baysPerRow;
  const levels = Math.max(
    1,
    Math.floor((height - spec.topClearance) / spec.levelPitch),
  );
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
