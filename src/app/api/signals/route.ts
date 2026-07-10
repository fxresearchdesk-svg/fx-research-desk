import { NextResponse } from "next/server";
import { notConfiguredResponse, unauthorizedResponse } from "@/lib/api-auth";
import { getSupabaseAdmin, verifyAdminPassword } from "@/lib/supabase-admin";

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return notConfiguredResponse("Supabase");

  const { data, error } = await supabase
    .from("signals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ signals: data });
}

export async function POST(request: Request) {
  if (!verifyAdminPassword(request)) return unauthorizedResponse();

  const supabase = getSupabaseAdmin();
  if (!supabase) return notConfiguredResponse("Supabase");

  try {
    const body = await request.json();
    const { pair, direction, entry_price, stop_loss, take_profit, result, pips, status } =
      body;

    if (!pair || !direction || entry_price == null || stop_loss == null || take_profit == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("signals")
      .insert({
        pair,
        direction,
        entry_price,
        stop_loss,
        take_profit,
        result: result ?? "PENDING",
        pips: pips ?? null,
        status: status ?? "active",
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

export async function DELETE(request: Request) {
  if (!verifyAdminPassword(request)) return unauthorizedResponse();

  const supabase = getSupabaseAdmin();
  if (!supabase) return notConfiguredResponse("Supabase");

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const { error } = await supabase.from("signals").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  if (!verifyAdminPassword(request)) return unauthorizedResponse();

  const supabase = getSupabaseAdmin();
  if (!supabase) return notConfiguredResponse("Supabase");

  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("signals")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ signal: data });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
