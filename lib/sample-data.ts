import type { PortfolioSnapshot } from "./domain";
import { buildBriefing } from "./portfolio";

export const samplePortfolio: PortfolioSnapshot = {
  id: "sample-emerging-investor",
  source: "sample",
  institution: "Sample portfolio",
  asOf: "2026-09-02T20:00:00.000Z",
  freshness: "delayed",
  currency: "USD",
  holdings: [
    { symbol: "VTI", name: "Vanguard Total Stock Market ETF", quantity: 9, price: 321.44, previousClose: 318.61, costBasis: 2480, sector: "Broad market", assetClass: "fund" },
    { symbol: "VXUS", name: "Vanguard Total International Stock ETF", quantity: 22, price: 74.16, previousClose: 74.51, costBasis: 1460, sector: "International", assetClass: "fund" },
    { symbol: "BND", name: "Vanguard Total Bond Market ETF", quantity: 19, price: 75.03, previousClose: 74.92, costBasis: 1395, sector: "Fixed income", assetClass: "fixed-income" },
    { symbol: "AAPL", name: "Apple Inc.", quantity: 4, price: 229.18, previousClose: 227.77, costBasis: 710, sector: "Technology", assetClass: "equity" }
  ]
};

export const sampleBriefing = buildBriefing(samplePortfolio);

export const sampleNews = [
  { id: "n1", symbol: "VTI", source: "Reuters", age: "42 min", headline: "U.S. equities finish higher as investors weigh the next inflation reading", relevance: "Broad-market exposure" },
  { id: "n2", symbol: "AAPL", source: "Company filing", age: "3 hr", headline: "Apple files updated quarterly report with the SEC", relevance: "Direct holding" },
  { id: "n3", symbol: "BND", source: "Federal Reserve", age: "Yesterday", headline: "Federal Reserve publishes latest economic conditions summary", relevance: "Rates and fixed income" }
];
