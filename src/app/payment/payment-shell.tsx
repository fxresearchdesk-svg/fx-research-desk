"use client";

import { Elements } from "@stripe/react-stripe-js";
import { InstitutionalTicker } from "@/components/institutional-ticker";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import { stripePromise } from "@/lib/stripe";

export function PaymentShell({ children }: { children: React.ReactNode }) {
  return (
    <Elements stripe={stripePromise}>
      <main className="min-h-screen bg-[#050505] text-[#F5F5F5] overflow-x-hidden">
        <InstitutionalTicker />
        <SiteNavbar />
        <div className="pt-[128px] pb-24">{children}</div>
        <SiteFooter />
      </main>
    </Elements>
  );
}
