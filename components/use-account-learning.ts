"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { accountSnapshotSchema, learningImport, mergeLearning, type AccountSnapshot } from "@/lib/learning-account-state";
import { learningSchema, type LearningState } from "@/lib/learning-progress";
type Account = AccountSnapshot & {status:"saved"|"pending"|"error";message:string;local:boolean};
const cacheKey = (id:string) => `cornerstone-learning-account-v1:${id}`;
export function useAccountLearning(enabled:boolean) {
 const [account,setAccount] = useState<Account|null>(null);
 const [checking,setChecking] = useState(enabled);
 const [busy,setBusy] = useState(false);
 const [locked,setLocked] = useState(false);
 const current = useRef<Account|null>(null), saving = useRef(false), generation = useRef(0), sequence = useRef(0);
 const commit = useCallback((value:Account|null) => {current.current=value;setAccount(value);},[]);
 const cache = useCallback((value:Account) => {
  try {localStorage.setItem(cacheKey(value.userId),JSON.stringify({...value,dirty:value.status !== "saved"}));return true;} catch {return false;}
 },[]);
 const cancel = useCallback(()=>{generation.current++;},[]);
 const load = useCallback(async() => {
  if (!enabled) return;
  const token=++generation.current;
  setChecking(true);
  try {
   const response=await fetch("/api/learning/account",{cache:"no-store",signal:AbortSignal.timeout(12000)});
   if(token!==generation.current)return;
   if(response.status===401) {if(current.current){setLocked(true);}else{commit(null);setLocked(false);}return;}
   if(response.status===503 && !current.current) {commit(null);setLocked(false);return;}
   if(!response.ok) throw new Error();
   const remote=accountSnapshotSchema.parse(await response.json());
   let local=current.current?.userId===remote.userId && current.current.status!=="saved" ? current.current : null;
   try {
    const stored=JSON.parse(localStorage.getItem(cacheKey(remote.userId)) ?? "null");
    const parsed=accountSnapshotSchema.safeParse(stored);
    if(!local && stored?.dirty && parsed.success && parsed.data.userId===remote.userId) local={...parsed.data,status:"pending",message:"",local:true};
   } catch { /* Keep the verified remote record; never adopt another account's cache. */ }
   const value:Account={...remote,state:local?mergeLearning(remote.state,local.state):remote.state,status:local?"pending":"saved",message:"",local:true};
   value.local=cache(value);commit(value);setLocked(false);
  } catch {if(token===generation.current)setLocked(true);}
  finally {if(token===generation.current)setChecking(false);}
 },[enabled,commit,cache]);
 useEffect(()=>{
  if(!enabled)return;
  const start=setTimeout(()=>{void load();},0);
  const refresh=()=>{void load();};
  window.addEventListener("focus",refresh);
  const storage=(event:StorageEvent)=>{if(event.key?.startsWith("cornerstone-learning-account-v1:") || event.key==="cornerstone-learning-session")refresh();};
  window.addEventListener("storage",storage);
  return ()=>{clearTimeout(start);cancel();window.removeEventListener("focus",refresh);window.removeEventListener("storage",storage);};
 },[enabled,load,cancel]);
 const update=useCallback((change:(state:LearningState)=>LearningState)=>{
  const previous=current.current;if(!previous)return;
  sequence.current++;
  const next:Account={...previous,state:learningSchema.parse(change(previous.state)),status:"pending",message:""};
  next.local=cache(next);commit(next);
 },[commit,cache]);
 const save=useCallback(async()=>{
  const sent=current.current;if(!sent || saving.current)return;
  saving.current=true;setBusy(true);const token=generation.current,seq=sequence.current;
  try {
   const response=await fetch("/api/learning/account",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:sent.userId,revision:sent.revision,state:sent.state}),signal:AbortSignal.timeout(12000)});
   if(token!==generation.current)return;
   if(!response.ok) {
    if(response.status===401 || response.status===409) {setLocked(true);throw new Error("Sign in to the same account or reload to merge before retrying. Your working progress is kept separately.");}
    throw new Error("Progress is not saved to your account. Check your connection and retry.");
   }
   const saved=accountSnapshotSchema.parse(await response.json());
   const latest=current.current;
   if(!latest || saved.userId!==latest.userId) {setLocked(true);return;}
   const pending=seq!==sequence.current;
   const value:Account={...saved,state:pending?mergeLearning(saved.state,latest.state):saved.state,status:pending?"pending":"saved",message:"",local:true};
   value.local=cache(value);commit(value);
  } catch(error) {
   if(token===generation.current && current.current?.userId===sent.userId) {
    const value:Account={...current.current,status:"error",message:error instanceof Error?error.message:"Progress is not saved. Retry when connected."};
    value.local=cache(value);commit(value);
   }
  } finally {saving.current=false;setBusy(false);}
 },[commit,cache]);
 useEffect(()=>{if(!busy && !locked && !checking && account?.status==="pending") {const timer=setTimeout(()=>{void save();},400);return ()=>clearTimeout(timer);}},[account,locked,checking,busy,save]);
 async function signOut() {
  if(current.current && current.current.status !== "saved" && !current.current.local) {setLocked(true);return;}
  // Keep unsent work in its account-scoped cache; never copy it to guest storage.
  setChecking(true);generation.current++;
  try {
   const response=await fetch("/api/auth/sign-out",{method:"POST",signal:AbortSignal.timeout(12000)});
   if(!response.ok)throw new Error();
   commit(null);setLocked(false);
   try {localStorage.setItem("cornerstone-learning-session",String(Date.now()));}catch{}
  } catch {setLocked(true);} finally {setChecking(false);}
 }
 return {account,checking,locked,update,retry:load,signOut,importGuest:(guest:LearningState)=>update(state=>learningImport(guest,state))};
}
