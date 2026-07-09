import type { Metadata } from "next";
import Link from "next/link";

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
            Technical Analysis for Forex Traders
          </h1>
          <p className="text-slate-400 text-lg mb-10">Read the charts. Predict the moves.</p>
          <p className="text-slate-500 text-sm mb-12">July 9, 2026</p>
        </header>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 mt-12">Support and Resistance</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Support and resistance are horizontal price levels where the market has historically
            struggled to break through. Support acts as a floor where buyers step in, while
            resistance acts as a ceiling where sellers take control. These levels form because
            traders remember past prices and react at the same zones again and again.
          </p>
          <p className="text-slate-300 leading-relaxed">
            The best trades often happen at these key levels. When price bounces off support, it
            signals buyer strength. When it rejects resistance, sellers are in charge. At FX
            Research Desk, we mark these levels on every chart before sending a signal so you
            know exactly where the market is likely to react.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 mt-12">Trendlines</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Trendlines connect higher lows in an uptrend or lower highs in a downtrend, showing
            you the direction of momentum. A rising trendline in an uptrend acts as dynamic
            support — price tends to bounce off it until the trend breaks. Drawing trendlines
            takes practice, but even two clean touch points can give you a powerful edge.
          </p>
          <p className="text-slate-300 leading-relaxed">
            You can trade two setups with trendlines: bounces and breaks. A bounce means buying
            at the trendline in an uptrend or selling at the trendline in a downtrend. A break
            means the trend is reversing — price closes beyond the trendline with conviction,
            signaling a potential new direction. Our signals often combine trendline analysis
            with support/resistance for high-probability entries.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 mt-12">Candlestick Patterns</h2>
          <p className="text-slate-300 leading-relaxed">
            Candlestick patterns reveal the battle between buyers and sellers in a single glance.
            Bullish engulfing patterns show buyers overwhelming sellers. Pin bars (long wicks with
            small bodies) signal rejection at key levels. Doji candles indicate indecision and
            often appear before reversals. Learning even three or four reliable patterns can
            dramatically improve your entry timing.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 mt-12">Key Indicators</h2>
          <p className="text-slate-300 leading-relaxed">
            RSI (Relative Strength Index) measures momentum on a scale of 0 to 100. Readings above
            70 suggest overbought conditions; below 30 suggests oversold. MACD (Moving Average
            Convergence Divergence) tracks trend direction and momentum shifts through its signal
            line crossovers. We use RSI to confirm reversals at key levels and MACD to validate
            trend strength — never as standalone signals, but as confluence tools alongside price
            action.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 mt-12">Putting It Together</h2>
          <ul className="space-y-3">
            {puttingItTogether.map((item) => (
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
