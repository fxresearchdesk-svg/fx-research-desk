"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const POLL_INTERVAL_MS = 60 * 1000;
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
  const priceColor =
    item.direction === "up"
      ? "text-[#3C7A5C]"
      : item.direction === "down"
        ? "text-[#A6483C]"
        : "text-[#FAF9F6]/80";

  return (
    <>
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap px-1 font-data text-[12px] tabular-nums">
        <span className="text-[#C6A15B]">{item.pair}</span>
        <span className={cn("font-medium", priceColor)}>
          {item.direction === "up" && "▲ "}
          {item.direction === "down" && "▼ "}
          {formatPrice(item.price, item.pair)}
        </span>
      </span>
      {showSeparator && (
        <span className="whitespace-nowrap px-1 text-[#3E4048]"> • </span>
      )}
    </>
  );
}

export function InstitutionalTicker() {
  const [pairs, setPairs] = useState<TickerPair[]>([]);
  const [status, setStatus] = useState<TickerStatus>("loading");
  const sessionOpenRef = useRef<Record<string, number>>({});
  const statusRef = useRef<TickerStatus>("loading");

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
        const validPairs: TickerPair[] = [];

        for (const { pair, getPrice } of PAIR_CONFIG) {
          const raw = getPrice(data.rates, gold, silver);
          if (!isValidPrice(raw)) continue;

          if (!sessionOpenRef.current[pair]) {
            sessionOpenRef.current[pair] = raw;
          }

          const open = sessionOpenRef.current[pair];
          const change = open > 0 ? ((raw - open) / open) * 100 : null;

          validPairs.push({
            pair,
            price: raw,
            change,
            direction:
              change === null || Math.abs(change) < 0.0001
                ? "flat"
                : change > 0
                  ? "up"
                  : "down",
          });
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
    (status === "ready" || status === "insufficient") && pairs.length > 0
      ? pairs
      : [];

  const marqueeItems =
    displayPairs.length > 0 ? [...displayPairs, ...displayPairs] : [];

  return (
    <div className="fixed left-0 right-0 top-0 z-[60] h-9 border-b border-white/10 bg-[#0E0F13]">
      <div className="flex h-full items-center overflow-hidden">
        {status === "loading" && marqueeItems.length === 0 && (
          <div className="flex w-full items-center gap-6 px-4" aria-hidden>
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="h-3 w-28 shrink-0 animate-pulse rounded-sm bg-white/10"
              />
            ))}
          </div>
        )}

        {status === "unavailable" && marqueeItems.length === 0 && (
          <span className="w-full px-4 text-center font-data text-[12px] text-[#9A9488]">
            Market data temporarily unavailable
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
