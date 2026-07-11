"use client";

import { InstitutionalTicker } from "@/components/institutional-ticker";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import { PLANS } from "@/lib/plans";
import { telegramUrl } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#030303] text-[#E8E6E3] overflow-x-hidden">
      <InstitutionalTicker />
      <SiteNavbar />

      <div className="pt-[104px] pb-24">
        <section className="py-16 px-6 border-b border-[#2A2A2A]">
          <p className="text-center text-[11px] tracking-[0.2em] text-[#8A8A8A]">
            <span className="text-[#B8956A]">◆</span> Institutional-grade signals.
            Verified performance since 2015.{" "}
            <span className="text-[#B8956A]">◆</span>
          </p>
        </section>

        <div className="section-rule" />

        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <header className="text-center mb-16">
              <p className="label-institutional mb-4">MEMBERSHIP ACCESS</p>
              <h1 className="font-serif-display text-[40px] md:text-[48px] text-[#E8E6E3] leading-[1.2] mb-4">
                Choose Your Level of Market Intelligence
              </h1>
              <p className="text-base text-[#8A8A8A]">
                Institutional-grade signals. Retail pricing.
              </p>
              <div className="w-16 h-px bg-[#B8956A]/20 mx-auto mt-8" />
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
              {Object.values(PLANS).map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    "w-full max-w-[420px] bg-[#111111] border border-[#2A2A2A] p-10",
                    plan.id === "professional" && "border-l-2 border-l-[#B8956A]",
                    plan.id === "permanent" && "border-[#B8956A]"
                  )}
                >
                  <p className="label-institutional mb-4">{plan.name}</p>
                  <p className="font-serif-display text-xl text-[#E8E6E3] mb-4">
                    {plan.headline}
                  </p>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-data text-[40px] text-[#FFFFFF] tabular-nums">
                      ${plan.price}
                    </span>
                    <span className="text-sm text-[#8A8A8A]">/{plan.period}</span>
                  </div>
                  <p className="text-[11px] text-[#8A8A8A] tracking-[0.15em] mb-8">
                    {plan.billing}
                  </p>

                  <div className="h-px bg-[#2A2A2A] mb-8" />

                  <ul className="space-y-3 mb-10">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="text-[13px] text-[#8A8A8A] leading-relaxed pl-3 border-l border-[#2A2A2A]"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={plan.href}
                    className="block text-center border border-[#2A2A2A] py-3 text-[11px] tracking-[0.2em] text-[#B8956A] transition-colors duration-200 hover:bg-[#B8956A] hover:text-[#030303]"
                  >
                    {plan.cta}
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-20 text-center">
              <p className="label-institutional mb-4">We Accept</p>
              <p className="text-[10px] tracking-[0.2em] text-[#8A8A8A]">
                VISA • MASTERCARD • STRIPE • BITCOIN • ETHEREUM • USDT • SKRILL •
                NETELLER
              </p>
            </div>

            <div className="mt-20 max-w-2xl mx-auto text-center border border-[#2A2A2A] bg-[#111111] p-10">
              <h2 className="label-institutional mb-4">Questions?</h2>
              <p className="text-[13px] text-[#8A8A8A] leading-relaxed mb-6">
                Not sure which plan fits your trading style? Our desk responds within
                15 minutes.
              </p>
              <p className="text-[13px] text-[#8A8A8A] mb-6">
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
                className="inline-block border border-[#2A2A2A] px-8 py-3 text-[11px] tracking-[0.2em] text-[#B8956A] hover:bg-[#B8956A] hover:text-[#030303] transition-colors duration-200"
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
