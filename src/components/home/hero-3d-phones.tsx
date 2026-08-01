"use client";

import { useEffect, useState } from "react";
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

const BACK: PhoneSignal = {
  pair: "GBP/USD",
  direction: "SELL",
  entry: "1.3462",
  stopLoss: "1.3498",
  takeProfit: "1.3390",
  note: "VIP Signals Channel",
};

function PhoneFace({
  signal,
  livePrice,
  change,
}: {
  signal: PhoneSignal;
  livePrice?: string | null;
  change?: number | null;
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

          <div className="hero-phones__card">
            <div className="hero-phones__pair-row">
              <p className="hero-phones__pair">{signal.pair}</p>
              <span
                className={
                  signal.direction === "BUY"
                    ? "hero-phones__badge hero-phones__badge--buy"
                    : "hero-phones__badge hero-phones__badge--sell"
                }
              >
                {signal.direction}
              </span>
            </div>

            {livePrice !== undefined && (
              <>
                <p className="hero-phones__live-label">Live price</p>
                <p className="hero-phones__price" data-live-price>
                  {livePrice ?? "—"}
                </p>
                <p className={`hero-phones__price-meta ${changeClass}`}>
                  {changeText}
                </p>
              </>
            )}

            <div className="hero-phones__rows">
              <div className="hero-phones__row">
                <span className="hero-phones__row-k">Entry</span>
                <span className="hero-phones__row-v">{signal.entry}</span>
              </div>
              <div className="hero-phones__row">
                <span className="hero-phones__row-k">SL</span>
                <span className="hero-phones__row-v">{signal.stopLoss}</span>
              </div>
              <div className="hero-phones__row">
                <span className="hero-phones__row-k">TP</span>
                <span className="hero-phones__row-v">{signal.takeProfit}</span>
              </div>
            </div>
          </div>

          <p className="hero-phones__footnote">{signal.note}</p>
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
          <PhoneFace signal={BACK} />
        </div>
        <div className="hero-phones__phone hero-phones__phone--front">
          <PhoneFace signal={FRONT} livePrice={livePrice} change={change} />
        </div>
      </div>
    </div>
  );
}
