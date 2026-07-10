"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const POLL_INTERVAL_MS = 5 * 60 * 1000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;
const MIN_PAIRS_TO_DISPLAY = 5;
const FXAPI_REST_URL = "https://fxapi.app/api/USD.json";

type TickerPair = {
  pair: string;
  price: number;
  change: number | null;
  direction: "up" | "down" | "flat";
};

type TickerStatus = "loading" | "ready" | "insufficient" | "unavailable";

type PairConfig = {
  pair: string;
  getPrice: (
    rates: Record<string, number>,
    gold: number | null,
    silver: number | null
  ) => number | null;
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
];

function isValidPrice(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function formatPrice(price: number, pair: string): string {
  if (pair === "USD/JPY") return price.toFixed(2);
  if (pair === "XAU/USD" || pair === "XAG/USD") return price.toFixed(2);
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
    const res = await fetch(`https://fxapi.app/api/${pair}.json`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { rate?: number };
    const rate = data.rate;
    if (!isValidPrice(rate)) return null;
    if (pair === "XAU/USD" && rate >= 1500 && rate <= 6000) return rate;
    if (pair === "XAG/USD" && rate >= 10 && rate <= 200) return rate;
    return null;
  } catch {
    return null;
  }
}

function TickerItem({
  item,
  showSeparator,
}: {
  item: TickerPair;
  showSeparator?: boolean;
}) {
  return (
    <>
      <span className="inline-flex items-center gap-2 px-3 font-mono text-xs tabular-nums whitespace-nowrap">
        <span className="text-[#A0A0A0]">{item.pair}</span>
        <span className="text-white font-medium">
          {formatPrice(item.price, item.pair)}
        </span>
        {item.change !== null && (
          <span
            className={cn(
              item.direction === "up" && "text-[#2D5A3D]",
              item.direction === "down" && "text-[#5C2A2A]",
              item.direction === "flat" && "text-[#A0A0A0]"
            )}
          >
            {item.direction === "up" && "▲ "}
            {item.direction === "down" && "▼ "}
            {item.change > 0 ? "+" : ""}
            {item.change.toFixed(2)}%
          </span>
        )}
      </span>
      {showSeparator && <span className="text-[#333333] mx-2">•</span>}
    </>
  );
}

function RefreshIcon({ spinning }: { spinning?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-3.5 w-3.5", spinning && "animate-spin")}
      aria-hidden
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}

export function InstitutionalTicker() {
  const [pairs, setPairs] = useState<TickerPair[]>([]);
  const [status, setStatus] = useState<TickerStatus>("loading");
  const [refreshing, setRefreshing] = useState(false);
  const previousPricesRef = useRef<Record<string, number>>({});
  const statusRef = useRef<TickerStatus>("loading");
  const marketOpen = isMarketOpen();

  const load = useCallback(async (manual = false) => {
    if (manual) {
      setRefreshing(true);
    } else if (statusRef.current !== "ready") {
      setStatus("loading");
      statusRef.current = "loading";
    }

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const [res, gold, silver] = await Promise.all([
          fetch(FXAPI_REST_URL, { cache: "no-store" }),
          fetchMetalRate("XAU/USD"),
          fetchMetalRate("XAG/USD"),
        ]);
        if (!res.ok) throw new Error("fetch failed");

        const data = (await res.json()) as { rates: Record<string, number> };
        const validPairs: TickerPair[] = [];

        for (const { pair, getPrice } of PAIR_CONFIG) {
          const raw = getPrice(data.rates, gold, silver);
          if (!isValidPrice(raw)) continue;

          const prev = previousPricesRef.current[pair];
          const change =
            prev && prev > 0 ? ((raw - prev) / prev) * 100 : null;

          validPairs.push({
            pair,
            price: raw,
            change,
            direction:
              change === null
                ? "flat"
                : change > 0
                  ? "up"
                  : change < 0
                    ? "down"
                    : "flat",
          });

          previousPricesRef.current[pair] = raw;
        }

        if (validPairs.length >= MIN_PAIRS_TO_DISPLAY) {
          setPairs(validPairs);
          setStatus("ready");
          statusRef.current = "ready";
        } else if (validPairs.length > 0) {
          setPairs(validPairs);
          setStatus("insufficient");
          statusRef.current = "insufficient";
        } else {
          setPairs([]);
          setStatus("insufficient");
          statusRef.current = "insufficient";
        }

        setRefreshing(false);
        return;
      } catch {
        if (attempt < MAX_RETRIES) {
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        }
      }
    }

    setPairs([]);
    setStatus("unavailable");
    statusRef.current = "unavailable";
    setRefreshing(false);
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(() => load(), POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [load]);

  const displayPairs =
    status === "ready" && pairs.length >= MIN_PAIRS_TO_DISPLAY ? pairs : [];

  const marqueeItems =
    displayPairs.length > 0 ? [...displayPairs, ...displayPairs] : null;

  const centerMessage =
    status === "unavailable"
      ? "Market data temporarily unavailable"
      : status === "loading" || status === "insufficient"
        ? "Live market data loading..."
        : null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-12 bg-[#0A0A0A] border-b border-[#1A1A1A]">
      <div className="h-full flex items-stretch">
        <div className="flex-1 overflow-hidden flex items-center min-w-0">
          {centerMessage && (
            <span className="w-full text-center px-3 font-mono text-xs text-[#A0A0A0]">
              {centerMessage}
            </span>
          )}
          {marqueeItems && (
            <div className="flex animate-ticker whitespace-nowrap items-center h-full">
              {marqueeItems.map((item, i) => (
                <TickerItem
                  key={`${item.pair}-${i}`}
                  item={item}
                  showSeparator={i < marqueeItems.length - 1}
                />
              ))}
            </div>
          )}
        </div>

        <div className="shrink-0 flex items-center gap-2 px-3 border-l border-[#1A1A1A]">
          <button
            type="button"
            onClick={() => load(true)}
            disabled={refreshing}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#1A1A1A] text-[#A0A0A0] transition-colors duration-300 hover:border-[#333333] hover:text-white disabled:opacity-50"
            aria-label="Refresh market data"
          >
            <RefreshIcon spinning={refreshing} />
          </button>

          {marketOpen && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full bg-[#2D5A3D] opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 bg-[#2D5A3D]" />
            </span>
          )}
          <span
            className={cn(
              "text-xs uppercase tracking-widest font-semibold whitespace-nowrap font-mono",
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
