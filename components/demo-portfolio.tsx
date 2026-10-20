"use client";
import { PortfolioHoldings } from "./portfolio-holdings";
import { useDemo } from "./demo-provider";
export function DemoPortfolio(){const {portfolio}=useDemo();return <PortfolioHoldings key={portfolio.id} portfolio={portfolio}/>;}
