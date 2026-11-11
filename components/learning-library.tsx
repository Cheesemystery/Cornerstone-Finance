"use client";
import Link from "next/link";
import { ArrowRight, Check, Circle } from "lucide-react";
import { lessons } from "@/lib/lessons";
import { learningStats, nextLesson } from "@/lib/learning-progress";
import { useMvp } from "./mvp-provider";
import { LearningAccountControls } from "./learning-account-controls";
import { LearningFoundation } from "./learning-foundation";
import { Card, SectionHeading, Badge } from "./ui/studio";
import { useFoundationArrival } from "./use-foundation-arrival";
import { SavedIdeas } from "./saved-ideas";
const groups=[
 {title:"Investing fundamentals",ids:["what-you-own"]},
 {title:"Markets, risk & diversification",ids:["why-prices-move","spread-your-risk"]},
 {title:"Growth & investment decisions",ids:["read-earnings","fees-and-time","research-checklist"]},
 {title:"Planning beyond the basics",ids:["time-horizon","inflation"]},
];
export function LearningLibrary() {
 const {learning,now,account}=useMvp();
 const next=nextLesson(learning);
 const stats=learningStats(learning,now??new Date("2026-01-01T12:00:00Z"));
 const completed=lessons.filter(l=>learning.completed.includes(l.id)).length;
 const href=next?`/learn/${next.id}`:"/learn/review";
 const arrival=useFoundationArrival(learning.completed,now!==null,learning.reducedMotion);
 const displayed=completed-(arrival.placing?1:0);
 const nextMilestone=stats.achievements.find(item=>!item.earned);
 return <div className="learn-studio tabular-nums">
  <section className="learn-pilot" aria-labelledby="learn-dashboard-title">
   <div className="learn-pilot-intro"><p className="eyebrow">The Cornerstone field guide</p><p className="learn-pilot-count" aria-live="polite">{displayed} of {lessons.length} lessons{completed===lessons.length&&!arrival.placing?" · Foundation Complete 🎉":""}</p><progress className="foundation-progress" aria-label="Foundation progress" value={displayed} max={lessons.length}/><h2 id="learn-dashboard-title">{completed===lessons.length?"A foundation worth keeping.":completed?"Build on what you know.":"Understand your money. Build your confidence."}</h2><p>{next?next.intro:"Useful ideas, ready whenever you need them. Keep them fresh with a short review."}</p><Link className="button primary" href={href}>{!completed?"Start learning":next?`Continue Lesson ${lessons.findIndex(l=>l.id===next.id)+1}`:"Review Your Foundation"}<ArrowRight size={18}/></Link>{next&&<p className="learn-pilot-caption">Up next: {next.title} · {next.minutes} min</p>}</div>
   <LearningFoundation arrivalId={arrival.id} placing={arrival.placing}/>
  </section>
  {account?.account&&<LearningAccountControls key={account.account.userId}/>}
  <section aria-labelledby="learning-path-heading"><SectionHeading eyebrow="Useful ideas. A lasting foundation." title="Your learning path" action={<span>All lessons open · learn at your pace</span>}/><h2 id="learning-path-heading" className="sr-only">Learning pathway</h2><div className="learn-path-groups">{groups.map((group,index)=><Card className="learn-path-group" key={group.title}><p className="eyebrow">Chapter {String(index+1).padStart(2,"0")}</p><h3>{group.title}</h3><ol>{group.ids.map(id=>{const lesson=lessons.find(l=>l.id===id)!;const done=learning.completed.includes(id),current=next?.id===id;return <li key={id} data-state={done?"complete":current?"current":"upcoming"}><Link href={`/learn/${id}`} aria-current={current?"step":undefined}><span className="learn-row-state" aria-hidden="true">{done?<Check size={17}/>:<Circle size={15}/>}</span><div><strong>{lesson.title}</strong><small>{lesson.minutes} min · {done?"Completed · review":current?(learning.steps[id]??0)>0?"Current · in progress":"Current · up next":"Upcoming · available"}</small></div><ArrowRight size={16}/></Link></li>;})}</ol></Card>)}</div></section>
  <SavedIdeas/>
  <details className="learn-milestones" open><summary>Milestones & learning history</summary><Card><SectionHeading eyebrow="Evidence of your effort" title="Milestones" action={<Link className="demo-link" href="/recap">Your learning history →</Link>}/><ul>{stats.achievements.map(item=><li key={item.id} data-earned={item.earned}><span aria-hidden="true">{item.earned?<Check size={18}/>:<Circle size={16}/>}</span><div><strong>{item.title}</strong><small>{item.description}</small></div><Badge tone={item.earned?"achievement":"neutral"}>{item.earned?"Earned":item.id===nextMilestone?.id?"Available next":"Upcoming"}</Badge></li>)}</ul></Card></details>
 </div>;
}
