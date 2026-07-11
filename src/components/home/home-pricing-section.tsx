import Link from "next/link";
import { PLANS } from "@/lib/plans";
import { cn } from "@/lib/utils";

export function HomePricingSection() {
  return (
    <section id="pricing" className="scroll-mt-[100px] bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 text-center">
          <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-[#B8956A]">
            Membership
          </p>
          <h2 className="font-serif-display text-3xl text-[#1A1A1A] md:text-4xl">
            Choose Your Plan
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Object.values(PLANS).map((plan) => {
            const periodLabel =
              plan.period === "month"
                ? "/mo"
                : plan.period === "quarter"
                  ? "/qtr"
                  : plan.period === "year"
                    ? "/yr"
                    : " once";
            const highlighted = plan.id === "professional";

            return (
              <div
                key={plan.id}
                className={cn(
                  "flex flex-col border border-[#E5E7EB] bg-white p-8",
                  highlighted && "border-[#B8956A]"
                )}
              >
                <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[#B8956A]">
                  {plan.name}
                </p>
                <p className="font-serif-display mb-6 text-lg text-[#1A1A1A]">
                  {plan.headline}
                </p>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="font-data text-4xl tabular-nums text-[#1A1A1A]">
                    ${plan.price}
                  </span>
                  <span className="text-sm text-[#6B7280]">{periodLabel}</span>
                </div>
                <ul className="mb-8 flex-1 space-y-2">
                  {plan.features.slice(0, 4).map((feature) => (
                    <li key={feature} className="text-sm text-[#4A4A4A]">
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className="block w-full border border-[#1A1A1A] py-3 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-[#1A1A1A] transition-colors duration-200 hover:bg-[#1A1A1A] hover:text-white"
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
