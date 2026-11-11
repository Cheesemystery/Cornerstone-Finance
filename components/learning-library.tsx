"use client";
import Link from "next/link";
import { LearningChallengePath } from "./learning-challenge-path";
import { CampusLeaderboard } from "./campus-leaderboard";
import { RothSimulatorLaunch } from "./roth-flight-simulator";
import { FinalCornerstoneHook } from "./final-cornerstone-hook";
import { ArrowRight, Check, Circle } from "lucide-react";
import { lessons } from "@/lib/lessons";
import { learningStats, nextLesson } from "@/lib/learning-progress";
import { useMvp } from "./mvp-provider";
import { LearningAccountControls } from "./learning-account-controls";
import { LearningFoundation } from "./learning-foundation";
import { Card, SectionHeading, Badge } from "./ui/studio";
import { useFoundationArrival } from "./use-foundation-arrival";
import { SavedIdeas } from "./saved-ideas";
export function LearningLibrary() {
 const {learning,now,account}=useMvp();
 const next=nextLesson(learning);
 const finalPending=lessons.slice(0,7).every(l=>learning.completed.includes(l.id))&&!learning.completed.includes("inflation");
 const stats=learningStats(learning,now??new Date("2026-01-01T12:00:00Z"));
 const completed=lessons.filter(l=>learning.completed.includes(l.id)).length;
 const href=next?`/learn/${next.id}`:"/learn/review";
 const arrival=useFoundationArrival(learning.completed,now!==null,learning.reducedMotion);
 const displayed=completed-(arrival.placing?1:0);
 const nextMilestone=stats.achievements.find(item=>!item.earned);
 return <div className="learn-studio tabular-nums">
  <section className="learn-pilot" aria-label="Learning dashboard">
   <div className="learn-pilot-intro"><FinalCornerstoneHook/>{!finalPending&&<><p className="eyebrow">The Cornerstone field guide</p><p className="learn-pilot-count" aria-live="polite">{displayed} of {lessons.length} lessons{completed===lessons.length&&!arrival.placing?" · Foundation Complete 🎉":""}</p><progress className="foundation-progress" aria-label="Foundation progress" value={displayed} max={lessons.length}/><h2 id="learn-dashboard-title">{completed===lessons.length?"A foundation worth keeping.":completed?"Build on what you know.":"Understand your money. Build your confidence."}</h2><p>{next?next.intro:"Useful ideas, ready whenever you need them. Keep them fresh with a short review."}</p><Link className="button primary" href={href}>{!completed?"Start learning":next?`Continue Lesson ${lessons.findIndex(l=>l.id===next.id)+1}`:"Review Your Foundation"}<ArrowRight size={18}/></Link>{next&&<p className="learn-pilot-caption">Up next: {next.title} · {next.minutes} min</p>}</>}</div>
   <LearningFoundation arrivalId={arrival.id} placing={arrival.placing}/>
  </section>
  <CampusLeaderboard/>
  {account?.account&&<LearningAccountControls key={account.account.userId}/>}
  <LearningChallengePath key={learning.resetGeneration}/>

  <RothSimulatorLaunch/>
  <SavedIdeas/>
  <details className="learn-milestones" open><summary>Milestones & learning history</summary><Card><SectionHeading eyebrow="Evidence of your effort" title="Milestones" action={<Link className="demo-link" href="/recap">Your learning history →</Link>}/><ul>{stats.achievements.map(item=><li key={item.id} data-earned={item.earned}><span aria-hidden="true">{item.earned?<Check size={18}/>:<Circle size={16}/>}</span><div><strong>{item.title}</strong><small>{item.description}</small></div><Badge tone={item.earned?"achievement":"neutral"}>{item.earned?"Earned":item.id===nextMilestone?.id?"Available next":"Upcoming"}</Badge></li>)}</ul></Card></details>
 </div>;
}
