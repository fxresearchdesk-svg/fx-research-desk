"use client";

import { SiteShell } from "@/components/site-shell";
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
        "inline-block px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white",
        status === "BULLISH" && "bg-[#3C7A5C]",
        status === "NEUTRAL" && "bg-[#4A463C]",
        status === "BEARISH" && "bg-[#A6483C]"
      )}
    >
      {status}
    </span>
  );
}

export function InsightsPageClient() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-[1240px] px-6 pb-24 pt-14 lg:px-10">
        <header className="mb-12">
          <p className="mb-3 text-[12.5px] font-extrabold tracking-[0.32em] text-[#C6A15B]">
            MARKET INSIGHTS
          </p>
          <h1 className="font-landing-serif text-[42px] font-bold text-[#0E0F13]">
            Weekly Market Intelligence
          </h1>
        </header>

        <section className="mb-14">
          <h2 className="mb-6 text-[12.5px] font-extrabold tracking-[0.32em] text-[#C6A15B]">
            Current Market Snapshot
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {SNAPSHOTS.map((item) => (
              <div key={item.pair} className="border border-[#E7E3D8] bg-white p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="font-data text-lg text-[#0E0F13]">{item.pair}</span>
                  <StatusBadge status={item.status} />
                </div>
                <p className="text-sm leading-relaxed text-[#4A463C]">{item.outlook}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14 border border-[#E7E3D8] bg-white p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-landing-serif text-2xl font-bold text-[#0E0F13]">
              This Week in FX
            </h2>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4A463C]">
              Week of July 7, 2026
            </p>
          </div>
          <ul className="space-y-3">
            {WEEKLY_EVENTS.map((event) => (
              <li
                key={event}
                className="flex gap-3 text-sm font-medium leading-relaxed text-[#4A463C]"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#C6A15B]" aria-hidden />
                <span>{event}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-6 text-[12.5px] font-extrabold tracking-[0.32em] text-[#C6A15B]">
            Recent Analysis
          </h2>
          <div className="divide-y divide-[#E7E3D8] border border-[#E7E3D8]">
            {RECENT_ANALYSIS.map((article) => (
              <div
                key={article.title}
                className="flex flex-col gap-2 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <h3 className="text-base font-semibold text-[#0E0F13]">
                  {article.title}
                </h3>
                <span className="font-data text-xs text-[#4A463C]">{article.date}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
