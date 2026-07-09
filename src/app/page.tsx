import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, BookOpen, Brain, Check, Star, TrendingUp, Shield, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-bold text-emerald-400">FX Research Desk</div>
        <div className="hidden md:flex gap-6 text-sm text-slate-400">
          <a href="#performance" className="hover:text-white transition">Performance</a>
          <a href="#education" className="hover:text-white transition">Education</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
          Join Telegram
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 md:py-32 max-w-6xl mx-auto text-center">
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
          <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-lg px-8">
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button size="lg" variant="outline" className="border-slate-700 text-white hover:bg-slate-800 text-lg px-8">
            View Performance
          </Button>
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

      {/* Track Record Section */}
      <section id="performance" className="bg-slate-900 border-y border-slate-800 px-6 py-20">
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

      {/* Pricing Section */}
      <section id="pricing" className="bg-slate-950 px-6 py-20">
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
              <Button variant="outline" className="mt-auto border-slate-700 text-white hover:bg-slate-800">
                Join Free Channel
              </Button>
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
              <Button className="mt-auto bg-emerald-500 hover:bg-emerald-600 text-black font-bold">
                Get Premium Access
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="bg-slate-900 border-y border-slate-800 px-6 py-20">
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
              <a href="#" className="text-emerald-400 text-sm font-medium hover:underline">
                Read More
              </a>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
              <BarChart3 className="text-emerald-400 w-10 h-10 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Technical Analysis</h3>
              <p className="text-slate-400 text-sm mb-4">
                Master support/resistance, trendlines, candlestick patterns, and key indicators like RSI and MACD.
              </p>
              <a href="#" className="text-emerald-400 text-sm font-medium hover:underline">
                Read More
              </a>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
              <Brain className="text-emerald-400 w-10 h-10 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Trading Psychology</h3>
              <p className="text-slate-400 text-sm mb-4">
                Control emotions, build discipline, and develop the mindset of a consistently profitable trader.
              </p>
              <a href="#" className="text-emerald-400 text-sm font-medium hover:underline">
                Read More
              </a>
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
    </main>
  );
}