import Link from "next/link";
import { PLANS } from "@/lib/plans";
import { cn } from "@/lib/utils";

const STRIP_FEATURES: Record<keyof typeof PLANS, string[]> = {
  standard: ["2–4 signals/day", "Telegram delivery", "Education access"],
  professional: ["All Standard features", "Dedicated support", "Quarterly billing"],
  elite: ["3–6 signals/day", "Priority support", "Annual billing"],
  permanent: ["Lifetime access", "Direct line support", "Future updates"],
};

export function HomePricingStrip() {
  return (
    <section className="border-y border-[#E5E7EB] bg-white px-4 py-10 lg:px-6">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Object.values(PLANS).map((plan) => {
          const highlighted = plan.id === "professional";
          const periodLabel =
            plan.period === "month"
              ? "/mo"
              : plan.period === "quarter"
                ? "/qtr"
                : plan.period === "year"
                  ? "/yr"
                  : " once";

          return (
            <div
              key={plan.id}
              className={cn(
                "flex flex-col border border-[#E5E7EB] bg-[#F9FAFB] p-6",
                highlighted && "border-l-2 border-l-[#B8956A]"
              )}
            >
              <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-[#B8956A]">
                {plan.name}
              </p>
              <div className="mb-3 flex items-baseline gap-1">
                <span className="font-data text-3xl tabular-nums text-[#1A1A1A]">
                  ${plan.price}
                </span>
                <span className="text-xs text-[#6B7280]">{periodLabel}</span>
              </div>
              <ul className="mb-5 flex-1 space-y-1">
                {STRIP_FEATURES[plan.id as keyof typeof PLANS].map((feature) => (
                  <li key={feature} className="text-[11px] text-[#4A4A4A]">
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className="block w-full border border-[#1A1A1A] bg-[#1A1A1A] py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-white transition-colors duration-200 hover:bg-[#333333]"
              >
                {plan.cta}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
