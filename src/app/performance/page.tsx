import type { Metadata } from "next";
import { PerformancePageClient } from "./performance-client";

export const metadata: Metadata = {
  title: "Verified Performance | FX Research Desk",
  description:
    "Live track record with verified win rate, pips, and recent trades from our forex signal service.",
};

export default function PerformancePage() {
  return <PerformancePageClient />;
}
