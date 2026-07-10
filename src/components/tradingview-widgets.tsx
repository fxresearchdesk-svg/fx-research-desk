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
        toolbar_bg: "#0A0A0A",
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: true,
        backgroundColor: "#0A0A0A",
        gridColor: "#1A1A1A",
        textColor: "#A0A0A0",
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
      className={cn("tradingview-widget-container h-full w-full", className)}
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
        showSymbolLogo: true,
        plotLineColorGrowing: "#00C853",
        plotLineColorFalling: "#FF1744",
        gridLineColor: "#1A1A1A",
        scaleFontColor: "#A0A0A0",
        belowLineFillColorGrowing: "rgba(0, 200, 83, 0.12)",
        belowLineFillColorFalling: "rgba(255, 23, 68, 0.12)",
        symbolActiveColor: "rgba(212, 175, 55, 0.12)",
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
      className={cn("tradingview-widget-container h-full w-full", className)}
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
      className={cn("tradingview-widget-container h-full w-full", className)}
    />
  );
}
