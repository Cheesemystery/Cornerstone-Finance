import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { env, integrations } from "@/lib/env";
import { internalPath } from "@/lib/internal-path";
import { learningAccountsReady } from "@/lib/server/learning-account";
import { connectedFeaturesEnabled } from "@/lib/features";
import { createSupabaseServerClient } from "@/lib/supabase/server";
const schema = z.object({ email: z.string().email().max(254), redirectTo: z.string().optional() });
export async function POST(request: NextRequest) {
 const origin = env.APP_URL ? new URL(env.APP_URL).origin : request.nextUrl.origin;
 if (request.headers.get("origin") !== origin) return NextResponse.json({error:"Open the sign-in page and try again."},{status:403});
 const parsed = schema.safeParse(await request.json().catch(() => null));
 if (!parsed.success) return NextResponse.json({error:"Enter a valid email address."},{status:400});
 if (!integrations.supabase || (!connectedFeaturesEnabled && !await learningAccountsReady())) return NextResponse.json({error:"Account sign-in is not available here yet. Continue as a guest."},{status:503});
 try {
  const client = await createSupabaseServerClient();
  const callback = new URL("/auth/callback", origin);
  callback.searchParams.set("next",internalPath(parsed.data.redirectTo));
  const {error} = await client!.auth.signInWithOtp({email:parsed.data.email,options:{emailRedirectTo:callback.toString()}});
  if (error) return NextResponse.json({error:"Unable to send the sign-in link. Please try again later."},{status:502});
  return NextResponse.json({ok:true});
 } catch { return NextResponse.json({error:"Sign-in is temporarily unavailable."},{status:503}); }
}
