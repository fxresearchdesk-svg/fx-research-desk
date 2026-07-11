"use client";

import { InstitutionalTicker } from "@/components/institutional-ticker";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import { PLANS } from "@/lib/plans";
import { telegramUrl } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#4A4A4A] overflow-x-hidden">
      <InstitutionalTicker />
      <SiteNavbar />

      <div className="pt-[104px] pb-24">
        <section className="py-16 px-6 border-b border-[#E5E5E5] bg-[#F5F5F0]">
          <p className="text-center text-xs tracking-[0.2em] text-[#4A4A4A]">
            <span className="text-[#B8956A] mx-1">◆</span>
            Institutional-grade signals. Verified performance since 2015.{" "}
            <span className="text-[#B8956A] mx-1">◆</span>
          </p>
        </section>

        <div className="section-rule" />

        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <header className="text-center mb-16">
              <p className="label-institutional mb-4">MEMBERSHIP ACCESS</p>
              <h1 className="font-serif-display text-[40px] md:text-[48px] text-[#1A1A1A] leading-[1.2] mb-4">
                Choose Your Level of Market Intelligence
              </h1>
              <p className="text-base text-[#4A4A4A]">
                Institutional-grade signals. Retail pricing.
              </p>
              <div className="w-16 h-px bg-[#E5E5E5] mx-auto mt-8" />
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
              {Object.values(PLANS).map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    "w-full max-w-[420px] card-ivory p-10",
                    plan.id === "professional" && "border-l-2 border-l-[#1A1A1A]",
                    plan.id === "permanent" && "border-2 border-[#1A1A1A]"
                  )}
                >
                  <p className="label-institutional mb-4">{plan.name}</p>
                  <p className="font-serif-display text-xl text-[#1A1A1A] mb-4">
                    {plan.headline}
                  </p>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-data text-[40px] text-[#1A1A1A] tabular-nums">
                      ${plan.price}
                    </span>
                    <span className="text-sm text-[#4A4A4A]">/{plan.period}</span>
                  </div>
                  <p className="text-[11px] text-[#9A9A9A] tracking-[0.15em] mb-8">
                    {plan.billing}
                  </p>

                  <div className="h-px bg-[#E5E5E5] mb-8" />

                  <ul className="space-y-3 mb-10">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="text-[14px] text-[#4A4A4A] leading-relaxed pl-3 border-l border-[#E5E5E5]"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={plan.href}
                    className="block text-center border border-[#1A1A1A] py-3 text-[11px] tracking-[0.2em] text-[#1A1A1A] transition-colors duration-200 hover:bg-[#1A1A1A] hover:text-white"
                  >
                    {plan.cta}
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-20 text-center">
              <p className="label-institutional mb-4">We Accept</p>
              <p className="text-[10px] tracking-[0.2em] text-[#9A9A9A]">
                VISA • MASTERCARD • STRIPE • BITCOIN • ETHEREUM • USDT • SKRILL •
                NETELLER
              </p>
            </div>

            <div className="mt-20 max-w-2xl mx-auto text-center card-ivory p-10">
              <h2 className="label-institutional mb-4">Questions?</h2>
              <p className="text-[13px] text-[#4A4A4A] leading-relaxed mb-6">
                Not sure which plan fits your trading style? Our desk responds within
                15 minutes.
              </p>
              <p className="text-[13px] text-[#4A4A4A] mb-6">
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
                className="inline-block border border-[#1A1A1A] px-8 py-3 text-[11px] tracking-[0.2em] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors duration-200"
              >
                CONTACT ON TELEGRAM
              </a>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
