"use client";

import { useMemo, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import {
  TradingViewAdvancedChart,
  TradingViewMarketOverview,
} from "@/components/tradingview-widgets";
import { TechnicalAnalysisWidget } from "@/components/technical-analysis-widget";
import { chartPairs } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const PAIR_COMMENTARY: Record<string, string> = {
  "FX:EURUSD":
    "Watch the 1.0800–1.0900 zone for directional confirmation. Dollar softness into US data tends to support EUR bids; fade strength into resistance unless momentum expands.",
  "FX:GBPUSD":
    "Sterling remains sensitive to BoE pricing and UK data. Prefer range tactics between recent swing highs/lows until a clean daily close breaks the band.",
  "FX:USDJPY":
    "Policy differential keeps USD/JPY structurally firm, but sharp risk-off can force yen squeezes. Trade pullbacks with tight invalidation near recent lows.",
  "FX:USDCHF":
    "CHF often mirrors EUR/USD inversely. Look for confirmation from European risk appetite before pressing USD/CHF breakouts.",
  "FX:AUDUSD":
    "AUD tracks China risk and commodity tone. Soft risk markets favor selling rallies; reclaiming prior session highs can reopen long setups.",
  "FX:USDCAD":
    "Oil correlation and BoC/Fed relative pricing drive this pair. Align entries with crude direction and avoid fighting overlapping session ranges.",
  "FX:NZDUSD":
    "NZD responds quickly to risk sentiment and dairy/China headlines. Keep size modest around RBNZ-sensitive sessions.",
  "FX:EURGBP":
    "A quieter cross — best traded on relative ECB vs BoE surprises. Fade extremes into mid-range unless a clear policy divergence emerges.",
  "TVC:GOLD":
    "Gold remains a dollar and real-yield proxy. Bullish above recent support with safe-haven demand; respect failed breaks of prior highs.",
  "TVC:SILVER":
    "Silver amplifies gold moves with higher volatility. Prefer confirmation from XAU direction and industrial demand tone before sizing up.",
};

export function ChartsPageClient() {
  const [symbol, setSymbol] = useState<string>(chartPairs[0].symbol);

  const commentary = useMemo(
    () =>
      PAIR_COMMENTARY[symbol] ??
      "Monitor structure on the daily chart: higher highs/lows for continuation, failed breaks for mean reversion.",
    [symbol]
  );

  const activeLabel =
    chartPairs.find((p) => p.symbol === symbol)?.label ?? symbol;

  return (
    <SiteShell>
      <div className="mx-auto max-w-[1240px] px-6 pb-24 pt-14 lg:px-10">
        <header className="mb-12 border-b border-[#E7E3D8] pb-10">
          <p className="mb-3 text-[12.5px] font-extrabold tracking-[0.32em] text-[#C6A15B]">
            LIVE MARKET CHARTS
          </p>
          <h1 className="font-landing-serif mb-4 text-[40px] font-bold leading-[1.2] text-[#0E0F13]">
            Real-Time Technical Analysis
          </h1>
          <p className="max-w-2xl text-[15.5px] font-medium text-[#4A463C]">
            Institutional-grade charting with real-time price action across major
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
                  "landing-focus border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors",
                  active
                    ? "border-[#0E0F13] bg-[#0E0F13] text-white"
                    : "border-[#E7E3D8] bg-white text-[#0E0F13] hover:border-[#C6A15B] hover:text-[#C6A15B]"
                )}
              >
                {pair.label}
              </button>
            );
          })}
        </div>

        <div className="mb-6 border border-[#E7E3D8] bg-white p-5">
          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C6A15B]">
            Desk note — {activeLabel}
          </p>
          <p className="text-sm leading-relaxed text-[#4A463C]">{commentary}</p>
        </div>

        <div className="mb-12 h-[400px] w-full overflow-hidden border border-[#E7E3D8] bg-white p-2 md:h-[600px]">
          <TradingViewAdvancedChart symbol={symbol} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="overflow-hidden border border-[#E7E3D8] bg-white">
            <div className="border-b border-[#E7E3D8] px-6 py-4">
              <h2 className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#C6A15B]">
                Market Overview
              </h2>
            </div>
            <div className="h-[420px]">
              <TradingViewMarketOverview />
            </div>
          </section>

          <section className="overflow-hidden border border-[#E7E3D8] bg-white">
            <div className="border-b border-[#E7E3D8] px-6 py-4">
              <h2 className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#C6A15B]">
                Technical Analysis
              </h2>
            </div>
            <div className="p-2 sm:p-3">
              <TechnicalAnalysisWidget key={symbol} symbol={symbol} />
            </div>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
