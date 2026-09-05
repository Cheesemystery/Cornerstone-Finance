import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env,integrations } from "@/lib/env";
export function createSupabaseAdminClient(){if(!integrations.supabaseAdmin)return null;return createClient(env.NEXT_PUBLIC_SUPABASE_URL!,env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}})}
