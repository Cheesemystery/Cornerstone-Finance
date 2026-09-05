import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { readRecapToken } from "@/lib/server/recap-tokens";
export async function GET(request:Request){const url=new URL(request.url),payload=readRecapToken(url.searchParams.get("token")||"","unsubscribe"),admin=createSupabaseAdminClient();if(!payload||!admin)return NextResponse.redirect(url.origin+"/settings?email=invalid");const {error}=await admin.from("recap_preferences").upsert({user_id:payload.userId,email_opt_in:false,updated_at:new Date().toISOString()},{onConflict:"user_id"});return NextResponse.redirect(url.origin+"/settings?email="+(error?"failed":"unsubscribed"))}
