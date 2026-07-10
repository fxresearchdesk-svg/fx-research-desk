import type { Metadata } from "next";
import { ChartsPageClient } from "./charts-client";

export const metadata: Metadata = {
  title: "Live Market Charts | FX Research Desk",
  description:
    "Professional-grade TradingView charts for real-time technical analysis across major forex pairs and metals.",
};

export default function ChartsPage() {
  return <ChartsPageClient />;
}
