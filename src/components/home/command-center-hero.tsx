"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  calcChangePercent,
  fetchUsdRates,
  isValidPrice,
} from "@/lib/fx-rates";
import { cn } from "@/lib/utils";

type MiniPair = {
  pair: "EUR/USD" | "GBP/USD" | "USD/JPY";
  price: number;
  direction: "up" | "down" | "flat";
};

const FALLBACK_TICKER: MiniPair[] = [
  { pair: "EUR/USD", price: 1.1417, direction: "up" },
  { pair: "GBP/USD", price: 1.3402, direction: "down" },
  { pair: "USD/JPY", price: 161.69, direction: "up" },
];

function formatMiniPrice(pair: MiniPair["pair"], price: number) {
  if (pair === "USD/JPY") return price.toFixed(2);
  return price.toFixed(4);
}

function HeroMiniTicker() {
  const [pairs, setPairs] = useState<MiniPair[]>(FALLBACK_TICKER);
  const previousRef = useRef<Record<string, number>>({});

  useEffect(() => {
    async function load() {
      const rates = await fetchUsdRates();
      if (!rates) return;

      const next: MiniPair[] = [];

      const eur = rates.EUR > 0 ? 1 / rates.EUR : null;
      if (isValidPrice(eur)) {
        const prev = previousRef.current["EUR/USD"];
        const change = calcChangePercent(eur, prev ?? null);
        next.push({
          pair: "EUR/USD",
          price: eur,
          direction:
            change === null ? "flat" : change > 0 ? "up" : change < 0 ? "down" : "flat",
        });
        previousRef.current["EUR/USD"] = eur;
      }

      const gbp = rates.GBP > 0 ? 1 / rates.GBP : null;
      if (isValidPrice(gbp)) {
        const prev = previousRef.current["GBP/USD"];
        const change = calcChangePercent(gbp, prev ?? null);
        next.push({
          pair: "GBP/USD",
          price: gbp,
          direction:
            change === null ? "flat" : change > 0 ? "up" : change < 0 ? "down" : "flat",
        });
        previousRef.current["GBP/USD"] = gbp;
      }

      const jpy = rates.JPY;
      if (isValidPrice(jpy)) {
        const prev = previousRef.current["USD/JPY"];
        const change = calcChangePercent(jpy, prev ?? null);
        next.push({
          pair: "USD/JPY",
          price: jpy,
          direction:
            change === null ? "flat" : change > 0 ? "up" : change < 0 ? "down" : "flat",
        });
        previousRef.current["USD/JPY"] = jpy;
      }

      if (next.length === 3) setPairs(next);
    }

    load();
    const id = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 border-b border-[#333333] px-6 py-3 font-data text-[12px] tabular-nums">
      {pairs.map((item, i) => (
        <span key={item.pair} className="inline-flex items-center gap-1.5 whitespace-nowrap">
          {i > 0 && <span className="text-[#333333]">|</span>}
          <span className="text-[#9CA3AF]">{item.pair}</span>
          <span className="text-white">{formatMiniPrice(item.pair, item.price)}</span>
          <span
            className={cn(
              item.direction === "up" && "text-[#4A7C59]",
              item.direction === "down" && "text-[#8B3A3A]",
              item.direction === "flat" && "text-[#9CA3AF]"
            )}
          >
            {item.direction === "up" ? "▲" : item.direction === "down" ? "▼" : "—"}
          </span>
        </span>
      ))}
    </div>
  );
}

type CommandCenterHeroProps = {
  winRate: string;
  pipsMonth: number;
  activeMembers: number;
  loading?: boolean;
};

export function CommandCenterHero({
  winRate,
  pipsMonth,
  activeMembers,
  loading,
}: CommandCenterHeroProps) {
  return (
    <section className="bg-[#F5F5F0] pt-[100px]">
      <div className="grid min-h-[700px] grid-cols-1 lg:grid-cols-[40%_60%]">
        <div className="flex flex-col bg-[#1A1A1A] text-white">
          <HeroMiniTicker />

          <div className="flex flex-1 flex-col justify-between px-6 py-8 lg:px-8">
            <div>
              <div className="font-data mb-1 text-7xl font-bold tabular-nums text-white">
                {loading ? "—" : winRate}
              </div>
              <p className="text-[11px] text-[#9CA3AF]">Win Rate | 2024–2026</p>
            </div>

            <div className="my-8 grid grid-cols-3 gap-4 border-y border-[#333333] py-6">
              <div>
                <div className="font-data text-2xl tabular-nums text-white">
                  {loading ? "—" : `${pipsMonth.toLocaleString()}+`}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.15em] text-[#9CA3AF]">
                  Pips/Month
                </div>
              </div>
              <div>
                <div className="font-data text-2xl tabular-nums text-white">
                  {loading ? "—" : `${activeMembers}+`}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.15em] text-[#9CA3AF]">
                  Active Members
                </div>
              </div>
              <div>
                <div className="font-data text-2xl tabular-nums text-white">30+</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.15em] text-[#9CA3AF]">
                  Countries
                </div>
              </div>
            </div>

            <Link
              href="/payment/standard"
              className="block w-full bg-[#B8956A] py-4 text-center text-xs font-bold uppercase tracking-[0.15em] text-black transition-colors duration-200 hover:bg-[#C9A87C]"
            >
              GET STARTED — $49/MONTH
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-center bg-[#F5F5F0] px-6 py-10 lg:px-12 lg:py-8">
          <h1 className="font-serif-display mb-5 max-w-xl text-[42px] leading-[1.15] text-[#1A1A1A]">
            Institutional-Grade Forex Signals
          </h1>
          <p className="mb-6 max-w-lg text-base leading-relaxed text-[#6B7280]">
            Real-time entry, stop-loss, and take-profit levels delivered to your Telegram.
            No guesswork. No hype. Just precision.
          </p>

          <p className="mb-6 text-[13px] text-[#4A4A4A]">
            <span>✓ Daily 2–6 Signals</span>
            <span className="mx-2 text-[#D1D5DB]">•</span>
            <span>✓ Entry + SL + TP</span>
            <span className="mx-2 text-[#D1D5DB]">•</span>
            <span>✓ Live Updates</span>
            <span className="mx-2 text-[#D1D5DB]">•</span>
            <span>✓ Education</span>
          </p>

          <p className="mb-8 text-[10px] uppercase tracking-[0.25em] text-[#6B7280]">
            SECURE CHECKOUT • INSTANT ACCESS • MONEY-BACK GUARANTEE
          </p>

          <a
            href="#performance"
            className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[#B8956A] transition-colors duration-200 hover:text-[#C9A87C]"
          >
            VIEW PERFORMANCE →
          </a>
        </div>
      </div>
    </section>
  );
}
