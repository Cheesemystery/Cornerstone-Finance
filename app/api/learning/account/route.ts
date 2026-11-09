import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { emptyLearning, learningSchema, migrateLearning } from "@/lib/learning-progress";
import { mergeLearning } from "@/lib/learning-account-state";
import { learningAccountsReady } from "@/lib/server/learning-account";
import { createSupabaseServerClient } from "@/lib/supabase/server";
const reply = (body: unknown,status=200) => NextResponse.json(body,{status,headers:{"Cache-Control":"no-store"}});
const input = z.object({userId:z.string().uuid(),revision:z.number().int().nonnegative(),state:learningSchema}).strict();
export async function GET() {
 if (!await learningAccountsReady()) return reply({error:"Account learning is unavailable."},503);
 const client = await createSupabaseServerClient();
 const {data:{user},error:authError} = await client!.auth.getUser();
 if (authError || !user) return reply({error:"Sign in to load account learning."},401);
 const {data,error} = await client!.from("learning_account_state").select("state,revision").eq("user_id",user.id).maybeSingle();
 if (error) return reply({error:"Account progress could not be loaded."},503);
 const parsed = learningSchema.safeParse(data?.state ?? emptyLearning);
 if (!parsed.success) return reply({error:"Saved account progress needs attention. Your guest learning is unchanged."},503);
 return reply({userId:user.id,revision:data?.revision ?? 0,state:migrateLearning(parsed.data)});
}
export async function PUT(request: NextRequest) {
 if (request.headers.get("origin") !== request.nextUrl.origin) return reply({error:"Reload the page before saving."},403);
 if (!await learningAccountsReady()) return reply({error:"Account learning is unavailable."},503);
 if (Number(request.headers.get("content-length") ?? 0) > 262144) return reply({error:"Learning record is too large."},413);
 const parsed = input.safeParse(await request.json().catch(()=>null));
 if (!parsed.success || JSON.stringify(parsed.data).length > 262144) return reply({error:"Invalid learning record."},400);
 const client = await createSupabaseServerClient();
 const {data:{user},error:authError} = await client!.auth.getUser();
 if (authError || !user) return reply({error:"Your session expired. Sign in again to save."},401);
 if (user.id !== parsed.data.userId) return reply({error:"Your account changed. Reload before saving."},409);
 const current = await client!.from("learning_account_state").select("state,revision").eq("user_id",user.id).maybeSingle();
 if (current.error) return reply({error:"Unable to read saved learning."},503);
 if ((current.data?.revision ?? 0) !== parsed.data.revision) return reply({error:"Progress changed on another device. Reload and merge before retrying."},409);
 const existing = learningSchema.safeParse(current.data?.state ?? emptyLearning);
 if (!existing.success) return reply({error:"Saved learning needs attention."},503);
 const state = mergeLearning(existing.data,migrateLearning(parsed.data.state));
 const saved = await client!.rpc("save_learning_progress",{expected_revision:parsed.data.revision,progress:state});
 if (saved.error) return reply({error:"Progress was not saved. Reload and retry."},saved.error.code === "40001" ? 409 : 503);
 return reply({userId:user.id,revision:saved.data,state});
}
