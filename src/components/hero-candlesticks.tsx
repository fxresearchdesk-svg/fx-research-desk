type Candle = {
  type: "green" | "red";
  bodyHeight: number;
  wickTop: number;
  wickBottom: number;
};

const CANDLES: Candle[] = [
  { type: "green", bodyHeight: 120, wickTop: 28, wickBottom: 22 },
  { type: "red", bodyHeight: 40, wickTop: 18, wickBottom: 15 },
  { type: "green", bodyHeight: 80, wickTop: 22, wickBottom: 20 },
  { type: "red", bodyHeight: 110, wickTop: 30, wickBottom: 24 },
  { type: "green", bodyHeight: 45, wickTop: 16, wickBottom: 17 },
  { type: "red", bodyHeight: 75, wickTop: 25, wickBottom: 19 },
  { type: "green", bodyHeight: 120, wickTop: 26, wickBottom: 28 },
];

function Candlestick({
  candle,
  index,
}: {
  candle: Candle;
  index: number;
}) {
  const color = candle.type === "green" ? "#4A7C59" : "#8B3A3A";

  return (
    <div
      className="hero-candle-animate flex flex-col items-center justify-end"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div
        className="w-[2px] shrink-0"
        style={{ height: candle.wickTop, backgroundColor: color }}
      />
      <div
        className="w-[10px] shrink-0 rounded-[1px]"
        style={{ height: candle.bodyHeight, backgroundColor: color }}
      />
      <div
        className="w-[2px] shrink-0"
        style={{ height: candle.wickBottom, backgroundColor: color }}
      />
    </div>
  );
}

export function HeroCandlesticks() {
  return (
    <div
      className="flex h-[400px] w-full max-w-lg items-end justify-center gap-8 opacity-40 transition-opacity duration-300 hover:opacity-60"
      aria-hidden
    >
      {CANDLES.map((candle, i) => (
        <Candlestick key={i} candle={candle} index={i} />
      ))}
    </div>
  );
}
