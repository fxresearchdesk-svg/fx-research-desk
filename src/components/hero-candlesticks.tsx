type Candle = {
  type: "green" | "red";
  bodyHeight: number;
  wickTop: number;
  wickBottom: number;
};

const CANDLES: Candle[] = [
  { type: "green", bodyHeight: 36, wickTop: 14, wickBottom: 10 },
  { type: "green", bodyHeight: 48, wickTop: 12, wickBottom: 8 },
  { type: "green", bodyHeight: 32, wickTop: 10, wickBottom: 12 },
  { type: "red", bodyHeight: 24, wickTop: 16, wickBottom: 10 },
  { type: "red", bodyHeight: 20, wickTop: 12, wickBottom: 14 },
  { type: "green", bodyHeight: 40, wickTop: 10, wickBottom: 8 },
  { type: "red", bodyHeight: 28, wickTop: 18, wickBottom: 10 },
  { type: "red", bodyHeight: 22, wickTop: 14, wickBottom: 12 },
  { type: "green", bodyHeight: 44, wickTop: 12, wickBottom: 10 },
];

function Candlestick({ candle }: { candle: Candle }) {
  const color = candle.type === "green" ? "#4A7C59" : "#8B3A3A";

  return (
    <div className="flex flex-col items-center justify-end">
      <div
        className="w-[1px] shrink-0"
        style={{ height: candle.wickTop, backgroundColor: color }}
      />
      <div
        className="w-[6px] shrink-0 rounded-[1px]"
        style={{ height: candle.bodyHeight, backgroundColor: color }}
      />
      <div
        className="w-[1px] shrink-0"
        style={{ height: candle.wickBottom, backgroundColor: color }}
      />
    </div>
  );
}

export function HeroCandlesticks() {
  return (
    <div
      className="flex h-[300px] w-full max-w-md items-end justify-center gap-6 opacity-40 transition-opacity duration-300 hover:opacity-60 lg:max-w-lg"
      aria-hidden
    >
      {CANDLES.map((candle, i) => (
        <Candlestick key={i} candle={candle} />
      ))}
    </div>
  );
}
