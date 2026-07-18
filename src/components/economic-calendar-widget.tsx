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

type EconomicCalendarWidgetProps = {
  className?: string;
};

export function EconomicCalendarWidget({ className }: EconomicCalendarWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    mountTradingViewWidget(
      container,
      "https://s3.tradingview.com/external-embedding/embed-widget-events.js",
      {
        colorTheme: "dark",
        isTransparent: true,
        width: "100%",
        height: 500,
        locale: "en",
        importanceFilter: "-1,0,1",
        countryFilter: "us,eu,gb,jp,ca,au,nz,ch",
      }
    );
  }, []);

  return (
    <div
      className={cn(
        "overflow-hidden border border-[#2A2B32] bg-[#0E0F13]",
        className
      )}
    >
      <div
        ref={containerRef}
        className="tradingview-widget-container min-h-[500px] w-full"
      />
    </div>
  );
}
