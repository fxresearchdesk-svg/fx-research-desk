import { NextResponse } from "next/server";
import { notConfiguredResponse } from "@/lib/api-auth";
import { getSupabaseAdmin, verifyWebhookSecret } from "@/lib/supabase-admin";

type TelegramWebhookPayload = {
  pair?: string;
  direction?: "BUY" | "SELL";
  entry_price?: number;
  stop_loss?: number;
  take_profit?: number;
  message?: string;
};

function parseSignalFromMessage(message: string): Partial<TelegramWebhookPayload> | null {
  const pairMatch = message.match(/([A-Z]{3}\/[A-Z]{3})/);
  const directionMatch = message.match(/\b(BUY|SELL)\b/i);
  const numbers = message.match(/\d+\.?\d*/g)?.map(Number) ?? [];

  if (!pairMatch || !directionMatch || numbers.length < 3) return null;

  return {
    pair: pairMatch[1],
    direction: directionMatch[1].toUpperCase() as "BUY" | "SELL",
    entry_price: numbers[0],
    stop_loss: numbers[1],
    take_profit: numbers[2],
  };
}

export async function POST(request: Request) {
  if (!verifyWebhookSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return notConfiguredResponse("Supabase");

  try {
    const body = (await request.json()) as TelegramWebhookPayload;

    let signal = body;
    if (body.message && !body.pair) {
      const parsed = parseSignalFromMessage(body.message);
      if (!parsed) {
        return NextResponse.json({ error: "Could not parse signal from message" }, { status: 400 });
      }
      signal = { ...parsed, ...body };
    }

    const { pair, direction, entry_price, stop_loss, take_profit } = signal;

    if (!pair || !direction || entry_price == null || stop_loss == null || take_profit == null) {
      return NextResponse.json({ error: "Missing required signal fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("signals")
      .insert({
        pair,
        direction,
        entry_price,
        stop_loss,
        take_profit,
        result: "PENDING",
        status: "active",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ signal: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "FX Research Desk webhook endpoint. POST Telegram signals here.",
  });
}
