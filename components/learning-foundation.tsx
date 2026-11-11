"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { foundationLessons } from "@/lib/foundation";
import { nextLesson } from "@/lib/learning-progress";
import { lessonTopics } from "@/lib/lesson-topics";
import { lessons } from "@/lib/lessons";
import { useMvp } from "./mvp-provider";
import { Card, SectionHeading } from "./ui/studio";
export function LearningFoundation({arrivalId,placing=false}:{arrivalId?:string;placing?:boolean}) {
 const {learning}=useMvp();
 const [choice,setSelected]=useState<string|null>(null);
 const selected=choice??arrivalId??nextLesson(learning)?.id??learning.completed.at(-1)??lessons[0].id;
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(arrivalId)root.current?.scrollIntoView({block:"center",behavior:learning.reducedMotion||matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});},[arrivalId,learning.reducedMotion]);
 const lesson=lessons.find(l=>l.id===selected)!;
 const {earned,ordered}=foundationLessons(learning.completed);
 return <div ref={root} id="foundation"><Card className="foundation-panel"><SectionHeading eyebrow="Built by you" title="Your financial foundation" action={<span>{earned.length} / {lessons.length} cornerstones earned</span>}/><div className="foundation-layout"><div className="foundation-architecture"><div className="foundation-stones" role="group" aria-label="Lesson cornerstones">{ordered.map((l,i)=><button key={l.id} type="button" style={{gridRow:Math.ceil(lessons.length/3)-Math.floor(i/3),gridColumn: i>=6 ? `${1+(i%3)*3} / span 3` : `${1+(i%3)*2} / span 2`}} data-earned={learning.completed.includes(l.id)} data-placing={placing&&arrivalId===l.id||undefined} aria-pressed={selected===l.id} aria-label={`${l.title} — ${learning.completed.includes(l.id)?"earned":"unfinished"}`} onClick={()=>setSelected(l.id)} onFocus={()=>setSelected(l.id)} onMouseEnter={()=>setSelected(l.id)}><span>{String(lessons.findIndex(item=>item.id===l.id)+1).padStart(2,"0")}</span><small>{lessonTopics[l.id]}</small>{learning.completed.includes(l.id)&&<Check size={18}/>}</button>)}</div><div className="foundation-plinth"/><p>One lesson understood. One cornerstone earned.</p></div><div className="foundation-selection" aria-live="polite"><p className="eyebrow">{learning.completed.includes(selected)?"A permanent part of your foundation":"Room to build"}</p><h3>{lesson.title}</h3><p>{learning.completed.includes(selected)?lesson.takeaway:lesson.intro}</p><Link className="demo-link" href={`/learn/${selected}`}>{learning.completed.includes(selected)?"Review this lesson":"Explore this lesson"}<ArrowRight size={16}/></Link></div></div></Card></div>;
}
