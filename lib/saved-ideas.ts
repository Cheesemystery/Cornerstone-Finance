"use client";
import { useEffect, useMemo, useRef } from "react";
import { createBrowserStore } from "./browser-store";
import { lessons } from "./lessons";
export function validIdeaIds(raw: unknown): string[] {
 return Array.isArray(raw) ? [...new Set(raw.filter((id): id is string => typeof id === "string" && lessons.some(lesson => lesson.id === id)))] : [];
}
export function legacyGuestIdeas() {
 try { const raw=localStorage.getItem("cornerstone-ideas-v1"); return raw===null ? ["what-you-own","read-earnings"] : validIdeaIds(JSON.parse(raw)); }
 catch { return []; }
}
// Import only into the original guest namespace. Never revive bookmarks after a reset
// or expose a guest bookmark to an account. Existing scoped data takes precedence.
const makeStore=(key:string)=>createBrowserStore<string[]>(key,[],validIdeaIds,
 key === "cornerstone-ideas-v1:guest:0" ? legacyGuestIdeas : undefined);
const stores=new Map<string,ReturnType<typeof makeStore>>();
function sharedStore(key:string) {
 let store=stores.get(key);
 if(!store){store=makeStore(key);stores.set(key,store);}
 return store;
}
export function useSavedIdeas(owner:string,resetGeneration:number) {
 const store=useMemo(()=>sharedStore(`cornerstone-ideas-v1:${owner}:${resetGeneration}`),[owner,resetGeneration]);
 const {value,update,persistence}=store.useStore();
 const seeded=useRef<string|null>(null);
 useEffect(()=>{
  if(owner==="guest"&&seeded.current!==`${owner}:${resetGeneration}`){seeded.current=`${owner}:${resetGeneration}`;if(!value.length)update(()=>["what-you-own","fees-and-time"]);}
 },[owner,resetGeneration,update,value.length]);
 return {ids:value,persistence,
  save:(id:string)=>update(ids=>ids.includes(id)?ids:[...ids,id]),
  remove:(id:string)=>update(ids=>ids.filter(saved=>saved!==id)),
 };
}
