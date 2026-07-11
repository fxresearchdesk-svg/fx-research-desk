import type { Metadata } from "next";
import { PaymentShell } from "./payment-shell";

export const metadata: Metadata = {
  title: "Checkout | FX Research Desk",
  description: "Secure checkout for FX Research Desk membership plans.",
};

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PaymentShell>{children}</PaymentShell>;
}
