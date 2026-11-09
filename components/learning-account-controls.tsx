"use client";
import { useState } from "react";
import Link from "next/link";
import { useMvp } from "./mvp-provider";
export function LearningAccountControls() {
 const {account,guestLearning}=useMvp();
 const [declined,setDeclined]=useState(false);
 if(!account.account)return <section className="mvp-card"><h2>Your learning account</h2><p>Guest progress stays in this browser. Account access depends on availability.</p><Link className="demo-link" href="/sign-in?returnTo=/learn">Account sign-in</Link></section>;
 const value=account.account;
 const hasGuest=guestLearning.completed.length>0 || Object.keys(guestLearning.steps).length>0;
 return <section className="mvp-card"><h2>Your learning account</h2><p role="status">{value.status==="saved"?"Saved to your account":value.status==="pending"?"Saving to your account…":value.message}</p>{!value.local && <p role="status">Browser storage is unavailable. Keep this page open until account saving succeeds; sign-out waits for that save.</p>}{value.status==="error" && <button className="button primary" onClick={()=>void account.retry()}>Reload and retry</button>}{hasGuest && !declined && <div><p>Import the learning saved as a guest in this browser? Only lesson progress and learning history are included.</p><button className="button primary" onClick={()=>account.importGuest(guestLearning)}>Import guest learning</button><button className="demo-link" onClick={()=>setDeclined(true)}>Keep guest learning separate</button><p className="muted small">You can leave it separate. Importing again never adds duplicate lesson bricks.</p></div>}<button className="demo-link" disabled={!value.local && value.status !== "saved"} onClick={()=>void account.signOut()}>Sign out</button></section>;
}
