const FXAPI_REST_URL = "https://fxapi.app/api/USD.json";

export type HeroPair = "EUR/USD" | "GBP/USD" | "XAU/USD";

export function isValidPrice(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

export function formatPairPrice(price: number, pair: HeroPair): string {
  if (pair === "XAU/USD") return price.toFixed(2);
  return price.toFixed(4);
}

export async function fetchMetalRate(pair: "XAU/USD" | "XAG/USD"): Promise<number | null> {
  try {
    const res = await fetch(`https://fxapi.app/api/${pair}.json`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { rate?: number };
    const rate = data.rate;
    if (!isValidPrice(rate)) return null;
    if (pair === "XAU/USD" && rate >= 1500 && rate <= 6000) return rate;
    if (pair === "XAG/USD" && rate >= 10 && rate <= 200) return rate;
    return null;
  } catch {
    return null;
  }
}

export async function fetchUsdRates(): Promise<Record<string, number> | null> {
  try {
    const res = await fetch(FXAPI_REST_URL, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { rates: Record<string, number> };
    return data.rates ?? null;
  } catch {
    return null;
  }
}

export function getEurUsd(rates: Record<string, number>): number | null {
  const eur = rates.EUR;
  return eur > 0 ? 1 / eur : null;
}

export function getGbpUsd(rates: Record<string, number>): number | null {
  const gbp = rates.GBP;
  return gbp > 0 ? 1 / gbp : null;
}

export function calcChangePercent(
  current: number,
  previous: number | null
): number | null {
  if (previous === null || previous <= 0) return null;
  return ((current - previous) / previous) * 100;
}

export type HeroPriceSnapshot = {
  eurUsd: number | null;
  gbpUsd: number | null;
  xauUsd: number | null;
};

export async function fetchHeroPrices(): Promise<HeroPriceSnapshot> {
  const [rates, gold] = await Promise.all([
    fetchUsdRates(),
    fetchMetalRate("XAU/USD"),
  ]);

  return {
    eurUsd: rates ? getEurUsd(rates) : null,
    gbpUsd: rates ? getGbpUsd(rates) : null,
    xauUsd: gold,
  };
}
