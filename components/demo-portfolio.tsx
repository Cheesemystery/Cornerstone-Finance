"use client";
import { PortfolioHoldings } from "./portfolio-holdings";
import { useDemo } from "./demo-provider";
import type { ReactNode } from "react";
export function DemoPortfolio({controls}: {controls?:ReactNode}){const {portfolio}=useDemo();return <PortfolioHoldings key={portfolio.id} portfolio={portfolio} controls={controls}/>;}
