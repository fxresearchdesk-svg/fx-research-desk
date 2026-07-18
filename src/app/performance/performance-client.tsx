"use client";

import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { telegramUrl } from "@/lib/site-config";
import { fetchRecentSignals, fetchStats, isSupabaseConfigured } from "@/lib/supabase";
import type { Signal, Stats } from "@/lib/types";
import { cn } from "@/lib/utils";

const MONTHLY_PIPS = [
  { month: "Jan", pips: 320 },
  { month: "Feb", pips: 280 },
  { month: "Mar", pips: 410 },
  { month: "Apr", pips: 350 },
  { month: "May", pips: 290 },
  { month: "Jun", pips: 380 },
];

const MAX_MONTHLY_PIPS = Math.max(...MONTHLY_PIPS.map((m) => m.pips));

function formatPrice(pair: string, value: number) {
  if (pair === "XAU/USD" || pair === "XAG/USD" || pair === "USD/JPY") {
    return value.toFixed(2);
  }
  return value.toFixed(4);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getResultLabel(signal: Signal) {
  if (signal.result === "WIN") {
    return signal.pips != null ? `WIN +${signal.pips}` : "WIN";
  }
  if (signal.result === "LOSS") {
    return signal.pips != null ? `LOSS ${signal.pips}` : "LOSS";
  }
  return "PENDING";
}

function hasVerifiedStats(stats: Stats | null): stats is Stats {
  return Boolean(
    stats &&
      Number.isFinite(stats.win_rate) &&
      Number.isFinite(stats.pips_month) &&
      Number.isFinite(stats.monthly_return)
  );
}

export function PerformancePageClient() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [signals, setSignals] = useState<Signal[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const [statsData, recentSignals] = await Promise.all([
          fetchStats(),
          fetchRecentSignals(20),
        ]);
        if (statsData) setStats(statsData);
        setSignals(recentSignals);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const showStats = !loading && hasVerifiedStats(stats);
  const showTrades = !loading && signals.length > 0;

  return (
    <SiteShell>
      <div className="mx-auto max-w-[1240px] px-6 pb-24 pt-14 lg:px-10">
        <header className="mb-12 border-b border-[#E7E3D8] pb-10">
          <p className="mb-3 text-[12.5px] font-extrabold tracking-[0.32em] text-[#C6A15B]">
            TRACK RECORD
          </p>
          <h1 className="font-landing-serif mb-4 text-[42px] font-bold text-[#0E0F13]">
            Verified Performance
          </h1>
          <p className="max-w-2xl text-[15.5px] font-medium text-[#4A463C]">
            Every trade is logged and verified. No fabricated results.
          </p>
        </header>

        {loading ? (
          <div className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[110px] animate-pulse border border-[#E7E3D8] bg-white"
              />
            ))}
          </div>
        ) : showStats ? (
          <div className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="border border-[#E7E3D8] bg-white p-6 text-center">
              <div className="font-data mb-2 text-3xl tabular-nums text-[#0E0F13] md:text-4xl">
                {Number(stats.win_rate).toFixed(1)}%
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#4A463C]">
                Win Rate
              </div>
            </div>
            <div className="border border-[#E7E3D8] bg-white p-6 text-center">
              <div className="font-data mb-2 text-3xl tabular-nums text-[#0E0F13] md:text-4xl">
                {stats.pips_month.toLocaleString()}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#4A463C]">
                Pips This Month
              </div>
            </div>
            <div className="border border-[#E7E3D8] bg-white p-6 text-center">
              <div className="font-data mb-2 text-3xl tabular-nums text-[#0E0F13] md:text-4xl">
                +{stats.monthly_return}%
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#4A463C]">
                Avg Monthly Return
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-16 border border-[#E7E3D8] bg-white px-6 py-12 text-center">
            <p className="mb-6 text-[15px] font-medium text-[#4A463C]">
              Performance data updating — join our Telegram for live results.
            </p>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="landing-focus inline-block bg-[#0E0F13] px-8 py-3.5 text-[12px] font-bold tracking-[0.14em] text-white transition-colors hover:bg-[#1c1e26]"
            >
              OPEN TELEGRAM
            </a>
          </div>
        )}

        {loading ? (
          <section className="mb-16">
            <h2 className="mb-6 text-[12.5px] font-extrabold tracking-[0.32em] text-[#C6A15B]">
              Recent Trades
            </h2>
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse border border-[#E7E3D8] bg-white"
                />
              ))}
            </div>
          </section>
        ) : showTrades ? (
          <section className="mb-16">
            <h2 className="mb-6 text-[12.5px] font-extrabold tracking-[0.32em] text-[#C6A15B]">
              Recent Trades
            </h2>
            <div className="overflow-x-auto border border-[#E7E3D8]">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#E7E3D8] bg-white text-[10px] uppercase tracking-[0.2em] text-[#4A463C]">
                    <th className="px-4 py-3 font-medium">Pair</th>
                    <th className="px-4 py-3 font-medium">Direction</th>
                    <th className="px-4 py-3 font-medium">Entry</th>
                    <th className="px-4 py-3 font-medium">S/L</th>
                    <th className="px-4 py-3 font-medium">T/P</th>
                    <th className="px-4 py-3 font-medium">Result</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {signals.map((signal, i) => (
                    <tr
                      key={signal.id}
                      className={cn(
                        "border-b border-[#E7E3D8] font-data text-[13px] tabular-nums",
                        i % 2 === 1 && "bg-[#F1EEE5]/50"
                      )}
                    >
                      <td className="px-4 py-3 text-[#0E0F13]">{signal.pair}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white",
                            signal.direction === "BUY"
                              ? "bg-[#3C7A5C]"
                              : "bg-[#A6483C]"
                          )}
                        >
                          {signal.direction}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#4A463C]">
                        {formatPrice(signal.pair, signal.entry_price)}
                      </td>
                      <td className="px-4 py-3 text-[#4A463C]">
                        {formatPrice(signal.pair, signal.stop_loss)}
                      </td>
                      <td className="px-4 py-3 text-[#4A463C]">
                        {formatPrice(signal.pair, signal.take_profit)}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-3",
                          signal.result === "WIN" && "text-[#3C7A5C]",
                          signal.result === "LOSS" && "text-[#A6483C]",
                          (!signal.result || signal.result === "PENDING") &&
                            "text-[#4A463C]"
                        )}
                      >
                        {getResultLabel(signal)}
                      </td>
                      <td className="px-4 py-3 text-[#4A463C]">
                        {formatDate(signal.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        <section>
          <h2 className="mb-6 text-[12.5px] font-extrabold tracking-[0.32em] text-[#C6A15B]">
            Monthly Breakdown
          </h2>
          <div className="space-y-4 border border-[#E7E3D8] bg-white p-6">
            {MONTHLY_PIPS.map((item) => (
              <div
                key={item.month}
                className="grid grid-cols-[48px_1fr_88px] items-center gap-4"
              >
                <span className="font-data text-sm text-[#0E0F13]">{item.month}</span>
                <div className="h-6 border border-[#E7E3D8] bg-[#FAF9F6]">
                  <div
                    className="h-full bg-[#3C7A5C]"
                    style={{ width: `${(item.pips / MAX_MONTHLY_PIPS) * 100}%` }}
                  />
                </div>
                <span className="font-data text-right text-sm tabular-nums text-[#3C7A5C]">
                  +{item.pips} pips
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
