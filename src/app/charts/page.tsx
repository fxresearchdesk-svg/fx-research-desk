import type { Metadata } from "next";
import { ChartsPageClient } from "./charts-client";

export const metadata: Metadata = {
  title: "Live Market Charts | FX Research Desk",
  description:
    "Institutional-grade live charts with real-time technical analysis across major forex pairs and precious metals.",
};

export default function ChartsPage() {
  return <ChartsPageClient />;
}
