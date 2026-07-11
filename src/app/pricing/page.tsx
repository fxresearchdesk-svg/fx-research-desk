"use client";

import Link from "next/link";
import { InstitutionalTicker } from "@/components/institutional-ticker";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import { PLANS } from "@/lib/plans";
import { telegramUrl } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const PLAN_BADGES: Partial<Record<keyof typeof PLANS, string>> = {
  professional: "MOST POPULAR",
  elite: "BEST VALUE",
  permanent: "LIFETIME ACCESS",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] text-[#4A4A4A] overflow-x-hidden">
      <InstitutionalTicker />
      <SiteNavbar />

      <div className="pt-[100px] pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8956A] mb-2">
              MEMBERSHIP ACCESS
            </p>
            <h1 className="font-serif-display text-[36px] text-[#1A1A1A] leading-[1.15]">
              Choose Your Level of Market Intelligence
            </h1>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.values(PLANS).map((plan) => {
              const badge = PLAN_BADGES[plan.id as keyof typeof PLANS];
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
                  className="relative flex flex-col bg-[#FFFFFF] border border-[#E5E7EB] p-6"
                >
                  {badge && (
                    <span className="absolute top-0 right-0 bg-[#1A1A1A] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white">
                      {badge}
                    </span>
                  )}

                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#B8956A] mb-1">
                    {plan.name}
                  </p>
                  <p className="font-serif-display text-base text-[#1A1A1A] mb-4 leading-snug">
                    {plan.headline}
                  </p>

                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="font-data text-[32px] text-[#1A1A1A] tabular-nums leading-none">
                      ${plan.price}
                    </span>
                    <span className="text-xs text-[#6B7280]">{periodLabel}</span>
                  </div>

                  <ul className="space-y-1.5 mb-5 flex-1">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex gap-1.5 text-[11px] text-[#4A4A4A] leading-snug"
                      >
                        <span className="text-[#4A7C59] shrink-0 text-[10px]" aria-hidden>
                          ✓
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.href}
                    className={cn(
                      "block text-center border border-[#1A1A1A] py-2.5",
                      "text-[10px] tracking-[0.18em] uppercase text-[#1A1A1A]",
                      "transition-colors duration-200 hover:bg-[#1A1A1A] hover:text-white"
                    )}
                  >
                    START NOW
                  </Link>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-center text-[10px] tracking-[0.18em] text-[#9CA3AF]">
            VISA • MASTERCARD • STRIPE • BITCOIN • ETHEREUM • USDT • SKRILL •
            NETELLER
          </p>

          <div className="mt-10 max-w-xl mx-auto text-center border border-[#E5E7EB] bg-[#FFFFFF] p-6">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#B8956A] mb-3">
              Questions?
            </h2>
            <p className="text-[13px] text-[#4A4A4A] leading-relaxed mb-4">
              Not sure which plan fits your trading style? Our desk responds within
              15 minutes.
            </p>
            <p className="text-[13px] text-[#4A4A4A] mb-4">
              Email{" "}
              <a
                href="mailto:fxresearchdesk@gmail.com"
                className="text-[#B8956A] hover:text-[#C9A87C] transition-colors"
              >
                fxresearchdesk@gmail.com
              </a>
            </p>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-[#1A1A1A] px-6 py-2.5 text-[10px] tracking-[0.18em] uppercase text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors duration-200"
            >
              CONTACT ON TELEGRAM
            </a>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
