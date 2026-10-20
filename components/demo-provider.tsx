"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { array, boolean, enum as enumSchema, type infer as Infer, object, string } from "zod";
import { connectedFeaturesEnabled } from "@/lib/features";
import { useWeeklyPortfolio } from "./use-weekly-portfolio";
import { sampleContributions } from "@/lib/sample-contributions";
import type { ContributionEvent } from "@/lib/recap";

const preferencesSchema = object({
  name:string().min(1).max(40).default("Alex"),
  college:string().max(80).default("Your university"),
  level:enumSchema(["New","Growing","Experienced"]).default("New"),
  goal:enumSchema(["Understand","Research","Stay consistent"]).default("Understand"),
  completed:array(string().max(50)).max(6).default([]),
  follows:array(string().max(80)).max(20).default([]),
  saved:array(string().max(30)).max(20).default([]),
  compact:boolean().default(false),
  proView:boolean().default(false),
  recapSeen:string().max(7).default(""),
  recapEmail:boolean().default(false),
  campusComparison:boolean().default(false)
});
export type DemoPreferences = Infer<typeof preferencesSchema>;
const defaults = preferencesSchema.parse({});
const initial = JSON.stringify(defaults);
const key = "cornerstone-demo-v1";
let memory = initial;
function snapshot() { try { return localStorage.getItem(key) ?? memory; } catch { return memory; } }
function parse(raw:string):DemoPreferences { try { return preferencesSchema.parse(JSON.parse(raw)); } catch { return defaults; } }
function subscribe(notify:()=>void) { window.addEventListener("storage",notify); window.addEventListener("cornerstone-demo",notify); return ()=>{window.removeEventListener("storage",notify);window.removeEventListener("cornerstone-demo",notify);}; }
function save(value:DemoPreferences) { memory=JSON.stringify(value);try {localStorage.setItem(key,memory);} catch {}window.dispatchEvent(new Event("cornerstone-demo")); }
function update(patch:Partial<DemoPreferences>) { save(preferencesSchema.parse({...parse(snapshot()),...patch})); }

function contributionFromRow(row:Record<string,unknown>):ContributionEvent {
  return {
    id:String(row.id), occurredOn:String(row.occurred_on), amount:Number(row.amount),
    currency:"USD", kind:row.direction as ContributionEvent["kind"],
    status:row.status as ContributionEvent["status"], source:row.source as ContributionEvent["source"],
    providerTransactionId:row.provider_transaction_id?String(row.provider_transaction_id):undefined,
    confidence:row.confidence==null?undefined:Number(row.confidence),
    userCorrected:Boolean(row.user_corrected)
  };
}

function useContributions() {
  const [state,setState] = useState<{
    events:ContributionEvent[];
    mode:"loading"|"sample"|"server";
    timezone:string;
  }>({events:sampleContributions,mode:connectedFeaturesEnabled?"loading":"sample",timezone:"America/Chicago"});
  const setContributions = useCallback((change:ContributionEvent[]|((events:ContributionEvent[])=>ContributionEvent[])) => {
    setState(current=>({...current,events:typeof change==="function"?change(current.events):change}));
  },[]);

  useEffect(()=>{
    if(!connectedFeaturesEnabled)return;
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/contributions",{signal:controller.signal});
        if(controller.signal.aborted)return;
        if(!response.ok){setState(current=>({...current,mode:"sample"}));return;}
        const body = await response.json();
        if(controller.signal.aborted)return;
        const events:ContributionEvent[] = (body.contributions??[]).map(contributionFromRow);
        const preferenceResponse = await fetch("/api/recap-preferences",{signal:controller.signal});
        let timezone:string|undefined;
        if(preferenceResponse.ok){
          const preferenceBody = await preferenceResponse.json();
          if(controller.signal.aborted)return;
          const preferences = preferenceBody.preferences;
          if(typeof preferences?.latest_seen_period==="string")update({recapSeen:preferences.latest_seen_period});
          if(typeof preferences?.timezone==="string")timezone=preferences.timezone;
        }
        if(!controller.signal.aborted)setState(current=>({events,mode:"server",timezone:timezone??current.timezone}));
      } catch {
        if(!controller.signal.aborted)setState(current=>({...current,mode:"sample"}));
      }
    }
    void load();
    return ()=>controller.abort();
  },[]);

  return {contributions:state.events,contributionMode:state.mode,recapTimezone:state.timezone,setContributions};
}
const DemoContext = createContext<{
  preferences:DemoPreferences; update:(patch:Partial<DemoPreferences>)=>void;
  contributions:ContributionEvent[]; setContributions:(events:ContributionEvent[]|((events:ContributionEvent[])=>ContributionEvent[]))=>void;
  contributionMode:"loading"|"sample"|"server";
  recapTimezone:string;
  reset:()=>void; notice:string; announce:(message:string)=>void;
} & ReturnType<typeof useWeeklyPortfolio> | null>(null);

export function DemoProvider({children}:{children:ReactNode}) {
  const raw = useSyncExternalStore(subscribe,snapshot,()=>initial);
  const preferences = useMemo(()=>parse(raw),[raw]);
  const weeklyData = useWeeklyPortfolio();
  const { clearHoldings } = weeklyData;
  const {contributions,setContributions,contributionMode,recapTimezone} = useContributions();
  const [notice,announce] = useState("");
  useEffect(()=>{if(!notice)return;const timer=window.setTimeout(()=>announce(""),6000);return()=>window.clearTimeout(timer);},[notice]);
  const reset = useCallback(()=>{save(defaults);clearHoldings();if(contributionMode!=="server")setContributions(sampleContributions);announce("Local holdings and preferences reset.");},[contributionMode,setContributions,clearHoldings]);
  const value = useMemo(()=>({...weeklyData,preferences,update,contributions,setContributions,contributionMode,recapTimezone,reset,notice,announce}),[weeklyData,preferences,contributions,setContributions,contributionMode,recapTimezone,reset,notice]);
  return <DemoContext.Provider value={value}>{children}{weeklyData.holdingsPersistence!=="saved"&&<div className="storage-notice" role="status">This browser could not fully save or read holdings and weekly completion. Keep a JSON backup from Portfolio.</div>}{notice&&<div className="demo-toast" role="status"><span>{notice}</span><button type="button" aria-label="Dismiss notification" onClick={()=>announce("")}>×</button></div>}</DemoContext.Provider>;
}
export function useDemo(){const value=useContext(DemoContext);if(!value)throw new Error("DemoProvider is required");return value;}
