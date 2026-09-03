import { NextRequest, NextResponse } from "next/server";
import { marketProvider } from "@/lib/providers/market";
export async function GET(request:NextRequest){const symbol=request.nextUrl.searchParams.get("symbol")?.trim().toUpperCase();try{return NextResponse.json({mode:process.env.FINNHUB_API_KEY?"live":"sample",items:await marketProvider.searchNews(symbol)});}catch{return NextResponse.json({error:"Research data is temporarily unavailable."},{status:503});}}
