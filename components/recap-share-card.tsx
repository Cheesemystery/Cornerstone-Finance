"use client";
import { Download, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { RecapSummary } from "@/lib/recap";
import { formatMonth } from "@/lib/recap";
import { captureSafeEvent } from "@/lib/analytics";
const money=(value:number)=>value.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0});

export function RecapShareCard({summary,compact=false,source="sample"}:{summary:RecapSummary;compact?:boolean;source?:"sample"|"server"}){
  const [showAmount,setShowAmount]=useState(false);
  const [error,setError]=useState("");
  const state=showAmount?"shown":"hidden";
  const amount=showAmount?money(summary.contributed):"••••";
  const label=source==="sample"?"Sample activity":"Confirmed activity";
  function download(){
    // Render the current visible state locally: edited demo amounts never leave the browser.
    const canvas=document.createElement("canvas");canvas.width=1200;canvas.height=630;
    const ctx=canvas.getContext("2d");if(!ctx){setError("Your browser could not create this image.");return}
    ctx.fillStyle="#173f2f";ctx.fillRect(0,0,1200,630);
    ctx.fillStyle="#fff";ctx.font="34px Georgia";ctx.fillText("Cornerstone.",64,85);
    ctx.fillStyle="#c7d8ca";ctx.font="22px Arial";ctx.fillText(formatMonth(summary.period)+" · "+label,64,185);
    ctx.fillStyle="#fff";ctx.font="100px Arial";ctx.fillText(amount,64,310,1072);
    ctx.font="50px Arial";ctx.fillText("My money, at my own pace.",64,405);
    ctx.fillStyle="#c7d8ca";ctx.font="24px Arial";ctx.fillText("A moment in my story.",64,462);ctx.fillText("Personal recap · No schedule required",64,557);
    canvas.toBlob(blob=>{if(!blob){setError("Your browser could not create this image.");return}const url=URL.createObjectURL(blob);const link=document.createElement("a");link.href=url;link.download=`cornerstone-${summary.period}.png`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);captureSafeEvent("share_downloaded")},"image/png");
  }
  return <div className={`recap-share-wrap ${compact?"is-compact":""}`}><div className="recap-share-card" aria-label={`Share card. Dollar amount ${state}.`}><span className="recap-share-brand">Cornerstone<span>.</span></span><p>{formatMonth(summary.period)} · {label}</p><strong>{amount}</strong><h3>My money, at my own pace.</h3><small>A moment in my story.</small><div><span>Personal recap</span><span>No schedule required</span></div></div><div className="recap-share-actions"><button className="button secondary" aria-pressed={showAmount} onClick={()=>setShowAmount(value=>!value)}>{showAmount?<EyeOff size={17}/>:<Eye size={17}/>} {showAmount?"Hide amount":"Show amount"}</button><button className="button primary" onClick={download}><Download size={17}/> Download</button></div><p className="demo-muted">Amounts start hidden each time. Your download matches this card.</p>{error&&<p role="alert">{error}</p>}</div>;
}
