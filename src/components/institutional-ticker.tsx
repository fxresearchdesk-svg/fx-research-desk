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

type PairConfig = {
  pair: string;
  getPrice: (rates: Record<string, number>, gold: number | null, silver: number | null) => number | null;
};

const PAIR_CONFIG: PairConfig[] = [
  { pair: "EUR/USD", getPrice: (r) => (r.EUR > 0 ? 1 / r.EUR : null) },
  { pair: "GBP/USD", getPrice: (r) => (r.GBP > 0 ? 1 / r.GBP : null) },
  { pair: "USD/JPY", getPrice: (r) => r.JPY ?? null },
  { pair: "USD/CHF", getPrice: (r) => r.CHF ?? null },
  { pair: "AUD/USD", getPrice: (r) => (r.AUD > 0 ? 1 / r.AUD : null) },
  { pair: "USD/CAD", getPrice: (r) => r.CAD ?? null },
  { pair: "NZD/USD", getPrice: (r) => (r.NZD > 0 ? 1 / r.NZD : null) },
  {
    pair: "EUR/GBP",
    getPrice: (r) => (r.EUR > 0 && r.GBP > 0 ? r.GBP / r.EUR : null),
  },
  { pair: "XAU/USD", getPrice: (_, gold) => gold },
  { pair: "XAG/USD", getPrice: (_, __, silver) => silver },
  { pair: "US30", getPrice: () => null },
  { pair: "NAS100", getPrice: () => null },
];

function formatPrice(price: number, pair: string): string {
  if (pair === "USD/JPY") return price.toFixed(2);
  if (pair === "XAU/USD" || pair === "XAG/USD") return price.toFixed(2);
  if (pair === "US30" || pair === "NAS100") return price.toFixed(0);
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

async function fetchMetalRate(pair: string): Promise<number | null> {
  try {
    const res = await fetch(`https://fxapi.app/api/${pair}.json`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { rate?: number };
    const rate = data.rate;
    if (typeof rate !== "number") return null;
    if (pair === "XAU/USD" && rate >= 1500 && rate <= 6000) return rate;
    if (pair === "XAG/USD" && rate >= 10 && rate <= 200) return rate;
    return null;
  } catch {
    return null;
  }
}

function TickerItem({ item }: { item: TickerPair }) {
  return (
    <span className="inline-flex items-center gap-2 px-6 font-mono text-sm font-medium tabular-nums whitespace-nowrap">
      <span className="text-[#A8A8A8]">{item.pair}</span>
      {item.price !== null ? (
        <>
          <span className="text-white">{formatPrice(item.price, item.pair)}</span>
          <span
            className={cn(
              item.direction === "up" && "text-[#2D5A3D]",
              item.direction === "down" && "text-[#5C2A2A]",
              item.direction === "flat" && "text-[#A0A0A0]"
            )}
          >
            {item.direction === "up" ? "▲" : item.direction === "down" ? "▼" : "—"}{" "}
            {item.change > 0 ? "+" : ""}
            {item.change.toFixed(2)}%
          </span>
        </>
      ) : (
        <span className="text-[#A0A0A0]">—</span>
      )}
    </span>
  );
}

export function InstitutionalTicker() {
  const [pairs, setPairs] = useState<TickerPair[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const previousPricesRef = useRef<Record<string, number>>({});
  const marketOpen = isMarketOpen();

  const load = useCallback(async () => {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const [res, gold, silver] = await Promise.all([
          fetch(FXAPI_REST_URL, { cache: "no-store" }),
          fetchMetalRate("XAU/USD"),
          fetchMetalRate("XAG/USD"),
        ]);
        if (!res.ok) throw new Error("fetch failed");
        const data = (await res.json()) as { rates: Record<string, number> };

        const next: TickerPair[] = PAIR_CONFIG.map(({ pair, getPrice }) => {
          const price = getPrice(data.rates, gold, silver);
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

  const marqueeItems =
    status === "ready" && pairs.length > 0
      ? [...pairs, ...pairs]
      : null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-14 bg-black border-b border-[#D4AF37]/20">
      <div className="h-full flex items-stretch">
        <div className="flex-1 overflow-hidden flex items-center min-w-0">
          {status === "loading" && (
            <span className="px-6 font-mono text-sm font-medium text-[#A0A0A0]">
              Loading markets...
            </span>
          )}
          {status === "unavailable" && (
            <span className="px-6 font-mono text-sm font-medium text-[#A0A0A0]">
              Market data unavailable
            </span>
          )}
          {marqueeItems && (
            <div className="flex animate-ticker whitespace-nowrap items-center h-full">
              {marqueeItems.map((item, i) => (
                <TickerItem key={`${item.pair}-${i}`} item={item} />
              ))}
            </div>
          )}
        </div>

        <div className="shrink-0 flex items-center gap-2.5 px-6 border-l border-[#D4AF37]/20">
          {marketOpen && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#2D5A3D] opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2D5A3D]" />
            </span>
          )}
          <span
            className={cn(
              "text-xs uppercase tracking-[0.25em] font-semibold whitespace-nowrap",
              marketOpen ? "text-[#2D5A3D]" : "text-[#5C2A2A]"
            )}
          >
            {marketOpen ? "MARKETS OPEN" : "MARKETS CLOSED"}
          </span>
        </div>
      </div>
    </div>
  );
}
