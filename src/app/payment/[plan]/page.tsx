"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { PLANS } from "@/lib/plans";

export default function PaymentPage() {
  const params = useParams();
  const planId = (params.plan as string) || "standard";
  const plan = PLANS[planId as keyof typeof PLANS] || PLANS.standard;

  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: { name: "FX Research Desk Client" },
        },
      });

      if (result.error) throw new Error(result.error.message);

      window.location.href = `/payment/success?plan=${planId}&method=stripe`;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Payment failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="card-surface p-8">
          <h2 className="label-institutional mb-4">SELECTED PLAN</h2>
          <h1 className="font-serif-display text-[32px] text-[#1A1A1A] mb-2">
            {plan.name}
          </h1>
          <p className="text-[13px] text-[#4A4A4A] mb-6">{plan.headline}</p>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-data text-[40px] text-[#1A1A1A]">
              ${plan.price}
            </span>
            <span className="text-[#4A4A4A]">/{plan.period}</span>
          </div>
          <p className="text-[11px] text-[#4A4A4A] tracking-[0.15em] mb-8">
            {plan.billing}
          </p>

          <ul className="space-y-3">
            {plan.features.map((f, i) => (
              <li
                key={i}
                className="text-[13px] text-[#4A4A4A] leading-relaxed pl-3 border-l border-[#E5E5E5]"
              >
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="card-surface p-8">
          <h2 className="label-institutional mb-4">SECURE CHECKOUT</h2>
          <p className="font-data text-lg text-[#1A1A1A] mb-6">
            Pay ${plan.price} USD
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label-institutional mb-2 block">Card Details</label>
              <div className="bg-[#F5F5F0] border border-[#D1D5DB] focus-within:border-[#1A1A1A] p-4 transition-colors">
                <CardElement
                  options={{
                    style: {
                      base: {
                        color: "#1A1A1A",
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "14px",
                        "::placeholder": { color: "#9A9A9A" },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {error && <p className="text-[#8B3A3A] text-sm">{error}</p>}

            <button
              type="submit"
              disabled={!stripe || loading}
              className="w-full border border-[#1A1A1A] py-4 text-[11px] tracking-[0.2em] text-[#1A1A1A] transition-colors duration-200 hover:bg-[#1A1A1A] hover:text-white disabled:opacity-50"
            >
              {loading ? "PROCESSING..." : `PAY $${plan.price}`}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#E5E5E5]">
            <p className="label-institutional mb-4 text-center">
              Other Payment Methods
            </p>
            <p className="text-[13px] text-[#4A4A4A] text-center mb-4">
              Bitcoin, Ethereum, USDT, Skrill, Neteller, or Wise
            </p>
            <p className="text-[13px] text-[#4A4A4A] text-center mb-4">
              Email us at{" "}
              <a
                href="mailto:fxresearchdesk@gmail.com"
                className="text-[#B8956A] hover:text-[#C9A87C] transition-colors"
              >
                fxresearchdesk@gmail.com
              </a>{" "}
              with your plan choice. We reply within 15 minutes.
            </p>
            <a
              href="https://t.me/fxresearchdesk"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center border border-[#1A1A1A] py-3 text-[11px] tracking-[0.2em] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors duration-200"
            >
              CONTACT ON TELEGRAM
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
