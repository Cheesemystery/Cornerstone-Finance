import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
const lessons=[
  ["Start here","What you actually own","Understand stocks, funds, and bonds through the investments already in your portfolio."],
  ["8 minutes","Why prices move","Separate daily noise from changes that affect a long-term investment thesis."],
  ["10 minutes","Diversification without jargon","Learn why owning more tickers does not always mean taking less risk."],
  ["6 minutes","Read an earnings report","Find the few figures that explain how a company is really performing."],
  ["7 minutes","Fees and compounding","See how small recurring costs change long-term outcomes."],
  ["Practice","Build a research checklist","Create a repeatable process before you consider an investment."]
];
export default function LearnPage(){return <AppShell><PageHeader eyebrow="Free learning library" title="Learn in context" description="Short, practical lessons connected to decisions and holdings—not homework for its own sake."/><div className="workspace lesson-grid">{lessons.map(([label,title,copy])=><a className="lesson-card" href="#" key={title}><span>{label}</span><h2>{title}</h2><p>{copy}</p></a>)}</div></AppShell>}
