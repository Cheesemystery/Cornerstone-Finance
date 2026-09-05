"use client";

import { ArrowDown, ArrowUpRight, Globe2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import styles from "./profile-suggestions.module.css";

const funds = [
  { symbol: "VXUS", name: "Vanguard Total International Stock ETF", detail: "A basket of stocks from around the world, outside the U.S.", url: "https://investor.vanguard.com/investment-products/etfs/profile/vxus" },
  { symbol: "IXUS", name: "iShares Core MSCI Total International Stock ETF", detail: "Another way to own a broad mix of companies outside the U.S.", url: "https://www.ishares.com/us/products/244048/ishares-core-msci-total-international-stock-etf" }
];

export function ProfileSuggestions() {
  const [scenario, setScenario] = useState("us");
  const usOnly = scenario === "us";

  return <section className={styles.wrapper} aria-labelledby="suggestions-title">
    <div className={styles.toolbar}>
      <span className={styles.preview}><Sparkles size={15} aria-hidden="true"/> Try an example</span>
      <div className={styles.switcher} role="group" aria-label="Example portfolio">
        <button aria-pressed={usOnly} onClick={() => setScenario("us")}>U.S. stocks only</button>
        <button aria-pressed={!usOnly} onClick={() => setScenario("mixed")}>A global mix</button>
      </div>
    </div>

    <div className={styles.hero}>
      <div className={styles.message} aria-live="polite">
        <p className={styles.kicker}>Example portfolio · The big picture</p>
        <h2 id="suggestions-title">{usOnly ? <>All your stocks.<br/><em>One country.</em></> : <>More countries.<br/><em>A wider mix.</em></>}</h2>
        <p className={styles.takeaway}>{usOnly ? "If U.S. stocks fall, your whole portfolio could feel it." : "Your stocks reach beyond the U.S. Check that your funds don’t all own the same companies."}</p>
        <a href="#global-funds" className={styles.cta}>{usOnly ? "Explore beyond the U.S." : "Explore global stock funds"}<ArrowDown size={18} aria-hidden="true"/></a>
      </div>
      <div className={styles.visual}>
        <Globe2 className={styles.globe} aria-hidden="true"/>
        <strong>{usOnly ? "100" : "70"}<span>%</span></strong>
        <span className={styles.visualLabel}>in U.S. stocks</span>
        <div className={styles.bar} aria-hidden="true"><span style={{width:usOnly ? "100%" : "70%"}}/></div>
        <p>{usOnly ? "0% outside the U.S." : "30% outside the U.S."}</p>
      </div>
    </div>
    <p className={styles.note}>Demo only — not your account. Spreading money across countries can reduce reliance on one market, but you can still lose money.</p>

    <div className={styles.fundHeading} id="global-funds">
      <div><p className={styles.kicker}>Your next discovery</p><h3>Meet the rest of the world.</h3></div>
      <span>2 funds to explore</span>
    </div>
    <p className={styles.explainer}>An ETF is a basket of investments you can own together. These two focus on stocks outside the U.S.</p>
    <div className={styles.funds}>{funds.map(fund => <a key={fund.symbol} className={styles.fund} href={fund.url} target="_blank" rel="noreferrer">
      <div className={styles.fundTop}><span>{fund.symbol}</span><ArrowUpRight size={25} aria-hidden="true"/></div>
      <p>{fund.detail}</p><small>{fund.name}</small>
      <span className={styles.fundAction}>Explore fund <ArrowUpRight size={15} aria-hidden="true"/><span className="sr-only"> on the fund provider’s website, opens a new tab</span></span>
    </a>)}</div>
    <p className={styles.note}>Research ideas, not buy recommendations. These funds overlap; they’re alternatives to compare. International investing also brings currency and country risks.</p>
    <Link href="/social" className={styles.community}>See how other students invest <ArrowUpRight size={19} aria-hidden="true"/></Link>
  </section>;
}
