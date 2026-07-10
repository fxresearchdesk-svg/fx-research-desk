"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { InstitutionalTicker } from "@/components/institutional-ticker";
import {
  fetchSignals,
  fetchStats,
  fetchTestimonials,
  isSupabaseConfigured,
} from "@/lib/supabase";
import type { Signal, Stats, Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";

const telegramUrl = "https://t.me/fxresearchdesk";

const navLinks = [
  { href: "#signals", label: "SIGNALS" },
  { href: "#performance", label: "PERFORMANCE" },
  { href: "#pricing", label: "PRICING" },
  { href: "#education", label: "EDUCATION" },
  { href: "#insights", label: "INSIGHTS" },
];

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

const testimonialSlideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 20 : -20,
    scale: 0.98,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -20 : 20,
    scale: 0.98,
  }),
};

function TestimonialCard({
  testimonial,
  className,
}: {
  testimonial: CarouselTestimonial;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative bg-[#0A0A0A] border-l-2 border-[#D4AF37]/40 px-8 py-10 md:px-12 md:py-12 text-left",
        className
      )}
    >
      <span
        className="pointer-events-none absolute -top-2 left-4 font-serif-display text-[7rem] md:text-[9rem] leading-none text-[#D4AF37]/10 select-none"
        aria-hidden
      >
        &ldquo;
      </span>
      <blockquote className="relative z-10 font-serif-display italic text-2xl md:text-3xl text-[#F5F5F5] leading-relaxed break-words">
        {testimonial.quote}
      </blockquote>
      <p className="relative z-10 mt-8 text-sm text-[#A0A0A0] tracking-widest uppercase">
        {testimonial.name}
      </p>
      {testimonial.location && (
        <p className="relative z-10 mt-1 text-xs text-[#737373] tracking-wide">
          {testimonial.location}
        </p>
      )}
    </div>
  );
}

function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: CarouselTestimonial[];
}) {
  const count = testimonials.length;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (nextIndex: number) => {
      if (count === 0) return;
      const normalized = ((nextIndex % count) + count) % count;
      if (normalized === index) return;

      let dir = normalized > index ? 1 : -1;
      if (index === count - 1 && normalized === 0) dir = 1;
      if (index === 0 && normalized === count - 1) dir = -1;

      setDirection(dir);
      setIndex(normalized);
    },
    [count, index]
  );

  const goNext = useCallback(() => {
    if (count === 0) return;
    setDirection(1);
    setIndex((prev) => (prev + 1) % count);
  }, [count]);

  const goPrev = useCallback(() => {
    if (count === 0) return;
    setDirection(-1);
    setIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (index >= count && count > 0) {
      setIndex(0);
    }
  }, [count, index]);

  useEffect(() => {
    if (isHovered || isDragging || count <= 1) return;
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [isHovered, isDragging, count, goNext]);

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

  const prevIndex = (index - 1 + count) % count;
  const nextIndex = (index + 1) % count;
  const current = testimonials[index];
  const prev = testimonials[prevIndex];
  const next = testimonials[nextIndex];

  return (
    <div
      ref={carouselRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative pb-20 outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] rounded-sm"
    >
      <button
        type="button"
        onClick={goPrev}
        aria-label="Previous testimonial"
        className="absolute left-4 top-1/2 z-20 hidden md:flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#D4AF37]/30 text-[#D4AF37] transition-colors duration-300 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/60"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
      </button>

      <button
        type="button"
        onClick={goNext}
        aria-label="Next testimonial"
        className="absolute right-4 top-1/2 z-20 hidden md:flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#D4AF37]/30 text-[#D4AF37] transition-colors duration-300 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/60"
      >
        <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
      </button>

      <div className="relative mx-auto max-w-4xl overflow-hidden px-2 md:px-20">
        {count > 1 && (
          <>
            <motion.div
              key={`peek-prev-${prevIndex}`}
              initial={false}
              animate={{ opacity: 0.3, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="pointer-events-none absolute left-0 top-1/2 z-0 hidden w-[72%] -translate-x-[58%] -translate-y-1/2 sm:block"
              aria-hidden
            >
              <TestimonialCard testimonial={prev} className="opacity-100" />
            </motion.div>
            <motion.div
              key={`peek-next-${nextIndex}`}
              initial={false}
              animate={{ opacity: 0.3, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="pointer-events-none absolute right-0 top-1/2 z-0 hidden w-[72%] translate-x-[58%] -translate-y-1/2 sm:block"
              aria-hidden
            >
              <TestimonialCard testimonial={next} className="opacity-100" />
            </motion.div>
          </>
        )}

        <motion.div
          drag={count > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.35}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(_, info) => {
            setIsDragging(false);
            const threshold = 60;
            if (info.offset.x < -threshold) goNext();
            else if (info.offset.x > threshold) goPrev();
          }}
          className="relative z-10 touch-pan-y"
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={testimonialSlideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <TestimonialCard testimonial={current} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {count > 1 && (
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              aria-current={index === i ? "true" : undefined}
              className={cn(
                "h-3 shrink-0 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/60",
                index === i
                  ? "w-8 bg-[#D4AF37]"
                  : "w-3 bg-[#333333] hover:bg-[#444444]"
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [logoSrc, setLogoSrc] = useState("/logo.png.jpeg");

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
    const ids = navLinks.map((l) => l.href.replace("#", ""));
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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <main className="min-h-screen bg-[#050505] text-[#F5F5F5] overflow-x-hidden">
      <InstitutionalTicker />

      {/* Navbar */}
      <header className="fixed top-12 left-0 right-0 z-50 h-[72px] bg-black/95 backdrop-blur border-b border-[#D4AF37]/20">
        <nav className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 shrink-0 transition-shadow hover:shadow-[0_0_24px_rgba(212,175,55,0.25)]"
          >
            <Image
              src={logoSrc}
              alt="FX Research Desk"
              width={280}
              height={56}
              className="h-10 sm:h-14 w-auto object-contain"
              onError={() =>
                setLogoSrc((prev) =>
                  prev === "/logo.png.jpeg"
                    ? "/logo.png"
                    : prev === "/logo.png"
                      ? "/logo.svg"
                      : "/logo.svg"
                )
              }
              priority
              unoptimized
            />
            <span className="hidden sm:block label-caps text-[#F5F5F5] tracking-[0.15em] whitespace-nowrap">
              FX RESEARCH DESK
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => {
              const id = link.href.replace("#", "");
              const active = activeSection === id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "label-caps relative pb-1 transition-colors duration-300",
                    active ? "text-[#D4AF37]" : "text-[#A8A8A8] hover:text-[#D4AF37]"
                  )}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
                  )}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-block label-caps border border-[#D4AF37]/20 text-[#D4AF37] px-6 py-3.5 transition-colors duration-300 hover:bg-[#D4AF37] hover:text-black whitespace-nowrap"
            >
              CLIENT ACCESS
            </a>
            <button
              type="button"
              className="lg:hidden label-caps text-[#A8A8A8] hover:text-[#D4AF37] px-2 py-1"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              MENU
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="fixed inset-0 z-[70] bg-[#050505]/90 lg:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="fixed top-0 right-0 bottom-0 z-[80] w-72 bg-[#0A0A0A] border-l border-[#1A1A1A] p-8 pt-24 lg:hidden"
            >
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="label-caps text-[#A8A8A8] hover:text-[#D4AF37] transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-caps border border-[#D4AF37]/20 text-[#D4AF37] px-6 py-3.5 text-center hover:bg-[#D4AF37] hover:text-black transition-colors duration-300 whitespace-nowrap"
                >
                  CLIENT ACCESS
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="pt-[120px] min-h-[calc(100vh-120px)] flex items-center">
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
      <section id="methodology" className="scroll-mt-[120px] py-24 px-6">
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
        className="scroll-mt-[120px] py-24 px-6 bg-[#0A0A0A] border-y border-[#1A1A1A]"
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
            className="scroll-mt-[120px]"
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
      <section id="pricing" className="scroll-mt-[120px] py-24 px-6">
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
        className="scroll-mt-[120px] py-24 px-6 bg-[#0A0A0A] border-y border-[#1A1A1A]"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
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
      <section id="education" className="scroll-mt-[120px] py-24 px-6">
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
      <section id="faq" className="scroll-mt-[120px] py-24 px-6 bg-[#0A0A0A] border-t border-[#1A1A1A]">
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

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-[#1A1A1A] py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Image
              src={logoSrc}
              alt="FX Research Desk"
              width={200}
              height={64}
              className="h-16 w-auto max-w-[200px] object-contain"
              onError={() =>
                setLogoSrc((prev) =>
                  prev === "/logo.png.jpeg"
                    ? "/logo.png"
                    : prev === "/logo.png"
                      ? "/logo.svg"
                      : "/logo.svg"
                )
              }
              unoptimized
            />
          </div>
          <p className="label-caps text-[#A0A0A0] mb-2">FX RESEARCH DESK</p>
          <p className="label-caps text-[#D4AF37]/60 mb-10">Research. Analyze. Execute.</p>

          <div className="flex flex-wrap justify-center gap-x-6 sm:gap-x-8 gap-y-4 mb-12 px-4">
            {[
              ...navLinks,
              { href: "#faq", label: "INQUIRIES" },
              { href: "#", label: "TERMS" },
              { href: "#", label: "PRIVACY" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="label-caps text-[#A0A0A0] hover:text-[#D4AF37] transition-colors duration-300 whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </div>

          <p className="text-[11px] text-[#333333] tracking-wide">
            © 2026 FX Research Desk. All Rights Reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
