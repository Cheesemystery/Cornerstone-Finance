import { NextResponse } from "next/server";
import { sampleBriefing } from "@/lib/sample-data";
export async function GET(){return NextResponse.json(sampleBriefing,{headers:{"Cache-Control":"private, max-age=60"}})}
