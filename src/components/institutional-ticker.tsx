"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const POLL_INTERVAL_MS = 5 * 60 * 1000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;
const FXAPI_REST_URL = "https://fxapi.app/api/USD.json";

type TickerPair = {
  pair: string;
  price: number | null;
  change: number;
  direction: "up" | "down" | "flat";
};

const DISPLAY_PAIRS = ["EUR/USD", "GBP/USD", "XAU/USD"] as const;

const PAIR_CONFIG = [
  { pair: "EUR/USD", code: "EUR", compute: (r: Record<string, number>) => 1 / r.EUR },
  { pair: "GBP/USD", code: "GBP", compute: (r: Record<string, number>) => 1 / r.GBP },
  { pair: "XAU/USD", code: "XAU", compute: (r: Record<string, number>) => (r.XAU > 0 ? 1 / r.XAU : null) },
] as const;

function formatPrice(price: number, pair: string): string {
  if (pair === "XAU/USD") return price.toFixed(2);
  return price.toFixed(4);
}

function isMarketOpen(): boolean {
  const now = new Date();
  const day = now.getUTCDay();
  const hour = now.getUTCHours();
  if (day === 6) return false;
  if (day === 0 && hour < 22) return false;
  if (day === 5 && hour >= 22) return false;
  return true;
}

async function fetchGoldRate(): Promise<number | null> {
  try {
    const res = await fetch("https://fxapi.app/api/XAU/USD.json", { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { rate?: number };
    const rate = data.rate;
    if (typeof rate === "number" && rate >= 1500 && rate <= 5000) return rate;
    return null;
  } catch {
    return null;
  }
}

export function InstitutionalTicker() {
  const [pairs, setPairs] = useState<TickerPair[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const previousPricesRef = useRef<Record<string, number>>({});
  const marketOpen = isMarketOpen();

  const load = useCallback(async () => {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const res = await fetch(FXAPI_REST_URL, { cache: "no-store" });
        if (!res.ok) throw new Error("fetch failed");
        const data = (await res.json()) as { rates: Record<string, number> };
        const gold = await fetchGoldRate();

        const next: TickerPair[] = PAIR_CONFIG.map(({ pair, code, compute }) => {
          let price: number | null = null;
          if (pair === "XAU/USD") {
            price = gold;
          } else {
            const rv = data.rates[code];
            if (rv && rv > 0) price = compute(data.rates);
          }
          const prev = previousPricesRef.current[pair];
          const change =
            price && prev && prev > 0 ? ((price - prev) / prev) * 100 : 0;
          return {
            pair,
            price,
            change,
            direction: (change > 0 ? "up" : change < 0 ? "down" : "flat") as TickerPair["direction"],
          };
        });

        const prices: Record<string, number> = {};
        next.forEach((p) => {
          if (p.price !== null) prices[p.pair] = p.price;
        });
        previousPricesRef.current = prices;

        setPairs(next);
        setStatus("ready");
        return;
      } catch {
        if (attempt < MAX_RETRIES) await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      }
    }
    setStatus("unavailable");
    setPairs([]);
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [load]);

  const display =
    status === "ready" && pairs.length > 0
      ? pairs.filter((p) => DISPLAY_PAIRS.includes(p.pair as (typeof DISPLAY_PAIRS)[number]))
      : null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-8 bg-[#050505] border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-6 font-mono text-xs text-[#737373] tabular-nums">
          {status === "loading" && (
            <span className="text-[#737373]">Loading markets...</span>
          )}
          {status === "unavailable" && (
            <span className="text-[#737373]">Market data unavailable</span>
          )}
          {display?.map((item) => (
            <span key={item.pair} className="flex items-center gap-1.5">
              <span className="text-[#A8A8A8]">{item.pair}</span>
              {item.price !== null ? (
                <>
                  <span className="text-[#F5F5F5]">{formatPrice(item.price, item.pair)}</span>
                  <span
                    className={cn(
                      item.direction === "up" && "text-[#2D5A3D]",
                      item.direction === "down" && "text-[#5C2A2A]",
                      item.direction === "flat" && "text-[#737373]"
                    )}
                  >
                    {item.direction === "up" ? "▲" : item.direction === "down" ? "▼" : "—"}{" "}
                    {item.change > 0 ? "+" : ""}
                    {item.change.toFixed(2)}%
                  </span>
                </>
              ) : (
                <span>N/A</span>
              )}
            </span>
          ))}
        </div>
        <div
          className={cn(
            "text-[10px] uppercase tracking-[0.25em] font-medium",
            marketOpen ? "text-[#2D5A3D]" : "text-[#5C2A2A]"
          )}
        >
          Market Status: {marketOpen ? "OPEN" : "CLOSED"}
        </div>
      </div>
    </div>
  );
}
