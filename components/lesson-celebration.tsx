"use client";
import {Dialog} from "radix-ui";
import Link from "next/link";
import {useRef,useState} from "react";
import {lessons} from "@/lib/lessons";
import {lessonTopics} from "@/lib/lesson-topics";
export function LessonCelebration({id,reducedMotion}:{id:string;reducedMotion:boolean}) {
 const [open,setOpen]=useState(true);
 const primary=useRef<HTMLAnchorElement>(null);
 const index=lessons.findIndex(l=>l.id===id),lesson=lessons[index];
 return <Dialog.Root open={open} onOpenChange={setOpen}><Dialog.Portal><Dialog.Overlay className="celebration-backdrop"/><Dialog.Content onOpenAutoFocus={event=>{event.preventDefault();primary.current?.focus();}} className="celebration-card" data-reduced-motion={reducedMotion||undefined}>
 <div className="celebration-stone" aria-hidden="true"><svg viewBox="0 0 140 130"><path d="m15 40 54-26 56 25-54 28Z" fill="#d4f279"/><path d="m15 40 56 27v48L15 88Z" fill="#245a45"/><path d="m71 67 54-28v48l-54 28Z" fill="#16382c"/><path d="m53 40 13 10 23-21" stroke="#16382c" strokeWidth="4" fill="none"/></svg></div>
 <p className="eyebrow">Knowledge, made permanent</p><Dialog.Title>Cornerstone #{String(index+1).padStart(2,"0")} Earned: {id==="inflation"?"Purchasing Power":lessonTopics[id]}</Dialog.Title><Dialog.Description>{lesson.takeaway}</Dialog.Description>
 <Link ref={primary} className="button primary" href={`/learn?justCompleted=${index+1}`}>Lay Stone on Your Foundation →</Link><Dialog.Close className="demo-link">Stay with this lesson</Dialog.Close>
 </Dialog.Content></Dialog.Portal></Dialog.Root>;
}
