import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import { internalPath } from "@/lib/internal-path";
export async function GET(request: NextRequest) {
 const origin = env.APP_URL ? new URL(env.APP_URL).origin : request.nextUrl.origin;
 const next = internalPath(request.nextUrl.searchParams.get("next"));
 const failed = new URL("/sign-in",origin);
 failed.searchParams.set("error","link"); failed.searchParams.set("returnTo",next);
 const code = request.nextUrl.searchParams.get("code");
 if (!code) return NextResponse.redirect(failed);
 try {
  const client = await createSupabaseServerClient();
  if (!client) return NextResponse.redirect(failed);
  const {data,error} = await client.auth.exchangeCodeForSession(code);
  if (error || !data.session) return NextResponse.redirect(failed);
  return NextResponse.redirect(new URL(next,origin));
 } catch { return NextResponse.redirect(failed); }
}
