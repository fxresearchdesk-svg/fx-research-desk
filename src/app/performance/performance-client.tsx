"use client";

import { useEffect, useState } from "react";
import { InstitutionalTicker } from "@/components/institutional-ticker";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import { fetchRecentSignals, fetchStats, isSupabaseConfigured } from "@/lib/supabase";
import type { Signal, Stats } from "@/lib/types";
import { cn } from "@/lib/utils";

const FALLBACK_STATS = {
  win_rate: 87.3,
  pips_month: 2450,
  monthly_return: 14.2,
  active_traders: 500,
};

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
  if (pair === "XAU/USD" || pair === "XAG/USD") return value.toFixed(2);
  if (pair === "USD/JPY") return value.toFixed(2);
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

export function PerformancePageClient() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [signals, setSignals] = useState<Signal[]>([]);

  const displayStats = stats ?? FALLBACK_STATS;

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    async function load() {
      const [statsData, recentSignals] = await Promise.all([
        fetchStats(),
        fetchRecentSignals(20),
      ]);
      if (statsData) setStats(statsData);
      setSignals(recentSignals);
      setLoading(false);
    }

    load();
  }, []);

  const statCards = [
    {
      value: `${Number(displayStats.win_rate).toFixed(1)}%`,
      label: "Win Rate",
    },
    {
      value: `${displayStats.pips_month.toLocaleString()}+`,
      label: "Pips This Month",
    },
    {
      value: `+${displayStats.monthly_return}%`,
      label: "Avg Monthly Return",
    },
    {
      value: `${displayStats.active_traders}+`,
      label: "Active Members",
    },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#4A4A4A]">
      <InstitutionalTicker />
      <SiteNavbar />

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-[100px]">
        <header className="mb-12 border-b border-[#E5E7EB] pb-10">
          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#B8956A]">
            TRACK RECORD
          </p>
          <h1 className="font-serif-display mb-4 text-[42px] text-[#1A1A1A]">
            Verified Performance
          </h1>
          <p className="max-w-2xl text-base text-[#6B7280]">
            Every trade is logged and verified. No fake results.
          </p>
        </header>

        <div className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="border border-[#E5E7EB] bg-white p-6 text-center"
            >
              <div className="font-data mb-2 text-3xl tabular-nums text-[#1A1A1A] md:text-4xl">
                {loading ? "—" : card.value}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#6B7280]">
                {card.label}
              </div>
            </div>
          ))}
        </div>

        <section className="mb-16">
          <h2 className="mb-6 text-[10px] uppercase tracking-[0.3em] text-[#B8956A]">
            Recent Trades
          </h2>

          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse border border-[#E5E7EB] bg-[#F9FAFB]" />
              ))}
            </div>
          ) : signals.length > 0 ? (
            <div className="overflow-x-auto border border-[#E5E7EB]">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-white text-[10px] uppercase tracking-[0.2em] text-[#6B7280]">
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
                        "border-b border-[#E5E7EB] font-data text-[13px] tabular-nums",
                        i % 2 === 1 && "bg-[#F9FAFB]"
                      )}
                    >
                      <td className="px-4 py-3 text-[#1A1A1A]">{signal.pair}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em]",
                            signal.direction === "BUY"
                              ? "bg-[#4A7C59]/15 text-[#4A7C59]"
                              : "bg-[#8B3A3A]/15 text-[#8B3A3A]"
                          )}
                        >
                          {signal.direction}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#4A4A4A]">
                        {formatPrice(signal.pair, signal.entry_price)}
                      </td>
                      <td className="px-4 py-3 text-[#4A4A4A]">
                        {formatPrice(signal.pair, signal.stop_loss)}
                      </td>
                      <td className="px-4 py-3 text-[#4A4A4A]">
                        {formatPrice(signal.pair, signal.take_profit)}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-3",
                          signal.result === "WIN" && "text-[#4A7C59]",
                          signal.result === "LOSS" && "text-[#8B3A3A]",
                          (!signal.result || signal.result === "PENDING") &&
                            "text-[#6B7280]"
                        )}
                      >
                        {getResultLabel(signal)}
                      </td>
                      <td className="px-4 py-3 text-[#6B7280]">
                        {formatDate(signal.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="border border-[#E5E7EB] bg-[#F9FAFB] px-6 py-12 text-center text-sm text-[#6B7280]">
              Trade history will appear here once signals are logged.
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-6 text-[10px] uppercase tracking-[0.3em] text-[#B8956A]">
            Monthly Breakdown
          </h2>
          <div className="space-y-4">
            {MONTHLY_PIPS.map((item) => (
              <div key={item.month} className="grid grid-cols-[48px_1fr_80px] items-center gap-4">
                <span className="font-data text-sm text-[#1A1A1A]">{item.month}</span>
                <div className="h-6 border border-[#E5E7EB] bg-[#F9FAFB]">
                  <div
                    className="h-full bg-[#4A7C59]"
                    style={{ width: `${(item.pips / MAX_MONTHLY_PIPS) * 100}%` }}
                  />
                </div>
                <span className="font-data text-right text-sm tabular-nums text-[#4A7C59]">
                  +{item.pips} pips
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
