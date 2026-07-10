import { NextResponse } from "next/server";
import { notConfiguredResponse, unauthorizedResponse } from "@/lib/api-auth";
import { getSupabaseAdmin, verifyAdminPassword } from "@/lib/supabase-admin";

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return notConfiguredResponse("Supabase");

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ testimonials: data });
}

export async function POST(request: Request) {
  if (!verifyAdminPassword(request)) return unauthorizedResponse();

  const supabase = getSupabaseAdmin();
  if (!supabase) return notConfiguredResponse("Supabase");

  try {
    const body = await request.json();
    const { name, location, quote, rating, member_type, image_url } = body;

    if (!name || !quote) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("testimonials")
      .insert({
        name,
        location: location ?? null,
        quote,
        rating: rating ?? 5,
        member_type: member_type ?? null,
        image_url: image_url ?? null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ testimonial: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
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
      .from("testimonials")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ testimonial: data });
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

  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
