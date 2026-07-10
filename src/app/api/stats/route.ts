import { NextResponse } from "next/server";
import { notConfiguredResponse, unauthorizedResponse } from "@/lib/api-auth";
import { getSupabaseAdmin, verifyAdminPassword } from "@/lib/supabase-admin";

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return notConfiguredResponse("Supabase");

  const { data, error } = await supabase
    .from("stats")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ stats: data });
}

export async function POST(request: Request) {
  if (!verifyAdminPassword(request)) return unauthorizedResponse();

  const supabase = getSupabaseAdmin();
  if (!supabase) return notConfiguredResponse("Supabase");

  try {
    const body = await request.json();
    const { win_rate, pips_month, monthly_return, active_traders, id } = body;

    if (
      win_rate == null ||
      pips_month == null ||
      monthly_return == null ||
      active_traders == null
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const payload = {
      win_rate,
      pips_month,
      monthly_return,
      active_traders,
      updated_at: new Date().toISOString(),
    };

    if (id) {
      const { data, error } = await supabase
        .from("stats")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ stats: data });
    }

    const { data, error } = await supabase.from("stats").insert(payload).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ stats: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
