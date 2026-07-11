"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="max-w-xl mx-auto px-6 text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
        className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#00C853] bg-[#00C853]/10"
      >
        <motion.div
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Check className="h-10 w-10 text-[#00C853]" strokeWidth={2.5} />
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="font-serif-display mb-4 text-4xl text-white"
      >
        Payment Confirmed
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-2 text-xl text-[#D4AF37]"
      >
        Welcome to FX Research Desk
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-8 text-[#A0A0A0] leading-relaxed"
      >
        Check your email for Telegram channel access
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-10 text-sm text-[#888888]"
      >
        Questions? Contact us at{" "}
        <a
          href="mailto:fxresearchdesk@gmail.com"
          className="text-[#D4AF37] hover:text-white transition-colors"
        >
          fxresearchdesk@gmail.com
        </a>
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Link
          href="/"
          className="inline-block rounded-sm bg-[#D4AF37] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-black transition-colors duration-300 hover:bg-[#E5C158]"
        >
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}
