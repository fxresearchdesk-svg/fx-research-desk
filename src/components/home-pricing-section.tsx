import Link from "next/link";
import { PLANS } from "@/lib/plans";
import { cn } from "@/lib/utils";

const PLAN_BADGES: Partial<Record<keyof typeof PLANS, string>> = {
  professional: "MOST POPULAR",
  elite: "BEST VALUE",
  permanent: "LIFETIME ACCESS",
};

export function HomePricingSection() {
  return (
    <section id="pricing" className="scroll-mt-[100px] bg-[#F9FAFB] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <p className="text-center font-data text-sm text-[#1A1A1A] tracking-wide mb-12">
          SECURE CHECKOUT{" "}
          <span className="text-[#D1D5DB] mx-2">|</span> INSTANT DELIVERY{" "}
          <span className="text-[#D1D5DB] mx-2">|</span> VERIFIED RESULTS{" "}
          <span className="text-[#D1D5DB] mx-2">|</span> GLOBAL REACH
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(PLANS).map((plan) => {
            const badge = PLAN_BADGES[plan.id as keyof typeof PLANS];
            const periodLabel =
              plan.period === "month"
                ? "/month"
                : plan.period === "quarter"
                  ? "/quarter"
                  : plan.period === "year"
                    ? "/year"
                    : " one-time";

            return (
              <div
                key={plan.id}
                className="relative flex flex-col bg-[#FFFFFF] border border-[#E5E7EB] p-8"
              >
                {badge && (
                  <span className="absolute top-0 right-0 bg-[#1A1A1A] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-white">
                    {badge}
                  </span>
                )}

                <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8956A] mb-3">
                  {plan.name}
                </p>
                <p className="font-serif-display text-lg text-[#1A1A1A] mb-6 leading-snug">
                  {plan.headline}
                </p>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-data text-[40px] text-[#1A1A1A] tabular-nums">
                    ${plan.price}
                  </span>
                  <span className="text-sm text-[#6B7280]">{periodLabel}</span>
                </div>
                <p className="text-[11px] text-[#9CA3AF] mb-6">{plan.billing}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-2 text-[13px] text-[#4A4A4A] leading-relaxed"
                    >
                      <span className="text-[#4A7C59] shrink-0" aria-hidden>
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={cn(
                    "block text-center border border-[#1A1A1A] py-3",
                    "text-[11px] tracking-[0.2em] uppercase text-[#1A1A1A]",
                    "transition-colors duration-200 hover:bg-[#1A1A1A] hover:text-white"
                  )}
                >
                  START NOW
                </Link>
              </div>
            );
          })}
        </div>

        <p className="mt-12 text-center text-[10px] tracking-[0.2em] text-[#9CA3AF]">
          VISA • MASTERCARD • STRIPE • BITCOIN • ETHEREUM • USDT • SKRILL •
          NETELLER
        </p>
      </div>
    </section>
  );
}
