import { NextResponse } from "next/server";
import { createLinkToken } from "@/lib/providers/plaid";
import { getAuthenticatedUser } from "@/lib/supabase/server";
export async function POST(){const user=await getAuthenticatedUser();if(!user)return NextResponse.json({reason:"Sign in before connecting a portfolio."},{status:401});const result=await createLinkToken(user.id);return NextResponse.json(result,{status:result.configured?200:503});}
