"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LiveTicker } from "@/components/live-ticker";
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

const statCards = [
  { value: "87%", label: "Win Rate" },
  { value: "+2,450", label: "Pips This Month" },
  { value: "+14.2%", label: "Avg Monthly Return" },
  { value: "500+", label: "Active Members" },
];

const latestSignals = [
  {
    pair: "EUR/USD",
    direction: "BUY" as const,
    entry: "1.0850",
    stopLoss: "1.0820",
    takeProfit: "1.0900",
    result: "WIN +45 pips",
    isWin: true,
    date: "Jul 9, 2026",
  },
  {
    pair: "GBP/USD",
    direction: "SELL" as const,
    entry: "1.2740",
    stopLoss: "1.2780",
    takeProfit: "1.2680",
    result: "WIN +60 pips",
    isWin: true,
    date: "Jul 8, 2026",
  },
  {
    pair: "USD/JPY",
    direction: "BUY" as const,
    entry: "151.20",
    stopLoss: "150.80",
    takeProfit: "152.00",
    result: "LOSS -12 pips",
    isWin: false,
    date: "Jul 8, 2026",
  },
  {
    pair: "XAU/USD",
    direction: "BUY" as const,
    entry: "2320.00",
    stopLoss: "2305.00",
    takeProfit: "2350.00",
    result: "WIN +85 pips",
    isWin: true,
    date: "Jul 7, 2026",
  },
  {
    pair: "AUD/USD",
    direction: "SELL" as const,
    entry: "0.6640",
    stopLoss: "0.6680",
    takeProfit: "0.6580",
    result: "WIN +35 pips",
    isWin: true,
    date: "Jul 6, 2026",
  },
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

const testimonials = [
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

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [yearlyBilling, setYearlyBilling] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <LiveTicker />

      {/* Navbar */}
      <header
        className={cn(
          "fixed top-10 left-0 right-0 z-50 h-16 transition-all duration-300",
          "bg-[#0a0a0a]/90 backdrop-blur-xl",
          scrolled && "border-b border-slate-800/50"
        )}
      >
        <nav className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-wider text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            FX RESEARCH DESK
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-emerald-400 transition-all group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold px-5 py-2 rounded-full transition shadow-lg shadow-emerald-500/20"
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
      <section className="relative min-h-[calc(100vh-6.5rem)] flex flex-col items-center justify-center px-6 pt-[6.5rem]">
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
              { icon: TrendingUp, label: "87% Win Rate" },
              { icon: Target, label: "2,450+ Pips/Month" },
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
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {statCards.map((stat, i) => (
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
            <div className="hidden lg:grid grid-cols-7 gap-4 px-6 py-3 text-xs uppercase tracking-wider text-slate-500 font-medium">
              <span>Pair</span>
              <span>Direction</span>
              <span>Entry</span>
              <span>SL</span>
              <span>TP</span>
              <span>Result</span>
              <span>Date</span>
            </div>
            {latestSignals.map((trade) => (
              <div
                key={`${trade.pair}-${trade.date}`}
                className="grid grid-cols-2 lg:grid-cols-7 gap-2 lg:gap-4 px-6 py-4 border-b border-slate-800/30 last:border-0 hover:bg-slate-800/20 transition-colors"
              >
                <div className="text-white font-semibold">{trade.pair}</div>
                <div className="text-emerald-400 font-medium text-sm">{trade.direction}</div>
                <div className="text-slate-300 text-sm hidden lg:block">{trade.entry}</div>
                <div className="text-slate-500 text-sm hidden lg:block">{trade.stopLoss}</div>
                <div className="text-slate-300 text-sm hidden lg:block">{trade.takeProfit}</div>
                <div>
                  <span
                    className={cn(
                      "inline-block px-2 py-1 rounded text-xs font-bold",
                      trade.isWin
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    )}
                  >
                    {trade.result}
                  </span>
                </div>
                <div className="text-slate-500 text-sm hidden lg:block">{trade.date}</div>
              </div>
            ))}
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
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ delay: i * 0.08 }}
                className="min-w-[320px] snap-center flex-shrink-0 bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:border-emerald-500/20 transition-all"
              >
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
