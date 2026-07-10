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
const VISIBLE_CANDLES = 15;
const CHART_HEIGHT = 220;
const CANDLE_GAP = 10;

const GREEN_BODY = "rgba(0, 200, 83, 0.85)";
const GREEN_WICK = "rgba(0, 200, 83, 0.35)";
const RED_BODY = "rgba(255, 61, 0, 0.85)";
const RED_WICK = "rgba(255, 61, 0, 0.35)";

const CANDLE_SPRING = { type: "spring" as const, stiffness: 200, damping: 20 };
const PAN_SPRING = { type: "spring" as const, stiffness: 200, damping: 20 };

type OhlcPoint = {
  id: number;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

type PanelStatus = "initializing" | "live" | "unavailable";

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

function createYScale(min: number, max: number, height: number, padding = 16) {
  const range = max - min || 0.0001;
  const plot = height - padding * 2;
  return (price: number) => padding + (1 - (price - min) / range) * plot;
}

function getCandleVisual(ageFromNewest: number) {
  if (ageFromNewest === 0) return { opacity: 1, bodyWidth: 16, wickWidth: 2 };
  if (ageFromNewest === 1) return { opacity: 0.7, bodyWidth: 14, wickWidth: 2 };
  if (ageFromNewest === 2) return { opacity: 0.55, bodyWidth: 12, wickWidth: 2 };
  if (ageFromNewest === 3) return { opacity: 0.4, bodyWidth: 10, wickWidth: 1 };
  if (ageFromNewest === 4) return { opacity: 0.25, bodyWidth: 8, wickWidth: 1 };
  return { opacity: 0.1, bodyWidth: 8, wickWidth: 1 };
}

function formatTimeLabel(ts: number) {
  const d = new Date(ts);
  const h = d.getUTCHours().toString().padStart(2, "0");
  const m = d.getUTCMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
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
      if (frame < 5) {
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
    }, 40);
    return () => clearInterval(interval);
  }, [scrambleKey, target]);

  return <>{display}</>;
}

function SmokeTrail({
  top,
  left,
  color,
  opacity,
}: {
  top: number;
  left: number;
  color: string;
  opacity: number;
}) {
  return (
    <div
      className="pointer-events-none absolute z-0"
      style={{
        top: top - 30,
        left,
        width: 1,
        height: 30,
        opacity,
        background: `linear-gradient(to top, ${color} 0%, transparent 100%)`,
      }}
    />
  );
}

function GhostCandle({
  point,
  yScale,
  chartHeight,
  ageFromNewest,
  isNewest,
}: {
  point: OhlcPoint;
  yScale: (price: number) => number;
  chartHeight: number;
  ageFromNewest: number;
  isNewest: boolean;
}) {
  const bullish = point.close >= point.open;
  const visual = getCandleVisual(ageFromNewest);
  const bodyColor = bullish ? GREEN_BODY : RED_BODY;
  const wickColor = bullish ? GREEN_WICK : RED_WICK;
  const glowColor = bullish ? "rgba(0,200,83," : "rgba(255,61,0,";

  const bodyTop = yScale(Math.max(point.open, point.close));
  const bodyBottom = yScale(Math.min(point.open, point.close));
  const bodyHeight = Math.max(bodyBottom - bodyTop, 4);
  const wickTop = yScale(point.high);
  const wickBottom = yScale(point.low);
  const wickHeight = Math.max(wickBottom - wickTop, bodyHeight + 4);
  const wickLeft = (visual.bodyWidth - visual.wickWidth) / 2;

  return (
    <motion.div
      layout
      initial={isNewest ? { opacity: 0, x: 24 } : false}
      animate={{ opacity: visual.opacity, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{
        layout: { duration: 0.4, ease: "easeOut" },
        opacity: { duration: 0.4 },
        x: isNewest ? CANDLE_SPRING : { duration: 0.4, ease: "easeOut" },
      }}
      className="relative shrink-0"
      style={{ width: visual.bodyWidth, height: chartHeight }}
    >
      <SmokeTrail
        top={wickTop}
        left={wickLeft + visual.wickWidth / 2 - 0.5}
        color={bullish ? "rgba(0,200,83,0.2)" : "rgba(255,61,0,0.2)"}
        opacity={visual.opacity}
      />

      <motion.div
        className="absolute z-0 origin-top rounded-full"
        style={{
          top: wickTop,
          left: wickLeft,
          width: visual.wickWidth,
          backgroundColor: wickColor,
        }}
        initial={isNewest ? { height: 0 } : false}
        animate={{ height: wickHeight }}
        transition={
          isNewest
            ? { duration: 0.2, ease: "easeOut", delay: 0.75 }
            : { duration: 0.2 }
        }
      />

      <motion.div
        className="absolute left-0 z-10 rounded-[2px]"
        style={{
          top: bodyTop,
          width: visual.bodyWidth,
          backgroundColor: bodyColor,
        }}
        initial={isNewest ? { height: 0 } : false}
        animate={{
          height: bodyHeight,
          boxShadow: isNewest
            ? [
                `0 0 8px ${glowColor}0.45)`,
                `0 0 16px ${glowColor}0.55)`,
                `0 0 8px ${glowColor}0.45)`,
              ]
            : "none",
        }}
        transition={
          isNewest
            ? {
                height: { ...CANDLE_SPRING, duration: 0.6 },
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }
            : { duration: 0.3 }
        }
      />
    </motion.div>
  );
}

function InitializingState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      <div className="flex w-full max-w-[200px] flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-px w-full animate-pulse bg-[#1A1A1A]/40"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
      <p className="text-xs uppercase tracking-[0.2em] text-[#444444]">
        Initializing market data...
      </p>
    </div>
  );
}

function UnavailableState() {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-xs uppercase tracking-[0.2em] text-[#444444]">
        Market data unavailable
      </p>
    </div>
  );
}

export function HeroMiniChart({ className, compact = false }: HeroMiniChartProps) {
  const [status, setStatus] = useState<PanelStatus>("initializing");
  const [points, setPoints] = useState<OhlcPoint[]>([]);
  const [change, setChange] = useState(0);
  const [scrambleKey, setScrambleKey] = useState(0);
  const [heartbeat, setHeartbeat] = useState(0);
  const [latestId, setLatestId] = useState<number | null>(null);

  const prevCloseRef = useRef<number | null>(null);
  const pointIdRef = useRef(0);
  const hasDataRef = useRef(false);

  const chartHeight = compact ? 160 : CHART_HEIGHT;
  const visible = points.slice(-VISIBLE_CANDLES);
  const current = points[points.length - 1] ?? null;
  const isUp = change >= 0;

  const panX = useMotionValue(0);
  const panSpring = useSpring(panX, PAN_SPRING);

  const priceMin =
    visible.length > 0 ? Math.min(...visible.map((p) => p.low)) : 0;
  const priceMax =
    visible.length > 0 ? Math.max(...visible.map((p) => p.high)) : 1;
  const yScale = createYScale(priceMin, priceMax, chartHeight);

  const trackWidth =
    visible.length > 0
      ? visible.reduce((sum, _, i) => {
          const age = visible.length - 1 - i;
          return sum + getCandleVisual(age).bodyWidth + CANDLE_GAP;
        }, -CANDLE_GAP)
      : 0;

  useEffect(() => {
    const viewport = compact ? 300 : 340;
    panX.set(-Math.max(0, trackWidth - viewport));
  }, [trackWidth, compact, panX]);

  const load = useCallback(async () => {
    const close = await fetchEurUsdPrice();

    if (close === null) {
      setStatus(hasDataRef.current ? "live" : "unavailable");
      return;
    }

    const prevClose = prevCloseRef.current;
    const nextChange =
      prevClose && prevClose > 0 ? ((close - prevClose) / prevClose) * 100 : 0;

    const id = ++pointIdRef.current;
    const point = buildOhlcPoint(close, prevClose, id);
    prevCloseRef.current = close;
    hasDataRef.current = true;

    setPoints((prev) => [...prev, point].slice(-MAX_POINTS));
    setChange(nextChange);
    setLatestId(id);
    setStatus("live");
    setScrambleKey((k) => k + 1);
  }, []);

  useEffect(() => {
    load();
    const pollId = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(pollId);
  }, [load]);

  useEffect(() => {
    if (status !== "live") return;
    const id = setInterval(() => setHeartbeat((h) => h + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  const timeLabels = visible.slice(-5).map((p) => formatTimeLabel(p.timestamp));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: [0, -4, 0],
      }}
      transition={{
        opacity: { duration: 0.6, ease: "easeOut", delay: 0.1 },
        y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
      }}
      className={cn(
        "relative w-full rounded-sm border border-[#D4AF37]/15 bg-[#080808]/90 p-5 backdrop-blur-sm",
        compact ? "h-[280px]" : "h-[340px] md:w-[380px]",
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          {status === "live" && current ? (
            <motion.p
              key={heartbeat}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="font-mono text-4xl font-bold tabular-nums text-white"
              style={{ textShadow: "0 0 20px rgba(212,175,55,0.3)" }}
            >
              <ScramblePrice value={current.close} scrambleKey={scrambleKey} />
            </motion.p>
          ) : status === "unavailable" ? (
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-[#444444]">
              Market data unavailable
            </p>
          ) : (
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-[#444444]">
              Initializing market data...
            </p>
          )}

          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#666666]">
            EUR/USD
          </p>

          {status === "live" && (
            <p
              className={cn(
                "mt-2 font-mono text-sm tabular-nums",
                isUp ? "text-[#00C853]" : "text-[#FF3D00]"
              )}
              style={{ opacity: 0.9 }}
            >
              {isUp ? "▲" : "▼"} {isUp ? "+" : ""}
              {change.toFixed(2)}%
            </p>
          )}
        </div>

        {status === "live" && (
          <span className="flex items-center gap-2 pt-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#00C853] opacity-50 animate-hero-live-ring" />
              <span className="relative h-2 w-2 rounded-full bg-[#00C853]" />
            </span>
            <span className="text-xs uppercase tracking-widest text-[#00C853]">
              LIVE
            </span>
          </span>
        )}
      </div>

      <div className="mb-3 h-px bg-[#D4AF37]/10" />

      <div className="relative overflow-hidden" style={{ height: chartHeight }}>
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-px bg-[#1A1A1A]/40" />
          ))}
        </div>

        {status === "live" && visible.length > 0 ? (
          <div className="absolute inset-0 flex items-end justify-center overflow-hidden pb-1">
            <motion.div
              layout
              className="flex items-stretch gap-[10px]"
              style={{ x: panSpring }}
            >
              <AnimatePresence initial={false} mode="popLayout">
                {visible.map((point, i) => {
                  const ageFromNewest = visible.length - 1 - i;
                  return (
                    <GhostCandle
                      key={point.id}
                      point={point}
                      yScale={yScale}
                      chartHeight={chartHeight}
                      ageFromNewest={ageFromNewest}
                      isNewest={point.id === latestId}
                    />
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>
        ) : status === "unavailable" ? (
          <UnavailableState />
        ) : (
          <InitializingState />
        )}
      </div>

      {status === "live" && timeLabels.length > 0 && (
        <div className="mt-3 flex justify-between px-2">
          {timeLabels.map((label, i) => (
            <span
              key={`${label}-${i}`}
              className="font-mono text-[10px] text-[#444444] tabular-nums"
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
