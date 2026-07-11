export const PLAN_IDS = [
  "standard",
  "professional",
  "elite",
  "permanent",
] as const;

export type PlanId = (typeof PLAN_IDS)[number];

export const PLAN_PRICES: Record<PlanId, number> = {
  standard: 49,
  professional: 99,
  elite: 150,
  permanent: 209,
};

export type PlanConfig = {
  id: PlanId;
  name: string;
  price: number;
  priceLabel: string;
  period: string;
  subtitle?: string;
  savings?: string;
  equivalent?: string;
  badge?: string;
  footnote?: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
};

const STANDARD_FEATURES = [
  "Daily 2–4 VIP Signals",
  "Entry, SL & TP — Every Trade",
  "Real-Time Telegram Alerts",
  "Live Modification Updates",
  "Full Education Library",
  "VIP Telegram Channel",
];

export const PLANS: Record<PlanId, PlanConfig> = {
  standard: {
    id: "standard",
    name: "STANDARD",
    price: 49,
    priceLabel: "$49",
    period: "/month",
    subtitle: "Monthly billing",
    description: "Monthly VIP signal access with full education library.",
    features: STANDARD_FEATURES,
    cta: "START NOW",
    href: "/payment/standard",
  },
  professional: {
    id: "professional",
    name: "PROFESSIONAL",
    price: 99,
    priceLabel: "$99",
    period: "/quarter",
    savings: "SAVE 33%",
    equivalent: "Equivalent $33/month",
    badge: "MOST POPULAR",
    description: "Quarterly billing with dedicated support.",
    features: [...STANDARD_FEATURES, "Dedicated Support (24hr)"],
    cta: "START NOW",
    href: "/payment/professional",
  },
  elite: {
    id: "elite",
    name: "ELITE",
    price: 150,
    priceLabel: "$150",
    period: "/year",
    savings: "SAVE 75%",
    equivalent: "Equivalent $12.50/month",
    badge: "BEST VALUE",
    description: "Annual access with priority support and monthly consultation.",
    features: [
      ...STANDARD_FEATURES,
      "Dedicated Support (24hr)",
      "Daily 3–6 VIP Signals",
      "Priority Support (4hr)",
      "Monthly 1-on-1 Call",
    ],
    cta: "START NOW",
    href: "/payment/elite",
  },
  permanent: {
    id: "permanent",
    name: "PERMANENT",
    price: 209,
    priceLabel: "$209",
    period: "one-time",
    subtitle: "Never pay again",
    badge: "LIFETIME ACCESS",
    footnote: "Limited spots available",
    description: "Lifetime access to all current and future research.",
    features: [
      ...STANDARD_FEATURES,
      "Dedicated Support (24hr)",
      "Daily 3–6 VIP Signals",
      "Priority Support (4hr)",
      "Monthly 1-on-1 Call",
      "Direct Line Support",
      "All Future Updates",
      "Personal Onboarding",
    ],
    cta: "SECURE LIFETIME ACCESS",
    href: "/payment/permanent",
  },
};

export function isValidPlan(plan: string): plan is PlanId {
  return PLAN_IDS.includes(plan as PlanId);
}
