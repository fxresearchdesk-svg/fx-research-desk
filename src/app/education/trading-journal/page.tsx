import type { Metadata } from "next";
import { EducationLayout } from "@/components/education-layout";

export const metadata: Metadata = {
  title: "Building a Trading Journal | FX Research Desk",
  description:
    "Track, review, and improve every trade with a data-driven journal framework.",
};

export default function TradingJournalPage() {
  return (
    <EducationLayout
      title="Building a Trading Journal"
      subtitle="Track, review, and improve every trade with data-driven analysis."
      date="Draft — full article coming soon"
    >
      <section>
        <h2>Overview</h2>
        <p>
          A trading journal turns gut feel into measurable process. Logging
          setups, risk, outcomes, and emotions lets you see which edge is real —
          and which habits quietly drain the account.
        </p>
        <p className="italic text-[#9A9488]">
          Full article copy will be published here shortly. This page is a live
          stub so the education index links correctly.
        </p>
      </section>
    </EducationLayout>
  );
}
