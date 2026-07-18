import type { Metadata } from "next";
import { EducationLayout } from "@/components/education-layout";

export const metadata: Metadata = {
  title: "Central Bank Policy & FX Markets | FX Research Desk",
  description:
    "How Fed, ECB, and BoJ decisions move currency prices — and how traders prepare around policy events.",
};

export default function CentralBankPolicyPage() {
  return (
    <EducationLayout
      title="Central Bank Policy & FX Markets"
      subtitle="How Fed, ECB, and BoJ decisions move currency prices."
      date="Draft — full article coming soon"
    >
      <section>
        <h2>Overview</h2>
        <p>
          Monetary policy is one of the primary drivers of FX trends. Rate paths,
          balance-sheet guidance, and communication tone all feed into dollar,
          euro, and yen pricing — especially around FOMC, ECB, and BoJ events.
        </p>
        <p className="italic text-[#9A9488]">
          Full article copy will be published here shortly. This page is a live
          stub so the education index links correctly.
        </p>
      </section>
    </EducationLayout>
  );
}
