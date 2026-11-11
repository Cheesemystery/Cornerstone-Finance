"use client";
import { createBrowserStore } from "./browser-store";
export const campuses=[{name:"Tuskegee University",stones:1428,students:184,week:64},{name:"Howard University",stones:1395,students:178,week:51},{name:"Georgia Tech",stones:1280,students:165,week:43},{name:"Spelman College",stones:1190,students:152,week:38},{name:"Morehouse College",stones:1142,students:147,week:32}];
type State={campus:string;awards:Record<string,string>;latest:string|null};
const initial:State={campus:campuses[0].name,awards:{},latest:null};
function decode(raw:unknown):State{
 const r=raw as Partial<State>|null;
 const campus=campuses.some(c=>c.name===r?.campus)?r!.campus!:initial.campus;
 const awards:Record<string,string>={};
 if(r?.awards&&typeof r.awards==="object")for(const [id,name] of Object.entries(r.awards))if((id==="simulator"||id.startsWith("lesson:"))&&campuses.some(c=>c.name===name))awards[id]=name;
 return {campus,awards,latest:typeof r?.latest==="string"&&awards[r.latest]?r.latest:null};
}
const store=createBrowserStore<State>("cornerstone-campus-foundations-v1",initial,decode);
export function contributeCampusStone(source:string){store.update(current=>current.awards[source]?current:{...current,awards:{...current.awards,[source]:current.campus},latest:source});}
export function campusRows(state:State){return campuses.map(c=>{const added=Object.values(state.awards).filter(name=>name===c.name).length;return {...c,stones:c.stones+added,week:c.week+added};}).sort((a,b)=>b.stones-a.stones||a.name.localeCompare(b.name));}
export function useCampusFoundations(){const {value,update,persistence}=store.useStore();return {state:value,rows:campusRows(value),persistence,select:(campus:string)=>update(s=>decode({...s,campus}))};}
