import { NextResponse } from "next/server";

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function notConfiguredResponse(resource: string) {
  return NextResponse.json(
    { error: `${resource} not configured. Set Supabase environment variables.` },
    { status: 503 }
  );
}
