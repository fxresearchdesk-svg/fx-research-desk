import { NextResponse } from "next/server";
import { unauthorizedResponse } from "@/lib/api-auth";
import { verifyAdminPassword } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  if (verifyAdminPassword(request)) {
    return NextResponse.json({ ok: true });
  }
  return unauthorizedResponse();
}
