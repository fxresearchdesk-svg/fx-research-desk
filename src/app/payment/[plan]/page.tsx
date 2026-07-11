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
        <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-8">
          <h2 className="text-[10px] tracking-[0.3em] text-[#D4AF37] mb-4">
            SELECTED PLAN
          </h2>
          <h1 className="text-3xl font-bold text-white mb-2">{plan.name}</h1>
          <p className="text-[#888] text-sm mb-6">{plan.headline}</p>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-5xl font-bold text-white">${plan.price}</span>
            <span className="text-[#666]">/{plan.period}</span>
          </div>
          <p className="text-[#00C853] text-xs tracking-widest mb-8">{plan.billing}</p>

          <div className="space-y-3">
            {plan.features.map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-[#00C853] mt-0.5">✓</span>
                <span className="text-[#A0A0A0] text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-8">
          <h2 className="text-[10px] tracking-[0.3em] text-[#D4AF37] mb-4">
            SECURE CHECKOUT
          </h2>
          <p className="text-white text-lg mb-6">Pay ${plan.price} USD</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] tracking-[0.2em] text-[#666] uppercase mb-2 block">
                Card Details
              </label>
              <div className="bg-[#111] border border-[#2A2A2A] p-4 rounded-sm">
                <CardElement
                  options={{
                    style: {
                      base: {
                        color: "#fff",
                        fontSize: "16px",
                        "::placeholder": { color: "#555" },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {error && <p className="text-[#FF3D00] text-sm">{error}</p>}

            <button
              type="submit"
              disabled={!stripe || loading}
              className="w-full bg-[#D4AF37] text-black font-bold py-4 text-[11px] tracking-[0.2em] hover:bg-[#E5C158] transition disabled:opacity-50"
            >
              {loading ? "PROCESSING..." : `PAY $${plan.price} — SECURE`}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#1A1A1A]">
            <p className="text-[10px] tracking-[0.2em] text-[#666] uppercase mb-4 text-center">
              Other Payment Methods
            </p>
            <p className="text-[#888] text-sm text-center mb-4">
              Bitcoin, Ethereum, USDT, Skrill, Neteller, or Wise
            </p>
            <p className="text-[#666] text-xs text-center mb-4">
              Email us at{" "}
              <a
                href="mailto:fxresearchdesk@gmail.com"
                className="text-[#D4AF37] hover:underline"
              >
                fxresearchdesk@gmail.com
              </a>{" "}
              with your plan choice. We reply within 15 minutes.
            </p>
            <a
              href="https://t.me/fxresearchdesk"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center border border-[#D4AF37]/40 text-[#D4AF37] py-3 text-[11px] tracking-[0.2em] hover:bg-[#D4AF37]/10 transition"
            >
              CONTACT ON TELEGRAM
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
