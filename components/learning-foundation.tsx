"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { foundationLessons } from "@/lib/foundation";
import { nextLesson } from "@/lib/learning-progress";
import { lessonTopics } from "@/lib/lesson-topics";
import { lessons } from "@/lib/lessons";
import { useMvp } from "./mvp-provider";
import { Card, SectionHeading } from "./ui/studio";
import styles from "./learning-foundation.module.css";
export function LearningFoundation({arrivalId,placing=false}:{arrivalId?:string;placing?:boolean}) {
 const {learning}=useMvp();
 const [choice,setSelected]=useState<string|null>(null);
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(arrivalId)root.current?.scrollIntoView({block:"center",behavior:learning.reducedMotion||matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});},[arrivalId,learning.reducedMotion]);
 const next=nextLesson(learning);
 const selected=choice??arrivalId??next?.id??learning.completed.at(-1)??lessons[0].id;
 const lesson=lessons.find(l=>l.id===selected)!;
 const {earned,ordered}=foundationLessons(learning.completed);
 return <div ref={root} id="foundation"><Card className="foundation-panel"><SectionHeading eyebrow="Built by you" title="Your financial foundation" action={<span>{earned.length} / {lessons.length} cornerstones earned</span>}/><div className="foundation-layout"><div className="foundation-architecture"><div className={`foundation-stones ${styles.wall}`} role="group" aria-label="Lesson cornerstones">{ordered.map((l,i)=>{
 const laid=learning.completed.includes(l.id);
 return <button key={l.id} type="button" className={styles.stone} style={{gridRow:Math.ceil(lessons.length/3)-Math.floor(i/3),gridColumn:i>=6?`${1+(i%3)*3} / span 3`:`${1+(i%3)*2} / span 2`}} data-earned={laid} data-next={next?.id===l.id||undefined} data-placing={placing&&arrivalId===l.id||undefined} aria-pressed={selected===l.id} aria-label={`${l.title} — ${laid?"earned":"unfinished"}`} onClick={()=>setSelected(l.id)} onFocus={()=>setSelected(l.id)} onMouseEnter={()=>setSelected(l.id)}><span className={styles.numeral}>◆ {String(lessons.findIndex(item=>item.id===l.id)+1).padStart(2,"0")}</span><span className={styles.badge}>{laid?"LAID ✓":next?.id===l.id?`NEXT UP · ${l.minutes} MIN`:"UNLAID"}</span><small className={styles.topic}>{lessonTopics[l.id]}</small></button>;
 })}</div><div className="foundation-plinth"/><p>One lesson understood. One cornerstone earned.</p></div><div className="foundation-selection" aria-live="polite"><p className="eyebrow">{learning.completed.includes(selected)?"A permanent part of your foundation":"Room to build"}</p><h3>{lesson.title}</h3><p>{learning.completed.includes(selected)?lesson.takeaway:lesson.intro}</p><Link className="demo-link" href={`/learn/${selected}`}>{learning.completed.includes(selected)?"Review this lesson":"Explore this lesson"}<span aria-hidden="true"> →</span></Link></div></div></Card></div>;
}
