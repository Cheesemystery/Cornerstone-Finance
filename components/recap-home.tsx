"use client";
import Link from "next/link";
import { ArrowRight, ArrowUp, Bot, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useDemo } from "./demo-provider";
import { demoAnswer } from "@/lib/demo-assistant";

const starterQuestions = ["Explain my portfolio", "How do I spread my risk?", "What is an ETF?"];

export function HomeAssistantCard(){
  const {portfolio}=useDemo();
  const [question,setQuestion]=useState("");
  const [answer,setAnswer]=useState<ReturnType<typeof demoAnswer>|null>(null);
  function ask(value:string){const text=value.trim();if(!text)return;setAnswer(demoAnswer(text,portfolio));setQuestion("");}
  function submit(event:FormEvent){event.preventDefault();ask(question);}
  return <section className="home-assistant-card" aria-labelledby="home-assistant-title">
    <div className="home-assistant-intro"><span className="home-assistant-icon"><Bot size={26}/></span><div><p className="eyebrow"><Sparkles size={13}/> Portfolio-aware assistant</p><h2 id="home-assistant-title">Ask about your money.</h2><p>Get a plain-English explanation of your specific portfolio or an investing concept—without judgment or buy/sell tips.</p></div><div className="home-assistant-prompts">{starterQuestions.map(prompt=><button key={prompt} onClick={()=>ask(prompt)}>{prompt}</button>)}</div></div>
    <div className="home-assistant-chat"><div className="home-assistant-answer" aria-live="polite">{answer?<><p>{answer.text.split("\n")[0]}</p><Link href={answer.href}>{answer.label} <ArrowRight size={14}/></Link></>:<><strong>What would you like to understand?</strong><p>Ask about a holding, your mix, risk, ETFs, fees, or the latest change.</p></>}</div><form onSubmit={submit}><label className="sr-only" htmlFor="home-assistant-question">Ask Cornerstone</label><input id="home-assistant-question" value={question} maxLength={500} onChange={event=>setQuestion(event.target.value)} placeholder="Ask about your portfolio…"/><button aria-label="Ask question" disabled={!question.trim()}><ArrowUp size={17}/></button></form><div className="home-assistant-foot"><span>Demo answers + your portfolio math</span><Link href="/assistant">Open full assistant <ArrowRight size={14}/></Link></div></div>
  </section>;
}

// Recaps are opened deliberately; visiting Home does not interrupt with a monthly scorecard.
export function MonthlyRecapModal(){return null;}
