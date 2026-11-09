import "server-only";
import { env, integrations } from "@/lib/env";
import { createClient } from "@supabase/supabase-js";
export const learningAccountsConfigured = () => process.env.LEARNING_ACCOUNTS_ENABLED === "true" && integrations.supabase && Boolean(env.APP_URL);
export async function learningAccountsReady() {
 if (!learningAccountsConfigured()) return false;
 try {
  // Availability checks must not read or refresh session cookies in a Server Component.
  const client = createClient(env.NEXT_PUBLIC_SUPABASE_URL!,env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const result = await client.rpc("learning_schema_ready");
  return !result.error && result.data === true;
 } catch { return false; }
}
