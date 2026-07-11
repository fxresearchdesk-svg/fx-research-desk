import { notFound } from "next/navigation";
import { isValidPlan, PLANS } from "@/lib/plans";
import { PaymentForm } from "./payment-form";

type PaymentPlanPageProps = {
  params: Promise<{ plan: string }>;
};

export default async function PaymentPlanPage({ params }: PaymentPlanPageProps) {
  const { plan: planId } = await params;

  if (!isValidPlan(planId)) {
    notFound();
  }

  const plan = PLANS[planId];

  return (
    <div className="max-w-6xl mx-auto px-6">
      <header className="mb-12 text-center md:text-left">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
          SECURE CHECKOUT
        </p>
        <h1 className="font-serif-display text-4xl text-white">
          Complete Your Membership
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-sm border border-[#D4AF37]/20 bg-[#0A0A0A] p-8">
          <span className="text-xs uppercase tracking-[0.25em] text-[#888888]">
            {plan.name}
          </span>
          <div className="mt-4 mb-2">
            <span className="font-serif-display text-5xl text-white tabular-nums">
              {plan.priceLabel}
            </span>
            <span className="ml-2 text-sm text-[#A0A0A0]">{plan.period}</span>
          </div>
          {plan.subtitle && (
            <p className="mb-2 text-sm text-[#A0A0A0]">{plan.subtitle}</p>
          )}
          {plan.savings && (
            <p className="mb-1 text-sm font-medium text-[#00C853]">{plan.savings}</p>
          )}
          {plan.equivalent && (
            <p className="mb-6 text-xs text-[#888888]">{plan.equivalent}</p>
          )}
          {!plan.savings && !plan.equivalent && <div className="mb-6" />}
          <p className="mb-6 text-sm leading-relaxed text-[#A0A0A0]">
            {plan.description}
          </p>
          <ul className="space-y-3">
            {plan.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-sm text-[#A0A0A0]"
              >
                <span className="mt-0.5 shrink-0 text-[#00C853]">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <PaymentForm plan={plan} />
      </div>
    </div>
  );
}
