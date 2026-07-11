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
      <span className="inline-flex items-center gap-1.5 font-data text-xs tabular-nums whitespace-nowrap px-1">
        <span className="text-[#AAAAAA]">{item.pair}</span>
        <span className="text-[#FFFFFF]">{formatPrice(item.price, item.pair)}</span>
        {item.change !== null && (
          <span
            className={cn(
              item.direction === "up" && "text-[#4A7C59]",
              item.direction === "down" && "text-[#8B3A3A]",
              item.direction === "flat" && "text-[#AAAAAA]"
            )}
          >
            {item.direction === "up" && "▲ "}
            {item.direction === "down" && "▼ "}
            {item.change > 0 ? "+" : ""}
            {item.change.toFixed(2)}%
          </span>
        )}
      </span>
      {showSeparator && (
        <span className="text-[#333333] whitespace-nowrap px-1"> • </span>
      )}
    </>
  );
}

export function InstitutionalTicker() {
  const [pairs, setPairs] = useState<TickerPair[]>([]);
  const [status, setStatus] = useState<TickerStatus>("loading");
  const previousPricesRef = useRef<Record<string, number>>({});
  const statusRef = useRef<TickerStatus>("loading");

  const load = useCallback(async () => {
    if (statusRef.current !== "ready") {
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
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(() => load(), POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [load]);

  const displayPairs =
    status === "ready" && pairs.length >= MIN_PAIRS_TO_DISPLAY ? pairs : [];

  const marqueeItems =
    displayPairs.length > 0 ? [...displayPairs, ...displayPairs] : [];

  const centerMessage =
    status === "unavailable"
      ? "Market data temporarily unavailable"
      : status === "loading" || status === "insufficient"
        ? "Loading market data..."
        : null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-10 border-b border-[#333333] bg-[#1A1A1A]">
      <div className="h-full flex items-center overflow-hidden">
        {centerMessage && (
          <span className="w-full text-center font-data text-xs text-[#AAAAAA] px-4">
            {centerMessage}
          </span>
        )}
        {marqueeItems.length > 0 && (
          <div className="ticker-marquee">
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
    </div>
  );
}
