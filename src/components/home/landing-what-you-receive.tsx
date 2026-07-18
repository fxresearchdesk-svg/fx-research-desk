const RECEIVE_POINTS = [
  "Entry, stop-loss & take-profit on every trade",
  "Technical & fundamental context included",
  "Live updates when we modify or close",
  "Delivered instantly — no delay, no queue",
];

export function LandingWhatYouReceive() {
  return (
    <section className="bg-[#F1EEE5] py-24">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-[70px] px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <div>
          <p className="mb-3 text-[12.5px] font-extrabold tracking-[0.32em] text-[#C6A15B]">
            WHAT YOU RECEIVE
          </p>
          <h2 className="font-landing-serif mb-[18px] text-[34px] font-bold text-[#0E0F13]">
            Every signal, fully annotated
          </h2>
          <p className="mb-[22px] max-w-[440px] text-[15.5px] font-medium leading-[1.6] text-[#4A463C]">
            No vague calls. Every alert includes exact entry, stop-loss, and take-profit
            levels, plus the reasoning behind the trade — sent straight to your phone the
            moment it&apos;s live.
          </p>
          <ul className="space-y-1">
            {RECEIVE_POINTS.map((point) => (
              <li
                key={point}
                className="relative py-[7px] pl-[22px] text-[14.5px] font-semibold text-[#0E0F13]"
              >
                <span
                  className="absolute left-0 font-extrabold text-[#C6A15B]"
                  aria-hidden
                >
                  —
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full max-w-[340px]">
          <div className="rounded-[26px] bg-[#0E0F13] p-3.5 shadow-[0_40px_70px_-25px_rgba(14,15,19,0.4)]">
            <div className="rounded-2xl bg-[#131c26] px-3.5 py-[18px]">
              <div className="mb-3.5 flex items-center gap-2.5 border-b border-[#1F2A36] pb-3.5">
                <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#C6A15B] font-landing-serif text-sm font-bold text-[#0E0F13]">
                  Fx
                </div>
                <div>
                  <p className="text-[13px] font-bold text-white">FX Research Desk</p>
                  <p className="text-[10.5px] text-[#7C8CA0]">VIP Signals Channel</p>
                </div>
              </div>

              <div className="rounded-xl bg-[#1B2733] px-4 py-3.5 font-data text-[12.5px] leading-[1.7] text-[#E8ECF1]">
                <p className="mb-2 text-[12.5px] font-extrabold tracking-wide text-[#E8C173]">
                  NEW SIGNAL — EUR/USD
                </p>
                <p className="font-bold text-[#6FCF97]">BUY @ 1.0842</p>
                <p>SL: 1.0810</p>
                <p>TP: 1.0910</p>
                <p>Bias: USD softness into CPI print</p>
                <p className="mt-2 text-right text-[9.5px] text-[#5B6B7E]">
                  10:42 AM ✓✓
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
