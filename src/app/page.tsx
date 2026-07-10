"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { InstitutionalTicker } from "@/components/institutional-ticker";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
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

const trustIndicators = [
  { value: "AUM: $2.4M+", label: "Client capital under signal guidance" },
  { value: "87% Win Rate", label: "Verified since 2015" },
  { value: "30+ Countries", label: "Global client base" },
  { value: "0% Hidden Fees", label: "Transparent pricing structure" },
  { value: "24/7 Desk", label: "London • New York • Singapore" },
];

const pricingTiers = [
  {
    name: "STANDARD",
    price: "$49",
    period: "/ month",
    subtitle: "Monthly commitment",
    badge: null as string | null,
    highlighted: false,
    features: [
      "10–15 signals per week",
      "Telegram delivery",
      "Basic commentary",
      "Community access",
    ],
    cta: "SELECT",
    ctaPrimary: false,
  },
  {
    name: "PROFESSIONAL",
    price: "$99",
    period: "/ quarter",
    subtitle: null,
    badge: "SAVE 33%",
    highlighted: false,
    features: [
      "20–25 signals per week",
      "Advanced analysis",
      "Risk framework",
      "Priority support",
    ],
    cta: "SELECT",
    ctaPrimary: true,
  },
  {
    name: "ELITE",
    price: "$150",
    period: "/ year",
    subtitle: null,
    badge: "SAVE 75%",
    highlighted: false,
    features: [
      "Unlimited signals",
      "Monthly consultation",
      "Custom risk profile",
      "Direct support line",
    ],
    cta: "SELECT",
    ctaPrimary: true,
  },
  {
    name: "PERMANENT",
    price: "$209",
    period: "one-time",
    subtitle: null,
    badge: "LIFETIME ACCESS",
    highlighted: true,
    features: [
      "Lifetime signal access",
      "Lifetime education",
      "All future updates",
      "Personal onboarding",
    ],
    cta: "SECURE ACCESS",
    ctaPrimary: true,
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

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="label-caps text-[#D4AF37] mb-4">{children}</p>
  );
}

function CandlestickChart() {
  const candles = [
    { h: 72, body: 28, up: true, wickTop: 12, wickBottom: 8 },
    { h: 56, body: 22, up: false, wickTop: 10, wickBottom: 14 },
    { h: 88, body: 32, up: true, wickTop: 16, wickBottom: 6 },
    { h: 64, body: 20, up: true, wickTop: 8, wickBottom: 12 },
    { h: 48, body: 18, up: false, wickTop: 14, wickBottom: 10 },
    { h: 76, body: 26, up: true, wickTop: 10, wickBottom: 8 },
  ];

  return (
    <div className="flex items-end justify-center gap-3 h-64 opacity-40">
      {candles.map((c, i) => (
        <div key={i} className="flex flex-col items-center" style={{ height: c.h }}>
          <div
            className="w-px bg-[#737373]"
            style={{ height: c.wickTop }}
          />
          <div
            className={cn(
              "w-4",
              c.up ? "bg-[#2D5A3D]" : "bg-[#5C2A2A]"
            )}
            style={{ height: c.body }}
          />
          <div
            className="w-px bg-[#737373] flex-1"
            style={{ minHeight: c.wickBottom }}
          />
        </div>
      ))}
    </div>
  );
}

type CarouselTestimonial = {
  quote: string;
  name: string;
  location: string;
};

const arrowButtonClass =
  "flex items-center justify-center rounded-full border border-[#D4AF37]/40 text-[#D4AF37] transition-all duration-300 hover:border-[#D4AF37]/80 hover:bg-[#D4AF37]/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/60";

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
      className="relative outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] rounded-sm pb-20 md:pb-0"
    >
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous testimonial"
            className={cn(
              arrowButtonClass,
              "absolute left-0 top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 md:left-[-60px] md:flex"
            )}
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next testimonial"
            className={cn(
              arrowButtonClass,
              "absolute right-0 top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 md:right-[-60px] md:flex"
            )}
          >
            <ChevronRight className="h-6 w-6" strokeWidth={1.5} />
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
        <AnimatePresence mode="wait">
          <motion.article
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, zIndex: 10 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="relative w-full bg-[#0A0A0A] border border-[#1A1A1A] rounded-sm p-8 text-center md:p-12 lg:p-16"
          >
            <span
              className="pointer-events-none absolute top-8 left-8 font-serif-display text-8xl leading-none text-[#D4AF37]/20 select-none"
              aria-hidden
            >
              &ldquo;
            </span>

            <blockquote className="relative z-10 mx-auto max-w-3xl font-serif-display italic text-xl text-[#F5F5F5] leading-relaxed break-words md:text-2xl lg:text-3xl xl:text-4xl">
              {current.quote}
            </blockquote>

            <p className="relative z-10 mt-12 text-sm uppercase tracking-[0.2em] text-[#A0A0A0]">
              {current.name}
            </p>
            {current.location && (
              <p className="relative z-10 mt-2 text-xs text-[#737373]">
                {current.location}
              </p>
            )}
          </motion.article>
        </AnimatePresence>
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
                "h-2.5 shrink-0 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/60",
                index === i
                  ? "w-8 bg-[#D4AF37]"
                  : "w-2.5 bg-[#333333] hover:bg-[#555555]"
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
    <main className="min-h-screen bg-[#050505] text-[#F5F5F5] overflow-x-hidden">
      <InstitutionalTicker />
      <SiteNavbar activeSection={activeSection} />

      {/* Hero */}
      <section className="pt-[136px] min-h-[calc(100vh-136px)] flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 py-16 grid grid-cols-1 lg:grid-cols-[55%_45%] gap-16 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <SectionLabel>INSTITUTIONAL FOREX INTELLIGENCE</SectionLabel>
            <h1 className="font-serif-display headline-glow text-6xl md:text-8xl text-white leading-[1.1] mb-8">
              Precision in Every Position
            </h1>
            <p className="text-lg text-[#A0A0A0] max-w-md mb-10 leading-relaxed">
              Macro-driven signals for investors who demand institutional-grade execution.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="label-caps bg-[#D4AF37] text-black px-10 py-4 hover:bg-[#E0C060] transition-colors duration-300 whitespace-nowrap"
              >
                REQUEST ACCESS
              </a>
              <a
                href="#performance"
                className="label-caps text-[#D4AF37] hover:text-[#E0C060] transition-colors duration-300"
              >
                VIEW PERFORMANCE →
              </a>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="hidden lg:block"
          >
            <CandlestickChart />
          </motion.div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="bg-[#0A0A0A] border-y border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-0 lg:divide-x lg:divide-[#1A1A1A]">
          {trustIndicators.map((item) => (
            <div key={item.value} className="text-center lg:px-4 xl:px-6 min-w-0">
              <div className="text-[#D4AF37] font-semibold text-sm mb-2 tabular-nums whitespace-nowrap">
                {item.value}
              </div>
              <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#A0A0A0] leading-relaxed px-2">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Methodology */}
      <section id="methodology" className="scroll-mt-[136px] py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeIn}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-16"
          >
            <SectionLabel>METHODOLOGY</SectionLabel>
            <h2 className="font-serif-display headline-glow text-4xl text-white">
              How We Generate Alpha
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px md:gap-0 md:divide-x divide-[#1A1A1A] bg-[#1A1A1A] md:bg-transparent">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.num}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.08 }}
                className="relative bg-[#050505] p-8 md:px-8 lg:px-10 min-w-0"
              >
                <span className="font-serif-display text-7xl text-[#1A1A1A] absolute top-4 right-4 md:right-6 select-none pointer-events-none">
                  {step.num}
                </span>
                <div className="relative">
                  <h3 className="text-xl font-semibold text-[#F5F5F5] mb-3">{step.title}</h3>
                  <p className="text-sm text-[#A0A0A0] leading-relaxed break-words">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance */}
      <section
        id="performance"
        className="scroll-mt-[136px] py-24 px-6 bg-[#0A0A0A] border-y border-[#1A1A1A]"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <SectionLabel>TRACK RECORD</SectionLabel>
            <h2 className="font-serif-display headline-glow text-4xl text-white mb-12">
              Verified. Audited. Consistent.
            </h2>
            {statsLoading ? (
              <div className="h-32 bg-[#111111] animate-pulse max-w-xs mx-auto" />
            ) : (
              <>
                <div className="font-serif-display text-7xl md:text-9xl font-bold text-[#D4AF37] tabular-nums mb-4">
                  {winRateDisplay}
                </div>
                <p className="label-caps text-[#A0A0A0]">Win Rate | 2015–2026</p>
              </>
            )}
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-20 text-center border-t border-b border-[#1A1A1A] py-10">
            <div>
              <div className="text-3xl text-[#D4AF37] tabular-nums font-semibold mb-2">
                +{stats.monthly_return}%
              </div>
              <div className="label-caps text-[#737373]">Monthly Return</div>
            </div>
            <div>
              <div className="text-3xl text-[#D4AF37] tabular-nums font-semibold mb-2">
                {stats.pips_month.toLocaleString()}
              </div>
              <div className="label-caps text-[#737373]">Pips/Month Average</div>
            </div>
            <div>
              <div className="text-3xl text-[#D4AF37] tabular-nums font-semibold mb-2">
                {stats.active_traders}+
              </div>
              <div className="label-caps text-[#737373]">Active Accounts</div>
            </div>
          </div>

          {/* Signals table */}
          <motion.div
            id="signals"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="scroll-mt-[136px]"
          >
            {signalsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-12 bg-[#111111] animate-pulse" />
                ))}
              </div>
            ) : dbConfigured && liveSignals.length > 0 ? (
              <>
                <div className="hidden md:grid grid-cols-7 gap-4 px-4 py-3 label-caps text-[#737373] border-b border-[#1A1A1A]">
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
                    className="grid grid-cols-2 md:grid-cols-7 gap-2 md:gap-4 px-4 py-4 border-b border-[#1A1A1A] font-mono text-[13px] tabular-nums hover:bg-[#111111] transition-colors duration-300"
                  >
                    <span className="text-[#F5F5F5]">{signal.pair}</span>
                    <span className="text-[#A8A8A8]">{signal.direction}</span>
                    <span className="text-[#737373] hidden md:block">
                      {formatPrice(signal.entry_price)}
                    </span>
                    <span className="text-[#737373] hidden md:block">
                      {formatPrice(signal.stop_loss)}
                    </span>
                    <span className="text-[#737373] hidden md:block">
                      {formatPrice(signal.take_profit)}
                    </span>
                    <span
                      className={cn(
                        signal.result === "WIN" && "text-[#2D5A3D]",
                        signal.result === "LOSS" && "text-[#5C2A2A]",
                        (signal.result === "PENDING" || !signal.result) && "text-[#737373]"
                      )}
                    >
                      {getResultLabel(signal)}
                    </span>
                    <span className="text-[#737373] hidden md:block">
                      {formatSignalDate(signal.created_at)}
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-16 border border-[#1A1A1A] bg-[#0A0A0A]">
                <p className="text-[#737373] mb-8">
                  Live signals available through secure client channels.
                </p>
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-caps border border-[#D4AF37]/20 text-[#D4AF37] px-8 py-3.5 hover:bg-[#D4AF37] hover:text-black transition-colors duration-300 whitespace-nowrap"
                >
                  REQUEST ACCESS
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-[136px] py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <SectionLabel>MEMBERSHIP</SectionLabel>
            <h2 className="font-serif-display headline-glow text-4xl text-white">
              Select Your Level of Access
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-px bg-[#1A1A1A]">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.06 }}
                className={cn(
                  "flex flex-col bg-[#0A0A0A] p-8 min-h-full border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-colors duration-500",
                  tier.highlighted && "border-2 border-[#D4AF37]"
                )}
              >
                {tier.badge && (
                  <span
                    className={cn(
                      "label-caps inline-block w-fit mb-4 text-[10px]",
                      tier.highlighted
                        ? "bg-[#D4AF37] text-black font-bold px-2 py-1"
                        : "bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-1"
                    )}
                  >
                    {tier.badge}
                  </span>
                )}
                <h3 className="label-caps text-[#F5F5F5] mb-4">{tier.name}</h3>
                <div className="mb-2">
                  <span className="font-serif-display text-4xl text-[#F5F5F5] tabular-nums">
                    {tier.price}
                  </span>
                  <span className="text-sm text-[#A0A0A0] ml-1">{tier.period}</span>
                </div>
                {tier.subtitle && (
                  <p className="text-xs text-[#A0A0A0] mb-6">{tier.subtitle}</p>
                )}
                {!tier.subtitle && <div className="mb-6" />}
                <ul className="space-y-3 mb-8 flex-1 min-w-0">
                  {tier.features.map((f) => (
                    <li key={f} className="text-sm text-[#A0A0A0] leading-relaxed break-words">
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "label-caps text-center py-3.5 px-4 transition-colors duration-300 whitespace-nowrap",
                    tier.ctaPrimary
                      ? "bg-[#D4AF37] text-black hover:bg-[#E0C060]"
                      : "border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
                  )}
                >
                  {tier.cta}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Insights */}
      <section
        id="insights"
        className="scroll-mt-[136px] bg-[#050505] py-24 px-6"
      >
        <div className="max-w-6xl mx-auto md:px-[60px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <SectionLabel>CLIENT PERSPECTIVES</SectionLabel>
            <TestimonialsCarousel testimonials={displayTestimonials} />
          </motion.div>
        </div>
      </section>

      {/* Education */}
      <section id="education" className="scroll-mt-[136px] py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-16"
          >
            <SectionLabel>KNOWLEDGE CENTER</SectionLabel>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1A1A1A]">
            {educationArticles.map((article, i) => (
              <motion.div
                key={`${article.title}-${i}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.06 }}
                className="bg-[#050505] p-8 min-w-0"
              >
                <h3 className="text-lg text-[#F5F5F5] font-medium mb-3 leading-snug">{article.title}</h3>
                <p className="text-sm text-[#A0A0A0] mb-6 leading-relaxed break-words">{article.excerpt}</p>
                {article.href.startsWith("/education") ? (
                  <Link
                    href={article.href}
                    className="label-caps text-[#D4AF37] hover:underline transition-colors duration-300"
                  >
                    READ
                  </Link>
                ) : (
                  <a
                    href="#"
                    className="label-caps text-[#D4AF37] hover:underline transition-colors duration-300"
                  >
                    READ
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-[136px] py-24 px-6 bg-[#0A0A0A] border-t border-[#1A1A1A]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-12"
          >
            <SectionLabel>INQUIRIES</SectionLabel>
          </motion.div>

          <div>
            {faqItems.map((item, i) => {
              const open = openFaq === i;
              return (
                <div key={item.question} className="border-b border-[#1A1A1A]">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-start justify-between gap-6 py-6 text-left"
                  >
                    <span className="text-[#F5F5F5] font-semibold leading-relaxed pr-4">{item.question}</span>
                    <span className="text-[#737373] text-lg shrink-0">{open ? "—" : "+"}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="pb-8 text-sm text-[#A0A0A0] leading-relaxed break-words">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0A0A0A] border-y border-[#1A1A1A] py-24 px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="font-serif-display headline-glow text-4xl text-white mb-10">
            Ready for Institutional-Grade Execution?
          </h2>
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block label-caps bg-[#D4AF37] text-black px-12 py-5 hover:bg-[#E0C060] transition-colors duration-300 whitespace-nowrap"
          >
            REQUEST ACCESS
          </a>
        </motion.div>
      </section>

      <SiteFooter />
    </main>
  );
}
