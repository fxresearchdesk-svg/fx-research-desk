import Link from "next/link";
import { HeroTicketCarousel } from "@/components/home/hero-ticket-carousel";

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

        <HeroTicketCarousel />
      </div>
    </section>
  );
}
