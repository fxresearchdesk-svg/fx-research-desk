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
    <main className="min-h-screen bg-[#050505] text-[#F5F5F5] overflow-x-hidden">
      <InstitutionalTicker />
      <SiteNavbar />

      <div className="pt-[136px] pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <header className="mb-12 text-center md:text-left">
            <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] mb-4">
              LIVE MARKET CHARTS
            </p>
            <h1 className="font-serif-display text-4xl text-white mb-4">
              Real-Time Technical Analysis
            </h1>
            <p className="text-[#A0A0A0] max-w-2xl mx-auto md:mx-0 leading-relaxed">
              Professional-grade charts powered by TradingView. Analyze price action
              across all major pairs.
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
                    "border px-4 py-2 text-xs tracking-widest uppercase transition-colors duration-300",
                    active
                      ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                      : "border-[#1A1A1A] text-[#A0A0A0] hover:border-[#D4AF37] hover:text-[#D4AF37]"
                  )}
                >
                  {pair.label}
                </button>
              );
            })}
          </div>

          <div className="mb-12 h-[400px] md:h-[600px] w-full overflow-hidden rounded-sm border border-[#1A1A1A] bg-[#0A0A0A]">
            <TradingViewAdvancedChart symbol={symbol} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="overflow-hidden rounded-sm border border-[#1A1A1A] bg-[#0A0A0A]">
              <div className="border-b border-[#1A1A1A] px-6 py-4">
                <h2 className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
                  Market Overview
                </h2>
              </div>
              <div className="h-[420px]">
                <TradingViewMarketOverview />
              </div>
            </section>

            <section className="overflow-hidden rounded-sm border border-[#1A1A1A] bg-[#0A0A0A]">
              <div className="border-b border-[#1A1A1A] px-6 py-4">
                <h2 className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
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
