export const telegramUrl = "https://t.me/fxresearchdesk";

export const navLinks = [
  { href: "/charts", label: "CHARTS" },
  { href: "/#performance", label: "PERFORMANCE" },
  { href: "/#pricing", label: "PRICING" },
  { href: "/#education", label: "EDUCATION" },
  { href: "/#insights", label: "INSIGHTS" },
] as const;

export const chartPairs = [
  { label: "EUR/USD", symbol: "FX:EURUSD" },
  { label: "GBP/USD", symbol: "FX:GBPUSD" },
  { label: "USD/JPY", symbol: "FX:USDJPY" },
  { label: "USD/CHF", symbol: "FX:USDCHF" },
  { label: "AUD/USD", symbol: "FX:AUDUSD" },
  { label: "USD/CAD", symbol: "FX:USDCAD" },
  { label: "NZD/USD", symbol: "FX:NZDUSD" },
  { label: "EUR/GBP", symbol: "FX:EURGBP" },
  { label: "XAU/USD", symbol: "TVC:GOLD" },
  { label: "XAG/USD", symbol: "TVC:SILVER" },
] as const;

export const tradingViewWatchlist = [
  "FX:EURUSD",
  "FX:GBPUSD",
  "FX:USDJPY",
  "FX:USDCHF",
  "FX:AUDUSD",
  "FX:USDCAD",
  "FX:NZDUSD",
  "FX:EURGBP",
  "TVC:GOLD",
  "TVC:SILVER",
] as const;
