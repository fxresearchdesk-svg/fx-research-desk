import Link from "next/link";
import { HeroFadedCandlesticks } from "@/components/home/hero-faded-candlesticks";

type SwissBankHeroProps = {
  winRate: string;
  pipsMonth: number;
  members: number;
  loading?: boolean;
};

export function SwissBankHero({
  winRate,
  pipsMonth,
  members,
  loading,
}: SwissBankHeroProps) {
  return (
    <section className="bg-white pt-[100px]">
      <div className="mx-auto grid h-[600px] max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        <div className="flex flex-col justify-center">
          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#B8956A]">
            FX RESEARCH DESK
          </p>
          <h1 className="font-serif-display mb-5 max-w-lg text-[44px] leading-tight text-[#1A1A1A]">
            Forex Signals Built for Serious Traders
          </h1>
          <p className="mb-8 max-w-md text-base leading-relaxed text-[#6B7280]">
            Daily entry, stop-loss, and take-profit levels. Delivered to Telegram in
            real-time.
          </p>

          <p className="mb-8 font-data text-[13px] text-[#1A1A1A]">
            {loading ? (
              "—"
            ) : (
              <>
                {winRate} Win Rate
                <span className="mx-3 text-[#D1D5DB]">|</span>
                {pipsMonth.toLocaleString()}+ Pips/Month
                <span className="mx-3 text-[#D1D5DB]">|</span>
                {members}+ Members
              </>
            )}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/payment/standard"
              className="inline-block bg-[#1A1A1A] px-8 py-3.5 text-center text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors duration-200 hover:bg-[#333333]"
            >
              GET STARTED — $49
            </Link>
            <Link
              href="/pricing"
              className="inline-block border border-[#1A1A1A] px-8 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.15em] text-[#1A1A1A] transition-colors duration-200 hover:bg-[#1A1A1A] hover:text-white"
            >
              VIEW PRICING
            </Link>
          </div>
        </div>

        <HeroFadedCandlesticks />
      </div>
    </section>
  );
}
