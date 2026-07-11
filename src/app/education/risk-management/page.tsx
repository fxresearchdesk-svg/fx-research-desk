import type { Metadata } from "next";
import { EducationLayout } from "@/components/education-layout";

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
    <EducationLayout
      title="The Complete Guide to Forex Risk Management"
      subtitle="Protect your capital. Trade another day."
      date="July 9, 2026"
    >
      <section>
        <h2>Why Risk Management Matters</h2>
        <p>
          Most traders fail not because they can&apos;t find good entries, but because they
          don&apos;t protect their capital. A single bad trade without a stop loss can wipe out
          weeks of profits. Risk management is what separates professionals from gamblers.
        </p>
        <p>
          At FX Research Desk, every signal we send includes a recommended stop loss and position
          size based on a 1-2% risk per trade rule. This ensures that even a losing streak
          won&apos;t blow your account.
        </p>
      </section>

      <section>
        <h2>The 1% Rule</h2>
        <p>
          Never risk more than 1-2% of your total account balance on a single trade. If you have
          a $1,000 account, your maximum loss per trade should be $10-20. This means if you hit
          a stop loss, your account barely flinches.
        </p>
        <p>
          This rule forces you to think in probabilities. You can afford to be wrong 10 times in
          a row and still have 90% of your capital intact. The market will always give you
          another opportunity — but only if you still have money to trade.
        </p>
      </section>

      <section>
        <h2>Position Sizing Made Simple</h2>
        <p>
          Position size = (Account Risk $) / (Stop Loss in Pips × Pip Value). For a standard lot,
          1 pip ≈ $10. If your stop loss is 20 pips and you want to risk $20, you should trade
          0.1 lots (1 mini lot). Our Premium signals always include the recommended lot size
          based on a 1% risk model.
        </p>
      </section>

      <section>
        <h2>Risk-Reward Ratio</h2>
        <p>
          Only take trades where the potential reward is at least 2x the risk. If your stop loss is
          20 pips, your take profit should be 40 pips minimum. This means you can be right only
          40% of the time and still make money. Our signals typically target 1:2 or 1:3
          risk-reward setups.
        </p>
      </section>

      <section>
        <h2>Final Tips</h2>
        <ul>
          {finalTips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>

      <div className="card-surface p-8 mt-16 text-center">
        <h2 className="font-serif-display text-[24px] text-[#111827] mb-2">
          Ready to Trade With Discipline?
        </h2>
        <p className="mb-6">
          Get our signals with built-in risk management — stop loss, take profit, and lot size
          included.
        </p>
        <a
          href="https://t.me/fxresearchdesk"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border border-[#1A1A1A] px-6 py-3 text-[11px] tracking-[0.2em] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors duration-200"
        >
          REQUEST ACCESS
        </a>
      </div>
    </EducationLayout>
  );
}
