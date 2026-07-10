"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const FXAPI_REST_URL = "https://fxapi.app/api/USD.json";
const POLL_INTERVAL_MS = 30 * 1000;
const MAX_HISTORY = 48;
const CHART_WIDTH = 288;
const CHART_HEIGHT = 200;

function formatGmtClock() {
  const now = new Date();
  const h = now.getUTCHours().toString().padStart(2, "0");
  const m = now.getUTCMinutes().toString().padStart(2, "0");
  const s = now.getUTCSeconds().toString().padStart(2, "0");
  return `${h}:${m}:${s} GMT`;
}

function isValidEurUsd(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

async function fetchEurUsdPrice(): Promise<number | null> {
  try {
    const res = await fetch(FXAPI_REST_URL, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { rates?: { EUR?: number } };
    const eur = data.rates?.EUR;
    if (!isValidEurUsd(eur)) return null;
    return 1 / eur;
  } catch {
    return null;
  }
}

function buildSparklinePath(
  prices: number[],
  width: number,
  height: number,
  padding = 10
): string {
  if (prices.length === 0) return "";

  const plotW = width - padding * 2;
  const plotH = height - padding * 2;

  if (prices.length === 1) {
    const y = padding + plotH / 2;
    return `M ${padding} ${y} L ${width - padding} ${y}`;
  }

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 0.00001;
  const step = plotW / (prices.length - 1);

  return prices
    .map((price, i) => {
      const x = padding + i * step;
      const y = padding + (1 - (price - min) / range) * plotH;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

type HeroMiniChartProps = {
  className?: string;
  compact?: boolean;
};

export function HeroMiniChart({ className, compact = false }: HeroMiniChartProps) {
  const [clock, setClock] = useState(formatGmtClock);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">(
    "loading"
  );
  const [price, setPrice] = useState<number | null>(null);
  const [change, setChange] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [pulseKey, setPulseKey] = useState(0);
  const [pathAnimKey, setPathAnimKey] = useState(0);
  const previousPriceRef = useRef<number | null>(null);

  const load = useCallback(async () => {
    const next = await fetchEurUsdPrice();

    if (next === null) {
      setStatus("unavailable");
      setPrice(null);
      setChange(null);
      setHistory([]);
      return;
    }

    const prev = previousPriceRef.current;
    const nextChange =
      prev && prev > 0 ? ((next - prev) / prev) * 100 : 0;

    previousPriceRef.current = next;
    setPrice(next);
    setChange(nextChange);
    setHistory((h) => [...h, next].slice(-MAX_HISTORY));
    setStatus("ready");
    setPulseKey((k) => k + 1);
    setPathAnimKey((k) => k + 1);
  }, []);

  useEffect(() => {
    load();
    const pollId = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(pollId);
  }, [load]);

  useEffect(() => {
    const clockId = setInterval(() => setClock(formatGmtClock()), 1000);
    return () => clearInterval(clockId);
  }, []);

  const chartHeight = compact ? 140 : CHART_HEIGHT;
  const sparkPath = buildSparklinePath(history, CHART_WIDTH, chartHeight);
  const lineUp =
    change === null ? true : change >= 0;
  const lineColor = lineUp ? "#2D5A3D" : "#FF1744";
  const hasSparkData = history.length > 0 && status === "ready";

  const changeDisplay =
    status !== "ready" || price === null
      ? "—"
      : `${(change ?? 0) > 0 ? "+" : ""}${(change ?? 0).toFixed(2)}%`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
      className={cn(
        "relative bg-[#0A0A0A] border border-[#1A1A1A] rounded-sm p-4 w-full md:w-[320px]",
        compact ? "h-[240px]" : "h-[280px]",
        className
      )}
    >
      {status === "ready" && (
        <span className="absolute top-4 right-4 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#00C853] animate-hero-live-dot" />
          <span className="text-[10px] uppercase tracking-widest text-[#00C853] font-medium">
            LIVE
          </span>
        </span>
      )}

      <div className="mb-1 flex items-baseline justify-between gap-2 pr-16">
        <p className="text-xs uppercase tracking-widest text-[#737373]">
          EUR/USD
        </p>
        <p className="text-[10px] uppercase tracking-widest text-[#737373]">
          Spot Rate
        </p>
      </div>

      <div
        className={cn("relative overflow-hidden", compact ? "h-[140px]" : "h-[200px]")}
      >
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          <div className="h-px bg-[#1A1A1A]/50" />
          <div className="h-px bg-[#1A1A1A]/50" />
          <div className="h-px bg-[#1A1A1A]/50" />
        </div>

        {hasSparkData && price !== null && (
          <div
            className="absolute left-0 right-0 h-px bg-[#D4AF37]/50 animate-hero-price-pulse"
            style={{ top: "42%" }}
          />
        )}

        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${chartHeight}`}
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden
        >
          {hasSparkData ? (
            <path
              key={pathAnimKey}
              d={sparkPath}
              fill="none"
              stroke={lineColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
              className="animate-hero-sparkline-draw"
            />
          ) : (
            <line
              x1="10"
              y1={chartHeight / 2}
              x2={CHART_WIDTH - 10}
              y2={chartHeight / 2}
              stroke="#1A1A1A"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          )}
        </svg>

        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-[#737373] font-mono">Loading rate…</span>
          </div>
        )}

        {status === "unavailable" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-[#737373] font-mono">Rate unavailable</span>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <motion.span
          key={pulseKey}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="font-mono text-2xl font-bold text-white tabular-nums"
        >
          {status === "ready" && price !== null ? price.toFixed(4) : "—"}
        </motion.span>

        <span
          className={cn(
            "font-mono text-sm tabular-nums",
            status !== "ready" || price === null
              ? "text-[#737373]"
              : (change ?? 0) >= 0
                ? "text-[#00C853]"
                : "text-[#FF1744]"
          )}
        >
          {changeDisplay}
        </span>

        <AnimatePresence mode="wait">
          <motion.span
            key={clock}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.4 }}
            transition={{ duration: 0.25 }}
            className="font-mono text-xs text-[#737373] tabular-nums"
          >
            {clock}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
