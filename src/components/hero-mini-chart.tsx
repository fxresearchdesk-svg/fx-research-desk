"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { cn } from "@/lib/utils";

const FXAPI_REST_URL = "https://fxapi.app/api/USD.json";
const POLL_INTERVAL_MS = 30 * 1000;
const MAX_POINTS = 20;
const VISIBLE_CANDLES = 12;
const CANDLE_WIDTH = 12;
const CANDLE_GAP = 6;

type OhlcPoint = {
  id: number;
  price: number;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

type HeroMiniChartProps = {
  className?: string;
  compact?: boolean;
};

function isValidEurRate(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

async function fetchEurUsdPrice(): Promise<number | null> {
  try {
    const res = await fetch(FXAPI_REST_URL, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { rates?: { EUR?: number } };
    const eur = data.rates?.EUR;
    if (!isValidEurRate(eur)) return null;
    return 1 / eur;
  } catch {
    return null;
  }
}

function buildOhlcPoint(close: number, prevClose: number | null, id: number): OhlcPoint {
  const open = prevClose ?? close;
  const bodyRange = Math.abs(close - open);
  const wickPad = Math.max(bodyRange * 0.4, 0.00003);

  return {
    id,
    price: close,
    timestamp: Date.now(),
    open,
    high: Math.max(open, close) + wickPad,
    low: Math.min(open, close) - wickPad,
    close,
  };
}

function createYScale(min: number, max: number, height: number, padding = 12) {
  const range = max - min || 0.0001;
  const plot = height - padding * 2;
  return (price: number) => padding + (1 - (price - min) / range) * plot;
}

function candleOpacity(index: number, total: number) {
  if (total <= 1) return 1;
  const t = index / (total - 1);
  return 0.4 + t * 0.6;
}

function ScramblePrice({
  value,
  scrambleKey,
}: {
  value: number;
  scrambleKey: number;
}) {
  const [display, setDisplay] = useState(value.toFixed(4));
  const target = value.toFixed(4);

  useEffect(() => {
    let frame = 0;
    const digits = "0123456789";
    const interval = setInterval(() => {
      if (frame < 10) {
        setDisplay(
          target
            .split("")
            .map((ch) => (ch === "." ? "." : digits[Math.floor(Math.random() * 10)]))
            .join("")
        );
        frame += 1;
      } else {
        setDisplay(target);
        clearInterval(interval);
      }
    }, 35);
    return () => clearInterval(interval);
  }, [scrambleKey, target]);

  return <>{display}</>;
}

function Candlestick({
  point,
  yScale,
  chartHeight,
  opacity,
  isLatest,
}: {
  point: OhlcPoint;
  yScale: (price: number) => number;
  chartHeight: number;
  opacity: number;
  isLatest: boolean;
}) {
  const bullish = point.close >= point.open;
  const bodyTop = yScale(Math.max(point.open, point.close));
  const bodyBottom = yScale(Math.min(point.open, point.close));
  const bodyHeight = Math.max(bodyBottom - bodyTop, 2);
  const wickTop = yScale(point.high);
  const wickBottom = yScale(point.low);
  const wickHeight = Math.max(wickBottom - wickTop, bodyHeight + 2);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative shrink-0"
      style={{ width: CANDLE_WIDTH, height: chartHeight }}
    >
      <motion.div
        className="absolute left-1/2 z-0 w-px -translate-x-1/2 bg-[#555555] origin-top"
        style={{ top: wickTop }}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: wickHeight, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut", delay: 0.15 }}
      />

      <motion.div
        className={cn(
          "absolute left-0 z-10 rounded-[1px]",
          bullish ? "bg-[#2D5A3D]" : "bg-[#5C2A2A]",
          isLatest && bullish && "shadow-[0_0_10px_rgba(45,90,61,0.3)]",
          isLatest && !bullish && "shadow-[0_0_10px_rgba(92,42,42,0.3)]"
        )}
        style={{ top: bodyTop, width: CANDLE_WIDTH }}
        initial={{ height: 0 }}
        animate={{ height: bodyHeight }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </motion.div>
  );
}

function ChartSkeleton({ chartHeight }: { chartHeight: number }) {
  return (
    <div className="absolute inset-0 flex flex-col gap-3 p-2">
      <div className="hero-skeleton-shimmer h-3 w-24 rounded-sm" />
      <div className="flex-1 flex items-end gap-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="hero-skeleton-shimmer flex-1 rounded-[1px]"
            style={{ height: `${30 + (i % 5) * 12}%` }}
          />
        ))}
      </div>
      <div className="hero-skeleton-shimmer h-8 w-32 rounded-sm" />
    </div>
  );
}

export function HeroMiniChart({ className, compact = false }: HeroMiniChartProps) {
  const [ready, setReady] = useState(false);
  const [points, setPoints] = useState<OhlcPoint[]>([]);
  const [change, setChange] = useState(0);
  const [scrambleKey, setScrambleKey] = useState(0);
  const prevCloseRef = useRef<number | null>(null);
  const pointIdRef = useRef(0);

  const load = useCallback(async () => {
    const close = await fetchEurUsdPrice();
    if (close === null) return;

    const prevClose = prevCloseRef.current;
    const nextChange =
      prevClose && prevClose > 0 ? ((close - prevClose) / prevClose) * 100 : 0;

    const point = buildOhlcPoint(close, prevClose, ++pointIdRef.current);
    prevCloseRef.current = close;

    setPoints((prev) => [...prev, point].slice(-MAX_POINTS));
    setChange(nextChange);
    setReady(true);
    setScrambleKey((k) => k + 1);
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [load]);

  const chartHeight = compact ? 150 : 180;
  const visible = points.slice(-VISIBLE_CANDLES);
  const current = points[points.length - 1] ?? null;
  const isUp = change >= 0;

  const priceMin =
    visible.length > 0
      ? Math.min(...visible.map((p) => p.low))
      : 0;
  const priceMax =
    visible.length > 0
      ? Math.max(...visible.map((p) => p.high))
      : 1;
  const yScale = createYScale(priceMin, priceMax, chartHeight);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: "easeOut", delay: 0.12 }}
      className={cn(
        "relative w-full md:w-[380px] rounded-sm border border-[#1A1A1A] bg-[#0A0A0A]/80 p-5 backdrop-blur-sm",
        compact ? "h-[280px]" : "h-[320px]",
        className
      )}
    >
      {!ready ? (
        <ChartSkeleton chartHeight={chartHeight} />
      ) : (
        <>
          <div className="mb-4">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#00C853] animate-pulse" />
              <motion.p
                key={scrambleKey}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="font-mono text-3xl font-bold text-white tabular-nums"
              >
                {current && <ScramblePrice value={current.close} scrambleKey={scrambleKey} />}
              </motion.p>
            </div>

            <p className="mt-1 text-xs uppercase tracking-widest text-[#737373]">
              EUR/USD
            </p>

            <p
              className={cn(
                "mt-2 font-mono text-sm font-medium tabular-nums",
                isUp ? "text-[#00C853]" : "text-[#FF1744]"
              )}
            >
              {isUp ? "▲" : "▼"} {isUp ? "+" : ""}
              {change.toFixed(2)}%
            </p>
          </div>

          <div
            className="relative overflow-hidden"
            style={{ height: chartHeight }}
          >
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-px bg-[#1A1A1A]" />
              ))}
            </div>

            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16"
              style={{
                background:
                  "linear-gradient(to right, #0A0A0A 0%, rgba(10,10,10,0.85) 40%, transparent 100%)",
              }}
            />

            <LayoutGroup>
              <motion.div
                layout
                className="absolute inset-x-0 bottom-0 top-0 flex items-stretch justify-end gap-[6px] pl-12 pr-1"
              >
                <AnimatePresence initial={false} mode="popLayout">
                  {visible.map((point, i) => (
                    <Candlestick
                      key={point.id}
                      point={point}
                      yScale={yScale}
                      chartHeight={chartHeight}
                      opacity={candleOpacity(i, visible.length)}
                      isLatest={i === visible.length - 1}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>
          </div>
        </>
      )}
    </motion.div>
  );
}
