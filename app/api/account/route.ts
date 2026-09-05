import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { decryptSecret } from "@/lib/crypto";
import { removePlaidItem } from "@/lib/providers/plaid";
import { cancelSubscription,deleteStripeCustomer } from "@/lib/providers/stripe";
const schema=z.object({confirmation:z.literal("DELETE")});
export async function DELETE(request:Request){
 const user=await getAuthenticatedUser(),admin=createSupabaseAdminClient();
 if(!user)return NextResponse.json({reason:"Sign in to delete your account."},{status:401});
 if(!admin)return NextResponse.json({reason:"Account deletion is not configured."},{status:503});
 if(!schema.safeParse(await request.json().catch(()=>null)).success)return NextResponse.json({reason:'Type "DELETE" to confirm.'},{status:400});
 const [{data:connections},{data:entitlement}]=await Promise.all([admin.from("portfolio_connections").select("encrypted_access_token,source").eq("user_id",user.id),admin.from("subscription_entitlements").select("stripe_customer_id,stripe_subscription_id,status").eq("user_id",user.id).maybeSingle()]);
 try {
  for(const connection of connections??[])if(connection.source==="plaid"&&connection.encrypted_access_token)await removePlaidItem(decryptSecret(connection.encrypted_access_token));
  if(entitlement?.stripe_subscription_id&&["trialing","active","past_due"].includes(entitlement.status))await cancelSubscription(entitlement.stripe_subscription_id);
  if(entitlement?.stripe_customer_id)await deleteStripeCustomer(entitlement.stripe_customer_id);
 } catch { return NextResponse.json({reason:"External access or billing could not be closed, so the account was kept. Try again."},{status:502}); }
 if(user.email)await admin.from("user_profiles").delete().eq("email",user.email);
 const {error}=await admin.auth.admin.deleteUser(user.id);
 if(error)return NextResponse.json({reason:"Account deletion could not be completed."},{status:500});
 return NextResponse.json({deleted:true});
}
