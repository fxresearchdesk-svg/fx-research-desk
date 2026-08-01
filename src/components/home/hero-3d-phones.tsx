"use client";

import { useEffect, useId, useState } from "react";
import {
  calcChangePercent,
  fetchUsdRates,
  getEurUsd,
  isValidPrice,
} from "@/lib/fx-rates";
import "./hero-3d-phones.css";

const POLL_MS = 60 * 1000;

type PhoneSignal = {
  pair: string;
  direction: "BUY" | "SELL";
  entry: string;
  stopLoss: string;
  takeProfit: string;
  note: string;
};

const FRONT: PhoneSignal = {
  pair: "EUR/USD",
  direction: "BUY",
  entry: "1.0842",
  stopLoss: "1.0810",
  takeProfit: "1.0910",
  note: "Illustrative setup · live market price",
};

const WATCHLIST = [
  { pair: "GBP/USD", change: "+0.08%", up: true },
  { pair: "USD/JPY", change: "−0.12%", up: false },
  { pair: "XAU/USD", change: "+0.21%", up: true },
] as const;

const TELEGRAM_BUBBLES = [
  {
    title: "NEW SIGNAL — EUR/USD",
    action: "BUY @ 1.0842",
    tone: "buy" as const,
    detail: "SL 1.0810 · TP 1.0910",
    time: "10:42",
  },
  {
    title: "NEW SIGNAL — GBP/USD",
    action: "SELL @ 1.3462",
    tone: "sell" as const,
    detail: "SL 1.3498 · TP 1.3390",
    time: "11:08",
  },
];

const SPARK_LINE =
  "M0 26 L10 24 L20 25 L30 20 L40 22 L50 16 L60 18 L70 12 L80 14 L90 9 L100 7";
const SPARK_AREA = `${SPARK_LINE} L100 36 L0 36 Z`;

function MiniChart({
  label,
  value,
  color,
  valueClassName,
}: {
  label: string;
  value: string;
  color: string;
  valueClassName?: string;
}) {
  const reactId = useId();
  const fillId = `spark-fill-${reactId.replace(/:/g, "")}`;

  return (
    <div className="hero-phones__card hero-phones__card--chart" data-chart>
      <div className="hero-phones__chart-head">
        <p className="hero-phones__chart-label">{label}</p>
        <p
          className={
            valueClassName
              ? `hero-phones__chart-value ${valueClassName}`
              : "hero-phones__chart-value"
          }
        >
          {value}
        </p>
      </div>
      <svg
        className="hero-phones__spark"
        viewBox="0 0 100 36"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={SPARK_AREA} fill={`url(#${fillId})`} />
        <path
          d={SPARK_LINE}
          fill="none"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function Watchlist() {
  return (
    <div className="hero-phones__card hero-phones__card--watch">
      {WATCHLIST.map((row) => (
        <div key={row.pair} className="hero-phones__watch-row">
          <span className="hero-phones__watch-pair">{row.pair}</span>
          <span
            className={
              row.up
                ? "hero-phones__watch-chg is-up"
                : "hero-phones__watch-chg is-down"
            }
          >
            {row.change}
          </span>
        </div>
      ))}
    </div>
  );
}

function FrontPhoneFace({
  livePrice,
  change,
}: {
  livePrice: string | null;
  change: number | null;
}) {
  const changeClass =
    change == null || change === 0
      ? ""
      : change > 0
        ? "is-up"
        : "is-down";
  const changeText =
    change == null
      ? "—"
      : `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;

  return (
    <div className="hero-phones__phone-inner">
      <div className="hero-phones__notch" aria-hidden />
      <div className="hero-phones__screen">
        <div className="hero-phones__body">
          <div className="hero-phones__header">
            <div className="hero-phones__avatar">Fx</div>
            <div className="hero-phones__channel">
              <p className="hero-phones__channel-name">FX Research Desk</p>
              <p className="hero-phones__channel-sub">VIP Signals</p>
            </div>
          </div>

          <div className="hero-phones__card hero-phones__card--signal">
            <div className="hero-phones__pair-row">
              <p className="hero-phones__pair">{FRONT.pair}</p>
              <span className="hero-phones__badge hero-phones__badge--buy">
                {FRONT.direction}
              </span>
            </div>
            <p className="hero-phones__live-label">Live price</p>
            <p className="hero-phones__price" data-live-price>
              {livePrice ?? "—"}
            </p>
            <p className={`hero-phones__price-meta ${changeClass}`}>
              {changeText}
            </p>
            <div className="hero-phones__rows">
              <div className="hero-phones__row">
                <span className="hero-phones__row-k">Entry</span>
                <span className="hero-phones__row-v">{FRONT.entry}</span>
              </div>
              <div className="hero-phones__row">
                <span className="hero-phones__row-k">SL</span>
                <span className="hero-phones__row-v">{FRONT.stopLoss}</span>
              </div>
              <div className="hero-phones__row">
                <span className="hero-phones__row-k">TP</span>
                <span className="hero-phones__row-v">{FRONT.takeProfit}</span>
              </div>
            </div>
          </div>

          <MiniChart
            label="24H Performance"
            value="+0.14%"
            color="#6FCF97"
          />
          <Watchlist />
          <p className="hero-phones__footnote">{FRONT.note}</p>
        </div>
      </div>
    </div>
  );
}

function BackPhoneFace() {
  return (
    <div className="hero-phones__phone-inner">
      <div className="hero-phones__notch" aria-hidden />
      <div className="hero-phones__screen">
        <div className="hero-phones__body">
          <div className="hero-phones__header">
            <div className="hero-phones__avatar">Fx</div>
            <div className="hero-phones__channel">
              <p className="hero-phones__channel-name">FX Research Desk</p>
              <p className="hero-phones__channel-sub">VIP Signals Channel</p>
            </div>
          </div>

          <div className="hero-phones__bubbles">
            {TELEGRAM_BUBBLES.map((bubble) => (
              <div key={bubble.title} className="hero-phones__bubble">
                <p className="hero-phones__bubble-title">{bubble.title}</p>
                <p
                  className={
                    bubble.tone === "buy"
                      ? "hero-phones__bubble-line hero-phones__bubble-line--buy"
                      : "hero-phones__bubble-line hero-phones__bubble-line--sell"
                  }
                >
                  {bubble.action}
                </p>
                <p className="hero-phones__bubble-line">{bubble.detail}</p>
                <p className="hero-phones__bubble-meta">{bubble.time} ✓✓</p>
              </div>
            ))}
          </div>

          <MiniChart
            label="Weekly Pips"
            value="+410"
            color="#D7B36A"
            valueClassName="hero-phones__chart-value--gold"
          />
        </div>
      </div>
    </div>
  );
}

export function Hero3dPhones() {
  const [livePrice, setLivePrice] = useState<string | null>(null);
  const [change, setChange] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let previous: number | null = null;

    async function poll() {
      const rates = await fetchUsdRates();
      if (cancelled || !rates) return;
      const price = getEurUsd(rates);
      if (!isValidPrice(price)) return;
      const pct = calcChangePercent(price, previous);
      previous = price;
      setLivePrice(price.toFixed(4));
      if (pct !== null) setChange(pct);
    }

    void poll();
    const id = window.setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return (
    <div className="hero-phones" aria-label="Signal phone mockups">
      <div className="hero-phones__stage">
        <div
          className="hero-phones__phone hero-phones__phone--back"
          aria-hidden
        >
          <BackPhoneFace />
        </div>
        <div className="hero-phones__phone hero-phones__phone--front">
          <FrontPhoneFace livePrice={livePrice} change={change} />
        </div>
      </div>
    </div>
  );
}
