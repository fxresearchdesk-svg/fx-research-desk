"use client";

import { Elements } from "@stripe/react-stripe-js";
import { InstitutionalTicker } from "@/components/institutional-ticker";
import { stripePromise } from "@/lib/stripe";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Elements stripe={stripePromise}>
      <InstitutionalTicker />
      <SiteNavbar />
      <main className="min-h-screen bg-[#F8F9FA] pt-[104px]">{children}</main>
      <SiteFooter />
    </Elements>
  );
}
