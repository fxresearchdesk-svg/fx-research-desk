"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { InstitutionalTicker } from "@/components/institutional-ticker";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import { HeroMarketPulse } from "@/components/hero-market-pulse";
import {
  fetchSignals,
  fetchStats,
  fetchTestimonials,
  isSupabaseConfigured,
} from "@/lib/supabase";
import { navLinks, telegramUrl } from "@/lib/site-config";
import type { Signal, Stats, Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";

const FALLBACK_STATS = {
  win_rate: 87.3,
  pips_month: 2450,
  monthly_return: 14.2,
  active_traders: 500,
};

const processSteps = [
  {
    num: "01",
    title: "Macro Analysis",
    description:
      "Top-down assessment of central bank policy, institutional flows, and geopolitical risk.",
  },
  {
    num: "02",
    title: "Technical Confluence",
    description:
      "Multi-timeframe analysis identifying high-probability entry zones with defined risk parameters.",
  },
  {
    num: "03",
    title: "Execution Protocol",
    description:
      "Precise entry, stop-loss, and take-profit levels delivered via secure channels.",
  },
];

const educationArticles = [
  {
    title: "Risk Management Framework",
    excerpt:
      "Position sizing, drawdown limits, and capital preservation protocols for institutional execution.",
    href: "/education/risk-management",
  },
  {
    title: "Technical Analysis",
    excerpt:
      "Multi-timeframe confluence, liquidity mapping, and precision entry methodology.",
    href: "/education/technical-analysis",
  },
  {
    title: "Trading Psychology",
    excerpt:
      "Discipline protocols and behavioral frameworks for consistent institutional performance.",
    href: "/education/trading-psychology",
  },
  {
    title: "Fundamental Analysis",
    excerpt:
      "Master economic indicators, central bank decisions, and news trading. Understand what moves the market before the charts do.",
    href: "#",
  },
  {
    title: "Risk-Reward Mastery",
    excerpt:
      "Learn to structure trades where you risk $1 to make $3. The math behind consistent profitability and compounding.",
    href: "#",
  },
  {
    title: "Trading Journals",
    excerpt:
      "Track every trade, review mistakes, and build a data-driven edge. Professional traders don't guess — they analyze.",
    href: "#",
  },
];

const faqItems = [
  {
    question: "What is included in standard membership?",
    answer:
      "Standard membership provides 10–15 signals per week via secure Telegram delivery, basic market commentary, and access to our client community.",
  },
  {
    question: "How are signals delivered?",
    answer:
      "All signals are transmitted in real-time through encrypted Telegram channels. Each alert includes pair, direction, entry, stop-loss, take-profit, and position sizing guidance.",
  },
  {
    question: "What is the cancellation policy?",
    answer:
      "Monthly and quarterly memberships may be cancelled at any time without penalty. Annual memberships remain active through the billing period.",
  },
  {
    question: "Which brokers are compatible?",
    answer:
      "Our execution parameters are broker-agnostic. Signals are compatible with MT4, MT5, cTrader, and institutional prime brokerage platforms.",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "Due to the proprietary nature of our research, refunds are not offered. Prospective clients may evaluate our methodology through published performance data.",
  },
  {
    question: "What distinguishes Permanent membership?",
    answer:
      "Permanent membership grants lifetime access to all current and future research, education, and signal delivery at a single capital commitment.",
  },
];

const FALLBACK_TESTIMONIALS = [
  {
    quote:
      "The precision of these signals transformed my approach to forex. This is not retail trading — this is institutional execution.",
    name: "Ahmed K.",
    location: "Dubai",
  },
  {
    quote:
      "Went from inconsistent returns to structured monthly gains. The risk framework alone justified the membership.",
    name: "Maria S.",
    location: "London",
  },
  {
    quote:
      "Permanent access was the correct decision. The desk operates with the discipline of a private bank research division.",
    name: "James O.",
    location: "New York",
  },
  {
    quote:
      "I was skeptical at first, but after 3 months my account is up 34%. The lifetime plan was the best decision I made.",
    name: "Robert T.",
    location: "Sydney",
  },
  {
    quote:
      "Finally a signal service that actually teaches you WHY to take the trade, not just blindly follow.",
    name: "Elena K.",
    location: "Frankfurt",
  },
  {
    quote:
      "Went from $2k to $8k in 6 months. Risk management is what kept me in the game during drawdowns.",
    name: "David M.",
    location: "Toronto",
  },
  {
    quote:
      "The quarterly calls alone are worth the Elite plan. Direct access to real traders who've been through everything.",
    name: "Yuki T.",
    location: "Tokyo",
  },
  {
    quote:
      "Compared to 4 other signal services, FX Research Desk is the only one with verified results and real education.",
    name: "Hassan A.",
    location: "Dubai",
  },
];

function formatPrice(value: number) {
  return Number(value).toFixed(4);
}

function formatSignalDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getResultLabel(signal: Signal) {
  if (signal.result === "WIN") {
    return signal.pips != null ? `WIN +${signal.pips}` : "WIN";
  }
  if (signal.result === "LOSS") {
    return signal.pips != null ? `LOSS ${signal.pips}` : "LOSS";
  }
  return "PENDING";
}

type CarouselTestimonial = {
  quote: string;
  name: string;
  location: string;
};

const arrowButtonClass =
  "flex items-center justify-center border border-[#E5E5E5] text-[#1A1A1A] transition-colors duration-200 hover:border-[#1A1A1A] hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:border-[#1A1A1A]";

function SectionRule() {
  return <div className="section-rule" />;
}

function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: CarouselTestimonial[];
}) {
  const count = testimonials.length;
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const goTo = useCallback(
    (nextIndex: number) => {
      if (count === 0) return;
      setIndex(((nextIndex % count) + count) % count);
    },
    [count]
  );

  const goNext = useCallback(() => {
    if (count === 0) return;
    setIndex((prev) => (prev + 1) % count);
  }, [count]);

  const goPrev = useCallback(() => {
    if (count === 0) return;
    setIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (index >= count && count > 0) setIndex(0);
  }, [count, index]);

  useEffect(() => {
    if (isHovered || count <= 1) return;
    const timer = setInterval(goNext, 7000);
    return () => clearInterval(timer);
  }, [isHovered, count, goNext, index]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    }
  };

  if (count === 0) return null;

  const current = testimonials[index];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative outline-none focus-visible:ring-1 focus-visible:ring-[#B8956A] pb-20 md:pb-0"
    >
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous testimonial"
            className={cn(
              arrowButtonClass,
              "absolute left-0 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 md:left-[-56px] md:flex"
            )}
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next testimonial"
            className={cn(
              arrowButtonClass,
              "absolute right-0 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 md:right-[-56px] md:flex"
            )}
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <div className="absolute bottom-[-50px] left-0 right-0 z-20 flex items-center justify-center gap-8 md:hidden">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous testimonial"
              className={cn(arrowButtonClass, "h-10 w-10")}
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next testimonial"
              className={cn(arrowButtonClass, "h-10 w-10")}
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </>
      )}

      <div className="relative w-full overflow-hidden">
        <article
          key={index}
          className="fade-in w-full card-surface p-8 text-center md:p-12 lg:p-16"
        >
          <blockquote className="mx-auto max-w-3xl font-serif-display text-xl text-[#1A1A1A] leading-relaxed break-words md:text-2xl lg:text-3xl">
            {current.quote}
          </blockquote>

          <p className="mt-12 text-[11px] uppercase tracking-[0.2em] text-[#9A9A9A]">
            {current.name}
          </p>
          {current.location && (
            <p className="mt-2 text-[11px] text-[#9A9A9A]">{current.location}</p>
          )}
        </article>
      </div>

      {count > 1 && (
        <div className="mt-12 flex items-center justify-center gap-3">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              aria-current={index === i ? "true" : undefined}
              className={cn(
                "h-2 shrink-0 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B8956A]",
                index === i
                  ? "w-8 bg-[#B8956A]"
                  : "w-2 bg-[#E5E5E5] hover:bg-[#9A9A9A]"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [statsLoading, setStatsLoading] = useState(true);
  const [signalsLoading, setSignalsLoading] = useState(true);
  const [liveStats, setLiveStats] = useState<Stats | null>(null);
  const [liveSignals, setLiveSignals] = useState<Signal[]>([]);
  const [liveTestimonials, setLiveTestimonials] = useState<Testimonial[]>([]);
  const [dbConfigured, setDbConfigured] = useState(false);

  const stats = liveStats ?? FALLBACK_STATS;
  const winRateDisplay = liveStats
    ? `${Number(stats.win_rate).toFixed(1)}%`
    : "87.3%";

  const mappedLive = liveTestimonials.map((t) => ({
    quote: t.quote,
    name: t.name,
    location: t.location ?? t.member_type ?? "",
  }));

  const displayTestimonials =
    mappedLive.length > 0
      ? [
          ...mappedLive,
          ...FALLBACK_TESTIMONIALS.filter(
            (fb) => !mappedLive.some((m) => m.quote === fb.quote)
          ),
        ]
      : FALLBACK_TESTIMONIALS;

  useEffect(() => {
    const configured = isSupabaseConfigured();
    setDbConfigured(configured);

    if (!configured) {
      setStatsLoading(false);
      setSignalsLoading(false);
      return;
    }

    async function load() {
      const [statsData, signals, testimonials] = await Promise.all([
        fetchStats(),
        fetchSignals(5),
        fetchTestimonials(),
      ]);
      if (statsData) setLiveStats(statsData);
      setLiveSignals(signals);
      setLiveTestimonials(testimonials);
      setStatsLoading(false);
      setSignalsLoading(false);
    }

    load();
  }, []);

  useEffect(() => {
    const ids = navLinks
      .map((l) => l.href.replace("/#", "").replace("#", ""))
      .filter((id) => id !== "charts");
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#4A4A4A] overflow-x-hidden">
      <InstitutionalTicker />
      <SiteNavbar activeSection={activeSection} />

      {/* Hero */}
      <section className="relative bg-[#FFFFFF] pt-[100px]">
        <div className="mx-auto grid h-[500px] max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2 lg:gap-16">
          <div className="fade-in flex flex-col justify-center">
            <h1 className="font-serif-display mb-6 max-w-xl text-[40px] font-semibold leading-[1.15] text-[#1A1A1A] md:text-[48px]">
              Trade What the Institutions Trade
            </h1>
            <p className="mb-8 max-w-md text-lg leading-relaxed text-[#6B7280]">
              Real-time forex signals with entry, stop-loss, and take-profit levels.
              Delivered instantly to your Telegram.
            </p>

            <p className="mb-10 font-data text-sm text-[#1A1A1A]">
              {statsLoading ? (
                "—"
              ) : (
                <>
                  {winRateDisplay} Win Rate
                  <span className="mx-3 text-[#D1D5DB]">|</span>
                  {stats.pips_month.toLocaleString()}+ Pips/Month
                  <span className="mx-3 text-[#D1D5DB]">|</span>
                  {stats.active_traders}+ Members
                </>
              )}
            </p>

            <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
              <Link
                href="/payment/standard"
                className="inline-block bg-[#1A1A1A] px-8 py-4 text-center text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors duration-200 hover:bg-[#333333] whitespace-nowrap"
              >
                GET STARTED — $49
              </Link>
              <a
                href="#performance"
                className="inline-block border border-[#1A1A1A] px-8 py-4 text-center text-xs font-semibold uppercase tracking-[0.15em] text-[#1A1A1A] transition-colors duration-200 hover:bg-[#1A1A1A] hover:text-white whitespace-nowrap"
              >
                VIEW PERFORMANCE
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-end">
            <HeroMarketPulse />
          </div>
        </div>
      </section>

      <SectionRule />

      {/* Trust */}
      <section className="border-y border-[#E5E5E5] bg-[#FFFFFF] py-6">
        <p className="text-center text-xs tracking-[0.2em] text-[#4A4A4A]">
          <span className="mx-1.5 text-sm font-medium text-[#B8956A]">◆</span>
          Institutional-grade signals. Verified performance since 2015.{" "}
          <span className="mx-1.5 text-sm font-medium text-[#B8956A]">◆</span>
        </p>
      </section>

      <SectionRule />

      {/* Methodology */}
      <section id="methodology" className="scroll-mt-[100px] bg-[#F5F5F0] py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-16">
            <p className="label-institutional mb-4">METHODOLOGY</p>
            <h2 className="font-serif-display text-[40px] text-[#1A1A1A] leading-[1.2]">
              How We Generate Alpha
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {processSteps.map((step) => (
              <div
                key={step.num}
                className="relative card-surface p-8 md:px-8 lg:px-10 min-w-0"
              >
                <span className="font-data text-5xl text-[#E5E5E5] absolute top-4 right-4 md:right-6 select-none pointer-events-none">
                  {step.num}
                </span>
                <div className="relative">
                  <h3 className="text-lg text-[#1A1A1A] mb-3">{step.title}</h3>
                  <p className="text-sm text-[#4A4A4A] leading-relaxed break-words">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionRule />

      {/* Performance */}
      <section
        id="performance"
        className="scroll-mt-[100px] py-24 px-6 bg-[#FFFFFF] border-y border-[#E5E5E5]"
      >
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-16">
            <p className="label-institutional mb-4">TRACK RECORD</p>
            <h2 className="font-serif-display text-[40px] text-[#1A1A1A] leading-[1.2] mb-12">
              Verified. Audited. Consistent.
            </h2>
            {statsLoading ? (
              <div className="h-32 bg-[#E5E5E5] animate-pulse max-w-xs mx-auto" />
            ) : (
              <>
                <div className="font-data text-[56px] text-[#1A1A1A] tabular-nums mb-4">
                  {winRateDisplay}
                </div>
                <p className="label-institutional">Win Rate | 2015–2026</p>
              </>
            )}
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-20 text-center border-t border-b border-[#E5E5E5] py-10">
            <div>
              <div className="font-data text-3xl text-[#1A1A1A] tabular-nums mb-2">
                +{stats.monthly_return}%
              </div>
              <div className="label-institutional">Monthly Return</div>
            </div>
            <div>
              <div className="font-data text-3xl text-[#1A1A1A] tabular-nums mb-2">
                {stats.pips_month.toLocaleString()}
              </div>
              <div className="label-institutional">Pips/Month Average</div>
            </div>
            <div>
              <div className="font-data text-3xl text-[#1A1A1A] tabular-nums mb-2">
                {stats.active_traders}+
              </div>
              <div className="label-institutional">Active Accounts</div>
            </div>
          </div>

          {/* Signals table */}
          <div id="signals" className="scroll-mt-[100px]">
            {signalsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-12 bg-[#E5E5E5] animate-pulse" />
                ))}
              </div>
            ) : dbConfigured && liveSignals.length > 0 ? (
              <>
                <div className="hidden md:grid grid-cols-7 gap-4 px-4 py-3 label-institutional border-b border-[#E5E5E5]">
                  <span>PAIR</span>
                  <span>TYPE</span>
                  <span>ENTRY</span>
                  <span>S/L</span>
                  <span>T/P</span>
                  <span>RESULT</span>
                  <span>DATE</span>
                </div>
                {liveSignals.map((signal) => (
                  <div
                    key={signal.id}
                    className="grid grid-cols-2 md:grid-cols-7 gap-2 md:gap-4 px-4 py-4 border-b border-[#E5E5E5] font-data text-[13px] tabular-nums hover:bg-[#F5F5F0] transition-colors duration-200"
                  >
                    <span className="text-[#1A1A1A]">{signal.pair}</span>
                    <span className="text-[#4A4A4A]">{signal.direction}</span>
                    <span className="text-[#4A4A4A] hidden md:block">
                      {formatPrice(signal.entry_price)}
                    </span>
                    <span className="text-[#4A4A4A] hidden md:block">
                      {formatPrice(signal.stop_loss)}
                    </span>
                    <span className="text-[#4A4A4A] hidden md:block">
                      {formatPrice(signal.take_profit)}
                    </span>
                    <span
                      className={cn(
                        signal.result === "WIN" && "text-[#4A7C59]",
                        signal.result === "LOSS" && "text-[#8B3A3A]",
                        (signal.result === "PENDING" || !signal.result) &&
                          "text-[#4A4A4A]"
                      )}
                    >
                      {getResultLabel(signal)}
                    </span>
                    <span className="text-[#4A4A4A] hidden md:block">
                      {formatSignalDate(signal.created_at)}
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-16 card-surface">
                <p className="text-[#4A4A4A] mb-8">
                  Live signals available through secure client channels.
                </p>
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-block whitespace-nowrap"
                >
                  REQUEST ACCESS
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      <SectionRule />

      {/* Testimonials / Insights */}
      <section id="insights" className="scroll-mt-[100px] bg-[#F5F5F0] py-24 px-6">
        <div className="max-w-6xl mx-auto md:px-[56px]">
          <p className="label-institutional mb-12">CLIENT PERSPECTIVES</p>
          <TestimonialsCarousel testimonials={displayTestimonials} />
        </div>
      </section>

      <SectionRule />

      {/* Education */}
      <section id="education" className="scroll-mt-[100px] py-24 px-6 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto">
          <header className="mb-16">
            <p className="label-institutional mb-4">KNOWLEDGE CENTER</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {educationArticles.map((article, i) => (
              <div
                key={`${article.title}-${i}`}
                className="card-surface p-8 min-w-0"
              >
                <h3 className="text-lg text-[#1A1A1A] mb-3 leading-snug">
                  {article.title}
                </h3>
                <p className="text-sm text-[#4A4A4A] mb-6 leading-relaxed break-words">
                  {article.excerpt}
                </p>
                {article.href.startsWith("/education") ? (
                  <Link
                    href={article.href}
                    className="text-[11px] tracking-[0.2em] uppercase text-[#B8956A] hover:text-[#C9A87C] transition-colors duration-200"
                  >
                    READ
                  </Link>
                ) : (
                  <a
                    href="#"
                    className="text-[11px] tracking-[0.2em] uppercase text-[#B8956A] hover:text-[#C9A87C] transition-colors duration-200"
                  >
                    READ
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionRule />

      {/* FAQ */}
      <section
        id="faq"
        className="scroll-mt-[100px] py-24 px-6 bg-[#F5F5F0] border-t border-[#E5E5E5]"
      >
        <div className="max-w-3xl mx-auto">
          <header className="mb-12">
            <p className="label-institutional">INQUIRIES</p>
          </header>

          <div>
            {faqItems.map((item, i) => {
              const open = openFaq === i;
              return (
                <div key={item.question} className="border-b border-[#E5E5E5]">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-start justify-between gap-6 py-6 text-left"
                  >
                    <span className="text-[#1A1A1A] leading-relaxed pr-4">
                      {item.question}
                    </span>
                    <span className="text-[#4A4A4A] text-lg shrink-0">
                      {open ? "—" : "+"}
                    </span>
                  </button>
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-out",
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-8 text-sm text-[#4A4A4A] leading-relaxed break-words">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionRule />

      {/* CTA */}
      <section className="bg-[#FFFFFF] border-y border-[#E5E5E5] py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif-display text-[40px] text-[#1A1A1A] leading-[1.2] mb-10">
            Ready for Institutional-Grade Execution?
          </h2>
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-vault-primary inline-block whitespace-nowrap"
          >
            REQUEST ACCESS
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
