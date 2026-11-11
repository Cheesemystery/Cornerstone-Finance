"use client";
import {useEffect,useState,useSyncExternalStore} from "react";
import {lessons} from "@/lib/lessons";
const subscribe=(notify:()=>void)=>{window.addEventListener("popstate",notify);return()=>window.removeEventListener("popstate",notify);};
export function useFoundationArrival(completed:readonly string[],ready:boolean,reduced:boolean) {
 const search=useSyncExternalStore(subscribe,()=>window.location.search,()=>"");
 const number=Number(new URLSearchParams(search).get("justCompleted"));
 const candidate=Number.isInteger(number)?lessons[number-1]?.id:undefined;
 const id=ready&&candidate&&completed.includes(candidate)?candidate:undefined;
 const [finished,setFinished]=useState(false);
 useEffect(()=>{
  if(!id)return;
  const media=matchMedia("(prefers-reduced-motion: reduce)");
  const timer=setTimeout(()=>{
   setFinished(true);
   const url=new URL(window.location.href);url.searchParams.delete("justCompleted");
   window.history.replaceState(window.history.state,"",url.pathname+url.search+url.hash);
  },reduced||media.matches?0:2000);
  return()=>clearTimeout(timer);
 },[id,reduced]);
 return {id,placing:!!id&&!finished};
}
