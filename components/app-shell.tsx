"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Bot, ChartNoAxesCombined, Compass, House, Users, Menu, Settings, ShieldCheck, X, ArrowUpRight, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDemo } from "./demo-provider";
import { recapDemoEnabled } from "@/lib/features";
const navigation = [
  {href:"/",label:"Home",icon:House},{href:"/recap",label:"Recap",icon:Sparkles},{href:"/portfolio",label:"Portfolio",icon:ChartNoAxesCombined},
  {href:"/discover",label:"Discover",icon:Compass},{href:"/social",label:"Social",icon:Users},
  {href:"/learn",label:"Learn",icon:BookOpen},{href:"/assistant",label:"Assistant",icon:Bot},{href:"/settings",label:"Settings",icon:Settings}
].filter(item=>recapDemoEnabled||item.href!=="/recap");
export function AppShell({children}:{children:React.ReactNode}) {
  const pathname=usePathname();const [open,setOpen]=useState(false);const menu=useRef<HTMLButtonElement>(null);const aside=useRef<HTMLElement>(null);
  const {preferences,portfolio}=useDemo();
  useEffect(()=>{if(!open)return;const previous=document.body.style.overflow;document.body.style.overflow="hidden";aside.current?.querySelector<HTMLAnchorElement>('a')?.focus();function key(event:KeyboardEvent){if(event.key==="Escape"){setOpen(false);menu.current?.focus();}if(event.key==="Tab"){const targets=aside.current?.querySelectorAll<HTMLElement>('a,button');if(!targets?.length)return;const first=targets[0],last=targets[targets.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}}document.addEventListener("keydown",key);return()=>{document.body.style.overflow=previous;document.removeEventListener("keydown",key);};},[open]);
  return <div className={`app-frame ${preferences.compact ? "compact-view" : ""}`}>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="mobile-header"><Link href="/" className="wordmark">Cornerstone<span className="brand-dot">.</span></Link><button ref={menu} className="icon-button" aria-expanded={open} aria-controls="main-sidebar" aria-label={open?"Close navigation":"Open navigation"} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></header>
    <aside ref={aside} id="main-sidebar" className={`sidebar ${open?"sidebar-open":""}`}>
      <div><Link href="/" className="wordmark" onClick={()=>setOpen(false)}>Cornerstone<span className="brand-dot">.</span></Link><p className="sidebar-kicker">Your money. Your future.</p></div>
      <button className="mobile-menu-close" onClick={()=>{setOpen(false);menu.current?.focus();}} aria-label="Close navigation"><X size={18}/></button>
      <nav aria-label="Primary navigation">{navigation.map(({href,label,icon:Icon})=><Link key={href} href={href} aria-current={(href==="/"?pathname==="/":pathname.startsWith(href))?"page":undefined} className={`nav-item ${(href==="/"?pathname==="/":pathname.startsWith(href))?"nav-active":""}`} onClick={()=>setOpen(false)}><Icon size={18} aria-hidden="true"/><span>{label}</span>{label==="Learn"&&preferences.completed.length>0&&<small className="nav-count">{preferences.completed.length}/6</small>}</Link>)}</nav>
      <Link href="/learn" className="sidebar-learn" onClick={()=>setOpen(false)}><BookOpen size={20}/><strong>A little wiser, every day.</strong><span>{preferences.completed.length}/6 lessons complete <ArrowUpRight size={14}/></span><div className="mini-progress"><span style={{width:`${preferences.completed.length/6*100}%`}}/></div></Link>
      <Link className="trust-note" href="/settings#privacy" onClick={()=>setOpen(false)}><ShieldCheck size={18} aria-hidden="true"/><div><strong>{portfolio.source==="csv"?"Local CSV preview":"You’re in demo mode"}</strong><span>No trades. No real money moved.</span></div></Link>
      <Link href="/settings" className="account-chip" onClick={()=>setOpen(false)}><span>{preferences.name.slice(0,2).toUpperCase()}</span><div><strong>{preferences.name}</strong><small>{preferences.college}</small></div><Settings size={15}/></Link>
    </aside>
    {open&&<button className="scrim" aria-label="Close navigation overlay" onClick={()=>{setOpen(false);menu.current?.focus();}}/>}
    <main id="main-content" className="main-content" tabIndex={-1}>{children}</main>
  </div>;
}
