import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import { createCheckout } from "@/lib/providers/stripe";
const schema=z.object({price:z.enum(["monthly","annual"])});
export async function POST(request:Request){const user=await getAuthenticatedUser();if(!user)return NextResponse.json({reason:"Sign in before starting a Pro trial."},{status:401});const parsed=schema.safeParse(await request.json().catch(()=>null));if(!parsed.success)return NextResponse.json({reason:"Choose a monthly or annual plan."},{status:400});try{const session=await createCheckout(user.id,user.email,parsed.data.price);return NextResponse.json({url:session.url})}catch(error){return NextResponse.json({reason:error instanceof Error?error.message:"Checkout is unavailable."},{status:503})}}
