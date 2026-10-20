export interface ResearchStock {
  symbol: string;
  name: string;
  exchange: string;
  kind: "stock" | "fund";
  example: {
    price: number;
    dailyPercent: number;
    relativeVolume: number;
    marketCap: string;
    pe: string;
    range: string;
    volume: string;
  };
  headlines: string[];
  customers: string[];
  suppliers: string[];
}
export const exampleResearchDate = "Sep 2, 2026";
export const researchStocks: ResearchStock[] = [
  {
    symbol: "AAPL",
    name: "Apple",
    exchange: "NASDAQ",
    kind: "stock",
    example: {
      price: 229.18,
      dailyPercent: 0.62,
      relativeVolume: 1.1,
      marketCap: "$3.4T",
      pe: "31.2",
      range: "$169 – $260",
      volume: "48.2M",
    },
    headlines: [
      "Product-cycle expectations return to the spotlight",
      "Investors compare services growth with device demand",
    ],
    customers: ["Individual device buyers", "Enterprise and education buyers"],
    suppliers: ["Semiconductor fabrication", "Display and component makers"],
  },
  {
    symbol: "NVDA",
    name: "NVIDIA",
    exchange: "NASDAQ",
    kind: "stock",
    example: {
      price: 138.4,
      dailyPercent: 6.4,
      relativeVolume: 2.7,
      marketCap: "$3.4T",
      pe: "52.4",
      range: "$86 – $160",
      volume: "214.0M",
    },
    headlines: [
      "AI infrastructure spending draws investor attention",
      "A closer look at supply capacity and customer concentration",
    ],
    customers: ["Cloud infrastructure operators", "Enterprise AI platforms"],
    suppliers: ["Chip foundries", "Advanced packaging and memory makers"],
  },
  {
    symbol: "MSFT",
    name: "Microsoft",
    exchange: "NASDAQ",
    kind: "stock",
    example: {
      price: 432.7,
      dailyPercent: 1.2,
      relativeVolume: 1.2,
      marketCap: "$3.2T",
      pe: "35.1",
      range: "$345 – $468",
      volume: "22.8M",
    },
    headlines: [
      "Cloud demand and AI investment remain research priorities",
      "Reading operating margins alongside infrastructure spending",
    ],
    customers: ["Business software buyers", "Cloud service customers"],
    suppliers: ["Data-center hardware makers", "Network and energy providers"],
  },
  {
    symbol: "TSLA",
    name: "Tesla",
    exchange: "NASDAQ",
    kind: "stock",
    example: {
      price: 241.6,
      dailyPercent: -5.8,
      relativeVolume: 2.3,
      marketCap: "$780B",
      pe: "68.2",
      range: "$139 – $359",
      volume: "116.4M",
    },
    headlines: [
      "Delivery expectations put margins in focus",
      "Investors weigh pricing, demand and capital spending",
    ],
    customers: ["Individual vehicle buyers", "Fleet and energy-storage buyers"],
    suppliers: ["Battery component makers", "Automotive electronics suppliers"],
  },
  {
    symbol: "AMZN",
    name: "Amazon",
    exchange: "NASDAQ",
    kind: "stock",
    example: {
      price: 202.3,
      dailyPercent: 0.8,
      relativeVolume: 1.0,
      marketCap: "$2.1T",
      pe: "39.8",
      range: "$151 – $231",
      volume: "35.6M",
    },
    headlines: [
      "Retail margins and cloud growth offer two research angles",
      "Infrastructure investment brings cash flow into focus",
    ],
    customers: ["Retail shoppers", "Cloud service customers"],
    suppliers: [
      "Merchants and consumer brands",
      "Logistics and data-center partners",
    ],
  },
  {
    symbol: "GOOGL",
    name: "Alphabet",
    exchange: "NASDAQ",
    kind: "stock",
    example: {
      price: 176.8,
      dailyPercent: 2.1,
      relativeVolume: 2.2,
      marketCap: "$2.2T",
      pe: "23.6",
      range: "$130 – $208",
      volume: "47.1M",
    },
    headlines: [
      "Search and AI strategy draw attention to the revenue mix",
      "Investors examine advertising demand and cloud profitability",
    ],
    customers: ["Advertising buyers", "Cloud service customers"],
    suppliers: ["Data-center hardware makers", "Content and network partners"],
  },
  ...[
    {
      symbol: "VTI",
      name: "Vanguard Total Stock Market ETF",
      price: 321.44,
      range: "$228 – $326",
    },
    {
      symbol: "VXUS",
      name: "Vanguard Total International Stock ETF",
      price: 74.16,
      range: "$55 – $78",
    },
    {
      symbol: "BND",
      name: "Vanguard Total Bond Market ETF",
      price: 75.03,
      range: "$68 – $77",
    },
  ].map((item) => ({
    symbol: item.symbol,
    name: item.name,
    exchange: "AMEX",
    kind: "fund" as const,
    example: {
      price: item.price,
      dailyPercent: 0.4,
      relativeVolume: 1,
      marketCap: "N/A · fund",
      pe: "See fund documents",
      range: item.range,
      volume: "Example: 4.2M",
    },
    headlines: [
      "Look through the fund to understand its underlying holdings",
      "Compare the expense ratio, exposure and tracking approach",
    ],
    customers: [],
    suppliers: [],
  })),
];
export function researchSignal(stock: ResearchStock) {
  const move = Math.abs(stock.example.dailyPercent) >= 5;
  const attention = stock.example.relativeVolume >= 2;
  return {
    hot: move || attention,
    reason: move
      ? "Large example daily move"
      : attention
        ? "Elevated example trading volume"
        : null,
    headline: stock.headlines[0],
  };
}
export function resolveResearchStock(query: string): ResearchStock | undefined {
  const normalized = query.trim().toUpperCase();
  return researchStocks.find(
    (stock) =>
      stock.symbol === normalized || stock.name.toUpperCase() === normalized,
  );
}
export function customResearchStock(symbol: string) {
  const normalized = symbol.trim().toUpperCase();
  if (!/^[A-Z][A-Z0-9.-]{0,9}$/.test(normalized)) return null;
  return {
    symbol: normalized,
    name: normalized,
    exchange: "",
    kind: "stock" as const,
  };
}
/** Authored example curve; never a historical-price claim. */
export function examplePriceSeries(
  stock: ResearchStock,
  period: "1M" | "3M" | "1Y",
) {
  const pattern =
    period === "1M"
      ? [
          0.97, 0.98, 0.975, 0.985, 0.99, 0.978, 0.982, 0.991, 0.987, 0.995,
          0.99, 0.997, 1.002, 0.998, 1.006, 0.997, 1.003, 0.994, 1.001,
        ]
      : period === "3M"
        ? [
            0.88, 0.9, 0.89, 0.92, 0.91, 0.94, 0.9, 0.93, 0.95, 0.94, 0.98,
            0.96, 0.99, 0.98, 1.01, 0.99, 1.02, 1.01, 1,
          ]
        : [
            0.71, 0.76, 0.74, 0.79, 0.75, 0.82, 0.8, 0.84, 0.79, 0.86, 0.88,
            0.85, 0.91, 0.89, 0.94, 0.97, 0.93, 0.98, 1,
          ];
  const previous = stock.example.price / (1 + stock.example.dailyPercent / 100);
  return [
    ...pattern.map((value) => previous * value),
    previous,
    stock.example.price,
  ];
}
