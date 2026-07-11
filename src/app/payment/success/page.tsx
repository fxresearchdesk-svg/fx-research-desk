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
      <div className="w-16 h-16 border border-[#4A7C59] flex items-center justify-center mx-auto mb-8">
        <svg
          className="w-8 h-8 text-[#4A7C59]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="font-serif-display text-[40px] text-[#111827] mb-4">
        Payment Confirmed
      </h1>
      <p className="text-[#6B7280] mb-2">Welcome to FX Research Desk</p>
      <p className="font-data text-sm text-[#6B7280] mb-8">
        Plan:{" "}
        <span className="text-[#B8956A] uppercase tracking-widest">{plan}</span> |
        Paid via {method}
      </p>

      <div className="card-surface p-6 mb-8 text-left">
        <h3 className="label-institutional mb-4">What happens next?</h3>
        <ol className="space-y-3 text-[13px] text-[#6B7280] leading-relaxed">
          <li className="flex gap-3">
            <span className="text-[#B8956A] font-data">1.</span>
            Check your email for the Telegram channel invite link
          </li>
          <li className="flex gap-3">
            <span className="text-[#B8956A] font-data">2.</span>
            Join the VIP Telegram channel to start receiving signals immediately
          </li>
          <li className="flex gap-3">
            <span className="text-[#B8956A] font-data">3.</span>
            Access the education library from your welcome email
          </li>
        </ol>
      </div>

      <p className="text-[13px] text-[#6B7280] mb-6">
        Questions? Contact us at{" "}
        <a
          href="mailto:fxresearchdesk@gmail.com"
          className="text-[#B8956A] hover:text-[#C9A87C] transition-colors"
        >
          fxresearchdesk@gmail.com
        </a>
      </p>

      <Link
        href="/"
        className="inline-block border border-[#B8956A] px-8 py-3 text-[11px] tracking-[0.2em] text-[#B8956A] hover:bg-[#B8956A] hover:text-white transition-colors duration-200"
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
        <div className="max-w-xl mx-auto px-6 py-24 text-center text-[#6B7280] text-sm">
          Loading...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
