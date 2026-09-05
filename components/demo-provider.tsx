"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { z } from "zod";
import type { PortfolioSnapshot } from "@/lib/domain";
import { samplePortfolio } from "@/lib/sample-data";
import { sampleContributions } from "@/lib/sample-contributions";
import type { ContributionEvent } from "@/lib/recap";

const preferencesSchema = z.object({
  name:z.string().min(1).max(40).default("Alex"),
  college:z.string().max(80).default("Your university"),
  level:z.enum(["New","Growing","Experienced"]).default("Growing"),
  goal:z.enum(["Understand","Research","Stay consistent"]).default("Understand"),
  completed:z.array(z.string().max(50)).max(6).default([]),
  follows:z.array(z.string().max(80)).max(20).default([]),
  saved:z.array(z.string().max(30)).max(20).default([]),
  compact:z.boolean().default(false),
  recapSeen:z.string().max(7).default(""),
  recapEmail:z.boolean().default(false),
  campusComparison:z.boolean().default(false)
});
export type DemoPreferences = z.infer<typeof preferencesSchema>;
const defaults = preferencesSchema.parse({});
const initial = JSON.stringify(defaults);
const key = "cornerstone-demo-v1";
let memory = initial;
function snapshot() { try { return localStorage.getItem(key) ?? memory; } catch { return memory; } }
function parse(raw:string):DemoPreferences { try { return preferencesSchema.parse(JSON.parse(raw)); } catch { return defaults; } }
function subscribe(notify:()=>void) { window.addEventListener("storage",notify); window.addEventListener("cornerstone-demo",notify); return ()=>{window.removeEventListener("storage",notify);window.removeEventListener("cornerstone-demo",notify);}; }
function save(value:DemoPreferences) { memory=JSON.stringify(value);try {localStorage.setItem(key,memory);} catch {}window.dispatchEvent(new Event("cornerstone-demo")); }
const DemoContext = createContext<{
  preferences:DemoPreferences; update:(patch:Partial<DemoPreferences>)=>void;
  portfolio:PortfolioSnapshot; setPortfolio:(portfolio:PortfolioSnapshot)=>void;
  contributions:ContributionEvent[]; setContributions:(events:ContributionEvent[]|((events:ContributionEvent[])=>ContributionEvent[]))=>void;
  contributionMode:"loading"|"sample"|"server";
  recapTimezone:string;
  reset:()=>void; notice:string; announce:(message:string)=>void;
} | null>(null);

export function DemoProvider({children}:{children:ReactNode}) {
  const raw = useSyncExternalStore(subscribe,snapshot,()=>initial);
  const preferences = parse(raw);
  const [portfolio,setPortfolio] = useState<PortfolioSnapshot>(samplePortfolio);
  const [contributions,setContributions] = useState<ContributionEvent[]>(sampleContributions);
  const [contributionMode,setContributionMode] = useState<"loading"|"sample"|"server">("loading");
  const [recapTimezone,setRecapTimezone] = useState("America/Chicago");
  const [notice,announce] = useState("");
  useEffect(()=>{let active=true;(async()=>{try{const response=await fetch("/api/contributions");if(!active)return;if(!response.ok){setContributionMode("sample");return}const body=await response.json();const events:ContributionEvent[]=(body.contributions??[]).map((row:Record<string,unknown>)=>({id:String(row.id),occurredOn:String(row.occurred_on),amount:Number(row.amount),currency:"USD",kind:row.direction as ContributionEvent["kind"],status:row.status as ContributionEvent["status"],source:row.source as ContributionEvent["source"],providerTransactionId:row.provider_transaction_id?String(row.provider_transaction_id):undefined,confidence:row.confidence==null?undefined:Number(row.confidence),userCorrected:Boolean(row.user_corrected)}));const preferenceResponse=await fetch("/api/recap-preferences");if(preferenceResponse.ok){const preferenceBody=await preferenceResponse.json();const seen=preferenceBody.preferences?.latest_seen_period,timeZone=preferenceBody.preferences?.timezone;if(typeof seen==="string")save(preferencesSchema.parse({...parse(snapshot()),recapSeen:seen}));if(typeof timeZone==="string")setRecapTimezone(timeZone)}if(active){setContributions(events);setContributionMode("server")}}catch{if(active)setContributionMode("sample")}})();return()=>{active=false}},[]);
  useEffect(()=>{if(!notice)return;const timer=window.setTimeout(()=>announce(""),6000);return()=>window.clearTimeout(timer);},[notice]);
  function update(patch:Partial<DemoPreferences>) { save(preferencesSchema.parse({...parse(snapshot()),...patch})); }
  function reset() { save(defaults);setPortfolio(samplePortfolio);if(contributionMode!=="server")setContributions(sampleContributions);announce("Demo reset. You’re back to the sample portfolio."); }
  return <DemoContext.Provider value={{preferences,update,portfolio,setPortfolio,contributions,setContributions,contributionMode,recapTimezone,reset,notice,announce}}>{children}{notice&&<div className="demo-toast" role="status"><span>{notice}</span><button aria-label="Dismiss notification" onClick={()=>announce("")}>×</button></div>}</DemoContext.Provider>;
}
export function useDemo(){const value=useContext(DemoContext);if(!value)throw new Error("DemoProvider is required");return value;}
