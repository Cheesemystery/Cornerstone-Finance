// @vitest-environment jsdom
import {act,cleanup,render,screen} from "@testing-library/react";
import {afterEach,expect,it,vi} from "vitest";
import {createBrowserStore} from "./browser-store";
import {emptyLearning,learningSchema,migrateLearning,recordActivity} from "./learning-progress";
import {mergeGuestLearning,recoverGuestLearning} from "./guest-learning";
afterEach(()=>{cleanup();vi.restoreAllMocks();localStorage.clear();});
const make=(key:string)=>createBrowserStore(key,emptyLearning,raw=>migrateLearning(learningSchema.parse(raw)),undefined,mergeGuestLearning,recoverGuestLearning);
it("converges concurrent tab receipts and respects explicit resets without resurrecting bricks",()=>{
 const key="guest-race",a=make(key);
 function View(){const s=a.useStore();return <output>{s.value.completed.length}:{s.value.resetGeneration}</output>;}
 render(<View/>);
 act(()=>a.update(s=>recordActivity(s,"lesson","what-you-own")));
 const staleOther=recordActivity(emptyLearning,"lesson","read-earnings");
 act(()=>{localStorage.setItem(key,JSON.stringify(staleOther));window.dispatchEvent(new StorageEvent("storage",{key,newValue:JSON.stringify(staleOther)}));});
 expect(screen.getByRole("status").textContent).toBe("2:0");
 expect(JSON.parse(localStorage.getItem(key)!).completed).toEqual(["what-you-own","read-earnings"]);
 const reset={...emptyLearning,resetGeneration:1};
 act(()=>{localStorage.setItem(key,JSON.stringify(reset));window.dispatchEvent(new StorageEvent("storage",{key,newValue:JSON.stringify(reset)}));});
 expect(screen.getByRole("status").textContent).toBe("0:1");
 act(()=>{localStorage.setItem(key,JSON.stringify(staleOther));window.dispatchEvent(new StorageEvent("storage",{key,newValue:JSON.stringify(staleOther)}));});
 expect(screen.getByRole("status").textContent).toBe("0:1");
});
it("restores persisted completions and checked quiz progress in a fresh store",()=>{
 const key="guest-restart",first=make(key);
 first.update(s=>({...recordActivity(s,"lesson","what-you-own"),steps:{"read-earnings":3},quizzes:{"read-earnings":{version:1,passed:2}}}));
 const resumed=JSON.parse(make(key).read());
 expect(resumed.completed).toEqual(["what-you-own"]);
 expect(resumed.quizzes["read-earnings"].passed).toBe(2);
});
it("retains valid completions, dates and quiz receipts from a partly corrupt record with a warning",()=>{
 const good=recordActivity(emptyLearning,"lesson","what-you-own",new Date("2026-11-07T12:00:00Z"));
 localStorage.setItem("guest-corrupt",JSON.stringify({...good,timezone:"broken",quizzes:{"read-earnings":{version:1,passed:2},"fees-and-time":{version:99,passed:3}}}));
 const store=make("guest-corrupt");
 function View(){const s=store.useStore();return <output>{s.persistence}:{s.value.completed.length}:{s.value.quizzes["read-earnings"].passed}</output>;}
 render(<View/>);
 expect(screen.getByRole("status").textContent).toBe("recovered:1:2");
 expect(JSON.parse(store.read()).events).toEqual(good.events);
 expect(JSON.parse(store.read()).quizzes["fees-and-time"]).toBeUndefined();
});
it("keeps working learning and incoming tab receipts when quota blocks saving",()=>{
 const key="guest-full",store=make(key);
 function View(){const s=store.useStore();return <output>{s.persistence}:{s.value.completed.length}</output>;}
 render(<View/>);
 vi.spyOn(Storage.prototype,"setItem").mockImplementation(()=>{throw new Error("quota");});
 act(()=>store.update(s=>recordActivity(s,"lesson","what-you-own")));
 const other=recordActivity(emptyLearning,"lesson","read-earnings");
 act(()=>window.dispatchEvent(new StorageEvent("storage",{key,newValue:JSON.stringify(other)})));
 expect(screen.getByRole("status").textContent).toBe("session:2");
 expect(JSON.parse(store.read()).completed).toHaveLength(2);
});

it("recovers valid legacy completions if the current saved JSON cannot be read",()=>{
 localStorage.setItem("guest-legacy-corrupt","{");
 const store=createBrowserStore("guest-legacy-corrupt",emptyLearning,raw=>migrateLearning(learningSchema.parse(raw)),()=>migrateLearning(undefined,{completed:["what-you-own"]}),mergeGuestLearning,recoverGuestLearning);
 expect(JSON.parse(store.read()).completed).toEqual(["what-you-own"]);
 expect(JSON.parse(store.read()).events).toEqual([]);
});
