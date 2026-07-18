"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  calcChangePercent,
  fetchUsdRates,
  isValidPrice,
} from "@/lib/fx-rates";
import { cn } from "@/lib/utils";

const CYCLE_MS = 3200;
const RESUME_MS = 4000;
const POLL_MS = 60 * 1000;
const TRANSITION = "transform 0.65s ease-out, opacity 0.65s ease-out, filter 0.65s ease-out";

type CarouselPair = "EUR/USD" | "GBP/USD" | "USD/JPY";

type Slide = {
  pair: CarouselPair;
  direction: "BUY" | "SELL";
  entry: string;
  stopLoss: string;
  takeProfit: string;
};

const SLIDES: Slide[] = [
  {
    pair: "EUR/USD",
    direction: "BUY",
    entry: "1.0842",
    stopLoss: "1.0810",
    takeProfit: "1.0910",
  },
  {
    pair: "GBP/USD",
    direction: "SELL",
    entry: "1.3462",
    stopLoss: "1.3498",
    takeProfit: "1.3390",
  },
  {
    pair: "USD/JPY",
    direction: "BUY",
    entry: "149.50",
    stopLoss: "148.80",
    takeProfit: "150.80",
  },
];

type LiveQuote = {
  price: number | null;
  change: number | null;
  direction: "up" | "down" | "flat";
};

function formatLivePrice(pair: CarouselPair, price: number): string {
  if (pair === "USD/JPY") return price.toFixed(2);
  return price.toFixed(4);
}

function getPriceFromRates(
  pair: CarouselPair,
  rates: Record<string, number>
): number | null {
  if (pair === "EUR/USD") {
    return rates.EUR > 0 ? 1 / rates.EUR : null;
  }
  if (pair === "GBP/USD") {
    return rates.GBP > 0 ? 1 / rates.GBP : null;
  }
  return isValidPrice(rates.JPY) ? rates.JPY : null;
}

function stackStyle(offset: number, reduceMotion: boolean): CSSProperties {
  if (reduceMotion) {
    return offset === 0
      ? { opacity: 1, transform: "translate(-50%, 0) rotate(-2deg)", zIndex: 3 }
      : {
          opacity: 0,
          transform: "translate(-50%, 12px) scale(0.96)",
          zIndex: 0,
          pointerEvents: "none",
        };
  }

  if (offset === 0) {
    return {
      opacity: 1,
      transform: "translate(-50%, 0) rotate(-2.5deg) scale(1)",
      zIndex: 3,
      filter: "none",
    };
  }
  if (offset === 1) {
    return {
      opacity: 0.5,
      transform: "translate(calc(-50% + 28px), 14px) rotate(5deg) scale(0.94)",
      zIndex: 2,
      filter: "grayscale(0.35)",
    };
  }
  return {
    opacity: 0.42,
    transform: "translate(calc(-50% - 28px), 18px) rotate(-7deg) scale(0.92)",
    zIndex: 1,
    filter: "grayscale(0.45)",
  };
}

function TicketCard({
  slide,
  live,
  style,
  reduceMotion,
  isActive,
}: {
  slide: Slide;
  live: LiveQuote;
  style: CSSProperties;
  reduceMotion: boolean;
  isActive: boolean;
}) {
  const isBuy = slide.direction === "BUY";
  const priceColor =
    live.direction === "up"
      ? "text-[#3C7A5C]"
      : live.direction === "down"
        ? "text-[#A6483C]"
        : "text-[#0E0F13]";

  return (
    <article
      className="absolute left-1/2 top-0 w-[min(100%,320px)] border border-[#E7E3D8] bg-white p-[22px_24px] shadow-[0_30px_60px_-20px_rgba(14,15,19,0.25)]"
      style={{
        ...style,
        transition: reduceMotion ? undefined : TRANSITION,
      }}
      aria-hidden={!isActive}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[16px] font-extrabold tracking-wide text-[#0E0F13]">
            {slide.pair}
          </p>
          <div className="mt-1.5 flex items-center gap-2 font-data text-[13px] tabular-nums">
            {live.price != null ? (
              <>
                <span className={cn("font-bold", priceColor)}>
                  {live.direction === "up" && "▲ "}
                  {live.direction === "down" && "▼ "}
                  {formatLivePrice(slide.pair, live.price)}
                </span>
                {live.change != null && (
                  <span className={cn("text-[11px] font-semibold", priceColor)}>
                    {live.change > 0 ? "+" : ""}
                    {live.change.toFixed(2)}%
                  </span>
                )}
              </>
            ) : (
              <span className="text-[11px] text-[#9A9488]">Fetching live…</span>
            )}
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 px-2.5 py-1 text-[11px] font-extrabold tracking-[0.12em] text-white",
            isBuy ? "bg-[#3C7A5C]" : "bg-[#A6483C]"
          )}
        >
          {slide.direction}
        </span>
      </div>

      <div className="font-data text-[13.5px]">
        <div className="flex justify-between border-b border-dashed border-[#E7E3D8] py-1.5">
          <span className="text-[11.5px] font-semibold tracking-[0.08em] text-[#4A463C]">
            ENTRY
          </span>
          <span className="font-bold tabular-nums text-[#0E0F13]">{slide.entry}</span>
        </div>
        <div className="flex justify-between border-b border-dashed border-[#E7E3D8] py-1.5">
          <span className="text-[11.5px] font-semibold tracking-[0.08em] text-[#4A463C]">
            STOP LOSS
          </span>
          <span className="font-bold tabular-nums text-[#0E0F13]">{slide.stopLoss}</span>
        </div>
        <div className="flex justify-between py-1.5">
          <span className="text-[11.5px] font-semibold tracking-[0.08em] text-[#4A463C]">
            TAKE PROFIT
          </span>
          <span className="font-bold tabular-nums text-[#3C7A5C]">{slide.takeProfit}</span>
        </div>
      </div>

      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9A9488]">
        Illustrative Setup · Live Market Price
      </p>
    </article>
  );
}

export function HeroTicketCarousel() {
  const [active, setActive] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [quotes, setQuotes] = useState<Record<CarouselPair, LiveQuote>>({
    "EUR/USD": { price: null, change: null, direction: "flat" },
    "GBP/USD": { price: null, change: null, direction: "flat" },
    "USD/JPY": { price: null, change: null, direction: "flat" },
  });

  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionOpenRef = useRef<Partial<Record<CarouselPair, number>>>({});
  const stackElRef = useRef<HTMLDivElement>(null);

  const loadQuotes = useCallback(async () => {
    const rates = await fetchUsdRates();
    if (!rates) return;

    setQuotes((prev) => {
      const next = { ...prev };
      (Object.keys(next) as CarouselPair[]).forEach((pair) => {
        const price = getPriceFromRates(pair, rates);
        if (!isValidPrice(price)) return;

        if (!sessionOpenRef.current[pair]) {
          sessionOpenRef.current[pair] = price;
        }
        const open = sessionOpenRef.current[pair] ?? null;
        const change = calcChangePercent(price, open);
        next[pair] = {
          price,
          change,
          direction:
            change === null || Math.abs(change) < 0.0001
              ? "flat"
              : change > 0
                ? "up"
                : "down",
        };
      });
      return next;
    });
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    loadQuotes();
    const id = setInterval(loadQuotes, POLL_MS);
    return () => clearInterval(id);
  }, [loadQuotes]);

  useEffect(() => {
    if (reduceMotion) return;

    const id = setInterval(() => {
      if (pausedRef.current) return;
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, CYCLE_MS);

    return () => clearInterval(id);
  }, [reduceMotion]);

  function pause() {
    pausedRef.current = true;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  }

  function scheduleResume() {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_MS);
  }

  return (
    <div className="mx-auto w-full max-w-[380px] lg:ml-auto lg:mr-0">
      <div
        ref={stackElRef}
        id="stack"
        className="relative mx-auto h-[300px] w-full"
        onMouseEnter={pause}
        onMouseLeave={scheduleResume}
        onTouchStart={pause}
        onTouchEnd={scheduleResume}
      >
        {SLIDES.map((slide, index) => {
          const raw = (index - active + SLIDES.length) % SLIDES.length;
          const signed = raw === 0 ? 0 : raw === 1 ? 1 : -1;

          return (
            <TicketCard
              key={slide.pair}
              slide={slide}
              live={quotes[slide.pair]}
              reduceMotion={reduceMotion}
              isActive={signed === 0}
              style={stackStyle(signed, reduceMotion)}
            />
          );
        })}
      </div>

      {!reduceMotion && (
        <div className="mt-5 flex items-center justify-center gap-2" role="tablist" aria-label="Signal slides">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.pair}
              type="button"
              role="tab"
              aria-selected={active === index}
              aria-label={`Show ${slide.pair}`}
              onClick={() => {
                pause();
                setActive(index);
                scheduleResume();
              }}
              className={cn(
                "landing-focus h-2 rounded-full transition-all duration-300",
                active === index
                  ? "w-6 bg-[#C6A15B]"
                  : "w-2 bg-[#E7E3D8] hover:bg-[#C6A15B]/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
