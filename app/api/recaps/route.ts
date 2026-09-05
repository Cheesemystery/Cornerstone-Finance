import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateMonthlyRecap } from "@/lib/server/recaps";
import { hasProEntitlement } from "@/lib/billing";

const schema=z.object({period:z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/)});

export async function GET(){
  const user=await getAuthenticatedUser(),admin=createSupabaseAdminClient();
  if(!user)return NextResponse.json({reason:"Sign in to view recaps."},{status:401});
  if(!admin)return NextResponse.json({reason:"Recap storage is not configured."},{status:503});
  const [{data,error},{data:entitlement}]=await Promise.all([
    admin.from("recap_snapshots").select("*").eq("user_id",user.id).order("period_start",{ascending:false}).order("revision",{ascending:false}).limit(100),
    admin.from("subscription_entitlements").select("status,current_period_end").eq("user_id",user.id).maybeSingle()
  ]);
  if(error)return NextResponse.json({reason:"Recaps are unavailable."},{status:500});
  const seen=new Set<string>(),latest:Record<string,unknown>[]=[];
  for(const row of data??[]){const key=row.period_kind+":"+row.period_start;if(!seen.has(key)){seen.add(key);latest.push(row)}}
  const isPro=hasProEntitlement(entitlement?.status,entitlement?.current_period_end);
  const visible=isPro?latest:latest.filter(row=>row.period_kind==="monthly").slice(0,3);
  return NextResponse.json({recaps:visible,isPro},{headers:{"Cache-Control":"private, no-store"}});
}

export async function POST(request:Request){
  const user=await getAuthenticatedUser();
  if(!user)return NextResponse.json({reason:"Sign in to build a recap."},{status:401});
  const parsed=schema.safeParse(await request.json().catch(()=>null));
  if(!parsed.success)return NextResponse.json({reason:"Choose a valid month."},{status:400});
  try{return NextResponse.json({recap:await generateMonthlyRecap(user.id,parsed.data.period)},{status:201})}catch{return NextResponse.json({reason:"Recap could not be generated."},{status:503})}
}
