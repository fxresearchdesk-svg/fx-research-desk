import type { Metadata } from "next";
import { EducationLayout } from "@/components/education-layout";

export const metadata: Metadata = {
  title: "Understanding Forex Correlations | FX Research Desk",
  description:
    "How EUR/USD, GBP/USD, and USD/JPY move together and apart — and how to use correlations in risk management.",
};

export default function ForexCorrelationsPage() {
  return (
    <EducationLayout
      title="Understanding Forex Correlations"
      subtitle="How major pairs move together — and when they diverge."
      date="Draft — full article coming soon"
    >
      <section>
        <h2>Overview</h2>
        <p>
          How EUR/USD, GBP/USD, and USD/JPY move together and apart. Correlation
          awareness helps you avoid doubling risk across related positions and
          spot when a cross is leading or lagging the dollar.
        </p>
        <p className="italic text-[#9A9488]">
          Full article copy will be published here shortly. This page is a live
          stub so the education index links correctly.
        </p>
      </section>
    </EducationLayout>
  );
}
