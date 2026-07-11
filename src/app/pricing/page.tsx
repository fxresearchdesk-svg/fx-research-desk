"use client";

import { InstitutionalTicker } from "@/components/institutional-ticker";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import { PLANS } from "@/lib/plans";
import { telegramUrl } from "@/lib/site-config";

const TRUST_ITEMS = [
  ["SECURE CHECKOUT", "256-bit SSL Encryption"],
  ["INSTANT DELIVERY", "Signals in 60 Seconds"],
  ["VERIFIED RESULTS", "87.3% Win Rate Since 2015"],
  ["GLOBAL REACH", "500+ Traders | 30+ Countries"],
] as const;

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#F5F5F5] overflow-x-hidden">
      <InstitutionalTicker />
      <SiteNavbar />

      <div className="pt-[128px] pb-24">
        <div className="bg-[#0A0A0A] border-y border-[#1A1A1A] py-4">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST_ITEMS.map(([title, sub]) => (
              <div key={title} className="text-center">
                <p className="text-[10px] tracking-[0.25em] text-[#888888]">{title}</p>
                <p className="text-[10px] text-[#555555] mt-1">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <header className="text-center mb-20">
              <p className="text-[10px] tracking-[0.35em] text-[#D4AF37] uppercase mb-4">
                MEMBERSHIP ACCESS
              </p>
              <h1 className="font-serif-display text-5xl md:text-6xl text-white mb-4">
                Choose Your Level of Market Intelligence
              </h1>
              <p className="text-sm text-[#666666]">
                Institutional-grade signals. Retail pricing.
              </p>
              <div className="w-16 h-px bg-[#D4AF37]/20 mx-auto mt-8" />
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
              {Object.values(PLANS).map((plan) => (
                <div
                  key={plan.id}
                  className={`relative w-full max-w-[420px] bg-[#0A0A0A] border p-10 transition-all duration-400 hover:-translate-y-1 ${
                    plan.id === "permanent"
                      ? "border-2 border-[#D4AF37] shadow-[0_0_40px_rgba(212,175,55,0.12)]"
                      : plan.id === "professional"
                        ? "border-[#D4AF37]/40 -translate-y-3 shadow-[0_0_30px_rgba(212,175,55,0.08)]"
                        : "border-[#1A1A1A] hover:border-[#D4AF37]/20"
                  }`}
                >
                  {plan.badge && (
                    <div
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[9px] font-bold tracking-[0.2em] whitespace-nowrap ${
                        plan.id === "professional"
                          ? "bg-[#D4AF37] text-black"
                          : "bg-[#0A0A0A] border border-[#D4AF37]/40 text-[#D4AF37]"
                      }`}
                    >
                      {plan.badge}
                    </div>
                  )}

                  <p className="text-[10px] tracking-[0.3em] text-[#888888] mb-4">
                    {plan.name}
                  </p>
                  <p className="text-xl text-white font-semibold mb-3">{plan.headline}</p>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-bold text-white tabular-nums">
                      ${plan.price}
                    </span>
                    <span className="text-sm text-[#666666]">/{plan.period}</span>
                  </div>
                  <p className="text-[10px] text-[#00C853] tracking-widest mb-8">
                    {plan.billing}
                  </p>

                  <div className="h-px bg-[#1A1A1A] mb-8" />

                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-base text-[#A0A0A0] leading-relaxed"
                      >
                        <span className="text-[#00C853] mt-1 shrink-0">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.id === "permanent" && (
                    <p className="text-[10px] text-[#FF3D00] tracking-widest text-center mb-6">
                      Limited spots available
                    </p>
                  )}

                  <a
                    href={plan.href}
                    className={`block text-center py-3.5 text-[11px] tracking-[0.2em] font-bold transition ${
                      plan.id === "professional" || plan.id === "permanent"
                        ? "bg-[#D4AF37] text-black hover:bg-[#E5C158]"
                        : "border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-20 text-center">
              <p className="text-[10px] tracking-[0.3em] text-[#555555] mb-4">
                We Accept
              </p>
              <p className="text-[10px] tracking-[0.2em] text-[#444444]">
                VISA • MASTERCARD • STRIPE • BITCOIN • ETHEREUM • USDT • SKRILL •
                NETELLER
              </p>
            </div>

            <div className="mt-24 max-w-2xl mx-auto text-center border border-[#1A1A1A] bg-[#0A0A0A] p-10">
              <h2 className="text-[10px] tracking-[0.35em] text-[#D4AF37] uppercase mb-4">
                Questions?
              </h2>
              <p className="text-sm text-[#A0A0A0] leading-relaxed mb-6">
                Not sure which plan fits your trading style? Our desk responds within
                15 minutes.
              </p>
              <p className="text-sm text-[#666666] mb-6">
                Email{" "}
                <a
                  href="mailto:fxresearchdesk@gmail.com"
                  className="text-[#D4AF37] hover:text-white transition-colors"
                >
                  fxresearchdesk@gmail.com
                </a>
              </p>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-[#D4AF37]/40 px-8 py-3 text-[11px] tracking-[0.2em] font-bold text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition"
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
