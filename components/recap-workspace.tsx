"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Check, Clock3, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useDemo } from "./demo-provider";
import { useMvp } from "./mvp-provider";
import { snapshotAsOf, assetColor } from "@/lib/presentation";
import { RecapShareCard } from "./recap-share-card";
import { RecapExtraTools } from "./recap-extra-tools";
import { formatMonth, isPossibleDuplicate, latestContributionMonth, monthKeyInTimeZone, shiftMonth, summarizeRecap, type ContributionEvent, type ContributionKind } from "@/lib/recap";
import { summarizePortfolio } from "@/lib/portfolio";
import { captureSafeEvent } from "@/lib/analytics";
import styles from "./recap-workspace.module.css";

const money=(value:number)=>value.toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0});
const preciseMoney=(value:number)=>value.toLocaleString("en-US",{style:"currency",currency:"USD"});

export function RecapWorkspace(){
  const {contributions,setContributions,contributionMode,recapTimezone,portfolio,announce}=useDemo();
  const { learning } = useMvp();
  const [selectedPeriod,setSelectedPeriod]=useState<string|null>(null);
  const [amount,setAmount]=useState("");
  const [date,setDate]=useState(()=>new Date().toISOString().slice(0,10));
  const [manualKind,setManualKind]=useState<ContributionKind>("contribution");
  const [duplicate,setDuplicate]=useState(false);
  const [editing,setEditing]=useState<{id:string;amount:string;date:string}|null>(null);
  const [editDuplicate,setEditDuplicate]=useState(false);
  const [revision,setRevision]=useState<number|null>(null);
  const [showShare,setShowShare]=useState(false);
  const [isPro,setIsPro]=useState(false);
  useEffect(()=>{if(contributionMode!=="server")return;let active=true;fetch("/api/recaps").then(async response=>{if(response.ok){const data=await response.json();if(active)setIsPro(Boolean(data.isPro))}}).catch(()=>undefined);return()=>{active=false}},[contributionMode]);
  const [goal,setGoal]=useState("");
  const [savedGoal,setSavedGoal]=useState<number|null>(null);
  const [goalPaused,setGoalPaused]=useState(false);
  const serverMode=contributionMode==="server";
  const latest=serverMode?monthKeyInTimeZone(new Date(),recapTimezone):latestContributionMonth(contributions);
  const period=selectedPeriod??latest;
  const summary=useMemo(()=>summarizeRecap(contributions,period),[contributions,period]);
  const overall=useMemo(()=>summarizeRecap(contributions,latest),[contributions,latest]);
  const facts=useMemo(()=>summarizePortfolio(portfolio),[portfolio]);
  const suggested=contributions.filter(event=>event.status==="suggested");
  const manualEntries=contributions.filter(event=>event.source==="manual"&&event.status!=="deleted").sort((a,b)=>b.occurredOn.localeCompare(a.occurredOn));
  const recent=contributions.filter(event=>event.status==="confirmed").sort((a,b)=>b.occurredOn.localeCompare(a.occurredOn));
  const lastAdded=recent.find(event=>event.kind==="contribution");
  const available=recent.filter(event=>isPro||event.occurredOn>=shiftMonth(latest,-2)+"-01");
  const activity=available.filter(event=>!selectedPeriod||event.occurredOn.startsWith(selectedPeriod));
  const periods=[...new Set(available.map(event=>event.occurredOn.slice(0,7)))].sort().reverse();
  async function classify(id:string,status:"confirmed"|"excluded"){
    if(serverMode){const response=await fetch(`/api/contributions/${id}`,{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({status})});const body=await response.json();if(!response.ok){announce(body.reason||"Activity could not be updated.");return}setRevision(Number(body.recap?.revision)||null)}
    setContributions(events=>events.map(event=>event.id===id?{...event,status,userCorrected:true}:event));announce(status==="confirmed"?"Activity confirmed and your recap was recalculated.":"Activity excluded from your recap.");captureSafeEvent("classification_corrected");
  }

  function addManual(event:FormEvent){event.preventDefault();const value=Number(amount);if(!Number.isFinite(value)||value<=0){announce("Enter an amount greater than $0.");return}if(isPossibleDuplicate(contributions,{amount:value,occurredOn:date})){setDuplicate(true);return}void commitManual(value)}

  async function commitManual(value=Number(amount),allowDuplicate=false){
    let item:ContributionEvent={id:`manual-${Date.now()}`,occurredOn:date,amount:value,currency:"USD",kind:manualKind,status:"confirmed",source:"manual",userCorrected:true};
    if(serverMode){const response=await fetch("/api/contributions",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({amount:value,occurredOn:date,kind:manualKind,allowDuplicate})});const body=await response.json();if(!response.ok){if(response.status===409)setDuplicate(true);else announce(body.reason||"Activity could not be saved.");return}const row=body.contribution;item={...item,id:String(row.id)};setRevision(Number(body.recap?.revision)||null)}
    setContributions(events=>[...events,item]);setAmount("");setDuplicate(false);setSelectedPeriod(date.slice(0,7));announce(serverMode?"Activity saved and your recap was recalculated.":"Manual activity added to this session.");
  }

  function beginEdit(entry:ContributionEvent){setEditing({id:entry.id,amount:String(entry.amount),date:entry.occurredOn});setEditDuplicate(false)}

  async function saveManual(allowDuplicate=false){
    if(!editing)return;const value=Number(editing.amount);if(!Number.isFinite(value)||value<=0){announce("Enter an amount greater than $0.");return}if(!allowDuplicate&&isPossibleDuplicate(contributions,{amount:value,occurredOn:editing.date},editing.id)){setEditDuplicate(true);return}
    if(serverMode){const response=await fetch(`/api/contributions/${editing.id}`,{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({amount:value,occurredOn:editing.date,allowDuplicate})});const body=await response.json();if(!response.ok){if(response.status===409)setEditDuplicate(true);else announce(body.reason||"Activity could not be updated.");return}setRevision(Number(body.recap?.revision)||null)}
    setContributions(events=>events.map(event=>event.id===editing.id?{...event,amount:value,occurredOn:editing.date,userCorrected:true}:event));setSelectedPeriod(editing.date.slice(0,7));setEditing(null);setEditDuplicate(false);announce(serverMode?"Manual activity updated.":"Manual activity updated in this session.");
  }

  async function deleteManual(entry:ContributionEvent){
    if(serverMode){const response=await fetch(`/api/contributions/${entry.id}`,{method:"DELETE"});const body=await response.json();if(!response.ok){announce(body?.reason||"Activity could not be removed.");return}setRevision(Number(body?.recap?.revision)||null)}
    setContributions(events=>events.map(event=>event.id===entry.id?{...event,status:"deleted",userCorrected:true}:event));if(editing?.id===entry.id)setEditing(null);announce("Manual activity removed. Earlier recap snapshots stay in your history.");
  }


  return <div className={styles.workspace}>
    <header className={styles.header}><div><span className={styles.eyebrow}>A little perspective</span><h1>Your Recap<span>.</span></h1><p>Your money, your learning, your own pace.</p></div><Link className={styles.softButton} href="/portfolio">View portfolio <ArrowRight size={16}/></Link></header>
    <div className={styles.grid}>
      <section className={styles.overview}>
        <div className={styles.cardHeading}><h2>Your overall picture</h2><span className={styles.badge}>{portfolio.source==="sample"?"Sample portfolio":`${portfolio.source.toUpperCase()} portfolio`}</span></div>
        <div className={styles.picture}><div><p className={styles.label}>Portfolio value</p><strong className={styles.value}>{preciseMoney(facts.totalValue)}</strong><p className={styles.change}>{facts.dayChange<0?"−":"+"}{preciseMoney(Math.abs(facts.dayChange))} <span>vs. previous close</span></p><p className={styles.caption}>Prices as of {new Date(portfolio.asOf).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric",timeZone:"UTC"})}. {portfolio.freshness} data.</p></div>
        </div><p>{snapshotAsOf(portfolio)}</p>
        <div className={styles.legend}>{facts.allocations.map((item)=><Link key={item.symbol} href="/portfolio"><i style={{background:assetColor(item.symbol)}}/><strong>{item.symbol}</strong><span>{item.percent.toFixed(1)}%</span></Link>)}</div>
        <div className={styles.note}>A snapshot of what you own. Explore a holding whenever you’re curious.</div>
      </section>
      <section className={styles.learning}><span className={styles.icon}><BookOpen size={22}/></span><span className={styles.eyebrow}>Room to explore</span><h2>Clarity counts,<br/>too.</h2><p>Get to know what you own, how it works, and what the numbers mean.</p><div className={styles.lessonGraphic} aria-hidden="true"><span/><span/><span/><span/></div><Link href="/learn">Find something to learn <ArrowRight size={17}/></Link><small>{learning.completed.length? `${learning.completed.length} lessons complete. Pick up anywhere.`:"Short lessons. Start wherever you’re curious."}</small></section>
    </div>
    <section className={styles.historySummary}><div><span className={styles.label}>Contributions to date <span className={styles.badge}>{serverMode?"Confirmed":"Sample"}</span></span><strong>{money(overall.lifetimeContributed)}</strong><small>Total money added, before withdrawals or market changes.</small></div><div><span className={styles.label}>Latest contribution</span><strong>{lastAdded?money(lastAdded.amount):"No activity yet"}</strong><small>{lastAdded?new Date(lastAdded.occurredOn+"T12:00:00Z").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric",timeZone:"UTC"}):"Your history will be here when you need it."}</small></div><div className={styles.pace}><span>Life doesn’t follow a monthly schedule.</span><p>Neither does your progress. This is a record, with room for pauses.</p></div></section>
          {suggested.length>0&&<section className="demo-card"><p className="eyebrow">A quick check</p><h2>Did you add this money?</h2><p>We suggest likely contributions. Nothing counts until you confirm it.</p><div className="contribution-review">{suggested.map(event=><div key={event.id}><span className="recap-orb small"><Clock3/></span><div><strong>{money(event.amount)}</strong><small>{event.occurredOn} · {event.accountName??"Connected account"} · Suggested</small></div><button className="icon-button approve" aria-label={`Confirm ${money(event.amount)} contribution`} onClick={()=>void classify(event.id,"confirmed")}><Check/></button><button className="icon-button" aria-label={`Exclude ${money(event.amount)} activity`} onClick={()=>void classify(event.id,"excluded")}><X/></button></div>)}</div></section>}

    <div className={styles.lowerGrid}>
    <section className={styles.card}><details><summary>Activity history <span>View your records</span></summary><div className={styles.detailsBody}><label className={styles.label}>Period<select className="demo-input" value={selectedPeriod??""} onChange={event=>setSelectedPeriod(event.target.value||null)}><option value="">{isPro?"All available activity":"Recent activity · 3 months"}</option>{periods.map(value=><option key={value} value={value}>{formatMonth(value)}</option>)}</select></label><div className={styles.activityList}>{activity.length?activity.map(item=><div key={item.id}><span><strong>{item.kind==="contribution"?"Money added":"Money withdrawn"}</strong><small>{item.occurredOn} · {item.source}</small></span><strong>{item.kind==="withdrawal"?"−":"+"}{money(item.amount)}</strong></div>):<p>No activity in this period.</p>}</div></div></details></section>
    <section className={styles.card}><details><summary>A goal, if you want one <span>Optional · no deadline</span></summary><div className={styles.detailsBody}><p>Choose a contribution total that’s useful to you. You can change it or put it aside.</p><form onSubmit={event=>{event.preventDefault();const value=Number(goal);if(value>0&&Number.isFinite(value)){setSavedGoal(value);setGoalPaused(false)}}}><label className="demo-label">Contribution target<input className="demo-input" type="number" min="1" max="100000000" required value={goal} onChange={event=>setGoal(event.target.value)}/></label><button className={styles.softButton}>Set target</button></form>{savedGoal&&<div className={styles.goal} role="status"><span>{goalPaused?"Goal paused":overall.lifetimeContributed>=savedGoal?"Target reached":`${money(savedGoal-overall.lifetimeContributed)} from your target`}</span>{!goalPaused&&<progress aria-label="Optional contribution target" max={savedGoal} value={Math.min(savedGoal,overall.lifetimeContributed)}/>}<button onClick={()=>setGoalPaused(value=>!value)}>{goalPaused?"Resume":"Pause"}</button><button onClick={()=>{setSavedGoal(null);setGoal("")}}>Remove</button></div>}<small>This optional target stays in this session.</small></div></details></section>
    </div>
    <section className={styles.card}><details><summary>Add or edit activity <Plus size={18}/></summary><div className={styles.detailsBody}>      <section className="demo-card"><p className="eyebrow">Add it yourself</p><h2>Log cash activity.</h2><p>{serverMode?"This entry is saved to your private contribution history.":"Manual entries stay in memory in this demo and clear on reload. Sign in to save them."}</p><form className="manual-contribution" onSubmit={addManual}><label className="demo-label">Type<select className="demo-input" value={manualKind} onChange={event=>setManualKind(event.target.value as ContributionKind)}><option value="contribution">Money added</option><option value="withdrawal">Money withdrawn</option></select></label><label className="demo-label">Amount<input className="demo-input" type="number" min="0.01" max="10000000" step="0.01" value={amount} onChange={event=>setAmount(event.target.value)} placeholder="$100"/></label><label className="demo-label">Date<input className="demo-input" type="date" required value={date} onChange={event=>setDate(event.target.value)}/></label><button className="button primary"><Plus size={17}/> Add activity</button></form>{duplicate&&<div className="duplicate-warning" role="alert"><strong>This looks familiar.</strong><p>Activity with the same amount appears within two days. Add it only if it is separate.</p><button className="button secondary" onClick={()=>void commitManual(Number(amount),true)}>Add anyway</button><button className="demo-link" onClick={()=>setDuplicate(false)}>Cancel</button></div>}</section>
      {manualEntries.length>0&&<section className="demo-card"><p className="eyebrow">Manual activity</p><h2>Entries you control.</h2><div className="manual-entry-list">{manualEntries.map(entry=><div key={entry.id}>{editing?.id===entry.id?<><label className="demo-label">Edit amount<input className="demo-input" type="number" min=".01" value={editing.amount} onChange={event=>setEditing({...editing,amount:event.target.value})}/></label><label className="demo-label">Edit date<input className="demo-input" type="date" required value={editing.date} onChange={event=>setEditing({...editing,date:event.target.value})}/></label><div className="manual-entry-actions"><button className="icon-button approve" aria-label={`Save ${money(entry.amount)} activity`} onClick={()=>void saveManual()}><Save/></button><button className="icon-button" aria-label="Cancel editing" onClick={()=>{setEditing(null);setEditDuplicate(false)}}><X/></button></div>{editDuplicate&&<div className="duplicate-warning" role="alert"><strong>This may be a duplicate.</strong><button className="demo-link" onClick={()=>void saveManual(true)}>Save anyway</button></div>}</>:<><span><strong>{entry.kind==="withdrawal"?"−":"+"}{money(entry.amount)}</strong><small>{entry.occurredOn} · {entry.kind==="contribution"?"Money added":"Money withdrawn"}</small></span><div className="manual-entry-actions"><button className="icon-button" aria-label={`Edit ${money(entry.amount)} activity`} onClick={()=>beginEdit(entry)}><Pencil/></button><button className="icon-button" aria-label={`Delete ${money(entry.amount)} activity`} onClick={()=>void deleteManual(entry)}><Trash2/></button></div></>}</div>)}</div></section>}
</div></details></section>
    <section className={styles.footer}><details><summary>What counts as a contribution?</summary><p>Confirmed external money added. Purchases, sales, dividends, reinvestments, fees, rollovers and internal transfers are excluded. Withdrawals are recorded separately.</p></details><button className={styles.softButton} aria-expanded={showShare} onClick={()=>setShowShare(value=>!value)}>{showShare?"Close share card":"Share a recap"}</button></section>
    {showShare&&<section className={styles.card}><h2>Your recap, your choice.</h2><p>A private card for {formatMonth(period)}. Choose what you share.</p><RecapShareCard key={period} summary={summary} source={serverMode?"server":"sample"}/></section>}
    <section className={styles.card}><RecapExtraTools isPro={isPro}/></section>
    {revision&&<small className={styles.caption}>Activity updated · recap revision {revision}</small>}
    <div className={styles.closing}>Come back when it’s useful. Your place is here.</div>
  </div>
}
