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
    <main className="min-h-screen overflow-x-hidden bg-[#F9FAFB] text-[#4A4A4A]">
      <InstitutionalTicker />
      <SiteNavbar />

      <div className="pt-[100px] pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <header className="mb-12 border-b border-[#E5E7EB] pb-10 text-center md:text-left">
            <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#B8956A]">
              LIVE MARKET CHARTS
            </p>
            <h1 className="font-serif-display mb-4 text-[40px] leading-[1.2] text-[#1A1A1A]">
              Real-Time Technical Analysis
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#4A4A4A] md:mx-0">
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
                    "border px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-colors duration-200",
                    active
                      ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                      : "border-[#E5E7EB] bg-white text-[#1A1A1A] hover:border-[#B8956A] hover:text-[#B8956A]"
                  )}
                >
                  {pair.label}
                </button>
              );
            })}
          </div>

          <div className="mb-12 h-[400px] w-full overflow-hidden border border-[#E5E7EB] bg-white p-2 md:h-[600px]">
            <TradingViewAdvancedChart symbol={symbol} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="overflow-hidden border border-[#E5E7EB] bg-white">
              <div className="border-b border-[#E5E7EB] px-6 py-4">
                <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#B8956A]">
                  Market Overview
                </h2>
              </div>
              <div className="h-[420px]">
                <TradingViewMarketOverview />
              </div>
            </section>

            <section className="overflow-hidden border border-[#E5E7EB] bg-white">
              <div className="border-b border-[#E5E7EB] px-6 py-4">
                <h2 className="text-[10px] uppercase tracking-[0.3em] text-[#B8956A]">
                  Technical Analysis
                </h2>
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
