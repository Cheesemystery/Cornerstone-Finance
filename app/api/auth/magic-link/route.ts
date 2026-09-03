import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { integrations } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
const schema=z.object({email:z.string().email().max(254),redirectTo:z.string().startsWith('/').default('/')});
export async function POST(request:NextRequest){const parsed=schema.safeParse(await request.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:'Enter a valid email address.'},{status:400});if(!integrations.supabase)return NextResponse.json({error:'Authentication is not configured in this environment.'},{status:503});const supabase=await createSupabaseServerClient();const origin=request.nextUrl.origin;const {error}=await supabase!.auth.signInWithOtp({email:parsed.data.email,options:{emailRedirectTo:`${origin}/auth/callback?next=${encodeURIComponent(parsed.data.redirectTo)}`}});if(error)return NextResponse.json({error:'Unable to send the sign-in link.'},{status:502});return NextResponse.json({ok:true});}
