import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
export async function POST(request:NextRequest) {
 if (request.headers.get("origin") !== request.nextUrl.origin) return NextResponse.json({error:"Reload before signing out."},{status:403});
 const client = await createSupabaseServerClient();
 if (client) { const {error} = await client.auth.signOut({scope:"local"}); if (error) return NextResponse.json({error:"Sign-out failed. Try again."},{status:503}); }
 return NextResponse.json({ok:true},{headers:{"Cache-Control":"no-store"}});
}
