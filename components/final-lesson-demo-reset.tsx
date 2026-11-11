"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMvp } from "./mvp-provider";
import { useSavedIdeas } from "@/lib/saved-ideas";
import { lessons } from "@/lib/lessons";
import { saveSeenStones } from "@/lib/stone-wall";
import { prepareFinalLessonDemo } from "@/lib/final-lesson-demo";

export function FinalLessonDemoReset({onNavigate}:{onNavigate?:()=>void}) {
 const {learning,updateLearning,account,now,persistence}=useMvp();
 const notes=useSavedIdeas("guest",learning.resetGeneration);
 const router=useRouter();
 const [message,setMessage]=useState("");
 if(account.account)return null;
 function prepare() {
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
  if(prepared) {setMessage("Ready: 7 of 8 lessons. Finish the final lesson to lay stone 8.");onNavigate?.();router.push(`/learn/${lessons[lessons.length-1].id}`);}
 }
 return <div className="demo-replay-control"><button type="button" onClick={prepare} disabled={!now} title="Prepare 7 of 8 lessons and replay the final lesson">Replay final lesson</button>{message&&<p role="status">{message}</p>}</div>;
}
