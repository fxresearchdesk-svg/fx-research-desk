import type { Metadata } from "next";
import { NewsPageClient } from "./news-client";

export const metadata: Metadata = {
  title: "Forex & Market News | FX Research Desk",
  description:
    "Latest forex, currency trading, and market intelligence from trusted sources.",
};

export default function NewsPage() {
  return <NewsPageClient />;
}
