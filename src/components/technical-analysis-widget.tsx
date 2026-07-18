"use client";

import { useEffect, useRef } from "react";
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

/** Map site chart symbols to TradingView TA widget symbols. */
export function toTechnicalAnalysisSymbol(symbol: string): string {
  if (symbol === "TVC:GOLD") return "OANDA:XAUUSD";
  if (symbol === "TVC:SILVER") return "OANDA:XAGUSD";
  return symbol;
}

type TechnicalAnalysisWidgetProps = {
  symbol: string;
  className?: string;
};

export function TechnicalAnalysisWidget({
  symbol,
  className,
}: TechnicalAnalysisWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tvSymbol = toTechnicalAnalysisSymbol(symbol);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    mountTradingViewWidget(
      container,
      "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js",
      {
        interval: "1D",
        width: "100%",
        isTransparent: true,
        height: 450,
        symbol: tvSymbol,
        showIntervalTabs: true,
        displayMode: "single",
        locale: "en",
        colorTheme: "dark",
      }
    );
  }, [tvSymbol]);

  return (
    <div
      className={cn(
        "overflow-hidden border border-[#2A2B32] bg-[#0E0F13]",
        className
      )}
    >
      <div
        ref={containerRef}
        className="tradingview-widget-container min-h-[450px] w-full"
      />
    </div>
  );
}
