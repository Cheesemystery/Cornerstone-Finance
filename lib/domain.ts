export type PortfolioSource = "plaid" | "csv" | "manual" | "sample";
export type Freshness = "live" | "delayed" | "stale";

export interface Holding {
  symbol: string;
  name: string;
  quantity: number;
  price: number;
  previousClose: number;
  costBasis?: number;
  sector: string;
  assetClass: "equity" | "fixed-income" | "cash" | "fund";
}

export interface PortfolioSnapshot {
  id: string;
  source: PortfolioSource;
  asOf: string;
  freshness: Freshness;
  institution?: string;
  currency: "USD";
  holdings: Holding[];
}

export interface SourceReference {
  label: string;
  url?: string;
  asOf: string;
}

export interface BriefingEvent {
  id: string;
  kind: "performance" | "risk" | "news" | "calendar";
  priority: "high" | "medium" | "low";
  headline: string;
  summary: string;
  symbols: string[];
  sources: SourceReference[];
  researchPrompt?: string;
}

export interface Briefing {
  id: string;
  portfolioId: string;
  generatedAt: string;
  marketStatus: "open" | "closed" | "pre-market" | "after-hours";
  facts: {
    totalValue: number;
    dayChange: number;
    dayChangePercent: number;
    topContributor: string;
    largestPositionPercent: number;
  };
  events: BriefingEvent[];
  disclosure: string;
}

export interface Entitlements {
  plan: "free" | "pro";
  maxPortfolios: number;
  aiExplanationsPerMonth: number;
  advancedBriefings: boolean;
  customAlerts: boolean;
}
