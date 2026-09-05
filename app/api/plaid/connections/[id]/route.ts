import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { decryptSecret } from "@/lib/crypto";
import { removePlaidItem } from "@/lib/providers/plaid";
import { generateMonthlyRecap } from "@/lib/server/recaps";

export async function DELETE(_request:Request,{params}:{params:Promise<{id:string}>}){
  const user=await getAuthenticatedUser(),admin=createSupabaseAdminClient();
  if(!user)return NextResponse.json({reason:"Sign in to disconnect an account."},{status:401});
  if(!admin)return NextResponse.json({reason:"Connection storage is not configured."},{status:503});
  const {id}=await params;
  const {data}=await admin.from("portfolio_connections").select("encrypted_access_token,source").eq("id",id).eq("user_id",user.id).maybeSingle();
  if(!data)return NextResponse.json({reason:"Connection not found."},{status:404});
  try{if(data.source==="plaid"&&data.encrypted_access_token)await removePlaidItem(decryptSecret(data.encrypted_access_token))}catch{return NextResponse.json({reason:"The provider could not revoke access. Nothing was deleted; try again."},{status:502})}
  const {error}=await admin.from("portfolio_connections").delete().eq("id",id).eq("user_id",user.id);
  if(error)return NextResponse.json({reason:"Connection could not be removed."},{status:500});
  await admin.from("recap_snapshots").delete().eq("user_id",user.id);
  const {data:remaining}=await admin.from("contribution_events").select("occurred_on").eq("user_id",user.id).eq("status","confirmed");
  const periods=[...new Set((remaining??[]).map(event=>String(event.occurred_on).slice(0,7)))].sort();
  for(const period of periods)await generateMonthlyRecap(user.id,period).catch(()=>undefined);
  return new Response(null,{status:204});
}
