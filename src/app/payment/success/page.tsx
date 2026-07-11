"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "standard";
  const method = searchParams.get("method") || "stripe";

  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <div className="w-16 h-16 border-2 border-[#00C853] rounded-full flex items-center justify-center mx-auto mb-8">
        <svg
          className="w-8 h-8 text-[#00C853]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-white mb-4">Payment Confirmed</h1>
      <p className="text-[#888] mb-2">Welcome to FX Research Desk</p>
      <p className="text-[#666] text-sm mb-8">
        Plan:{" "}
        <span className="text-[#D4AF37] uppercase tracking-widest">{plan}</span> |
        Paid via {method}
      </p>

      <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-6 mb-8 text-left">
        <h3 className="text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase mb-4">
          What happens next?
        </h3>
        <ol className="space-y-3 text-sm text-[#A0A0A0]">
          <li className="flex gap-3">
            <span className="text-[#D4AF37] font-bold">1.</span>
            Check your email for the Telegram channel invite link
          </li>
          <li className="flex gap-3">
            <span className="text-[#D4AF37] font-bold">2.</span>
            Join the VIP Telegram channel to start receiving signals immediately
          </li>
          <li className="flex gap-3">
            <span className="text-[#D4AF37] font-bold">3.</span>
            Access the education library from your welcome email
          </li>
        </ol>
      </div>

      <p className="text-[#666] text-xs mb-6">
        Questions? Contact us at{" "}
        <a
          href="mailto:fxresearchdesk@gmail.com"
          className="text-[#D4AF37] hover:underline"
        >
          fxresearchdesk@gmail.com
        </a>
      </p>

      <Link
        href="/"
        className="inline-block bg-[#D4AF37] text-black px-8 py-3 text-[11px] tracking-[0.2em] font-bold hover:bg-[#E5C158] transition"
      >
        RETURN TO HOMEPAGE
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-xl mx-auto px-6 py-24 text-center text-[#666] text-sm">
          Loading...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
