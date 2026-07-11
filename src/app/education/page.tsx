import type { Metadata } from "next";
import { EducationPageClient } from "./education-client";

export const metadata: Metadata = {
  title: "Education & Trading Guides | FX Research Desk",
  description:
    "Master forex markets with professional guides on risk management, technical analysis, and trading psychology.",
};

export default function EducationIndexPage() {
  return <EducationPageClient />;
}
