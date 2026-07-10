import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseAdminConfigured()) return null;

  if (!adminClient) {
    adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
  }

  return adminClient;
}

export function verifyAdminPassword(request: Request): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;

  const headerPassword = request.headers.get("x-admin-password");
  return headerPassword === password;
}

export function verifyWebhookSecret(request: Request): boolean {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) return false;

  const headerSecret = request.headers.get("x-webhook-secret");
  return headerSecret === secret;
}
