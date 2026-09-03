"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

const levels=[['New','I own little or nothing yet.'],['Growing','I invest, but want a clearer process.'],['Experienced','I want faster portfolio context.']];
const goals=[['Understand','Explain what changed and why.'],['Research','Make company and fund research easier.'],['Stay consistent','Keep my long-term plan in view.']];

export function OnboardingFlow(){
  const router=useRouter();
  const [step,setStep]=useState(1);const [level,setLevel]=useState('Growing');const [goal,setGoal]=useState('Understand');const [status,setStatus]=useState('');
  async function connect(){setStatus('Checking secure connection…');const response=await fetch('/api/plaid/link-token',{method:'POST'});const body=await response.json();if(response.status===401){router.push('/sign-in?returnTo=/onboarding');return}setStatus(response.ok?'Secure connection is ready.':body.reason||'Plaid sandbox is not configured yet. Use the sample portfolio or import a CSV.');}
  function csv(e:ChangeEvent<HTMLInputElement>){const file=e.target.files?.[0];if(file)setStatus(`${file.name} is ready for local validation. No file has been uploaded.`)}
  return <div className="onboarding"><div className="progress-line" aria-label={`Step ${step} of 3`}><span style={{width:`${step/3*100}%`}}/></div>
    {step===1&&<section><p className="eyebrow">Step 1 of 3</p><h1>How familiar is investing?</h1><p className="muted">This changes explanation depth—not which tools you can access.</p><div className="choice-grid workspace">{levels.map(([title,copy])=><button key={title} className={`choice ${level===title?'choice-selected':''}`} onClick={()=>setLevel(title)}><strong>{title}</strong><span>{copy}</span></button>)}</div><div className="step-actions"><Link className="button secondary" href="/">Use sample portfolio</Link><button className="button primary" onClick={()=>setStep(2)}>Continue</button></div></section>}
    {step===2&&<section><p className="eyebrow">Step 2 of 3</p><h1>What should Cornerstone help with first?</h1><p className="muted">Your briefing will prioritize this goal.</p><div className="choice-grid workspace">{goals.map(([title,copy])=><button key={title} className={`choice ${goal===title?'choice-selected':''}`} onClick={()=>setGoal(title)}><strong>{title}</strong><span>{copy}</span></button>)}</div><div className="step-actions"><button className="button secondary" onClick={()=>setStep(1)}>Back</button><button className="button primary" onClick={()=>setStep(3)}>Continue</button></div></section>}
    {step===3&&<section><p className="eyebrow">Step 3 of 3</p><h1>Choose how to begin</h1><p className="muted">Connecting is read-only. Cornerstone cannot place trades, withdraw money, or change your brokerage account.</p><div className="choice-grid workspace"><button className="choice" onClick={connect}><strong>Connect securely</strong><span>Use Plaid Investments in read-only mode.</span></button><label className="choice" style={{cursor:'pointer'}}><strong>Import a CSV</strong><span>Choose an export from your brokerage.</span><input className="sr-only" type="file" accept=".csv,text/csv" onChange={csv}/></label><Link className="choice" href="/"><strong>Use sample data</strong><span>Explore the complete briefing without an account.</span></Link></div>{status&&<p className="notice workspace" role="status">{status}</p>}<div className="step-actions"><button className="button secondary" onClick={()=>setStep(2)}>Back</button><Link className="button primary" href="/">Open briefing</Link></div></section>}
  </div>
}
