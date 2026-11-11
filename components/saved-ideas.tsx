"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Bookmark, Check, ArrowRight } from "lucide-react";
import { Button, Card, SectionHeading, EmptyState, Badge } from "./ui/studio";
import { lessons } from "@/lib/lessons";
import { useSavedIdeas } from "@/lib/saved-ideas";
import { useMvp } from "./mvp-provider";

export function SavedIdeas({lessonId}:{lessonId?:string}) {
 const {learning,account}=useMvp();
 const {ids,save,remove,persistence}=useSavedIdeas(account.account?.userId??"guest",learning.resetGeneration);
 const collectionHeading=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  if(lessonId)return;
  function revealCollection() {
   if(window.location.hash !== "#saved-ideas")return;
   collectionHeading.current?.scrollIntoView({block:"start",behavior:"instant"});
   collectionHeading.current?.focus({preventScroll:true});
  }
  revealCollection();
  window.addEventListener("hashchange",revealCollection);
  return ()=>window.removeEventListener("hashchange",revealCollection);
 },[lessonId]);
 const savedLessons=ids.flatMap(id=>{const lesson=lessons.find(item=>item.id===id);return lesson?[lesson]:[];});
 const storageNote=persistence==="session"?"Available for this session. Browser storage is unavailable; this idea may disappear after closing or refreshing.":persistence==="recovered"?"Some saved ideas could not be read. Save again to keep a fresh copy.":null;
 if(lessonId) {
  const lesson=lessons.find(item=>item.id===lessonId);
  if(!lesson||!learning.completed.includes(lessonId))return null;
  const saved=ids.includes(lessonId);
  return <aside className="saved-principle" aria-label="Lesson takeaway"><p className="eyebrow">The idea to keep</p><h2>{lesson.takeaway}</h2><div className="idea-save-actions"><Button variant="secondary" aria-pressed={saved} onClick={()=>saved?remove(lessonId):save(lessonId)}>{saved?<Check size={17}/>:<Bookmark size={17}/>} {saved?"Remove saved idea":"Save this idea"}</Button>{saved&&<Link className="demo-link" href="/learn#saved-ideas">View saved ideas <ArrowRight size={16}/></Link>}</div><p role="status">{storageNote??(saved?"Idea saved in this browser.":"Optional. Save the idea or continue to your next lesson.")}</p></aside>;
 }
 return <Card className="saved-ideas" id="saved-ideas" aria-label="Saved ideas"><div ref={collectionHeading} tabIndex={-1}><SectionHeading eyebrow="Your personal field notes" title="Ideas worth keeping." action={<Badge>{savedLessons.length} saved</Badge>}/></div><p>Keep useful concepts close. Saved on this device; review or remove them whenever you like.</p>{!savedLessons.length&&<EmptyState title="Your next useful idea belongs here.">Complete a lesson, then choose Save this idea. Saving is always optional.</EmptyState>}{savedLessons.map(lesson=><article key={lesson.id}><p className="eyebrow">{lesson.tag}</p><h3>{lesson.takeaway}</h3><p>{lesson.id==="what-you-own"?"A ticker symbol like VTI is just the label on the jar. The holdings inside tell you that you own 3,500+ real US companies.":lesson.id==="fees-and-time"?"A 1% annual fee sounds tiny, but over 30 years it can quietly eat more than 25% of your total investment gains. Stick to low-cost index funds under 0.10%.":lesson.sections[2].body}</p><div className="idea-save-actions"><Link className="demo-link" href={`/learn/${lesson.id}`}>Review: {lesson.title} →</Link><button type="button" className="demo-link" onClick={()=>{remove(lesson.id);collectionHeading.current?.focus({preventScroll:true});}} aria-label={`Remove idea from ${lesson.title}`}>Remove</button></div></article>)}{storageNote&&<p role="status">{storageNote}</p>}</Card>;
}
