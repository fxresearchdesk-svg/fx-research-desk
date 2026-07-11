"use client";

import { InstitutionalTicker } from "@/components/institutional-ticker";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import { cn } from "@/lib/utils";

const SNAPSHOTS = [
  {
    pair: "EUR/USD",
    outlook:
      "Bullish bias above 1.1400. ECB dovish tilt supports euro. Target 1.1500.",
    status: "BULLISH" as const,
  },
  {
    pair: "GBP/USD",
    outlook:
      "Range-bound 1.3350-1.3450. BoE policy uncertainty caps upside.",
    status: "NEUTRAL" as const,
  },
  {
    pair: "XAU/USD",
    outlook:
      "Gold tests $4,120 resistance. Safe-haven demand on geopolitical risk.",
    status: "BULLISH" as const,
  },
];

const WEEKLY_EVENTS = [
  "Fed Chair Powell testimony (Wed) — watch for rate guidance",
  "US CPI data (Thu) — inflation trajectory critical for USD",
  "ECB rate decision (Thu) — 25bp cut priced in",
  "UK GDP print (Fri) — sterling volatility expected",
];

const RECENT_ANALYSIS = [
  { title: "Why the Dollar Is Losing Ground", date: "July 10, 2026" },
  { title: "Gold's Breakout: What's Next?", date: "July 8, 2026" },
  { title: "EUR/GBP: The Quiet Cross to Watch", date: "July 5, 2026" },
];

function StatusBadge({ status }: { status: "BULLISH" | "NEUTRAL" | "BEARISH" }) {
  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em]",
        status === "BULLISH" && "bg-[#4A7C59]/15 text-[#4A7C59]",
        status === "NEUTRAL" && "bg-[#E5E7EB] text-[#6B7280]",
        status === "BEARISH" && "bg-[#8B3A3A]/15 text-[#8B3A3A]"
      )}
    >
      {status}
    </span>
  );
}

export function InsightsPageClient() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#4A4A4A]">
      <InstitutionalTicker />
      <SiteNavbar />

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-[100px]">
        <header className="mb-12">
          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#B8956A]">
            MARKET INSIGHTS
          </p>
          <h1 className="font-serif-display text-[42px] text-[#1A1A1A]">
            Weekly Market Intelligence
          </h1>
        </header>

        <section className="mb-14">
          <h2 className="mb-6 text-[10px] uppercase tracking-[0.3em] text-[#B8956A]">
            Current Market Snapshot
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {SNAPSHOTS.map((item) => (
              <div key={item.pair} className="border border-[#E5E7EB] bg-white p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="font-data text-lg text-[#1A1A1A]">{item.pair}</span>
                  <StatusBadge status={item.status} />
                </div>
                <p className="text-sm leading-relaxed text-[#6B7280]">{item.outlook}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14 border border-[#E5E7EB] bg-white p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-serif-display text-2xl text-[#1A1A1A]">This Week in FX</h2>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#6B7280]">
              Week of July 7, 2026
            </p>
          </div>
          <ul className="space-y-3">
            {WEEKLY_EVENTS.map((event) => (
              <li
                key={event}
                className="flex gap-3 text-sm leading-relaxed text-[#6B7280]"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#B8956A]" aria-hidden />
                <span>{event}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-6 text-[10px] uppercase tracking-[0.3em] text-[#B8956A]">
            Recent Analysis
          </h2>
          <div className="divide-y divide-[#E5E7EB] border border-[#E5E7EB]">
            {RECENT_ANALYSIS.map((article) => (
              <div
                key={article.title}
                className="flex flex-col gap-2 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <h3 className="text-base text-[#1A1A1A]">{article.title}</h3>
                <span className="font-data text-xs text-[#6B7280]">{article.date}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
