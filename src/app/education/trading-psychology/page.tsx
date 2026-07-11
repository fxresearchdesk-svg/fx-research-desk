import type { Metadata } from "next";
import { EducationLayout } from "@/components/education-layout";

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
    <EducationLayout
      title="Mastering Trading Psychology"
      subtitle="Control your mind. Control your trades."
      date="July 9, 2026"
    >
      <section>
        <h2>Why Psychology Beats Strategy</h2>
        <p>
          You can have the best strategy in the world, but if you panic during a drawdown or
          get greedy after a winning streak, you will lose money. Fear makes you exit winners
          too early. Greed makes you hold losers too long. Emotions are the silent account
          killer that no indicator can fix.
        </p>
        <p>
          Professional traders are not emotionless robots — they have systems that remove
          decision-making from the heat of the moment. They know their edge, they trust their
          process, and they accept that losses are part of the game. Psychology is what allows
          you to execute the same plan whether you are up or down on the day.
        </p>
      </section>

      <section>
        <h2>FOMO and Revenge Trading</h2>
        <p>
          FOMO (Fear Of Missing Out) pushes you into trades you did not plan. You see a pair
          moving fast, jump in late, and get caught in a reversal. Revenge trading happens
          after a loss — you double your size to &ldquo;make it back quickly,&rdquo; which
          usually leads to an even bigger loss. Both behaviors come from the same root: trading
          based on feelings instead of rules.
        </p>
        <p>
          The fix is simple but hard: walk away after a loss. Set a daily loss limit and stop
          trading when you hit it. There is always another setup tomorrow. The market does not
          owe you a win, and chasing losses is how accounts get destroyed in a single session.
        </p>
      </section>

      <section>
        <h2>The Discipline of a Pro</h2>
        <p>
          A professional trader follows their plan even when it feels uncomfortable. They take
          the stop loss without hesitation. They skip trades that do not meet their criteria,
          even if the setup &ldquo;looks close enough.&rdquo; Discipline is not about being
          perfect — it is about being consistent. Every rule you break is a tax on your
          long-term edge.
        </p>
      </section>

      <section>
        <h2>Building a Routine</h2>
        <p>
          Start each session with pre-market preparation: check the economic calendar, mark key
          levels on your charts, and identify your A+ setups before the market opens. After
          trading, journal every trade — entry reason, emotions felt, and outcome. Weekly
          reviews help you spot patterns in your mistakes before they become habits. Routine
          removes randomness and builds the confidence to execute under pressure.
        </p>
      </section>

      <section>
        <h2>Mental Checklist</h2>
        <ul>
          {mentalChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <div className="border border-[#1F1F1F] bg-[#0C0C0C] p-8 mt-16 text-center">
        <h2 className="font-serif-display text-[24px] text-[#E8E6E3] mb-2">
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
          className="inline-block border border-[#1F1F1F] px-6 py-3 text-[11px] tracking-[0.2em] text-[#B8956A] hover:bg-[#B8956A] hover:text-[#030303] transition-colors duration-200"
        >
          REQUEST ACCESS
        </a>
      </div>
    </EducationLayout>
  );
}
