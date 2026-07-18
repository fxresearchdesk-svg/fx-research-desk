import type { Metadata } from "next";
import { EducationLayout } from "@/components/education-layout";

export const metadata: Metadata = {
  title: "Gold (XAU/USD) Trading Strategy | FX Research Desk",
  description:
    "Safe-haven flows, dollar inverse, and key technical levels for trading XAU/USD.",
};

export default function GoldStrategyPage() {
  return (
    <EducationLayout
      title="Gold (XAU/USD) Trading Strategy"
      subtitle="Safe-haven flows, dollar inverse, and key technical levels."
      date="Draft — full article coming soon"
    >
      <section>
        <h2>Overview</h2>
        <p>
          Gold sits at the intersection of dollar pricing, real yields, and risk
          sentiment. Understanding those drivers — alongside clean technical
          structure — is the foundation of a disciplined XAU/USD approach.
        </p>
        <p className="italic text-[#9A9488]">
          Full article copy will be published here shortly. This page is a live
          stub so the education index links correctly.
        </p>
      </section>
    </EducationLayout>
  );
}
