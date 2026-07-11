"use client";

const BAR_COUNT = 9;

export function HeroMarketPulse() {
  return (
    <div
      className="flex h-56 w-full max-w-sm items-end justify-center gap-2 lg:max-w-md"
      aria-hidden
    >
      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <div
          key={i}
          className="hero-pulse-bar w-[2px] origin-bottom bg-[#B8956A]"
          style={{
            animationDelay: `${i * 0.18}s`,
            opacity: 0.25 + ((i % 4) + 1) * 0.15,
          }}
        />
      ))}
    </div>
  );
}
