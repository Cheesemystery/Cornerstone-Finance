import { sourceLabel, comparisonLabel } from "./presentation";
import type { PortfolioSnapshot } from "./domain";
import { movementSummary } from "./portfolio";

export const signedAmount = (value: number) => `${value < 0 ? "−" : value > 0 ? "+" : ""}${new Intl.NumberFormat("en-US", {style:"currency",currency:"USD"}).format(Math.abs(value))}`;

export function moneyStory(portfolio: PortfolioSnapshot) {
  const { summary, direction, ranked, driver, offset } = movementSummary(portfolio);
  const hasHoldings = portfolio.holdings.length > 0;
  const explanation = !hasHoldings ? "Add a portfolio to see how your holdings contribute to its movement." : direction === "unchanged" ? "Your holdings’ price changes balanced out, with no net change over the comparison period." : `${driver?.symbol} made the largest ${direction === "lower" ? "negative" : "positive"} contribution (${signedAmount(driver?.value ?? 0)}).${offset ? ` ${offset.symbol} offset part of that move (${signedAmount(offset.value)}).` : " The breakdown shows how each holding contributed."}`;
  return { summary, direction, ranked, explanation, title: hasHoldings ? `Your portfolio finished ${direction}.` : "Your money story starts here.", period: comparisonLabel(portfolio), asOf: new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric",year:"numeric",timeZone:"America/New_York"}).format(new Date(portfolio.asOf)), source: sourceLabel(portfolio) };
}


