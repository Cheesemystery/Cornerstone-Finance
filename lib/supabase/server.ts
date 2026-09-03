import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { env, integrations } from "@/lib/env";

export async function createSupabaseServerClient(){
  if(!integrations.supabase) return null;
  const store=await cookies();
  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL!,env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{
    cookies:{getAll:()=>store.getAll(),setAll(items){for(const item of items)store.set(item.name,item.value,item.options)}}
  });
}

export async function getAuthenticatedUser(){
  const client=await createSupabaseServerClient();
  if(!client)return null;
  const {data:{user}}=await client.auth.getUser();
  return user;
}
