import type { PortfolioWeek } from "@/lib/weekly-portfolio";
import { displayDate, signedMoney } from "@/lib/presentation";
import styles from "./home-dashboard.module.css";

const signedPercent = (value: number) => {
  const rounded = Number(value.toFixed(3));
  return `${rounded < 0 ? "−" : "+"}${Math.abs(rounded).toFixed(3)}%`;
};

export function HomeProHoldings({week}: {week:PortfolioWeek}) {
  const positions = [...week.positions].sort((a,b) => Math.abs(b.contribution) - Math.abs(a.contribution) || a.ticker.localeCompare(b.ticker));
  return <div className={styles.proHoldings}>
    <table>
      <caption>Holdings · as of {displayDate(week.endDate)}</caption>
      <thead><tr><th scope="col">Ticker</th><th scope="col">Week contribution</th><th scope="col">Contribution %</th></tr></thead>
      <tbody>{positions.map(position => <tr key={position.ticker}>
        <th scope="row">{position.ticker}</th>
        <td>{signedMoney(Number(position.contribution.toFixed(2)))}</td>
        <td>{signedPercent(position.contribution / week.startValue * 100)}</td>
      </tr>)}</tbody>
      <tfoot><tr><th scope="row">Week total</th><td>{signedMoney(Number(week.change.toFixed(2)))}</td><td>{signedPercent(week.percent)}</td></tr></tfoot>
    </table>
    <p>Percentages use starting portfolio value; totals use unrounded figures.</p>
  </div>;
}
