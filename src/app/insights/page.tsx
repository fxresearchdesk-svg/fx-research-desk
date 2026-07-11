import type { Metadata } from "next";
import { InsightsPageClient } from "./insights-client";

export const metadata: Metadata = {
  title: "Market Insights & Weekly Outlook | FX Research Desk",
  description:
    "Weekly forex market intelligence, pair outlooks, and macro commentary from FX Research Desk.",
};

export default function InsightsPage() {
  return <InsightsPageClient />;
}
