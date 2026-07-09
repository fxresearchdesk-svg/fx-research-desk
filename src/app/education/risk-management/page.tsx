import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Complete Guide to Forex Risk Management | FX Research Desk",
  description:
    "Learn how to protect your capital with proper position sizing, stop-loss strategies, and risk-reward ratios.",
};

const finalTips = [
  "Always use a stop loss — no exceptions",
  "Never move your stop loss further away to \"give it room\"",
  "Avoid trading during high-impact news unless you're experienced",
  "Keep a trading journal to review your mistakes",
];

export default function RiskManagementPage() {
  return (
    <main className="bg-slate-950 text-white min-h-screen px-6 py-12 md:py-16">
      <article className="max-w-3xl mx-auto">
        <Link
          href="/#education"
          className="text-emerald-400 hover:text-emerald-300 text-sm mb-8 inline-block"
        >
          ← Back to Education
        </Link>

        <header>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            The Complete Guide to Forex Risk Management
          </h1>
          <p className="text-slate-400 text-lg mb-10">
            Protect your capital. Trade another day.
          </p>
          <p className="text-slate-500 text-sm mb-12">July 9, 2026</p>
        </header>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 mt-12">
            Why Risk Management Matters
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Most traders fail not because they can&apos;t find good entries, but because they
            don&apos;t protect their capital. A single bad trade without a stop loss can wipe out
            weeks of profits. Risk management is what separates professionals from gamblers.
          </p>
          <p className="text-slate-300 leading-relaxed">
            At FX Research Desk, every signal we send includes a recommended stop loss and position
            size based on a 1-2% risk per trade rule. This ensures that even a losing streak
            won&apos;t blow your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 mt-12">The 1% Rule</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Never risk more than 1-2% of your total account balance on a single trade. If you have
            a $1,000 account, your maximum loss per trade should be $10-20. This means if you hit
            a stop loss, your account barely flinches.
          </p>
          <p className="text-slate-300 leading-relaxed">
            This rule forces you to think in probabilities. You can afford to be wrong 10 times in
            a row and still have 90% of your capital intact. The market will always give you
            another opportunity — but only if you still have money to trade.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 mt-12">
            Position Sizing Made Simple
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Position size = (Account Risk $) / (Stop Loss in Pips × Pip Value). For a standard lot,
            1 pip ≈ $10. If your stop loss is 20 pips and you want to risk $20, you should trade
            0.1 lots (1 mini lot). Our Premium signals always include the recommended lot size
            based on a 1% risk model.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 mt-12">Risk-Reward Ratio</h2>
          <p className="text-slate-300 leading-relaxed">
            Only take trades where the potential reward is at least 2x the risk. If your stop loss is
            20 pips, your take profit should be 40 pips minimum. This means you can be right only
            40% of the time and still make money. Our signals typically target 1:2 or 1:3
            risk-reward setups.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 mt-12">Final Tips</h2>
          <ul className="space-y-3">
            {finalTips.map((tip) => (
              <li key={tip} className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 mr-3 shrink-0" />
                <span className="text-slate-300">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mt-16 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Ready to Trade With Discipline?</h2>
          <p className="text-slate-400 mb-6">
            Get our signals with built-in risk management — stop loss, take profit, and lot size
            included.
          </p>
          <a
            href="https://t.me/fxresearchdesk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-6 py-3 rounded-lg"
          >
            Join Premium
          </a>
        </div>
      </article>
    </main>
  );
}
