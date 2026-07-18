"use client";

import { useEffect, useState } from "react";
import { LandingFooter } from "@/components/home/landing-footer";
import { LandingHeader } from "@/components/home/landing-header";
import { LandingHero } from "@/components/home/landing-hero";
import { LandingHowItWorks } from "@/components/home/landing-how-it-works";
import { LandingPricing } from "@/components/home/landing-pricing";
import { LandingTestimonial } from "@/components/home/landing-testimonial";
import { LandingTrustStrip } from "@/components/home/landing-trust-strip";
import { LandingUtilityBar } from "@/components/home/landing-utility-bar";
import { LandingWhatYouReceive } from "@/components/home/landing-what-you-receive";
import {
  fetchTestimonials,
  isSupabaseConfigured,
} from "@/lib/supabase";
import type { Testimonial } from "@/lib/types";

const FEATURED_TESTIMONIAL = {
  quote:
    "The precision of these signals transformed my trading. This is not retail — this is institutional execution.",
  name: "Ahmed K.",
  location: "Dubai",
  memberSince: "2024",
};

export default function Home() {
  const [liveTestimonials, setLiveTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    fetchTestimonials().then(setLiveTestimonials).catch(() => undefined);
  }, []);

  const featured = liveTestimonials[0]
    ? {
        quote: liveTestimonials[0].quote,
        name: liveTestimonials[0].name,
        location: liveTestimonials[0].location ?? "",
        memberSince: new Date(liveTestimonials[0].created_at)
          .getFullYear()
          .toString(),
      }
    : FEATURED_TESTIMONIAL;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FAF9F6] text-[#0E0F13]">
      <LandingUtilityBar />
      <LandingHeader />
      <LandingHero />
      <LandingTrustStrip />
      <LandingHowItWorks />
      <LandingWhatYouReceive />
      <LandingPricing />
      <LandingTestimonial
        quote={featured.quote}
        name={featured.name}
        location={featured.location}
        memberSince={featured.memberSince}
      />
      <LandingFooter />
    </main>
  );
}
