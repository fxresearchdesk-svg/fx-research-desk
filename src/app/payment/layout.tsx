"use client";

import { Elements } from "@stripe/react-stripe-js";
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
      <SiteNavbar />
      <main className="min-h-screen bg-[#050505] pt-[128px]">{children}</main>
      <SiteFooter />
    </Elements>
  );
}
