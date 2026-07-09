"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, BarChart3, BookOpen, Brain, Check, Menu, Star, TrendingUp, Shield, Users, X } from "lucide-react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const mobileNavLinks = [
    { href: "#how-it-works", label: "How It Works" },
    { href: "#performance", label: "Performance" },
    { href: "#signals", label: "Signals" },
    { href: "#education", label: "Education" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ];

  const telegramUrl = "https://t.me/fxresearchdesk";

  const latestSignals = [
    { pair: "EUR/USD", direction: "BUY" as const, entry: "1.0850", stopLoss: "1.0820", takeProfit: "1.0900", result: "WIN +45 pips", isWin: true },
    { pair: "GBP/USD", direction: "SELL" as const, entry: "1.2740", stopLoss: "1.2780", takeProfit: "1.2680", result: "WIN +60 pips", isWin: true },
    { pair: "USD/JPY", direction: "BUY" as const, entry: "151.20", stopLoss: "150.80", takeProfit: "152.00", result: "LOSS -12 pips", isWin: false },
    { pair: "XAU/USD", direction: "BUY" as const, entry: "2320.00", stopLoss: "2305.00", takeProfit: "2350.00", result: "WIN +85 pips", isWin: true },
    { pair: "AUD/USD", direction: "SELL" as const, entry: "0.6640", stopLoss: "0.6680", takeProfit: "0.6580", result: "WIN +35 pips", isWin: true },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
        <nav className="px-6 py-4 flex items-center justify-between relative">
          <div className="text-xl font-bold text-emerald-400">FX Research Desk</div>
          <div className="hidden md:flex gap-6 text-sm text-slate-400">
            <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
            <a href="#performance" className="hover:text-white transition">Performance</a>
            <a href="#signals" className="hover:text-white transition">Signals</a>
            <a href="#education" className="hover:text-white transition">Education</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </div>
          <div className="flex items-center gap-2" ref={menuRef}>
            <button
              type="button"
              className="md:hidden p-2 text-slate-400 hover:text-white transition"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            {menuOpen && (
              <div className="md:hidden bg-slate-900 border border-slate-800 rounded-lg p-4 absolute top-full right-4 mt-2 w-48 shadow-xl">
                {mobileNavLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block py-2 text-slate-400 hover:text-emerald-400 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants(), "bg-emerald-500 hover:bg-emerald-600 text-black font-semibold")}
            >
              Join Telegram
            </a>
          </div>
        </nav>
      </div>
      <div className="h-16"></div>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 max-w-6xl mx-auto text-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm mb-6 border border-emerald-500/20">
          <TrendingUp className="w-4 h-4" />
          <span>Professional Forex Signals & Education</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Trade Smarter with <br />
          <span className="text-emerald-400">Data-Driven Signals</span>
        </h1>
        
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Join FX Research Desk for high-probability forex signals, 
          in-depth market analysis, and proven trading strategies.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: "lg" }), "bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-lg px-8")}
          >
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </a>
          <a
            href="#performance"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-slate-700 text-white hover:bg-slate-800 text-lg px-8")}
          >
            View Performance
          </a>
        </div>

        {/* Trust badges */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
            <Shield className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Verified Results</h3>
            <p className="text-slate-400 text-sm">Every trade is tracked and verified with full transparency.</p>
          </div>
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
            <TrendingUp className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="font-semibold text-lg mb-2">High Win Rate</h3>
            <p className="text-slate-400 text-sm">Consistent performance backed by technical analysis.</p>
          </div>
          <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
            <Users className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Community</h3>
            <p className="text-slate-400 text-sm">Join 500+ traders in our active Telegram channel.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="scroll-mt-20 bg-slate-950 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">How It Works</h2>
            <p className="text-slate-400">Start trading profitable signals in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-lg mb-4">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Join Telegram</h3>
              <p className="text-slate-400 text-sm">
                Subscribe to our free or premium Telegram channel and get instant access to our trading community.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-lg mb-4">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Receive Signals</h3>
              <p className="text-slate-400 text-sm">
                Get real-time alerts with entry price, stop loss, take profit, and clear reasoning for every trade.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-lg mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Trade & Profit</h3>
              <p className="text-slate-400 text-sm">
                Copy the signals into your broker, follow our risk rules, and watch your account grow consistently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Track Record Section */}
      <section id="performance" className="scroll-mt-20 bg-slate-900 border-y border-slate-800 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Track Record</h2>
            <p className="text-slate-400">Verified performance metrics from our signals</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-slate-950 border border-slate-800 rounded-xl text-center p-6">
              <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">87%</div>
              <div className="text-sm text-slate-400">Win Rate</div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl text-center p-6">
              <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">+2,450</div>
              <div className="text-sm text-slate-400">Pips This Month</div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl text-center p-6">
              <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">+14.2%</div>
              <div className="text-sm text-slate-400">Monthly Return</div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl text-center p-6">
              <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">500+</div>
              <div className="text-sm text-slate-400">Active Traders</div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Signals Section */}
      <section id="signals" className="scroll-mt-20 bg-slate-950 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Latest Signals</h2>
            <p className="text-slate-400">Recent trades delivered to our community</p>
          </div>

          <div>
            {latestSignals.map((trade) => (
              <div
                key={trade.pair}
                className="flex flex-col gap-2 md:grid md:grid-cols-6 md:items-center md:gap-4 bg-slate-900 border border-slate-800 rounded-lg px-6 py-4 mb-3"
              >
                <div className="text-white font-bold">{trade.pair}</div>
                <div className={`font-bold ${trade.direction === "BUY" ? "text-emerald-400" : "text-red-400"}`}>
                  {trade.direction}
                </div>
                <div className="text-slate-300 text-sm">{trade.entry}</div>
                <div className="text-red-400/70 text-sm">{trade.stopLoss}</div>
                <div className="text-emerald-400/70 text-sm">{trade.takeProfit}</div>
                <div
                  className={`font-bold px-2 py-1 rounded text-xs w-fit ${
                    trade.isWin
                      ? "text-emerald-400 bg-emerald-500/10"
                      : "text-red-400 bg-red-500/10"
                  }`}
                >
                  {trade.result}
                </div>
              </div>
            ))}
          </div>

          <p className="text-slate-500 text-xs text-center mt-6">
            Results shown are from Premium signals. Past performance does not guarantee future results.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="scroll-mt-20 bg-slate-950 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Choose Your Plan</h2>
            <p className="text-slate-400">Join our Telegram channel and start trading with confidence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Signals */}
            <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-2">Free Signals</h3>
              <div className="text-3xl font-bold text-slate-400 mb-6">$0/month</div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 shrink-0 text-slate-500" />
                  3-5 signals per week
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 shrink-0 text-slate-500" />
                  Delayed by 2 hours
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 shrink-0 text-slate-500" />
                  Basic market updates
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 shrink-0 text-slate-500" />
                  Community access
                </li>
              </ul>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline" }), "mt-auto border-slate-700 text-white hover:bg-slate-800")}
              >
                Join Free Channel
              </a>
            </div>

            {/* Premium Signals */}
            <div className="flex flex-col bg-slate-900 border-2 border-emerald-500 rounded-2xl p-8 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                RECOMMENDED
              </span>
              <h3 className="text-xl font-bold text-white mb-2">Premium Signals</h3>
              <div className="text-3xl font-bold text-emerald-400 mb-6">$29/month</div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  15-20 signals per week
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  Real-time alerts
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  Full educational content
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  Risk management guides
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  1-on-1 support
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  Private community
                </li>
              </ul>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants(), "mt-auto bg-emerald-500 hover:bg-emerald-600 text-black font-bold")}
              >
                Get Premium Access
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="scroll-mt-20 bg-slate-900 border-y border-slate-800 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Forex Education Hub</h2>
            <p className="text-slate-400">Master the markets with our free guides and strategies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
              <BookOpen className="text-emerald-400 w-10 h-10 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Risk Management</h3>
              <p className="text-slate-400 text-sm mb-4">
                Learn how to protect your capital with proper position sizing, stop-loss strategies, and risk-reward ratios.
              </p>
              <Link href="/education/risk-management" className="text-emerald-400 text-sm font-medium hover:underline">
                Read More
              </Link>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
              <BarChart3 className="text-emerald-400 w-10 h-10 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Technical Analysis</h3>
              <p className="text-slate-400 text-sm mb-4">
                Master support/resistance, trendlines, candlestick patterns, and key indicators like RSI and MACD.
              </p>
              <Link href="/education/technical-analysis" className="text-emerald-400 text-sm font-medium hover:underline">
                Read More
              </Link>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
              <Brain className="text-emerald-400 w-10 h-10 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Trading Psychology</h3>
              <p className="text-slate-400 text-sm mb-4">
                Control emotions, build discipline, and develop the mindset of a consistently profitable trader.
              </p>
              <Link href="/education/trading-psychology" className="text-emerald-400 text-sm font-medium hover:underline">
                Read More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-slate-950 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">What Traders Say</h2>
            <p className="text-slate-400">Join hundreds of profitable traders in our community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 w-5 h-5 fill-yellow-400" />
                ))}
              </div>
              <p className="text-slate-300 text-sm italic mb-4">
                &ldquo;FX Research Desk changed my trading. The signals are accurate and the education helped me understand WHY we enter each trade.&rdquo;
              </p>
              <div className="text-white font-semibold text-sm">Ahmed K.</div>
              <div className="text-slate-500 text-xs">Premium Member • 6 months</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 w-5 h-5 fill-yellow-400" />
                ))}
              </div>
              <p className="text-slate-300 text-sm italic mb-4">
                &ldquo;Went from blowing accounts to consistent monthly profits. The risk management guides alone are worth the subscription.&rdquo;
              </p>
              <div className="text-white font-semibold text-sm">Maria S.</div>
              <div className="text-slate-500 text-xs">Premium Member • 1 year</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 w-5 h-5 fill-yellow-400" />
                ))}
              </div>
              <p className="text-slate-300 text-sm italic mb-4">
                &ldquo;Best signal service I&apos;ve used. Real-time alerts, clear entry/exit points, and the community is incredibly supportive.&rdquo;
              </p>
              <div className="text-white font-semibold text-sm">James O.</div>
              <div className="text-slate-500 text-xs">Free Member → Premium</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="scroll-mt-20 bg-slate-900 border-y border-slate-800 px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Frequently Asked Questions</h2>
            <p className="text-slate-400">Everything you need to know before joining</p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-2">Are the signals really free?</h3>
              <p className="text-slate-400 text-sm">
                Yes! We offer a free tier with 3-5 signals per week. For real-time alerts and full education, upgrade to Premium for $29/month.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-2">What time zone are the signals sent in?</h3>
              <p className="text-slate-400 text-sm">
                Signals are sent in real-time during London and New York sessions. Our busiest hours are 8 AM - 4 PM GMT.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-2">Do I need a specific broker?</h3>
              <p className="text-slate-400 text-sm">
                No. Our signals work with any forex broker — MT4, MT5, cTrader, or prop firms. We provide clear entry, stop loss, and take profit levels.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-2">Can I cancel Premium anytime?</h3>
              <p className="text-slate-400 text-sm">
                Absolutely. Premium is monthly with no contracts. Cancel anytime and keep access until the end of your billing period.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-emerald-500 px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-black">Ready to Start Trading Smarter?</h2>
          <p className="text-black/70 text-lg mt-2">
            Join 500+ traders getting real-time forex signals and expert education.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white hover:bg-slate-900 font-bold px-6 py-3 rounded-lg"
            >
              Join Free Channel
            </a>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-emerald-600 hover:bg-slate-100 font-bold px-6 py-3 rounded-lg border-2 border-white"
            >
              Get Premium
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-xl font-bold text-emerald-400">FX Research Desk</div>
              <p className="text-slate-400 text-sm mt-2">
                Professional forex signals and education for serious traders.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#performance" className="text-slate-400 text-sm hover:text-emerald-400 transition">
                    Performance
                  </a>
                </li>
                <li>
                  <a href="#education" className="text-slate-400 text-sm hover:text-emerald-400 transition">
                    Education
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-slate-400 text-sm hover:text-emerald-400 transition">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 text-sm hover:text-emerald-400 transition"
                  >
                    Telegram Channel
                  </a>
                </li>
                <li>
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 text-sm hover:text-emerald-400 transition"
                  >
                    Telegram Support
                  </a>
                </li>
                <li className="text-slate-400 text-sm">
                  Email: contact@fxresearchdesk.com
                </li>
              </ul>
            </div>
          </div>

          <p className="text-center text-slate-600 text-sm mt-12 pt-8 border-t border-slate-800">
            © 2026 FX Research Desk. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}