"use client";

import { useState } from "react";
import { InstitutionalTicker } from "@/components/institutional-ticker";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import {
  TradingViewAdvancedChart,
  TradingViewMarketOverview,
  TradingViewTechnicalAnalysis,
} from "@/components/tradingview-widgets";
import { chartPairs } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function ChartsPageClient() {
  const [symbol, setSymbol] = useState<string>(chartPairs[0].symbol);

  return (
    <main className="min-h-screen bg-[#030303] text-[#E8E6E3] overflow-x-hidden">
      <InstitutionalTicker />
      <SiteNavbar />

      <div className="pt-[104px] pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <header className="mb-12 text-center md:text-left border-b border-[#2A2A2A] pb-10">
            <p className="label-institutional mb-4">LIVE MARKET CHARTS</p>
            <h1 className="font-serif-display text-[40px] text-[#E8E6E3] leading-[1.2] mb-4">
              Real-Time Technical Analysis
            </h1>
            <p className="text-base text-[#8A8A8A] max-w-2xl mx-auto md:mx-0 leading-relaxed">
              Institutional-grade charting with real-time price action across all major
              currency pairs and precious metals.
            </p>
          </header>

          <div className="mb-6 flex flex-wrap gap-2">
            {chartPairs.map((pair) => {
              const active = symbol === pair.symbol;
              return (
                <button
                  key={pair.symbol}
                  type="button"
                  onClick={() => setSymbol(pair.symbol)}
                  className={cn(
                    "border px-4 py-2 text-[11px] tracking-[0.2em] uppercase transition-colors duration-200",
                    active
                      ? "border-[#B8956A] text-[#B8956A]"
                      : "border-[#2A2A2A] text-[#8A8A8A] hover:border-[#B8956A] hover:text-[#B8956A]"
                  )}
                >
                  {pair.label}
                </button>
              );
            })}
          </div>

          <div className="mb-12 h-[400px] md:h-[600px] w-full overflow-hidden border border-[#2A2A2A] bg-[#111111]">
            <TradingViewAdvancedChart symbol={symbol} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="overflow-hidden border border-[#2A2A2A] bg-[#111111]">
              <div className="border-b border-[#2A2A2A] px-6 py-4">
                <h2 className="label-institutional">Market Overview</h2>
              </div>
              <div className="h-[420px]">
                <TradingViewMarketOverview />
              </div>
            </section>

            <section className="overflow-hidden border border-[#2A2A2A] bg-[#111111]">
              <div className="border-b border-[#2A2A2A] px-6 py-4">
                <h2 className="label-institutional">Technical Analysis</h2>
              </div>
              <div className="h-[420px]">
                <TradingViewTechnicalAnalysis symbol={symbol} />
              </div>
            </section>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
