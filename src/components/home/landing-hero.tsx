import Link from "next/link";
import { cn } from "@/lib/utils";

type TradeTicketProps = {
  pair: string;
  direction: "BUY" | "SELL";
  entry: string;
  stopLoss: string;
  takeProfit: string;
  className?: string;
};

function TradeTicket({
  pair,
  direction,
  entry,
  stopLoss,
  takeProfit,
  className,
}: TradeTicketProps) {
  const isBuy = direction === "BUY";

  return (
    <div
      className={cn(
        "w-[min(100%,340px)] border border-[#E7E3D8] bg-white p-[22px_24px] shadow-[0_30px_60px_-20px_rgba(14,15,19,0.25)]",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-[16px] font-extrabold tracking-wide text-[#0E0F13]">
          {pair}
        </span>
        <span
          className={cn(
            "px-2.5 py-1 text-[11px] font-extrabold tracking-[0.12em] text-white",
            isBuy ? "bg-[#3C7A5C]" : "bg-[#A6483C]"
          )}
        >
          {direction}
        </span>
      </div>

      <div className="font-data text-[13.5px]">
        <div className="flex justify-between border-b border-dashed border-[#E7E3D8] py-1.5">
          <span className="text-[11.5px] font-semibold tracking-[0.08em] text-[#4A463C]">
            ENTRY
          </span>
          <span className="font-bold tabular-nums text-[#0E0F13]">{entry}</span>
        </div>
        <div className="flex justify-between border-b border-dashed border-[#E7E3D8] py-1.5">
          <span className="text-[11.5px] font-semibold tracking-[0.08em] text-[#4A463C]">
            STOP LOSS
          </span>
          <span className="font-bold tabular-nums text-[#0E0F13]">{stopLoss}</span>
        </div>
        <div className="flex justify-between py-1.5">
          <span className="text-[11.5px] font-semibold tracking-[0.08em] text-[#4A463C]">
            TAKE PROFIT
          </span>
          <span className="font-bold tabular-nums text-[#3C7A5C]">{takeProfit}</span>
        </div>
      </div>

      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9A9488]">
        Sample Signal Format
      </p>
    </div>
  );
}

export function LandingHero() {
  return (
    <section className="bg-[#FAF9F6] pb-[70px] pt-16 lg:pt-[72px]">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-[60px] px-6 lg:grid-cols-[1fr_0.86fr] lg:px-10">
        <div>
          <p className="mb-[18px] text-[12.5px] font-extrabold tracking-[0.32em] text-[#C6A15B]">
            FX RESEARCH DESK
          </p>
          <h1 className="font-landing-serif mb-[22px] max-w-xl text-[40px] font-bold leading-[1.12] text-[#0E0F13] sm:text-[54px]">
            Forex Signals Built for <em className="italic text-[#C6A15B]">Serious Traders</em>
          </h1>
          <p className="mb-7 max-w-[480px] text-[17px] font-medium leading-[1.6] text-[#4A463C]">
            Daily entry, stop-loss, and take-profit levels — filtered through technical
            and macro analysis, delivered to Telegram in real time.
          </p>

          <div className="mb-[34px] flex flex-wrap gap-[26px]">
            <p className="text-[13.5px] font-bold text-[#0E0F13]">
              <span className="font-extrabold text-[#C6A15B]">5–10</span> Daily Signals
            </p>
            <p className="text-[13.5px] font-bold text-[#0E0F13]">
              <span className="font-extrabold text-[#C6A15B]">24/7</span> Desk Support
            </p>
            <p className="text-[13.5px] font-bold text-[#0E0F13]">
              <span className="font-extrabold text-[#C6A15B]">1–2%</span> Risk Per Setup
            </p>
          </div>

          <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center">
            <Link
              href="/payment/standard"
              className="landing-focus inline-block bg-[#0E0F13] px-[30px] py-[17px] text-center text-[13px] font-bold tracking-[0.12em] text-white transition-all hover:-translate-y-px hover:bg-[#1c1e26]"
            >
              GET STARTED — $49/MO
            </Link>
            <Link
              href="/pricing"
              className="landing-focus inline-block border-[1.5px] border-[#0E0F13] px-7 py-4 text-center text-[13px] font-bold tracking-[0.12em] text-[#0E0F13] transition-colors hover:bg-[#0E0F13] hover:text-white"
            >
              VIEW PRICING
            </Link>
          </div>
        </div>

        <div className="relative mx-auto hidden h-[420px] w-full max-w-[420px] lg:mx-0 lg:ml-auto lg:block">
          <p className="absolute right-10 top-8 z-20 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C6A15B]">
            Sample Signal Format
          </p>
          <TradeTicket
            pair="GBP/USD"
            direction="SELL"
            entry="1.3462"
            stopLoss="1.3498"
            takeProfit="1.3390"
            className="absolute right-[-10px] top-2 rotate-[4deg] opacity-55 grayscale-[0.3]"
          />
          <TradeTicket
            pair="EUR/USD"
            direction="BUY"
            entry="1.0842"
            stopLoss="1.0810"
            takeProfit="1.0910"
            className="absolute right-10 top-[60px] rotate-[-3deg]"
          />
        </div>

        <div className="mx-auto w-full max-w-[340px] lg:hidden">
          <TradeTicket
            pair="EUR/USD"
            direction="BUY"
            entry="1.0842"
            stopLoss="1.0810"
            takeProfit="1.0910"
          />
        </div>
      </div>
    </section>
  );
}
