"use client";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { lessons } from "@/lib/lessons";
import { foundationLessons } from "@/lib/foundation";
import styles from "./cornerstone-reward.module.css";
export const PLACEMENT_MS=1050;
function subscribeMotion(notify:()=>void) {
 const media=matchMedia("(prefers-reduced-motion: reduce)");
 media.addEventListener("change",notify);
 return ()=>media.removeEventListener("change",notify);
}
type Props={completed:readonly string[];lessonId:string;newCompletion:boolean;reducedMotion:boolean;nextHref:string;nextTitle:string;saveLabel:string};
export function CornerstoneReward({completed,lessonId,newCompletion,reducedMotion,nextHref,nextTitle,saveLabel}:Props) {
 const {earned,ordered}=foundationLessons(completed);
 const eligible=newCompletion&&earned.some(lesson=>lesson.id===lessonId);
 const [observed,setObserved]=useState(false);
 const started=observed||typeof IntersectionObserver === "undefined";
 const [finished,setFinished]=useState(false);
 const [skipped,setSkipped]=useState(false);
 const root=useRef<HTMLDivElement>(null);
 const systemReduced=useSyncExternalStore(subscribeMotion,()=>matchMedia("(prefers-reduced-motion: reduce)").matches,()=>false);
 const reduced=reducedMotion||systemReduced;
 const settled=!eligible||reduced||finished;
 useEffect(()=>{
  if(!eligible||reduced)return;
  if(typeof IntersectionObserver === "undefined")return;
  const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){setObserved(true);observer.disconnect();}},{threshold:.25});
  if(root.current)observer.observe(root.current);
  return ()=>observer.disconnect();
 },[eligible,reduced]);
 useEffect(()=>{
  if(!started||settled)return;
  const timer=setTimeout(()=>setFinished(true),PLACEMENT_MS+150);
  return ()=>clearTimeout(timer);
 },[started,settled]);
 return <div ref={root} className={styles.reward} data-reduced-motion={reduced||undefined}>
  <p className="eyebrow">Knowledge, made permanent</p>
  <svg viewBox={`0 0 420 ${62+Math.ceil(lessons.length/3)*84}`} role="img" aria-label={`Your foundation: ${earned.length} of ${lessons.length} cornerstones laid`} className={styles.drawing}>
   <path d={`M18 ${40+Math.ceil(lessons.length/3)*84}H402`} className={styles.base}/>
   {ordered.map((lesson,index)=>{
    const laid=earned.some(item=>item.id===lesson.id);
    const incoming=eligible&&lesson.id===lessonId&&!settled;
    return <g key={lesson.id} transform={`translate(${30+index%3*122} ${30+(Math.ceil(lessons.length/3)-1-Math.floor(index/3))*84})`} data-cornerstone={lesson.id} data-laid={laid}>
     <title>{lesson.title}: {laid?"earned":"unfinished"}</title>
     <g data-incoming={incoming||undefined} data-started={incoming&&started||undefined} className={incoming?styles.incoming:undefined} onAnimationEnd={incoming?()=>setFinished(true):undefined}>
      <rect width="114" height="74" rx="8" className={laid?styles.solid:styles.outline}/>
      <text x="16" y="45" className={laid?styles.number:styles.emptyNumber}>{String(lessons.findIndex(item=>item.id===lesson.id)+1).padStart(2,"0")}</text>
      {laid&&<path d="m80 37 6 6 12-13" className={styles.check}/>}
     </g>
    </g>;
   })}
  </svg>
  <h2>{eligible?(settled?"Your cornerstone is laid.":"One more idea. A stronger foundation."):"Your financial foundation"}</h2>
  <p role="status" aria-live="polite">{settled?`${earned.length} of ${lessons.length} cornerstones laid` : "Placing your earned cornerstone…"}</p>
  <p className="muted small">{saveLabel}</p>
  {(!settled||skipped)&&<button type="button" className="demo-link" aria-disabled={skipped||undefined} onClick={()=>{if(!settled){setFinished(true);setSkipped(true);}}}>{skipped?"Animation skipped":"Skip animation"}</button>}
  <div className={styles.next} data-settled={settled}><p className="eyebrow">{nextHref==="/learn"?"Keep your foundation strong":"Continue learning · your next lesson"}</p><Link className="button primary" href={nextHref}>{nextTitle}</Link><Link className="demo-link" href="/learn">Return to foundation</Link><Link className="demo-link" href="/recap">View my Recap</Link></div>
 </div>;
}
