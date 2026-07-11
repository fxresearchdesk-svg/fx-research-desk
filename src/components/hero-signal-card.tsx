export function HeroSignalCard() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      {/* Back card */}
      <div
        className="absolute left-6 top-6 w-full max-w-sm border border-[#E5E7EB] bg-[#F9FAFB] p-6 opacity-30 shadow-sm"
        aria-hidden
      >
        <p className="mb-4 text-[10px] uppercase tracking-widest text-[#B8956A]">
          FX RESEARCH DESK
        </p>
        <p className="font-data mb-3 text-xl font-bold text-[#1A1A1A]">GBP/USD — SELL</p>
        <p className="font-data text-sm text-[#4A4A4A]">Entry: 1.2734</p>
        <p className="font-data text-sm text-[#4A4A4A]">Stop Loss: 1.2760</p>
        <p className="font-data text-sm text-[#4A4A4A]">Take Profit: 1.2680</p>
      </div>

      {/* Front card */}
      <div className="relative z-10 w-full max-w-sm -rotate-2 border border-[#E5E7EB] bg-[#F9FAFB] p-6 shadow-sm">
        <p className="mb-4 text-[10px] uppercase tracking-widest text-[#B8956A]">
          FX RESEARCH DESK
        </p>
        <p className="font-data mb-4 text-2xl font-bold text-[#1A1A1A]">EUR/USD — BUY</p>
        <div className="space-y-2">
          <p className="font-data text-base text-[#4A4A4A]">Entry: 1.0847</p>
          <p className="font-data text-base text-[#4A4A4A]">Stop Loss: 1.0820</p>
          <p className="font-data text-base text-[#4A4A4A]">Take Profit: 1.0900</p>
        </div>
        <p className="mt-4 text-sm text-[#6B7280]">Risk: 1% | Reward: 3.2R</p>
        <span className="mt-4 inline-block bg-[#4A7C59]/10 px-2 py-1 text-[10px] uppercase tracking-wider text-[#4A7C59]">
          Active Signal
        </span>
      </div>
    </div>
  );
}
