// @vitest-environment jsdom
import {act,cleanup,renderHook,waitFor} from "@testing-library/react";
import {afterEach,beforeEach,expect,it,vi} from "vitest";
import {useAccountLearning} from "./use-account-learning";
import {emptyLearning,recordActivity} from "@/lib/learning-progress";
const A="11111111-1111-4111-8111-111111111111",B="22222222-2222-4222-8222-222222222222";
const snapshot=(id=A)=>({userId:id,revision:0,state:emptyLearning});
beforeEach(()=>localStorage.clear());
afterEach(()=>{cleanup();localStorage.clear();vi.unstubAllGlobals();vi.restoreAllMocks();});
it("does not contact account services while the learning gate is off",()=>{
 const fetcher=vi.fn();vi.stubGlobal("fetch",fetcher);
 const {result}=renderHook(()=>useAccountLearning(false));
 expect(result.current.checking).toBe(false);expect(fetcher).not.toHaveBeenCalled();
});
it("loads account learning separately, imports only on request, and acknowledges only a successful save",async()=>{
 const guest=recordActivity(emptyLearning,"lesson","what-you-own");
 localStorage.setItem("cornerstone-learning-v1",JSON.stringify(guest));
 const fetcher=vi.fn().mockImplementation(async(_url:string,options?:RequestInit)=>{
  if(options?.method==="PUT") {const body=JSON.parse(options.body as string);return Response.json({...body,revision:1});}
  return Response.json(snapshot());
 });vi.stubGlobal("fetch",fetcher);
 const {result}=renderHook(()=>useAccountLearning(true));
 await waitFor(()=>expect(result.current.account?.status).toBe("saved"));
 expect(result.current.account?.state.completed).toEqual([]);
 act(()=>result.current.importGuest(guest));
 expect(result.current.account?.status).toBe("pending");
 await waitFor(()=>expect(result.current.account?.revision).toBe(1));
 expect(result.current.account?.status).toBe("saved");
 expect(JSON.parse(localStorage.getItem("cornerstone-learning-v1")!).completed).toEqual(["what-you-own"]);
});
it("retains unsaved progress under its owner after expiry, and never adopts it into another account",async()=>{
 let owner=A;
 vi.stubGlobal("fetch",vi.fn().mockImplementation(async(_url:string,options?:RequestInit)=>options?.method==="PUT"?Response.json({}, {status:401}):Response.json(snapshot(owner))));
 const {result}=renderHook(()=>useAccountLearning(true));
 await waitFor(()=>expect(result.current.account?.userId).toBe(A));
 act(()=>result.current.update(state=>recordActivity(state,"lesson","read-earnings")));
 await waitFor(()=>expect(result.current.locked).toBe(true));
 expect(JSON.parse(localStorage.getItem(`cornerstone-learning-account-v1:${A}`)!).dirty).toBe(true);
 owner=B;
 await act(async()=>{await result.current.retry();});
 expect(result.current.account?.userId).toBe(B);
 expect(result.current.account?.state.completed).toEqual([]);
 expect(result.current.locked).toBe(false);
});
it("reload merges a queued same-account completion after an offline save",async()=>{
 const queued={...snapshot(),state:recordActivity(emptyLearning,"lesson","read-earnings"),dirty:true};
 localStorage.setItem(`cornerstone-learning-account-v1:${A}`,JSON.stringify(queued));
 vi.stubGlobal("fetch",vi.fn().mockImplementation(async(_url:string,options?:RequestInit)=>options?.method==="PUT"?Response.json({}, {status:503}):Response.json(snapshot())));
 const {result}=renderHook(()=>useAccountLearning(true));
 await waitFor(()=>expect(result.current.account?.status).toBe("error"));
 expect(result.current.account?.state.completed).toEqual(["read-earnings"]);
 expect(result.current.locked).toBe(false);
});

it("holds in-memory unsent learning when storage is full and sign-out would lose it",async()=>{
 vi.spyOn(Storage.prototype,"setItem").mockImplementation(()=>{throw new Error("full");});
 const fetcher=vi.fn().mockResolvedValue(Response.json(snapshot()));vi.stubGlobal("fetch",fetcher);
 const {result}=renderHook(()=>useAccountLearning(true));
 await waitFor(()=>expect(result.current.account?.userId).toBe(A));
 act(()=>result.current.update(state=>recordActivity(state,"lesson","what-you-own")));
 await act(async()=>{await result.current.signOut();});
 expect(result.current.locked).toBe(true);
 expect(result.current.account?.state.completed).toEqual(["what-you-own"]);
 expect(fetcher.mock.calls.some(call=>call[0]==="/api/auth/sign-out")).toBe(false);
 vi.restoreAllMocks();
});
