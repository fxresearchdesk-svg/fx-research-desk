"use client";

import { useEffect, useRef } from "react";
import { tradingViewWatchlist } from "@/lib/site-config";
import { cn } from "@/lib/utils";

function mountTradingViewWidget(
  container: HTMLDivElement,
  scriptSrc: string,
  config: Record<string, unknown>
) {
  container.innerHTML = "";
  const widget = document.createElement("div");
  widget.className = "tradingview-widget-container__widget";
  container.appendChild(widget);

  const script = document.createElement("script");
  script.src = scriptSrc;
  script.type = "text/javascript";
  script.async = true;
  script.innerHTML = JSON.stringify(config);
  container.appendChild(script);
}

type AdvancedChartProps = {
  symbol: string;
  className?: string;
};

export function TradingViewAdvancedChart({
  symbol,
  className,
}: AdvancedChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    mountTradingViewWidget(
      container,
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js",
      {
        autosize: true,
        symbol,
        interval: "D",
        timezone: "exchange",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#1E1E1E",
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_side_toolbar: true,
        hide_legend: false,
        save_image: true,
        hide_volume: true,
        backgroundColor: "#1E1E1E",
        gridColor: "#333333",
        textColor: "#777777",
        watchlist: [...tradingViewWatchlist],
        details: true,
        hotlist: true,
        calendar: true,
        allow_symbol_change: true,
        support_host: "https://www.tradingview.com",
      }
    );
  }, [symbol]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "tv-widget-host tradingview-widget-container h-full w-full overflow-hidden",
        className
      )}
    />
  );
}

type MarketOverviewProps = {
  className?: string;
};

export function TradingViewMarketOverview({ className }: MarketOverviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    mountTradingViewWidget(
      container,
      "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js",
      {
        colorTheme: "dark",
        dateRange: "12M",
        showChart: true,
        locale: "en",
        isTransparent: false,
        width: "100%",
        height: "100%",
        largeChartUrl: "",
        showSymbolLogo: false,
        plotLineColorGrowing: "#4A7C59",
        plotLineColorFalling: "#8B3A3A",
        gridLineColor: "#333333",
        scaleFontColor: "#777777",
        belowLineFillColorGrowing: "rgba(74, 124, 89, 0.12)",
        belowLineFillColorFalling: "rgba(139, 58, 58, 0.12)",
        symbolActiveColor: "rgba(184, 149, 106, 0.12)",
        tabs: [
          {
            title: "Forex",
            symbols: [
              { s: "FX:EURUSD", d: "EUR/USD" },
              { s: "FX:GBPUSD", d: "GBP/USD" },
              { s: "FX:USDJPY", d: "USD/JPY" },
              { s: "FX:USDCHF", d: "USD/CHF" },
              { s: "FX:AUDUSD", d: "AUD/USD" },
              { s: "FX:USDCAD", d: "USD/CAD" },
            ],
            originalTitle: "Forex",
          },
          {
            title: "Metals",
            symbols: [
              { s: "TVC:GOLD", d: "Gold" },
              { s: "TVC:SILVER", d: "Silver" },
            ],
            originalTitle: "Metals",
          },
        ],
      }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "tv-widget-host tradingview-widget-container h-full w-full overflow-hidden",
        className
      )}
    />
  );
}

type TechnicalAnalysisProps = {
  symbol: string;
  className?: string;
};

export function TradingViewTechnicalAnalysis({
  symbol,
  className,
}: TechnicalAnalysisProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    mountTradingViewWidget(
      container,
      "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js",
      {
        interval: "1D",
        width: "100%",
        isTransparent: false,
        height: "100%",
        symbol,
        showIntervalTabs: true,
        displayMode: "single",
        locale: "en",
        colorTheme: "dark",
      }
    );
  }, [symbol]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "tv-widget-host tradingview-widget-container h-full w-full overflow-hidden",
        className
      )}
    />
  );
}

type HeroChartProps = {
  className?: string;
};

export function TradingViewHeroChart({ className }: HeroChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    mountTradingViewWidget(
      container,
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js",
      {
        autosize: true,
        symbol: "FX:EURUSD",
        interval: "60",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#1E1E1E",
        enable_publishing: false,
        hide_top_toolbar: true,
        hide_side_toolbar: true,
        hide_legend: true,
        save_image: false,
        hide_volume: true,
        backgroundColor: "#1E1E1E",
        gridColor: "#333333",
        textColor: "#777777",
        allow_symbol_change: false,
        support_host: "https://www.tradingview.com",
      }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "tv-widget-host tradingview-widget-container h-full w-full overflow-hidden bg-[#1E1E1E]",
        className
      )}
    />
  );
}
