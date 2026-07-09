import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mastering Trading Psychology | FX Research Desk",
  description:
    "Control emotions, build discipline, and develop the mindset of a consistently profitable trader.",
};

const mentalChecklist = [
  "Did I check the economic calendar?",
  "Is this my A+ setup?",
  "Am I risking 1% or less?",
  "Can I walk away after this trade?",
];

export default function TradingPsychologyPage() {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Mastering Trading Psychology</h1>
          <p className="text-slate-400 text-lg mb-10">Control your mind. Control your trades.</p>
          <p className="text-slate-500 text-sm mb-12">July 9, 2026</p>
        </header>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 mt-12">
            Why Psychology Beats Strategy
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            You can have the best strategy in the world, but if you panic during a drawdown or
            get greedy after a winning streak, you will lose money. Fear makes you exit winners
            too early. Greed makes you hold losers too long. Emotions are the silent account
            killer that no indicator can fix.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Professional traders are not emotionless robots — they have systems that remove
            decision-making from the heat of the moment. They know their edge, they trust their
            process, and they accept that losses are part of the game. Psychology is what allows
            you to execute the same plan whether you are up or down on the day.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 mt-12">FOMO and Revenge Trading</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            FOMO (Fear Of Missing Out) pushes you into trades you did not plan. You see a pair
            moving fast, jump in late, and get caught in a reversal. Revenge trading happens
            after a loss — you double your size to &ldquo;make it back quickly,&rdquo; which
            usually leads to an even bigger loss. Both behaviors come from the same root: trading
            based on feelings instead of rules.
          </p>
          <p className="text-slate-300 leading-relaxed">
            The fix is simple but hard: walk away after a loss. Set a daily loss limit and stop
            trading when you hit it. There is always another setup tomorrow. The market does not
            owe you a win, and chasing losses is how accounts get destroyed in a single session.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 mt-12">The Discipline of a Pro</h2>
          <p className="text-slate-300 leading-relaxed">
            A professional trader follows their plan even when it feels uncomfortable. They take
            the stop loss without hesitation. They skip trades that do not meet their criteria,
            even if the setup &ldquo;looks close enough.&rdquo; Discipline is not about being
            perfect — it is about being consistent. Every rule you break is a tax on your
            long-term edge.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 mt-12">Building a Routine</h2>
          <p className="text-slate-300 leading-relaxed">
            Start each session with pre-market preparation: check the economic calendar, mark key
            levels on your charts, and identify your A+ setups before the market opens. After
            trading, journal every trade — entry reason, emotions felt, and outcome. Weekly
            reviews help you spot patterns in your mistakes before they become habits. Routine
            removes randomness and builds the confidence to execute under pressure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 mt-12">Mental Checklist</h2>
          <ul className="space-y-3">
            {mentalChecklist.map((item) => (
              <li key={item} className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 mr-3 shrink-0" />
                <span className="text-slate-300">{item}</span>
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
