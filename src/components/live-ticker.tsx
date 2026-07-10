"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const POLL_INTERVAL_MS = 5 * 60 * 1000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

const FXAPI_REST_URL = "https://fxapi.app/api/USD.json";
const FXAPI_V1_URL = "https://api.fxapi.app/v1/latest";

type PairDirection = "up" | "down" | "flat";

type TickerPair = {
  pair: string;
  price: number | null;
  change: number;
  direction: PairDirection;
};

type TickerStatus = "loading" | "ready" | "connecting" | "unavailable";

type UsdRatesResponse = {
  base: string;
  timestamp: string;
  rates: Record<string, number | null>;
};

type V1RatesResponse = {
  data?: Record<string, { value?: number } | number>;
  rates?: Record<string, number>;
};

const PAIR_CONFIG = [
  { pair: "EUR/USD", code: "EUR", compute: (rates: Record<string, number>) => 1 / rates.EUR },
  { pair: "GBP/USD", code: "GBP", compute: (rates: Record<string, number>) => 1 / rates.GBP },
  { pair: "USD/JPY", code: "JPY", compute: (rates: Record<string, number>) => rates.JPY },
  { pair: "AUD/USD", code: "AUD", compute: (rates: Record<string, number>) => 1 / rates.AUD },
  { pair: "USD/CAD", code: "CAD", compute: (rates: Record<string, number>) => rates.CAD },
  { pair: "USD/CHF", code: "CHF", compute: (rates: Record<string, number>) => rates.CHF },
] as const;

function formatPrice(price: number, pair: string): string {
  if (pair === "USD/JPY") return price.toFixed(2);
  if (pair === "XAU/USD") return price.toFixed(2);
  return price.toFixed(4);
}

function formatMinutesAgo(ms: number): string {
  const minutes = Math.floor((Date.now() - ms) / 60000);
  if (minutes <= 0) return "just now";
  if (minutes === 1) return "1 min ago";
  return `${minutes} min ago`;
}

function getDirection(change: number): PairDirection {
  if (change > 0) return "up";
  if (change < 0) return "down";
  return "flat";
}

function parseV1Rates(data: V1RatesResponse): Record<string, number> | null {
  if (data.rates) return data.rates as Record<string, number>;

  if (data.data) {
    const rates: Record<string, number> = {};
    for (const [key, value] of Object.entries(data.data)) {
      const rate = typeof value === "number" ? value : value?.value;
      if (typeof rate === "number" && rate > 0) rates[key] = rate;
    }
    return Object.keys(rates).length > 0 ? rates : null;
  }

  return null;
}

async function fetchUsdRates(): Promise<{ rates: Record<string, number>; timestamp: string }> {
  const apiKey = process.env.NEXT_PUBLIC_FXAPI_KEY;

  if (apiKey) {
    const symbols = "EUR,GBP,JPY,AUD,CAD,CHF,XAU";
    const v1Url = `${FXAPI_V1_URL}?base=USD&symbols=${symbols}&apikey=${apiKey}`;
    const v1Res = await fetch(v1Url, { cache: "no-store" });
    if (v1Res.ok) {
      const v1Data = (await v1Res.json()) as V1RatesResponse;
      const rates = parseV1Rates(v1Data);
      if (rates) {
        return { rates, timestamp: new Date().toISOString() };
      }
    }
  }

  const res = await fetch(FXAPI_REST_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`FX API error: ${res.status}`);

  const data = (await res.json()) as UsdRatesResponse;
  const rates: Record<string, number> = {};

  for (const [code, value] of Object.entries(data.rates)) {
    if (typeof value === "number" && value > 0) rates[code] = value;
  }

  return { rates, timestamp: data.timestamp };
}

async function fetchGoldRate(): Promise<number | null> {
  try {
    const res = await fetch("https://fxapi.app/api/XAU/USD.json", { cache: "no-store" });
    if (!res.ok) return null;

    const data = (await res.json()) as { rate?: number };
    const rate = data.rate;
    if (typeof rate !== "number" || rate < 1500 || rate > 4000) return null;
    return rate;
  } catch {
    return null;
  }
}

function buildPairs(
  rates: Record<string, number>,
  goldRate: number | null,
  previousPrices: Record<string, number>
): TickerPair[] {
  const pairs: TickerPair[] = PAIR_CONFIG.map(({ pair, code, compute }) => {
    const rateValue = rates[code];
    if (!rateValue || rateValue <= 0) {
      return { pair, price: null, change: 0, direction: "flat" as PairDirection };
    }

    const price = compute(rates);
    const prev = previousPrices[pair];
    const change =
      prev && prev > 0 ? ((price - prev) / prev) * 100 : 0;

    return {
      pair,
      price,
      change,
      direction: getDirection(change),
    };
  });

  const xauFromUsd = rates.XAU && rates.XAU > 0 ? 1 / rates.XAU : null;
  const xauPrice =
    goldRate ?? (xauFromUsd && xauFromUsd >= 1500 && xauFromUsd <= 4000 ? xauFromUsd : null);

  const prevXau = previousPrices["XAU/USD"];
  const xauChange =
    xauPrice && prevXau && prevXau > 0 ? ((xauPrice - prevXau) / prevXau) * 100 : 0;

  pairs.splice(3, 0, {
    pair: "XAU/USD",
    price: xauPrice,
    change: xauChange,
    direction: getDirection(xauChange),
  });

  return pairs;
}

function TickerItem({ item }: { item: TickerPair }) {
  if (item.price === null) {
    return (
      <span className="inline-flex items-center gap-2 mx-6 text-xs font-mono text-slate-500">
        <span className="text-slate-400">{item.pair}</span>
        <span>N/A</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 mx-6 text-xs font-mono text-slate-300">
      <span className="text-slate-400">{item.pair}</span>
      <span className="text-white">{formatPrice(item.price, item.pair)}</span>
      {item.direction === "up" && <ArrowUp className="w-3 h-3 text-emerald-500" />}
      {item.direction === "down" && <ArrowDown className="w-3 h-3 text-red-400" />}
      <span
        className={cn(
          item.direction === "up" && "text-emerald-500",
          item.direction === "down" && "text-red-400",
          item.direction === "flat" && "text-white"
        )}
      >
        {item.change > 0 ? "+" : ""}
        {item.change.toFixed(2)}%
      </span>
    </span>
  );
}

export function LiveTicker() {
  const [pairs, setPairs] = useState<TickerPair[]>([]);
  const [status, setStatus] = useState<TickerStatus>("loading");
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [minutesLabel, setMinutesLabel] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const previousPricesRef = useRef<Record<string, number>>({});
  const hasLoadedRef = useRef(false);

  const fetchWithRetry = useCallback(async (): Promise<boolean> => {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const [{ rates }, goldRate] = await Promise.all([fetchUsdRates(), fetchGoldRate()]);
        const nextPairs = buildPairs(rates, goldRate, previousPricesRef.current);

        const nextPrices: Record<string, number> = {};
        for (const item of nextPairs) {
          if (item.price !== null) nextPrices[item.pair] = item.price;
        }
        previousPricesRef.current = nextPrices;

        setPairs(nextPairs);
        setLastUpdated(Date.now());
        setStatus("ready");
        hasLoadedRef.current = true;
        return true;
      } catch {
        if (attempt < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        }
      }
    }
    return false;
  }, []);

  const refresh = useCallback(
    async (manual = false) => {
      if (manual) setIsRefreshing(true);
      else if (!hasLoadedRef.current) setStatus("loading");
      else setStatus("connecting");

      const success = await fetchWithRetry();

      if (!success && !hasLoadedRef.current) {
        setPairs([]);
        setStatus("unavailable");
      }

      setIsRefreshing(false);
    },
    [fetchWithRetry]
  );

  useEffect(() => {
    refresh();

    const pollId = setInterval(() => refresh(), POLL_INTERVAL_MS);
    return () => clearInterval(pollId);
  }, [refresh]);

  useEffect(() => {
    if (!lastUpdated) return;

    const updateLabel = () => setMinutesLabel(formatMinutesAgo(lastUpdated));
    updateLabel();

    const labelId = setInterval(updateLabel, 60000);
    return () => clearInterval(labelId);
  }, [lastUpdated]);

  const statusMessage =
    status === "loading"
      ? "Connecting to markets..."
      : status === "connecting"
        ? "Connecting to markets..."
        : status === "unavailable"
          ? "Market data temporarily unavailable"
          : null;

  const marqueeItems =
    status === "ready" && pairs.length > 0
      ? [...pairs, ...pairs]
      : null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-10 bg-slate-950 border-b border-slate-800 overflow-hidden flex items-center">
      <div className="absolute left-3 z-10 flex items-center gap-2">
        {statusMessage ? (
          <span className="text-[10px] text-slate-500 font-mono">{statusMessage}</span>
        ) : (
          lastUpdated && (
            <span className="text-[10px] text-slate-600 font-mono hidden sm:inline">
              Last updated: {minutesLabel}
            </span>
          )
        )}
        <button
          type="button"
          onClick={() => refresh(true)}
          disabled={isRefreshing}
          className="p-1 text-slate-500 hover:text-emerald-400 transition disabled:opacity-50"
          aria-label="Refresh market data"
        >
          <RefreshCw className={cn("w-3 h-3", isRefreshing && "animate-spin")} />
        </button>
      </div>

      {marqueeItems ? (
        <div className="flex animate-ticker whitespace-nowrap items-center">
          {marqueeItems.map((item, i) => (
            <span key={`${item.pair}-${i}`} className="inline-flex items-center">
              <TickerItem item={item} />
              <span className="text-slate-700 mx-2">•</span>
            </span>
          ))}
        </div>
      ) : (
        <div className="w-full flex justify-center">
          <span className="text-xs font-mono text-slate-500 animate-pulse">
            {statusMessage ?? "Connecting to markets..."}
          </span>
        </div>
      )}
    </div>
  );
}
