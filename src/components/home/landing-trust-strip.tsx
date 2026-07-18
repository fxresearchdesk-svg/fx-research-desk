const TRUST_ITEMS = [
  { value: "9,600+", label: "ACTIVE MEMBERS" },
  { value: "5–10", label: "SIGNALS DAILY" },
  { value: "24/7", label: "LIVE DESK SUPPORT" },
  { value: "100%", label: "RISK-MANAGED SETUPS" },
];

export function LandingTrustStrip() {
  return (
    <section className="bg-[#0E0F13] py-[26px]">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-5 px-6 lg:px-10">
        {TRUST_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-3 text-[#E8E4D8]">
            <span className="font-landing-serif text-[22px] font-bold text-[#E8C173]">
              {item.value}
            </span>
            <span className="text-[11.5px] font-semibold tracking-[0.1em] text-[#9A9488]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
