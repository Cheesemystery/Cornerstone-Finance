"use client";
import { useState } from "react";
import { GrowthCalculator } from "./growth-calculator";
import { useDemo } from "./demo-provider";
import { captureSafeEvent } from "@/lib/analytics";

// Keep optional paid tools accessible without turning the overview into a promotion.
export function RecapExtraTools({isPro}:{isPro:boolean}){
 const {contributionMode}=useDemo();
 const [preview,setPreview]=useState(false);
 const [billingPeriod,setBillingPeriod]=useState<"monthly"|"annual">("monthly");
 const [status,setStatus]=useState("");
 async function checkout(){setStatus("Opening secure checkout…");try{const response=await fetch("/api/billing/checkout",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({price:billingPeriod})});const data=await response.json();if(!response.ok)throw new Error(data.reason||"Checkout is unavailable.");captureSafeEvent("trial_started");location.href=data.url}catch(error){setStatus(error instanceof Error?error.message:"Checkout is unavailable.")}}
 return <details><summary>Explore a future scenario</summary><div style={{paddingTop:20}}><p>Explore the math with assumptions you choose. This is an illustration, with no contribution schedule to follow.</p>{isPro||preview?<><GrowthCalculator/>{preview&&!isPro&&<button className="demo-link" onClick={()=>setPreview(false)}>Close sample preview</button>}</>:<><p>Cornerstone Pro · 14 days free, then {billingPeriod==="monthly"?"$4.99/month":"$39.99/year"}. Cancel anytime.</p><label className="demo-label">Billing period<select className="demo-input" value={billingPeriod} onChange={event=>setBillingPeriod(event.target.value as "monthly"|"annual")}><option value="monthly">Monthly</option><option value="annual">Yearly</option></select></label><button className="button secondary" onClick={checkout}>Start free trial</button>{contributionMode==="sample"&&<button className="demo-link" onClick={()=>setPreview(true)}>Explore a sample scenario</button>}</>}{status&&<p role="status">{status}</p>}</div></details>;
}
