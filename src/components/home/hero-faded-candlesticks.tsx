type FadedCandle = {
  type: "green" | "red";
  left: number;
  bottom: number;
  bodyHeight: number;
  bodyWidth: 8 | 10 | 12;
  wickTop: number;
  wickBottom: number;
  zIndex: number;
};

const CANDLES: FadedCandle[] = [
  { type: "green", left: 4, bottom: 8, bodyHeight: 52, bodyWidth: 10, wickTop: 18, wickBottom: 14, zIndex: 2 },
  { type: "green", left: 10, bottom: 14, bodyHeight: 68, bodyWidth: 8, wickTop: 22, wickBottom: 16, zIndex: 3 },
  { type: "red", left: 16, bottom: 10, bodyHeight: 40, bodyWidth: 8, wickTop: 15, wickBottom: 20, zIndex: 1 },
  { type: "green", left: 22, bottom: 18, bodyHeight: 84, bodyWidth: 12, wickTop: 24, wickBottom: 18, zIndex: 4 },
  { type: "green", left: 28, bottom: 26, bodyHeight: 96, bodyWidth: 10, wickTop: 20, wickBottom: 22, zIndex: 5 },
  { type: "red", left: 34, bottom: 20, bodyHeight: 48, bodyWidth: 8, wickTop: 17, wickBottom: 15, zIndex: 3 },
  { type: "green", left: 40, bottom: 30, bodyHeight: 110, bodyWidth: 10, wickTop: 28, wickBottom: 19, zIndex: 6 },
  { type: "green", left: 46, bottom: 38, bodyHeight: 72, bodyWidth: 8, wickTop: 16, wickBottom: 24, zIndex: 4 },
  { type: "red", left: 52, bottom: 32, bodyHeight: 56, bodyWidth: 10, wickTop: 22, wickBottom: 17, zIndex: 5 },
  { type: "green", left: 58, bottom: 42, bodyHeight: 128, bodyWidth: 12, wickTop: 30, wickBottom: 21, zIndex: 7 },
  { type: "green", left: 64, bottom: 50, bodyHeight: 88, bodyWidth: 10, wickTop: 19, wickBottom: 26, zIndex: 6 },
  { type: "red", left: 70, bottom: 44, bodyHeight: 44, bodyWidth: 8, wickTop: 15, wickBottom: 18, zIndex: 4 },
  { type: "green", left: 76, bottom: 54, bodyHeight: 140, bodyWidth: 12, wickTop: 26, wickBottom: 28, zIndex: 8 },
  { type: "green", left: 82, bottom: 62, bodyHeight: 102, bodyWidth: 10, wickTop: 24, wickBottom: 20, zIndex: 7 },
  { type: "red", left: 88, bottom: 56, bodyHeight: 62, bodyWidth: 8, wickTop: 18, wickBottom: 22, zIndex: 5 },
  { type: "green", left: 92, bottom: 68, bodyHeight: 118, bodyWidth: 10, wickTop: 22, wickBottom: 25, zIndex: 9 },
  { type: "green", left: 86, bottom: 74, bodyHeight: 76, bodyWidth: 8, wickTop: 17, wickBottom: 19, zIndex: 6 },
  { type: "green", left: 78, bottom: 80, bodyHeight: 150, bodyWidth: 12, wickTop: 30, wickBottom: 27, zIndex: 10 },
];

function FadedCandlestick({ candle }: { candle: FadedCandle }) {
  const color = candle.type === "green" ? "#4A7C59" : "#8B3A3A";

  return (
    <div
      className="absolute flex flex-col items-center justify-end"
      style={{
        left: `${candle.left}%`,
        bottom: `${candle.bottom}%`,
        zIndex: candle.zIndex,
      }}
    >
      <div
        className="w-[1px] shrink-0"
        style={{ height: candle.wickTop, backgroundColor: color }}
      />
      <div
        className="shrink-0 rounded-[1px]"
        style={{
          width: candle.bodyWidth,
          height: candle.bodyHeight,
          backgroundColor: color,
        }}
      />
      <div
        className="w-[1px] shrink-0"
        style={{ height: candle.wickBottom, backgroundColor: color }}
      />
    </div>
  );
}

export function HeroFadedCandlesticks() {
  return (
    <div
      className="relative h-full min-h-[280px] w-full opacity-15 transition-opacity duration-500 ease-in-out hover:opacity-30 lg:min-h-[600px]"
      aria-hidden
    >
      {CANDLES.map((candle, i) => (
        <FadedCandlestick key={i} candle={candle} />
      ))}
    </div>
  );
}
