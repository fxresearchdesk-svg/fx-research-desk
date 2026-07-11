"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  calcChangePercent,
  fetchHeroPrices,
  formatPairPrice,
  type HeroPair,
} from "@/lib/fx-rates";
import { cn } from "@/lib/utils";

const POLL_INTERVAL_MS = 30 * 1000;
const MAX_HISTORY = 24;

type PairDisplay = {
  price: number | null;
  change: number | null;
};

function buildSparklinePath(values: number[], width: number, height: number): string {
  if (values.length < 2) return "";

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padding = 4;

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = padding + ((max - v) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  return `M ${points.join(" L ")}`;
}

function ChangeDisplay({ change }: { change: number | null }) {
  if (change === null) return null;

  const up = change > 0;
  const down = change < 0;

  return (
    <span
      className={cn(
        "font-data text-sm",
        up && "text-[#4A7C59]",
        down && "text-[#8B3A3A]",
        !up && !down && "text-[#9CA3AF]"
      )}
    >
      {up && "▲ "}
      {down && "▼ "}
      {change > 0 ? "+" : ""}
      {change.toFixed(2)}%
    </span>
  );
}

function SecondaryPair({
  pair,
  data,
  status,
}: {
  pair: HeroPair;
  data: PairDisplay;
  status: "loading" | "ready" | "unavailable";
}) {
  return (
    <div>
      <p className="mb-2 text-[10px] uppercase tracking-widest text-[#9CA3AF]">
        {pair}
      </p>
      {status === "loading" && (
        <p className="font-data text-lg text-[#9CA3AF]">Loading...</p>
      )}
      {status === "unavailable" && (
        <p className="font-data text-lg text-[#9CA3AF]">Unavailable</p>
      )}
      {status === "ready" && data.price !== null && (
        <>
          <p className="font-data text-xl text-[#1A1A1A]">
            {formatPairPrice(data.price, pair)}
          </p>
          <ChangeDisplay change={data.change} />
        </>
      )}
    </div>
  );
}

export function HeroLivePrices() {
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">(
    "loading"
  );
  const [eur, setEur] = useState<PairDisplay>({ price: null, change: null });
  const [gbp, setGbp] = useState<PairDisplay>({ price: null, change: null });
  const [gold, setGold] = useState<PairDisplay>({ price: null, change: null });
  const [eurHistory, setEurHistory] = useState<number[]>([]);

  const prevRef = useRef<{
    eurUsd: number | null;
    gbpUsd: number | null;
    xauUsd: number | null;
  }>({ eurUsd: null, gbpUsd: null, xauUsd: null });

  const load = useCallback(async () => {
    const snapshot = await fetchHeroPrices();
    const hasPrimary =
      snapshot.eurUsd !== null || snapshot.gbpUsd !== null || snapshot.xauUsd !== null;

    if (!hasPrimary) {
      setStatus("unavailable");
      return;
    }

    if (snapshot.eurUsd !== null) {
      setEur({
        price: snapshot.eurUsd,
        change: calcChangePercent(snapshot.eurUsd, prevRef.current.eurUsd),
      });
      setEurHistory((prev) =>
        [...prev, snapshot.eurUsd!].slice(-MAX_HISTORY)
      );
      prevRef.current.eurUsd = snapshot.eurUsd;
    }

    if (snapshot.gbpUsd !== null) {
      setGbp({
        price: snapshot.gbpUsd,
        change: calcChangePercent(snapshot.gbpUsd, prevRef.current.gbpUsd),
      });
      prevRef.current.gbpUsd = snapshot.gbpUsd;
    }

    if (snapshot.xauUsd !== null) {
      setGold({
        price: snapshot.xauUsd,
        change: calcChangePercent(snapshot.xauUsd, prevRef.current.xauUsd),
      });
      prevRef.current.xauUsd = snapshot.xauUsd;
    }

    setStatus("ready");
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [load]);

  const sparkPath = buildSparklinePath(eurHistory, 320, 56);

  return (
    <div className="w-full max-w-md">
      <div className="border border-[#E5E7EB] bg-[#FAFAFA] p-8">
        <p className="mb-3 text-[10px] uppercase tracking-widest text-[#9CA3AF]">
          EUR/USD
        </p>

        {status === "loading" && (
          <p className="font-data text-[32px] text-[#9CA3AF]">—</p>
        )}
        {status === "unavailable" && (
          <p className="font-data text-sm text-[#9CA3AF]">
            Market data temporarily unavailable
          </p>
        )}
        {status === "ready" && eur.price !== null && (
          <>
            <div className="flex items-baseline gap-4">
              <p className="font-data text-[32px] text-[#1A1A1A]">
                {formatPairPrice(eur.price, "EUR/USD")}
              </p>
              <ChangeDisplay change={eur.change} />
            </div>

            <div className="mt-6 h-14 w-full">
              {sparkPath ? (
                <svg
                  viewBox="0 0 320 56"
                  className="h-full w-full"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <defs>
                    <linearGradient
                      id="heroSparkGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#B8956A" stopOpacity="0.4" />
                      <stop offset="50%" stopColor="#B8956A" stopOpacity="1" />
                      <stop offset="100%" stopColor="#B8956A" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  <path
                    d={sparkPath}
                    fill="none"
                    stroke="url(#heroSparkGrad)"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              ) : (
                <div className="h-px w-full bg-[#E5E7EB]" />
              )}
            </div>
          </>
        )}

        <div className="mt-8 grid grid-cols-2 gap-6 border-t border-[#E5E7EB] pt-6">
          <SecondaryPair pair="GBP/USD" data={gbp} status={status} />
          <SecondaryPair pair="XAU/USD" data={gold} status={status} />
        </div>
      </div>
    </div>
  );
}
