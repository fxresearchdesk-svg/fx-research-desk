import Link from "next/link";
import { cn } from "@/lib/utils";

type PlanCard = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  period: string;
  href: string;
  cta: string;
  badge?: string;
  featured?: boolean;
  features: { text: string; plus?: boolean }[];
};

const PLANS: PlanCard[] = [
  {
    id: "standard",
    name: "STANDARD",
    tagline: "Start Your Edge",
    price: 49,
    period: "/ mo",
    href: "/payment/standard",
    cta: "SELECT — $49",
    features: [
      { text: "Daily 2–4 VIP signals" },
      { text: "Entry, SL & TP — every trade" },
      { text: "Real-time Telegram alerts" },
      { text: "Live modification & closing updates" },
    ],
  },
  {
    id: "professional",
    name: "PROFESSIONAL",
    tagline: "Accelerate Returns",
    price: 99,
    period: "/ qtr",
    href: "/payment/professional",
    cta: "SELECT — $99",
    badge: "MOST POPULAR",
    featured: true,
    features: [
      { text: "All Standard features, plus:", plus: true },
      { text: "Dedicated support" },
      { text: "Extended technical breakdowns" },
    ],
  },
  {
    id: "elite",
    name: "ELITE",
    tagline: "Trade Like an Institution",
    price: 150,
    period: "/ yr",
    href: "/payment/elite",
    cta: "SELECT — $150",
    badge: "BEST VALUE",
    features: [
      { text: "All Professional features, plus:", plus: true },
      { text: "Daily 3–6 VIP signals" },
      { text: "Priority support" },
    ],
  },
  {
    id: "permanent",
    name: "PERMANENT",
    tagline: "Own Your Edge Forever",
    price: 209,
    period: "once",
    href: "/payment/permanent",
    cta: "SELECT — $209",
    badge: "LIFETIME",
    features: [
      { text: "All Elite features, plus:", plus: true },
      { text: "Direct line support" },
      { text: "Lifetime signal access" },
    ],
  },
];

const PAYMENT_PILLS = [
  "VISA",
  "MASTERCARD",
  "PAYPAL",
  "STRIPE",
  "ALL CRYPTO ACCEPTED",
];

export function LandingPricing() {
  return (
    <section id="pricing" className="scroll-mt-24 bg-[#FAF9F6] py-24">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <header className="mx-auto mb-14 max-w-[600px] text-center">
          <p className="mb-3 text-[12.5px] font-extrabold tracking-[0.32em] text-[#C6A15B]">
            MEMBERSHIP
          </p>
          <h2 className="font-landing-serif text-[36px] font-bold text-[#0E0F13]">
            Choose Your Plan
          </h2>
          <p className="mt-3 text-[15.5px] font-medium text-[#4A463C]">
            Institutional-grade FX research with defined risk on every setup.
          </p>
        </header>

        <div className="flex flex-col gap-[22px] lg:flex-row">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-1 flex-col border bg-white",
                plan.featured ? "border-2 border-[#C6A15B]" : "border-[#E7E3D8]"
              )}
            >
              {plan.badge && (
                <span className="absolute right-0 top-0 bg-[#0E0F13] px-3.5 py-2 text-[11px] font-extrabold tracking-[0.13em] text-white">
                  {plan.badge}
                </span>
              )}

              <div className="flex flex-1 flex-col px-[26px] py-[30px]">
                <p className="mb-2.5 text-[12.5px] font-extrabold tracking-[0.24em] text-[#C6A15B]">
                  {plan.name}
                </p>
                <p className="font-landing-serif mb-4 min-h-7 text-[21px] font-bold text-[#0E0F13]">
                  {plan.tagline}
                </p>

                <div className="mb-5 flex items-baseline gap-1.5 border-b-2 border-[#EEEBE1] pb-[18px]">
                  <span className="font-landing-serif text-[44px] font-extrabold text-[#0E0F13]">
                    ${plan.price}
                  </span>
                  <span className="text-sm font-bold text-[#4A463C]">{plan.period}</span>
                </div>

                <ul className="mb-[22px] flex-1">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.text}
                      className={cn(
                        "relative py-1.5 text-sm font-semibold",
                        feature.plus
                          ? "pl-0 text-[12.5px] italic text-[#4A463C]"
                          : "pl-6 text-[#0E0F13]"
                      )}
                    >
                      {!feature.plus && (
                        <span
                          className="absolute left-0 font-black text-[#3C7A5C]"
                          aria-hidden
                        >
                          ✓
                        </span>
                      )}
                      {feature.text}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={cn(
                    "landing-focus mt-auto block border-[1.5px] border-[#0E0F13] py-3.5 text-center text-[12.5px] font-extrabold tracking-[0.16em] transition-colors",
                    plan.featured
                      ? "bg-[#0E0F13] text-white hover:bg-[#1c1e26]"
                      : "text-[#0E0F13] hover:bg-[#0E0F13] hover:text-white"
                  )}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[26px] flex flex-wrap items-center justify-center gap-3 bg-[#0E0F13] px-[30px] py-[18px]">
          <span className="mr-2 text-xs font-extrabold tracking-[0.2em] text-[#E8C173]">
            SECURE PAYMENT
          </span>
          {PAYMENT_PILLS.map((pill) => (
            <span
              key={pill}
              className="rounded-[20px] bg-white px-4 py-1.5 text-[12.5px] font-extrabold text-[#0E0F13]"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
