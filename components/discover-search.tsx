"use client";
import { Search } from "lucide-react";
import { useState } from "react";
import { sampleNews } from "@/lib/sample-data";

export function DiscoverSearch() {
  const [query,setQuery]=useState("");
  const news=sampleNews.filter(item=>`${item.symbol} ${item.headline} ${item.source}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="workspace">
    <label className="searchbox"><Search size={18} aria-hidden="true"/><span className="sr-only">Search investments and news</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search a ticker, company, ETF, or headline"/></label>
    <div style={{marginTop:26}} className="news-list">{news.map(item=><article className="news-card" key={item.id}><span className="news-symbol">{item.symbol}</span><div><h3>{item.headline}</h3><p>{item.source} · {item.age}</p></div><span className="relevance">{item.relevance}</span></article>)}{!news.length&&<div className="card"><h3>No matching research</h3><p className="muted small">Try VTI, AAPL, bonds, or a source name.</p></div>}</div>
    <p className="disclosure">Sample sourced content is shown until a server-side Finnhub key is configured. Production results will include original article links and timestamps.</p>
  </div>;
}
