"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LiveTicker } from "@/components/live-ticker";
import {
  fetchSignals,
  fetchStats,
  fetchTestimonials,
  isSupabaseConfigured,
} from "@/lib/supabase";
import type { Signal, Stats, Testimonial } from "@/lib/types";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  Clock,
  Copy,
  Globe,
  Menu,
  Plus,
  Send,
  Share2,
  Star,
  Target,
  TrendingUp,
  Video,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const telegramUrl = "https://t.me/fxresearchdesk";

const navLinks = [
  { href: "#signals", label: "Signals" },
  { href: "#performance", label: "Performance" },
  { href: "#pricing", label: "Pricing" },
  { href: "#education", label: "Education" },
  { href: "#faq", label: "FAQ" },
];

const socialMarquee = [
  "500+ ACTIVE TRADERS",
  "4.9/5 RATING",
  "FEATURED ON TRADINGVIEW",
  "SINCE 2024",
  "30+ COUNTRIES",
];

const steps = [
  {
    num: "01",
    icon: Send,
    title: "Join Telegram",
    description:
      "Subscribe to our channel and get instant access to signals and community.",
  },
  {
    num: "02",
    icon: Copy,
    title: "Copy Signals",
    description:
      "Every alert includes entry, stop loss, take profit, and lot size. Just copy to your broker.",
  },
  {
    num: "03",
    icon: Wallet,
    title: "Withdraw Profits",
    description:
      "Follow our risk rules, grow your account, and withdraw consistently.",
  },
];

const FALLBACK_STAT_CARDS = [
  { value: "87%", label: "Win Rate" },
  { value: "+2,450", label: "Pips This Month" },
  { value: "+14.2%", label: "Avg Monthly Return" },
  { value: "500+", label: "Active Members" },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    badge: "MONTHLY",
    badgeStyle: "text-slate-500",
    highlighted: false,
    features: [
      "10–15 signals per week",
      "Real-time Telegram alerts",
      "Basic market analysis",
      "Community access",
      "Email support",
    ],
    cta: "Get Started",
    ctaStyle: "outline" as const,
  },
  {
    name: "Pro",
    price: "$99",
    period: "/quarter",
    badge: "SAVE 33%",
    badgeStyle: "bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded",
    highlighted: false,
    features: [
      "20–25 signals per week",
      "Advanced technical analysis",
      "Risk management guides",
      "Priority support",
      "Weekly market outlook",
    ],
    cta: "Get Pro",
    ctaStyle: "primary" as const,
  },
  {
    name: "Elite",
    price: "$150",
    period: "/year",
    badge: "SAVE 75%",
    badgeStyle: "bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded",
    highlighted: false,
    features: [
      "Unlimited signals",
      "1-on-1 strategy calls (monthly)",
      "Custom risk profile setup",
      "Early access to new features",
      "Direct WhatsApp support",
    ],
    cta: "Get Elite",
    ctaStyle: "primary" as const,
  },
  {
    name: "Lifetime",
    price: "$209",
    period: "one-time",
    badge: "BEST VALUE",
    badgeStyle: "bg-emerald-500 text-black px-2 py-1 rounded",
    highlighted: true,
    features: [
      "Lifetime access to all signals",
      "Lifetime education content",
      "Lifetime community access",
      "All future updates included",
      "Personal onboarding call",
    ],
    cta: "Get Lifetime Access",
    ctaStyle: "primary-lg" as const,
  },
];

const FALLBACK_TESTIMONIALS = [
  {
    quote:
      "FX Research Desk completely changed how I trade. The signals are precise and the risk management alone saved my account.",
    name: "Ahmed K.",
    location: "Dubai",
  },
  {
    quote:
      "Went from consistent losses to 12% monthly gains. The quarterly plan paid for itself in the first week.",
    name: "Maria S.",
    location: "London",
  },
  {
    quote:
      "Best investment I've made. The lifetime plan is a no-brainer if you're serious about forex.",
    name: "James O.",
    location: "New York",
  },
  {
    quote:
      "The 1-on-1 calls in the Elite plan are worth 10x the price. My trading psychology improved massively.",
    name: "Chen W.",
    location: "Singapore",
  },
  {
    quote:
      "I started with the free signals, upgraded to Pro, then Lifetime. Never looked back.",
    name: "Priya R.",
    location: "Mumbai",
  },
];

const educationArticles = [
  {
    icon: BookOpen,
    title: "Risk Management",
    description:
      "Learn how to protect your capital with position sizing, stop-loss strategies, and risk-reward ratios.",
    href: "/education/risk-management",
  },
  {
    icon: BarChart3,
    title: "Technical Analysis",
    description:
      "Master support/resistance, trendlines, candlestick patterns, and key indicators like RSI and MACD.",
    href: "/education/technical-analysis",
  },
  {
    icon: Brain,
    title: "Trading Psychology",
    description:
      "Control emotions, build discipline, and develop the mindset of a consistently profitable trader.",
    href: "/education/trading-psychology",
  },
];

const faqItems = [
  {
    question: "What's included in the free signals?",
    answer:
      "Our free Telegram channel includes 3–5 signals per week with delayed alerts. You get basic market updates and community access.",
  },
  {
    question: "How do I receive the signals?",
    answer:
      "All signals are sent via Telegram in real-time. Each alert includes currency pair, direction (BUY/SELL), entry price, stop loss, take profit, and recommended lot size.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes, absolutely. Monthly and quarterly plans can be cancelled anytime with no penalties. Yearly plans are non-refundable but you keep access until the end of your billing period.",
  },
  {
    question: "What brokers do you recommend?",
    answer:
      "Our signals work with any forex broker — MT4, MT5, cTrader, or prop firms. We don't have affiliate deals, so our recommendations are unbiased.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Due to the digital nature of our service, we don't offer refunds. However, you can start with our free signals to evaluate quality before upgrading.",
  },
  {
    question: "How is the Lifetime plan different?",
    answer:
      "Lifetime gives you permanent access to all current and future features. Pay once, profit forever. Includes personal onboarding and all future updates at no extra cost.",
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function statsToCards(stats: Stats) {
  return [
    { value: `${stats.win_rate}%`, label: "Win Rate" },
    { value: `+${stats.pips_month.toLocaleString()}`, label: "Pips This Month" },
    { value: `+${stats.monthly_return}%`, label: "Avg Monthly Return" },
    { value: `${stats.active_traders}+`, label: "Active Members" },
  ];
}

function formatSignalDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatPrice(value: number) {
  return Number(value).toFixed(4);
}

function getSignalResultLabel(signal: Signal) {
  if (signal.result === "PENDING") return "OPEN";
  if (signal.result === "WIN") {
    return signal.pips != null ? `WIN +${signal.pips} pips` : "WIN";
  }
  if (signal.result === "LOSS") {
    return signal.pips != null ? `LOSS ${signal.pips} pips` : "LOSS";
  }
  return "OPEN";
}

function StatSkeleton() {
  return (
    <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-8 text-center animate-pulse">
      <div className="h-12 bg-slate-800 rounded-lg mb-3 mx-auto w-24" />
      <div className="h-4 bg-slate-800 rounded w-28 mx-auto" />
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [yearlyBilling, setYearlyBilling] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeSection, setActiveSection] = useState("");

  const [statsLoading, setStatsLoading] = useState(true);
  const [signalsLoading, setSignalsLoading] = useState(true);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  const [liveStats, setLiveStats] = useState<Stats | null>(null);
  const [liveSignals, setLiveSignals] = useState<Signal[]>([]);
  const [liveTestimonials, setLiveTestimonials] = useState<Testimonial[]>([]);

  const [usingStaticStats, setUsingStaticStats] = useState(false);
  const [dbConfigured, setDbConfigured] = useState(false);

  const statCards = liveStats ? statsToCards(liveStats) : FALLBACK_STAT_CARDS;
  const displayTestimonials =
    liveTestimonials.length > 0
      ? liveTestimonials.map((t) => ({
          quote: t.quote,
          name: t.name,
          location: t.location ?? t.member_type ?? "",
          imageUrl: t.image_url,
        }))
      : FALLBACK_TESTIMONIALS.map((t) => ({ ...t, imageUrl: null as string | null }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const configured = isSupabaseConfigured();
    setDbConfigured(configured);

    if (!configured) {
      setUsingStaticStats(true);
      setStatsLoading(false);
      setSignalsLoading(false);
      setTestimonialsLoading(false);
      return;
    }

    async function loadSiteData() {
      const [stats, signals, testimonialsData] = await Promise.all([
        fetchStats(),
        fetchSignals(5),
        fetchTestimonials(),
      ]);

      if (stats) {
        setLiveStats(stats);
        setUsingStaticStats(false);
      } else {
        setUsingStaticStats(true);
      }

      setLiveSignals(signals);
      setLiveTestimonials(testimonialsData);
      setStatsLoading(false);
      setSignalsLoading(false);
      setTestimonialsLoading(false);
    }

    loadSiteData();
  }, []);

  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <LiveTicker />

      {/* Navbar */}
      <header
        className={cn(
          "fixed top-10 left-0 right-0 z-50 transition-all duration-300 shadow-lg shadow-black/20",
          scrolled ? "h-[4.5rem]" : "h-20",
          "bg-[#0a0a0a]/95 backdrop-blur-xl",
          scrolled && "border-b border-emerald-500/20"
        )}
      >
        <nav
          className={cn(
            "max-w-7xl mx-auto px-6 h-full flex items-center justify-between transition-all duration-300",
            scrolled ? "py-3" : "py-4"
          )}
        >
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 font-black tracking-widest text-white transition-all duration-300",
              scrolled ? "text-xl" : "text-2xl"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            FX RESEARCH DESK
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const sectionId = link.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group relative text-base font-semibold transition-colors pb-2",
                    isActive ? "text-emerald-400" : "text-slate-400 hover:text-white"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500 transition-opacity",
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}
                  />
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex bg-emerald-500 hover:bg-emerald-400 text-black text-base font-bold px-6 py-3 rounded-full transition shadow-lg shadow-emerald-500/20"
            >
              Join Telegram
            </a>
            <button
              type="button"
              className="lg:hidden p-2 text-slate-400 hover:text-white"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[80] w-80 max-w-[85vw] bg-[#0a0a0a]/95 backdrop-blur-xl border-l border-slate-800/50 p-6 pt-20 lg:hidden"
            >
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="absolute top-14 right-6 p-2 text-slate-400 hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="py-3 px-4 text-slate-300 hover:text-emerald-400 hover:bg-white/5 rounded-xl transition"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3.5 rounded-full transition"
              >
                Join Telegram
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="relative min-h-[calc(100vh-7.5rem)] flex flex-col items-center justify-center px-6 pt-[7.5rem]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.05)_0%,_transparent_65%)]" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float-orb pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float-orb-delayed pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-float-orb-slow pointer-events-none" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center max-w-5xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
            🔥 Trusted by 500+ Traders in 30+ Countries
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
            Trade Forex Like a Professional
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
              With Data-Driven Signals
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Get real-time alerts, verified performance metrics, and proven strategies from traders
            who&apos;ve been in the markets for 10+ years.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-500 text-black font-bold text-lg px-8 py-4 rounded-full hover:scale-105 transition-all shadow-xl shadow-emerald-500/25"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#performance"
              className="inline-flex items-center gap-2 border-2 border-slate-700 text-white text-lg px-8 py-4 rounded-full hover:bg-slate-800 hover:border-slate-600 transition-all"
            >
              View Performance
            </a>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {[
              { icon: TrendingUp, label: `${statCards[0]?.value ?? "87%"} Win Rate` },
              { icon: Target, label: `${statCards[1]?.value ?? "+2,450"} Pips/Month` },
              { icon: Clock, label: "24/7 Market Coverage" },
              { icon: Zap, label: "Instant Telegram Alerts" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm text-slate-500">
                <item.icon className="w-4 h-4 text-emerald-500" />
                {item.label}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Social proof marquee */}
      <div className="border-y border-slate-800/30 bg-slate-900/30 py-4 overflow-hidden">
        <div className="hidden md:flex animate-marquee whitespace-nowrap">
          {[...socialMarquee, ...socialMarquee].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="mx-10 text-xs font-bold tracking-widest text-slate-600 uppercase"
            >
              {item} •
            </span>
          ))}
        </div>
        <div className="flex md:hidden flex-wrap justify-center gap-x-6 gap-y-2 px-6">
          {socialMarquee.map((item) => (
            <span
              key={item}
              className="text-xs font-bold tracking-widest text-slate-600 uppercase"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <section id="how-it-works" className="scroll-mt-28 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Start Profiting in 3 Steps</h2>
            <p className="text-slate-400">
              No complicated setups. Just follow the signals and trade.
            </p>
          </motion.div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="hidden md:block absolute top-1/2 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent -translate-y-1/2" />
            <div className="hidden md:flex absolute top-1/2 left-[16.67%] right-[16.67%] -translate-y-1/2 justify-between px-[8%]">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-emerald-500/40 border border-emerald-500/60"
                />
              ))}
            </div>

            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeIn}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{ y: -4 }}
                className="relative bg-slate-900/30 border border-slate-800/50 rounded-2xl p-8 overflow-hidden hover:border-emerald-500/30 transition-all"
              >
                <span className="absolute -top-4 -right-2 text-[120px] font-bold text-slate-800/30 leading-none select-none pointer-events-none">
                  {step.num}
                </span>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mt-6">{step.title}</h3>
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance */}
      <section
        id="performance"
        className="scroll-mt-28 py-24 px-6 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Verified Performance</h2>
            <p className="text-slate-400">Every trade is logged and verified. No fake results.</p>
            {usingStaticStats && (
              <span className="inline-block mt-4 text-xs font-medium text-slate-500 bg-slate-800/50 border border-slate-700/50 px-3 py-1 rounded-full">
                Connect database for live updates
              </span>
            )}
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {statsLoading
              ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
              : statCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-8 text-center hover:border-emerald-500/20 transition-all"
              >
                <div className="text-5xl font-bold text-emerald-400 mb-2">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            id="signals"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeIn}
            className="scroll-mt-28 rounded-2xl border border-slate-800/50 bg-slate-900/30 backdrop-blur-sm overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-slate-800/30">
              <h3 className="text-lg font-semibold text-white">Recent Trades</h3>
            </div>

            {signalsLoading ? (
              <div className="px-6 py-8 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 bg-slate-800/50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : dbConfigured && liveSignals.length > 0 ? (
              <>
                <div className="hidden lg:grid grid-cols-7 gap-4 px-6 py-3 text-xs uppercase tracking-wider text-slate-500 font-medium">
                  <span>Pair</span>
                  <span>Direction</span>
                  <span>Entry</span>
                  <span>SL</span>
                  <span>TP</span>
                  <span>Result</span>
                  <span>Date</span>
                </div>
                {liveSignals.map((signal) => {
                  const resultLabel = getSignalResultLabel(signal);
                  const isPending = signal.result === "PENDING" || signal.result === null;
                  const isWin = signal.result === "WIN";
                  return (
                    <div
                      key={signal.id}
                      className="grid grid-cols-2 lg:grid-cols-7 gap-2 lg:gap-4 px-6 py-4 border-b border-slate-800/30 last:border-0 hover:bg-slate-800/20 transition-colors"
                    >
                      <div className="text-white font-semibold">{signal.pair}</div>
                      <div className="text-emerald-400 font-medium text-sm">{signal.direction}</div>
                      <div className="text-slate-300 text-sm hidden lg:block">
                        {formatPrice(signal.entry_price)}
                      </div>
                      <div className="text-slate-500 text-sm hidden lg:block">
                        {formatPrice(signal.stop_loss)}
                      </div>
                      <div className="text-slate-300 text-sm hidden lg:block">
                        {formatPrice(signal.take_profit)}
                      </div>
                      <div>
                        <span
                          className={cn(
                            "inline-block px-2 py-1 rounded text-xs font-bold",
                            isPending && "bg-yellow-500/10 text-yellow-400",
                            isWin && "bg-emerald-500/10 text-emerald-400",
                            signal.result === "LOSS" && "bg-red-500/10 text-red-400"
                          )}
                        >
                          {resultLabel}
                        </span>
                      </div>
                      <div className="text-slate-500 text-sm hidden lg:block">
                        {formatSignalDate(signal.created_at)}
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="px-6 py-12 text-center">
                <p className="text-slate-400 mb-6">
                  Live signals available in our Telegram channel
                </p>
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-full transition"
                >
                  Join Telegram Channel
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-28 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h2>
            <p className="text-slate-400">Upgrade anytime. Cancel anytime. No hidden fees.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="flex items-center justify-center gap-4 mb-12"
          >
            <span className={cn("text-sm font-medium", !yearlyBilling ? "text-white" : "text-slate-500")}>
              Monthly
            </span>
            <button
              type="button"
              onClick={() => setYearlyBilling((v) => !v)}
              className={cn(
                "relative w-14 h-7 rounded-full transition-colors",
                yearlyBilling ? "bg-emerald-500" : "bg-slate-700"
              )}
              aria-label="Toggle billing period"
            >
              <span
                className={cn(
                  "absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform",
                  yearlyBilling && "translate-x-7"
                )}
              />
            </button>
            <span className={cn("text-sm font-medium", yearlyBilling ? "text-white" : "text-slate-500")}>
              Yearly
            </span>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className={cn(
                  "flex flex-col bg-slate-900/30 backdrop-blur rounded-2xl p-8",
                  tier.highlighted
                    ? "border-2 border-emerald-500 shadow-xl shadow-emerald-500/10"
                    : "border border-slate-800/50 hover:border-emerald-500/20"
                )}
              >
                <div className="mb-4">
                  <span
                    className={cn(
                      "text-xs font-bold tracking-wider",
                      tier.badgeStyle
                    )}
                  >
                    {tier.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span
                    className={cn(
                      "text-4xl font-bold",
                      tier.highlighted ? "text-emerald-400" : "text-white"
                    )}
                  >
                    {tier.price}
                  </span>
                  <span className="text-slate-500 text-sm">{tier.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="text-emerald-500 mt-0.5">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "mt-auto text-center rounded-full font-semibold transition-all",
                    tier.ctaStyle === "outline" &&
                      "border border-slate-700 text-white hover:bg-slate-800 px-6 py-3",
                    tier.ctaStyle === "primary" &&
                      "bg-emerald-500 text-black hover:bg-emerald-400 font-bold px-6 py-3 shadow-lg shadow-emerald-500/20",
                    tier.ctaStyle === "primary-lg" &&
                      "bg-emerald-500 text-black hover:bg-emerald-400 font-bold px-6 py-3 text-lg shadow-xl shadow-emerald-500/30"
                  )}
                >
                  {tier.cta}
                </a>
              </motion.div>
            ))}
          </div>

          <p className="text-center mt-8">
            <a href="#pricing" className="text-emerald-400 hover:underline text-sm">
              Compare all features
            </a>
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="scroll-mt-28 py-24 px-6 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-4xl font-bold text-white text-center mb-12"
          >
            Trusted by Traders Worldwide
          </motion.h2>

          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-6 px-6">
            {testimonialsLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="min-w-[320px] h-48 bg-slate-900/50 border border-slate-800 rounded-2xl animate-pulse flex-shrink-0"
                  />
                ))
              : displayTestimonials.map((t, i) => (
              <motion.div
                key={`${t.name}-${i}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ delay: i * 0.08 }}
                className="min-w-[320px] snap-center flex-shrink-0 bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:border-emerald-500/20 transition-all"
              >
                {t.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.imageUrl}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover mb-4"
                  />
                )}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 italic leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="text-white font-semibold text-sm">{t.name}</div>
                <div className="text-slate-500 text-xs">{t.location}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section id="education" className="scroll-mt-28 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Master Forex Trading</h2>
            <p className="text-slate-400">Free guides to level up your trading skills</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {educationArticles.map((article, i) => (
              <motion.div
                key={article.href}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group bg-slate-900/30 border border-slate-800/50 rounded-2xl p-8 hover:border-emerald-500/30 transition-all"
              >
                <article.icon className="w-10 h-10 text-emerald-500 group-hover:text-emerald-400 transition mb-5" />
                <h3 className="text-xl font-bold text-white mb-3">{article.title}</h3>
                <p className="text-slate-400 text-sm mb-5 leading-relaxed">{article.description}</p>
                <Link
                  href={article.href}
                  className="text-emerald-400 text-sm font-medium group-hover:underline"
                >
                  Read More →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-28 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-4xl font-bold text-white text-center mb-12"
          >
            Frequently Asked Questions
          </motion.h2>

          <div>
            {faqItems.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <motion.div
                  key={item.question}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  transition={{ delay: i * 0.04 }}
                  className="bg-slate-900/30 border border-slate-800/50 rounded-xl mb-3 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-white/[0.02] transition"
                  >
                    <span className="text-white font-medium">{item.question}</span>
                    <Plus
                      className={cn(
                        "w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300",
                        isOpen && "rotate-45"
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 pt-0 text-slate-400 leading-relaxed">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-slate-900 to-[#0a0a0a] overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Join 500+ traders who&apos;ve already made the switch. Your first profitable trade could
            be today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-500 text-black font-bold text-lg px-8 py-4 rounded-full hover:scale-105 transition-all shadow-xl shadow-emerald-500/25"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 border-2 border-slate-700 text-white text-lg px-8 py-4 rounded-full hover:bg-slate-800 transition-all"
            >
              View Pricing
            </a>
          </div>
          <p className="text-slate-600 text-sm mt-6">No credit card required. Cancel anytime.</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t border-slate-800/50 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2 text-lg font-bold tracking-wider text-white mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                FX RESEARCH DESK
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-5">
                Professional forex signals and education for serious traders.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: Share2, label: "X" },
                  { icon: Send, label: "Telegram" },
                  { icon: Video, label: "YouTube" },
                  { icon: Globe, label: "Instagram" },
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition"
                    aria-label={label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-slate-500 text-sm hover:text-emerald-400 transition"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Legal
              </h3>
              <ul className="space-y-2.5">
                {[
                  "Terms of Service",
                  "Privacy Policy",
                  "Refund Policy",
                  "Risk Disclosure",
                ].map((item) => (
                  <li key={item}>
                    <span className="text-slate-500 text-sm cursor-default">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Connect
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 text-sm hover:text-emerald-400 transition"
                  >
                    Telegram Channel
                  </a>
                </li>
                <li>
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 text-sm hover:text-emerald-400 transition"
                  >
                    Telegram Support
                  </a>
                </li>
                <li className="text-slate-500 text-sm">Email: contact@fxresearchdesk.com</li>
              </ul>
            </div>
          </div>

          <p className="text-slate-600 text-sm text-center mt-12 pt-8 border-t border-slate-800/30">
            © 2026 FX Research Desk. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
