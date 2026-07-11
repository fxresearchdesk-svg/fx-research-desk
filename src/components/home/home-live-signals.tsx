import type { Signal } from "@/lib/types";
import { cn } from "@/lib/utils";

const FALLBACK_SIGNALS: Omit<Signal, "id" | "created_at" | "result" | "pips">[] = [
  {
    pair: "EUR/USD",
    direction: "BUY",
    entry_price: 1.1417,
    stop_loss: 1.138,
    take_profit: 1.147,
    status: "ACTIVE",
  },
  {
    pair: "GBP/USD",
    direction: "SELL",
    entry_price: 1.3402,
    stop_loss: 1.345,
    take_profit: 1.332,
    status: "ACTIVE",
  },
  {
    pair: "XAU/USD",
    direction: "BUY",
    entry_price: 4115.23,
    stop_loss: 4080,
    take_profit: 4180,
    status: "ACTIVE",
  },
];

function formatSignalPrice(pair: string, value: number) {
  if (pair === "XAU/USD" || pair === "XAG/USD") return value.toFixed(2);
  if (pair === "USD/JPY") return value.toFixed(2);
  return value.toFixed(4);
}

type HomeLiveSignalsProps = {
  signals?: Signal[];
  loading?: boolean;
};

export function HomeLiveSignals({ signals = [], loading }: HomeLiveSignalsProps) {
  const display =
    signals.length >= 3
      ? signals.slice(0, 3)
      : FALLBACK_SIGNALS.map((s, i) => ({
          ...s,
          id: `fallback-${i}`,
          result: null,
          pips: null,
          created_at: new Date().toISOString(),
        }));

  return (
    <section id="performance" className="scroll-mt-[100px] bg-[#1A1A1A] px-4 py-12 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="mb-6 text-[10px] uppercase tracking-[0.3em] text-[#B8956A]">
          LIVE SIGNALS
        </p>

        {loading ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 animate-pulse border border-[#333333] bg-[#1E1E1E]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {display.map((signal) => (
              <div
                key={signal.id}
                className="border border-[#333333] bg-[#1E1E1E] px-4 py-4 font-data text-[13px] tabular-nums"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-[#F5F5F5]">{signal.pair}</span>
                  <span
                    className={cn(
                      "px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em]",
                      signal.direction === "BUY"
                        ? "bg-[#4A7C59]/20 text-[#4A7C59]"
                        : "bg-[#8B3A3A]/20 text-[#8B3A3A]"
                    )}
                  >
                    {signal.direction}
                  </span>
                </div>
                <div className="space-y-1 text-[#9CA3AF]">
                  <p>
                    <span className="text-[#6B7280]">Entry:</span>{" "}
                    <span className="text-[#E5E7EB]">
                      {formatSignalPrice(signal.pair, signal.entry_price)}
                    </span>
                  </p>
                  <p>
                    <span className="text-[#6B7280]">SL:</span>{" "}
                    <span className="text-[#E5E7EB]">
                      {formatSignalPrice(signal.pair, signal.stop_loss)}
                    </span>
                  </p>
                  <p>
                    <span className="text-[#6B7280]">TP:</span>{" "}
                    <span className="text-[#E5E7EB]">
                      {formatSignalPrice(signal.pair, signal.take_profit)}
                    </span>
                  </p>
                  <p>
                    <span className="text-[#6B7280]">Status:</span>{" "}
                    <span className="text-[#B8956A]">
                      {(signal.status ?? "ACTIVE").toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-6 text-[11px] text-[#9CA3AF]">
          These are live signals from our VIP channel
        </p>
      </div>
    </section>
  );
}
