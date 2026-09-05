"use client";
import { PortfolioHoldings } from "./portfolio-holdings";
import { useDemo } from "./demo-provider";
export function DemoPortfolio(){const {portfolio,setPortfolio,announce}=useDemo();return <>{portfolio.source==="csv"&&<div className="csv-banner"><span>CSV preview · Prices from your file · Clears on reload</span><button className="demo-link" onClick={async()=>{const {samplePortfolio}=await import("@/lib/sample-data");setPortfolio(samplePortfolio);announce("Sample portfolio restored.");}}>Restore sample</button></div>}<PortfolioHoldings key={portfolio.id} portfolio={portfolio}/></>}
