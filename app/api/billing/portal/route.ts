import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createPortal } from "@/lib/providers/stripe";
export async function POST(){const user=await getAuthenticatedUser(),admin=createSupabaseAdminClient();if(!user)return NextResponse.json({reason:"Sign in to manage Pro."},{status:401});if(!admin)return NextResponse.json({reason:"Billing is not configured."},{status:503});const {data}=await admin.from("subscription_entitlements").select("stripe_customer_id").eq("user_id",user.id).maybeSingle();if(!data?.stripe_customer_id)return NextResponse.json({reason:"No subscription was found."},{status:404});try{const session=await createPortal(data.stripe_customer_id);return NextResponse.json({url:session.url})}catch(error){return NextResponse.json({reason:error instanceof Error?error.message:"The billing portal is unavailable."},{status:503})}}
