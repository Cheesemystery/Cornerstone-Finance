import type { Briefing, Holding, PortfolioSnapshot } from "./domain";

export const marketValue = (holding: Holding) => holding.quantity * holding.price;

export function summarizePortfolio(snapshot: PortfolioSnapshot) {
  const totalValue = snapshot.holdings.reduce((sum, holding) => sum + marketValue(holding), 0);
  const previousValue = snapshot.holdings.reduce(
    (sum, holding) => sum + holding.quantity * holding.previousClose,
    0
  );
  const dayChange = totalValue - previousValue;
  const dayChangePercent = previousValue ? (dayChange / previousValue) * 100 : 0;
  const allocations = snapshot.holdings
    .map((holding) => ({
      symbol: holding.symbol,
      value: marketValue(holding),
      percent: totalValue ? (marketValue(holding) / totalValue) * 100 : 0
    }))
    .sort((a, b) => b.value - a.value);
  const contributors = snapshot.holdings
    .map((holding) => ({
      symbol: holding.symbol,
      value: holding.quantity * (holding.price - holding.previousClose)
    }))
    .sort((a, b) => b.value - a.value);

  return { totalValue, previousValue, dayChange, dayChangePercent, allocations, contributors };
}

export function buildBriefing(snapshot: PortfolioSnapshot): Briefing {
  const summary = summarizePortfolio(snapshot);
  const largest = summary.allocations[0];
  const top = summary.contributors[0];
  const direction = summary.dayChange >= 0 ? "up" : "down";
  const events: Briefing["events"] = [
    {
      id: "daily-move",
      kind: "performance",
      priority: "high",
      headline: `Your portfolio is ${direction} ${Math.abs(summary.dayChangePercent).toFixed(2)}% today`,
      summary: `${top?.symbol ?? "Your leading holding"} contributed most to today's move. Review the underlying change before making any decision.`,
      symbols: top ? [top.symbol] : [],
      sources: [{ label: "Portfolio holdings", asOf: snapshot.asOf }],
      researchPrompt: top ? `What changed for ${top.symbol} today?` : undefined
    }
  ];

  if (largest && largest.percent >= 40) {
    events.push({
      id: "concentration",
      kind: "risk",
      priority: "medium",
      headline: `${largest.symbol} represents ${largest.percent.toFixed(0)}% of the portfolio`,
      summary: "A large position can drive both gains and losses. Compare this exposure with your time horizon and risk tolerance.",
      symbols: [largest.symbol],
      sources: [{ label: "Calculated from current holdings", asOf: snapshot.asOf }],
      researchPrompt: `How does concentration risk work for ${largest.symbol}?`
    });
  }

  events.push({
    id: "research-next",
    kind: "news",
    priority: "low",
    headline: `Research the companies driving ${top?.symbol ?? "your portfolio"}`,
    summary: "Read the latest sourced coverage and compare the facts with your original investment thesis.",
    symbols: top ? [top.symbol] : [],
    sources: [{ label: "Market news feed", asOf: snapshot.asOf }],
    researchPrompt: top ? `Show sourced news for ${top.symbol}` : "Show today's market news"
  });

  return {
    id: `briefing-${snapshot.id}`,
    portfolioId: snapshot.id,
    generatedAt: new Date().toISOString(),
    marketStatus: "closed",
    facts: {
      totalValue: summary.totalValue,
      dayChange: summary.dayChange,
      dayChangePercent: summary.dayChangePercent,
      topContributor: top?.symbol ?? "—",
      largestPositionPercent: largest?.percent ?? 0
    },
    events,
    disclosure: "Educational information only. Cornerstone does not provide individualized investment advice or execute trades."
  };
}

export const freeEntitlements = {
  plan: "free",
  maxPortfolios: 1,
  aiExplanationsPerMonth: 20,
  advancedBriefings: false,
  customAlerts: false
} as const;
