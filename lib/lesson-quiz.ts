import { lessons } from "./lessons";
export type QuizQuestion = { id: string; question: string; options: readonly string[]; correct: number; explanation: string };
const first = lessons[0];
export const ownershipQuiz: readonly QuizQuestion[] = [
 { id: "etf", question: first.question, options: first.options, correct: first.correct, explanation: first.explanation },
 { id: "stock", question: "What does a share of stock represent?", options: ["A guaranteed payment", "A small ownership stake in a business", "A loan to a government"], correct: 1, explanation: "A stock is an ownership stake. Its price and dividends are not guaranteed." },
 { id: "bond", question: "When you buy a bond, what are you doing?", options: ["Lending money under payment terms, with risks", "Buying guaranteed growth", "Owning every company in a fund"], correct: 0, explanation: "A bond is a loan to an issuer. Issuers can fail to pay, and bond prices can fall." },
];
export function quizPassed(passed: number) { return passed === ownershipQuiz.length; }

export type LessonId = (typeof lessons)[number]["id"];
const extraQuestions: Record<Exclude<LessonId, "what-you-own">, readonly QuizQuestion[]> = {
"time-horizon":[{"id": "timeline", "question": "What does time horizon mean?", "options": ["Time until you expect to use the money", "Yesterday\u2019s return", "A guaranteed recovery date"], "correct": 0, "explanation": "It describes the time until you expect to need the money."}, {"id": "guarantee", "question": "Does a longer horizon guarantee a recovery?", "options": ["Yes", "No", "Only for popular stocks"], "correct": 1, "explanation": "More time does not guarantee recovery or remove investment risk."}],
"inflation":[{"id": "power", "question": "What is purchasing power?", "options": ["What money can buy", "Only the account balance", "A promised return"], "correct": 0, "explanation": "Purchasing power describes what your money can buy."}, {"id": "tradeoff", "question": "Does inflation make investments risk-free?", "options": ["Yes", "Only stocks", "No; market losses and other risks remain"], "correct": 2, "explanation": "Inflation risk and investment risk are different. Neither removes the other."}],
 "why-prices-move": [
  {id:"expectations",question:"Why can a stock fall even when profits grow?",options:["Investors may have expected more", "Growing profits guarantee a rising price", "Prices never reflect expectations"],correct:0,explanation:"Prices reflect expectations. Results can improve and still fall short of what investors expected."},
  {id:"context",question:"What should you check before reacting to a price move?",options:["Only the color of the chart", "Whether a popular post promises a rebound", "What changed, its original source, and how it fits your plan"],correct:2,explanation:"Check the source and business context alongside your time horizon and risks."},
 ],
 "spread-your-risk": [
  {id:"mix",question:"What helps you understand your portfolio's mix?",options:["Counting ticker symbols alone", "Looking at companies, industries, countries and investment types", "Choosing only funds from the same industry"],correct:1,explanation:"Different ticker names can hide the same underlying holdings and risks."},
  {id:"losses",question:"Can diversification prevent every loss?",options:["No; many markets can fall together", "Yes, once you own ten tickers", "Yes, every fund guarantees safety"],correct:0,explanation:"Spreading investments reduces reliance on one company or market, but cannot prevent all losses."},
 ],
 "read-earnings": [
  {id:"revenue",question:"What does revenue measure?",options:["Cash left after every expense", "A guaranteed future return", "Money earned from sales before expenses"],correct:2,explanation:"Revenue measures sales before expenses. Profit reflects what remains after relevant expenses."},
  {id:"cash",question:"Is accounting profit the same as cash flow?",options:["Yes, they are interchangeable", "No; read the cash flow statement and original filings too", "Only social posts can explain the difference"],correct:1,explanation:"Profit and cash flow differ. Original filings, debt disclosures and risk factors add context."},
 ],
 "fees-and-time": [
  {id:"compounding",question:"What does compounding mean?",options:["Returns can earn returns when they stay invested", "Returns can never be negative", "Fees only matter once"],correct:0,explanation:"Returns can build on returns over time, but real returns vary and can be negative."},
  {id:"model",question:"How should you read the calculator's smooth curve?",options:["As a promised result", "As a forecast including taxes and inflation", "As a hypothetical model with assumptions"],correct:2,explanation:"The calculator assumes constant returns and excludes taxes and inflation. Real markets do not follow a smooth curve."},
 ],
 "research-checklist": [
  {id:"fit",question:"What should you ask about an investment's fit?",options:["Only whether its price rose yesterday", "Its costs, existing overlap, downside and when you need the money", "Whether everyone online likes it"],correct:1,explanation:"Consider costs, what it adds to your mix, realistic risks and your time horizon."},
  {id:"source",question:"A popular post promises guaranteed returns. What is a useful response?",options:["Act before the offer disappears", "Treat popularity as verification", "Check incentives, dates and primary sources; be skeptical"],correct:2,explanation:"Popularity is not verification. Guaranteed-return claims and pressure to act are reasons for skepticism."},
 ],
};
export function lessonQuiz(id: string): readonly QuizQuestion[] {
 const lesson = lessons.find(item => item.id === id);
 if (!lesson) return [];
 if (lesson.id === "what-you-own") return ownershipQuiz;
 return [{id:"original",question:lesson.question,options:lesson.options,correct:lesson.correct,explanation:lesson.explanation}, ...extraQuestions[lesson.id]];
}
