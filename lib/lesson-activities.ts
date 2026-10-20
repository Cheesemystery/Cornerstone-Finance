export type LessonActivity = {
  scene: "cafe" | "prices" | "baskets" | "earnings" | "fees" | "checklist";
  story: string;
  hook: string;
  prompt: string;
  explanation: string;
  kind: "match" | "choice" | "allocate" | "order" | "fees";
  options?: string[];
  correct?: number;
  feedback?: string[];
};
export const lessonActivities: Record<string, LessonActivity> = {
  "what-you-own": {
    scene: "cafe",
    hook: "A tiny piece of your favorite café.",
    story:
      "Imagine the campus café is split into 100 equal shares. Owning one share means owning 1% of that fictional business. You could benefit if it grows—and lose money if it struggles.",
    kind: "match",
    prompt: "Match each idea to what you actually own.",
    explanation:
      "A stock is ownership, a bond is a loan, and a fund holds a collection of investments. A company may share profits through dividends, but it does not have to.",
  },
  "why-prices-move": {
    scene: "prices",
    hook: "Same café. A different price.",
    story:
      "On Monday, a fictional café share costs $20. On Friday, it costs $18. You can observe a $2 drop. The chart alone cannot tell you what caused it—or where the price goes next.",
    kind: "choice",
    prompt: "What can this picture tell you for sure?",
    options: [
      "The café will close.",
      "One share costs $2 less than before.",
      "The price will bounce back next week.",
    ],
    correct: 1,
    feedback: [
      "A price chart cannot tell you whether the business will close. You would need reliable evidence.",
      "Exactly. The price changed from $20 to $18; the cause and future are still unknown.",
      "A previous drop cannot guarantee a recovery. Prices can fall further.",
    ],
    explanation:
      "Separate the observation from the story. Look for a reliable source before deciding why a price moved.",
  },
  "spread-your-risk": {
    scene: "baskets",
    hook: "Three baskets. One shared ingredient.",
    story:
      "A café stock and a café-only fund both depend on cafés. Adding a second label does not necessarily add a different kind of risk.",
    kind: "allocate",
    prompt: "Move some of the 10 tokens into the broad basket.",
    explanation:
      "Changing the mix reduces reliance on cafés in this example. The broad basket also contains one café token, so there is still overlap—and all investments can lose value.",
  },
  "read-earnings": {
    scene: "earnings",
    hook: "Busy café. Smaller profit?",
    story:
      "Last term, a fictional café sold $1,000 of coffee and spent $700. This term, sales are $1,200 and costs are $1,000. More sales do not automatically mean more profit.",
    kind: "choice",
    prompt: "How much profit remains this term?",
    options: ["$1,200", "$300", "$200"],
    correct: 2,
    feedback: [
      "$1,200 is sales before costs. Subtract the $1,000 spent to find profit.",
      "$300 was last term’s profit. This term’s higher costs change the result.",
      "Yes: $1,200 minus $1,000 leaves $200. Sales rose, but profit fell.",
    ],
    explanation:
      "Profit and cash are different too. A customer might owe money for a sale that has not been paid yet. Read the cash flow statement to see actual cash movement.",
  },
  "fees-and-time": {
    scene: "fees",
    hook: "A small fee takes a long trip.",
    story:
      "Imagine two identical baskets growing at the same hypothetical rate. One has a higher annual fee. The fee leaves less money invested, and that difference can grow over time.",
    kind: "fees",
    prompt: "Change the annual fee. Watch the difference.",
    explanation:
      "This is a constant-return illustration, not a forecast. Fees reduce the amount left to grow. Real returns vary, can be negative, and the model excludes taxes and inflation.",
  },
  "research-checklist": {
    scene: "checklist",
    hook: "A friend sends you a hot tip.",
    story:
      "A popular post says a fund is a must-buy. Before copying it, build a process you can explain: understand the investment, inspect its original documents, then consider how it fits.",
    kind: "order",
    prompt: "Put the research steps in a useful order.",
    explanation:
      "Start by understanding the investment. Verify its costs and risks in original documents. Then assess its fit. Popularity is not evidence.",
  },
};

export const quizFeedback: Record<string, readonly string[]> = {
  "what-you-own": [
    "A fund chooses a particular basket. It does not automatically own every company.",
    "Exactly: ETFs can hold stocks, bonds, or other investments. Check the basket.",
    "A basket can lose value. Diversification does not remove every risk.",
  ],
  "why-prices-move": [
    "Yes. You observed a price change; you still need evidence for any explanation.",
    "A falling price does not establish that a business will fail. Inspect its situation and original sources.",
    "A short price move does not guarantee what comes next.",
  ],
  "spread-your-risk": [
    "Yes. Tracking the same index usually means owning many of the same businesses.",
    "Cash and a single stock are different exposures; inspect the actual holdings of funds for overlap.",
    "A government bond and a technology stock are different exposures. Similar fund names can hide shared holdings.",
  ],
  "read-earnings": [
    "Expenses are exactly what you need to inspect when sales rise but profit falls.",
    "Yes. Growing costs or unusual charges can explain the gap between sales and profit.",
    "One period's results cannot guarantee the next. Investigate the change in costs.",
  ],
  "fees-and-time": [
    "A fee is a cost, not a guarantee of a better result.",
    "Ongoing fees can be charged repeatedly, reducing future growth as well as today's balance.",
    "Yes. Fees leave less money invested, so there is less money that could earn later returns.",
  ],
  "research-checklist": [
    "An anonymous comment does not establish a fund's actual fees. Find the original disclosure.",
    "Yes. The fund's official documents are the starting point for its costs and objectives.",
    "Likes measure popularity, not whether a fee claim is accurate. Check the official documents.",
  ],
};
