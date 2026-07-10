"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

const FXAPI_REST_URL = "https://fxapi.app/api/USD.json";
const POLL_INTERVAL_MS = 30 * 1000;
const MAX_POINTS = 20;
const VISIBLE_CANDLES = 12;
const CANDLE_BODY = 14;
const CANDLE_WICK = 2;
const CANDLE_GAP = 16;
const CHART_HEIGHT_DESKTOP = 220;
const CHART_HEIGHT_MOBILE = 150;
const SPRING = { type: "spring" as const, stiffness: 300, damping: 25 };

const GREEN = "#00C853";
const RED = "#FF3D00";

type OhlcPoint = {
  id: number;
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
  const wickPad = Math.max(bodyRange * 0.45, 0.00004);

  return {
    id,
    timestamp: Date.now(),
    open,
    high: Math.max(open, close) + wickPad,
    low: Math.min(open, close) - wickPad,
    close,
  };
}

function createYScale(min: number, max: number, height: number, padding = 14) {
  const range = max - min || 0.0001;
  const plot = height - padding * 2;
  return (price: number) => padding + (1 - (price - min) / range) * plot;
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
      if (frame < 8) {
        setDisplay(
          target
            .split("")
            .map((ch) =>
              ch === "." ? "." : digits[Math.floor(Math.random() * 10)]
            )
            .join("")
        );
        frame += 1;
      } else {
        setDisplay(target);
        clearInterval(interval);
      }
    }, 38);
    return () => clearInterval(interval);
  }, [scrambleKey, target]);

  return <>{display}</>;
}

function LiveIndicator() {
  return (
    <span className="flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
        <span className="absolute h-full w-full rounded-full bg-[#00C853] opacity-40 animate-hero-live-ring" />
        <span className="relative h-2 w-2 rounded-full bg-[#00C853] shadow-[0_0_8px_rgba(0,200,83,0.8)]" />
      </span>
      <span className="text-xs font-semibold uppercase tracking-widest text-[#00C853]">
        LIVE
      </span>
    </span>
  );
}

function Candlestick({
  point,
  yScale,
  chartHeight,
  isLatest,
}: {
  point: OhlcPoint;
  yScale: (price: number) => number;
  chartHeight: number;
  isLatest: boolean;
}) {
  const bullish = point.close >= point.open;
  const bodyColor = bullish ? GREEN : RED;
  const wickColor = bullish ? "rgba(0,200,83,0.6)" : "rgba(255,61,0,0.6)";

  const bodyTop = yScale(Math.max(point.open, point.close));
  const bodyBottom = yScale(Math.min(point.open, point.close));
  const bodyHeight = Math.max(bodyBottom - bodyTop, 4);
  const wickTop = yScale(point.high);
  const wickBottom = yScale(point.low);
  const wickHeight = Math.max(wickBottom - wickTop, bodyHeight + 4);

  return (
    <motion.div
      layout
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={SPRING}
      className="relative shrink-0"
      style={{ width: CANDLE_BODY, height: chartHeight }}
    >
      <motion.div
        className="absolute z-0 origin-top rounded-full"
        style={{
          top: wickTop,
          left: (CANDLE_BODY - CANDLE_WICK) / 2,
          width: CANDLE_WICK,
          backgroundColor: wickColor,
        }}
        initial={{ height: 0 }}
        animate={{ height: wickHeight }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0.4 }}
      />

      <motion.div
        className="absolute left-0 z-10 rounded-[2px]"
        style={{
          top: bodyTop,
          width: CANDLE_BODY,
          backgroundColor: bodyColor,
          boxShadow: isLatest
            ? bullish
              ? "0 0 12px rgba(0,200,83,0.4)"
              : "0 0 12px rgba(255,61,0,0.4)"
            : undefined,
        }}
        initial={{ height: 0 }}
        animate={{ height: bodyHeight }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </motion.div>
  );
}

function ChartSkeleton() {
  return (
    <div className="flex h-full items-end gap-4 px-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="hero-terminal-skeleton flex-1 rounded-[2px]"
          style={{ height: `${35 + (i % 4) * 14}%` }}
        />
      ))}
    </div>
  );
}

export function HeroMiniChart({ className, compact = false }: HeroMiniChartProps) {
  const [live, setLive] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [points, setPoints] = useState<OhlcPoint[]>([]);
  const [change, setChange] = useState(0);
  const [scrambleKey, setScrambleKey] = useState(0);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  const prevCloseRef = useRef<number | null>(null);
  const pointIdRef = useRef(0);
  const hasDataRef = useRef(false);

  const chartHeight = compact ? CHART_HEIGHT_MOBILE : CHART_HEIGHT_DESKTOP;
  const visible = points.slice(-VISIBLE_CANDLES);
  const current = points[points.length - 1] ?? null;
  const isUp = change >= 0;

  const panX = useMotionValue(0);
  const panSpring = useSpring(panX, SPRING);

  const priceMin =
    visible.length > 0 ? Math.min(...visible.map((p) => p.low)) : 0;
  const priceMax =
    visible.length > 0 ? Math.max(...visible.map((p) => p.high)) : 1;
  const yScale = createYScale(priceMin, priceMax, chartHeight);

  const candleStride = CANDLE_BODY + CANDLE_GAP;
  const trackWidth = visible.length * candleStride - CANDLE_GAP;

  useEffect(() => {
    const viewportWidth = compact ? 280 : 360;
    const overflow = Math.max(0, trackWidth - viewportWidth);
    panX.set(-overflow);
  }, [trackWidth, compact, panX]);

  const load = useCallback(async () => {
    const close = await fetchEurUsdPrice();
    if (close === null) {
      if (!hasDataRef.current) setConnecting(true);
      return;
    }

    const prevClose = prevCloseRef.current;
    const nextChange =
      prevClose && prevClose > 0 ? ((close - prevClose) / prevClose) * 100 : 0;

    if (prevClose !== null) {
      setFlash(nextChange >= 0 ? "up" : "down");
      window.setTimeout(() => setFlash(null), 450);
    }

    const point = buildOhlcPoint(close, prevClose, ++pointIdRef.current);
    prevCloseRef.current = close;

    setPoints((prev) => [...prev, point].slice(-MAX_POINTS));
    setChange(nextChange);
    setLive(true);
    setConnecting(false);
    hasDataRef.current = true;
    setScrambleKey((k) => k + 1);
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [load]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
      className={cn(
        "relative w-full rounded-sm border border-[#2A2A2A] bg-[#0A0A0A] p-5",
        compact ? "h-[280px] md:w-full" : "w-full md:w-[400px]",
        className
      )}
    >
      <div className="relative mb-4">
        <AnimatePresence>
          {flash && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "pointer-events-none absolute inset-0 rounded-sm",
                flash === "up" ? "bg-[#00C853]/10" : "bg-[#FF3D00]/10"
              )}
            />
          )}
        </AnimatePresence>

        <div className="flex items-start justify-between gap-3">
          <div>
            {live && current ? (
              <p className="font-mono text-4xl font-bold text-white tabular-nums leading-none">
                <ScramblePrice value={current.close} scrambleKey={scrambleKey} />
              </p>
            ) : (
              <p className="font-mono text-lg font-bold uppercase tracking-widest text-[#888888]">
                CONNECTING...
              </p>
            )}

            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#888888]">
              EUR/USD
            </p>

            {live && (
              <p
                className={cn(
                  "mt-2 font-mono text-sm font-semibold tabular-nums",
                  isUp ? "text-[#00C853]" : "text-[#FF3D00]"
                )}
              >
                {isUp ? "▲" : "▼"} {isUp ? "+" : ""}
                {change.toFixed(2)}%
              </p>
            )}
          </div>

          {live && <LiveIndicator />}
        </div>
      </div>

      <div className="mb-4 h-px bg-[#2A2A2A]" />

      <div
        className="relative overflow-hidden"
        style={{ height: chartHeight }}
      >
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-px bg-[#1A1A1A]" />
          ))}
        </div>

        {connecting || !live ? (
          <ChartSkeleton />
        ) : (
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute right-0 top-0 bottom-0 flex items-stretch gap-4"
              style={{ x: panSpring }}
            >
              <AnimatePresence initial={false} mode="popLayout">
                {visible.map((point, i) => (
                  <Candlestick
                    key={point.id}
                    point={point}
                    yScale={yScale}
                    chartHeight={chartHeight}
                    isLatest={i === visible.length - 1}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
