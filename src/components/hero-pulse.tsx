"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const FXAPI_REST_URL = "https://fxapi.app/api/USD.json";
const POLL_INTERVAL_MS = 30 * 1000;

const PULSE_BARS = [
  { width: 2, duration: 2, opacity: 0.2, heights: [16, 48, 24, 56, 16] },
  { width: 2, duration: 2.8, opacity: 0.35, heights: [20, 64, 32, 72, 20] },
  { width: 3, duration: 3.2, opacity: 0.5, heights: [24, 72, 40, 80, 24] },
  { width: 3, duration: 3.8, opacity: 0.65, heights: [28, 80, 44, 88, 28] },
  { width: 4, duration: 4.5, opacity: 0.75, heights: [32, 88, 48, 96, 32] },
  { width: 4, duration: 5, opacity: 0.8, heights: [36, 96, 52, 100, 36] },
  { width: 3, duration: 4.2, opacity: 0.7, heights: [30, 84, 46, 92, 30] },
];

type PulseStatus = "connecting" | "live" | "unavailable";

type HeroPulseProps = {
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

function PulseBars({ connecting }: { connecting: boolean }) {
  return (
    <div className="flex items-end justify-center gap-3 h-[100px]">
      {PULSE_BARS.map((bar, i) => (
        <motion.div
          key={i}
          className="rounded-full shrink-0"
          style={{
            width: bar.width,
            backgroundColor: `rgba(212, 175, 55, ${bar.opacity})`,
          }}
          animate={
            connecting
              ? { height: [bar.heights[0] * 0.2, bar.heights[2] * 0.25, bar.heights[0] * 0.2] }
              : { height: bar.heights }
          }
          transition={{
            duration: connecting ? 2.5 : bar.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.08,
          }}
        />
      ))}
    </div>
  );
}

export function HeroPulse({ className, compact = false }: HeroPulseProps) {
  const [status, setStatus] = useState<PulseStatus>("connecting");
  const [price, setPrice] = useState<number | null>(null);
  const [change, setChange] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);

  const prevPriceRef = useRef<number | null>(null);
  const hasDataRef = useRef(false);

  const isUp = change >= 0;
  const connecting = status === "connecting";

  const load = useCallback(async () => {
    const close = await fetchEurUsdPrice();

    if (close === null) {
      setStatus(hasDataRef.current ? "live" : "connecting");
      return;
    }

    const prev = prevPriceRef.current;
    const nextChange =
      prev && prev > 0 ? ((close - prev) / prev) * 100 : 0;

    prevPriceRef.current = close;
    hasDataRef.current = true;
    setPrice(close);
    setChange(nextChange);
    setStatus("live");
    setPulseKey((k) => k + 1);
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [load]);

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
        "relative flex flex-col rounded-sm border border-[#1A1A1A] bg-[#080808]/80 p-6 backdrop-blur-sm",
        compact ? "h-[280px] w-full" : "h-[340px] w-[380px]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          {connecting ? (
            <>
              <p className="font-mono text-4xl font-bold text-white">—</p>
              <p className="mt-2 text-xs uppercase tracking-widest text-[#444444]">
                CONNECTING...
              </p>
            </>
          ) : (
            <motion.p
              key={pulseKey}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="font-mono text-4xl font-bold tabular-nums text-white"
            >
              {price?.toFixed(4)}
            </motion.p>
          )}

          <p className="mt-2 text-xs uppercase tracking-widest text-[#666666]">
            EUR/USD
          </p>

          {status === "live" && price !== null && (
            <p
              className={cn(
                "mt-2 font-mono text-sm tabular-nums",
                isUp ? "text-[#00C853]" : "text-[#FF3D00]"
              )}
            >
              {isUp ? "▲" : "▼"} {isUp ? "+" : ""}
              {change.toFixed(2)}%
            </p>
          )}
        </div>

        {status === "live" && (
          <span className="flex items-center gap-2 pt-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00C853] opacity-40" />
              <span className="relative h-2 w-2 rounded-full bg-[#00C853] shadow-[0_0_8px_rgba(0,200,83,0.6)]" />
            </span>
            <span className="text-xs uppercase tracking-widest text-[#00C853]">
              LIVE
            </span>
          </span>
        )}
      </div>

      <div className="flex flex-1 items-center justify-center">
        <PulseBars connecting={connecting} />
      </div>

      <div className="mt-auto pt-4">
        <p className="mb-3 text-center text-[10px] uppercase tracking-widest text-[#00C853]">
          MARKET ACTIVE
        </p>
        <div className="mb-3 h-px w-full bg-[#1A1A1A]" />
        <p className="text-center text-[10px] uppercase tracking-widest text-[#444444]">
          London • New York • Tokyo
        </p>
      </div>
    </motion.div>
  );
}
