"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { PlanConfig } from "@/lib/plans";
import { telegramUrl } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#F5F5F5",
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      fontSize: "16px",
      "::placeholder": { color: "#666666" },
    },
    invalid: { color: "#FF3D00" },
  },
};

export function PaymentForm({ plan }: { plan: PlanConfig }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intentLoading, setIntentLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function createIntent() {
      try {
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: plan.id }),
        });

        if (!res.ok) throw new Error("Failed to initialize payment");

        const data = (await res.json()) as { clientSecret?: string };
        if (!cancelled && data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to initialize payment. Please refresh and try again.");
        }
      } finally {
        if (!cancelled) setIntentLoading(false);
      }
    }

    createIntent();
    return () => {
      cancelled = true;
    };
  }, [plan.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setLoading(true);
    setError(null);

    const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: { card },
      }
    );

    if (paymentError) {
      setError(paymentError.message ?? "Payment failed. Please try again.");
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      router.push("/payment/success");
      return;
    }

    setError("Payment could not be completed. Please try again.");
    setLoading(false);
  }

  return (
    <div className="rounded-sm border border-[#1A1A1A] bg-[#0A0A0A] p-8">
      <h2 className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-[#D4AF37]">
        Payment Options
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#888888]">
            Card Details
          </label>
          <div className="rounded-sm border border-[#1A1A1A] bg-[#050505] px-4 py-4">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>

        {error && (
          <p className="text-sm text-[#FF3D00]">{error}</p>
        )}

        <button
          type="submit"
          disabled={!stripe || !clientSecret || loading || intentLoading}
          className={cn(
            "w-full rounded-sm bg-[#D4AF37] px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black transition-colors duration-300",
            "hover:bg-[#E5C158] disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          {loading ? "Processing..." : intentLoading ? "Loading..." : `Pay $${plan.price}`}
        </button>
      </form>

      <div className="my-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-[#1A1A1A]" />
        <span className="text-xs uppercase tracking-[0.25em] text-[#666666]">OR</span>
        <div className="h-px flex-1 bg-[#1A1A1A]" />
      </div>

      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-[#A0A0A0]">
          For Bitcoin, Ethereum, USDT, Skrill, Neteller, or Wise — email{" "}
          <a
            href="mailto:fxresearchdesk@gmail.com"
            className="text-[#D4AF37] hover:text-white transition-colors"
          >
            fxresearchdesk@gmail.com
          </a>{" "}
          with your plan choice. We&apos;ll reply within 15 minutes.
        </p>
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-sm border border-[#D4AF37]/30 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] transition-colors duration-300 hover:bg-[#D4AF37] hover:text-black"
        >
          Contact on Telegram
        </a>
      </div>
    </div>
  );
}
