import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});

const PLAN_PRICES: Record<string, number> = {
  standard: 49,
  professional: 99,
  elite: 150,
  permanent: 209,
};

export async function POST(req: Request) {
  try {
    const { plan } = await req.json();
    const amount = PLAN_PRICES[plan] || 49;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      metadata: { plan },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Payment failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
