export function tzs(value: number | string | null | undefined) {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency: "TZS",
    maximumFractionDigits: 0,
  }).format(n);
}

export function num(value: number | string | null | undefined, digits = 0) {
  return new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number(value ?? 0));
}

export function shortDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  quote: "Quote",
  confirmed: "Confirmed",
  in_production: "In production",
  installed: "Installed",
  closed: "Closed",
  cancelled: "Cancelled",
};

export const INVOICE_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  partially_paid: "Part paid",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

export const CLIENT_STATUS_LABELS: Record<string, string> = {
  lead: "Lead",
  active: "Active",
  dormant: "Dormant",
  blocked: "Blocked",
};
