"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMvp } from "./mvp-provider";
import { useSavedIdeas } from "@/lib/saved-ideas";
import { lessons } from "@/lib/lessons";
import { saveSeenStones } from "@/lib/stone-wall";
import { prepareFinalLessonDemo } from "@/lib/final-lesson-demo";

let demoInitialized=false;
export function FinalLessonDemoReset({onNavigate}:{onNavigate?:()=>void}) {
 const {learning,updateLearning,account,now,persistence}=useMvp();
 const notes=useSavedIdeas("guest",learning.resetGeneration);
 const router=useRouter();
 const [message,setMessage]=useState("");
 const initialized=useRef(false);
 const prepareRef=useRef<((navigate?:boolean)=>void)|null>(null);
 useEffect(()=>{
  if(now&&!account.account&&!account.checking&&!initialized.current&&!demoInitialized){initialized.current=true;demoInitialized=true;prepareRef.current?.(false);}
 },[now,account.account,account.checking]);
 useEffect(()=>{
  const keyboard=(event:KeyboardEvent)=>{
   const target=event.target as HTMLElement|null;
   if(event.shiftKey&&event.key.toLowerCase()==="r"&&!event.ctrlKey&&!event.metaKey&&!event.altKey&&!(target instanceof Element && target.closest("input,textarea,select,[contenteditable=true]"))){
    event.preventDefault();prepareRef.current?.();
   }
  };
  window.addEventListener("keydown",keyboard);return()=>window.removeEventListener("keydown",keyboard);
 },[]);
 prepareRef.current=prepare;
 if(account.account)return null;
 function prepare(navigate=true) {
  if(!now)return;
  if(persistence!=="saved"||notes.persistence!=="saved") {
   setMessage("Enable browser storage before preparing the demo.");return;
  }
  let prepared=false;
  updateLearning(current=>{
   const next=prepareFinalLessonDemo(current);
   try {
    // Carry field notes into the new reset generation before changing learning.
    localStorage.setItem(`cornerstone-ideas-v1:guest:${next.resetGeneration}`,JSON.stringify(notes.ids));
   } catch { setMessage("Couldn’t preserve field notes. Demo progress was not changed.");return current; }
   saveSeenStones(next.completed);
   prepared=true;return next;
  });
  if(prepared) {window.dispatchEvent(new Event("cornerstone-progress-sync"));setMessage("Ready: 7 of 8 lessons. Finish the final lesson to lay stone 8.");if(navigate){onNavigate?.();router.push(`/learn/${lessons[lessons.length-1].id}`);}}
 }
 return <div className="demo-replay-control"><button type="button" onClick={()=>prepare()} disabled={!now} title="Prepare 7 of 8 lessons and replay the final lesson">Replay final lesson</button>{message&&<p role="status">{message}</p>}</div>;
}
