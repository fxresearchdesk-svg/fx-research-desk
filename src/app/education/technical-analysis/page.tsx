import type { Metadata } from "next";
import { EducationLayout } from "@/components/education-layout";

export const metadata: Metadata = {
  title: "Technical Analysis for Forex Traders | FX Research Desk",
  description:
    "Master support and resistance, trendlines, candlestick patterns, and key indicators like RSI and MACD.",
};

const puttingItTogether = [
  "Wait for confluence",
  "Don't trade against the trend",
  "Confirm with volume/price action",
];

export default function TechnicalAnalysisPage() {
  return (
    <EducationLayout
      title="Technical Analysis for Forex Traders"
      subtitle="Read the charts. Predict the moves."
      date="July 9, 2026"
    >
      <section>
        <h2>Support and Resistance</h2>
        <p>
          Support and resistance are horizontal price levels where the market has historically
          struggled to break through. Support acts as a floor where buyers step in, while
          resistance acts as a ceiling where sellers take control. These levels form because
          traders remember past prices and react at the same zones again and again.
        </p>
        <p>
          The best trades often happen at these key levels. When price bounces off support, it
          signals buyer strength. When it rejects resistance, sellers are in charge. At FX
          Research Desk, we mark these levels on every chart before sending a signal so you
          know exactly where the market is likely to react.
        </p>
      </section>

      <section>
        <h2>Trendlines</h2>
        <p>
          Trendlines connect higher lows in an uptrend or lower highs in a downtrend, showing
          you the direction of momentum. A rising trendline in an uptrend acts as dynamic
          support — price tends to bounce off it until the trend breaks. Drawing trendlines
          takes practice, but even two clean touch points can give you a powerful edge.
        </p>
        <p>
          You can trade two setups with trendlines: bounces and breaks. A bounce means buying
          at the trendline in an uptrend or selling at the trendline in a downtrend. A break
          means the trend is reversing — price closes beyond the trendline with conviction,
          signaling a potential new direction. Our signals often combine trendline analysis
          with support/resistance for high-probability entries.
        </p>
      </section>

      <section>
        <h2>Candlestick Patterns</h2>
        <p>
          Candlestick patterns reveal the battle between buyers and sellers in a single glance.
          Bullish engulfing patterns show buyers overwhelming sellers. Pin bars (long wicks with
          small bodies) signal rejection at key levels. Doji candles indicate indecision and
          often appear before reversals. Learning even three or four reliable patterns can
          dramatically improve your entry timing.
        </p>
      </section>

      <section>
        <h2>Key Indicators</h2>
        <p>
          RSI (Relative Strength Index) measures momentum on a scale of 0 to 100. Readings above
          70 suggest overbought conditions; below 30 suggests oversold. MACD (Moving Average
          Convergence Divergence) tracks trend direction and momentum shifts through its signal
          line crossovers. We use RSI to confirm reversals at key levels and MACD to validate
          trend strength — never as standalone signals, but as confluence tools alongside price
          action.
        </p>
      </section>

      <section>
        <h2>Putting It Together</h2>
        <ul>
          {puttingItTogether.map((item) => (
            <li key={item}>{item}</li>
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
