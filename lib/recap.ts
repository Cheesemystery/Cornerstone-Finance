export type ContributionKind = "contribution" | "withdrawal";
export type ContributionStatus = "suggested" | "confirmed" | "excluded" | "deleted";
export type ContributionSource = "plaid" | "manual" | "sample";

export interface ContributionEvent {
  id:string;
  occurredOn:string;
  amount:number;
  currency:"USD";
  kind:ContributionKind;
  status:ContributionStatus;
  source:ContributionSource;
  accountName?:string;
  providerTransactionId?:string;
  confidence?:number;
  userCorrected?:boolean;
}

export interface PlaidInvestmentActivity {
  id:string;
  date:string;
  amount:number;
  type:string;
  subtype:string;
  accountName?:string;
  cancelTransactionId?:string | null;
}

export interface RecapSummary {
  period:string;
  contributed:number;
  withdrawn:number;
  previousContributed:number;
  changeFromPrevious:number;
  lifetimeContributed:number;
  streak:number;
  pending:number;
  nextMilestone:number;
  months:Array<{period:string;contributed:number;active:boolean}>;
}

const contributionSubtypes=new Set(["contribution","deposit"]);
const withdrawalSubtypes=new Set(["withdrawal","distribution"]);
const milestones=[100,250,500,1000,2500,5000,10000,25000,50000,100000,250000,500000,1000000];
export function nextContributionMilestone(lifetimeContributed:number){return milestones.find(value=>value>lifetimeContributed)??Math.ceil((lifetimeContributed+1)/1000000)*1000000}

export function normalizePlaidInvestmentActivity(activity:PlaidInvestmentActivity):ContributionEvent|null {
  const subtype=activity.subtype.trim().toLowerCase();
  const kind=contributionSubtypes.has(subtype)?"contribution":withdrawalSubtypes.has(subtype)?"withdrawal":null;
  if(!kind||activity.cancelTransactionId||!Number.isFinite(activity.amount)||activity.amount===0)return null;
  // Plaid investment cash credits are negative. Store every normalized amount as positive.
  return {id:`plaid-${activity.id}`,providerTransactionId:activity.id,occurredOn:activity.date,amount:Math.abs(activity.amount),currency:"USD",kind,status:"suggested",source:"plaid",accountName:activity.accountName,confidence:(subtype==="contribution"||subtype==="withdrawal") ? .98 : .9};
}

export function monthKey(date:string|Date){const value=typeof date==="string"?date.slice(0,7):`${date.getUTCFullYear()}-${String(date.getUTCMonth()+1).padStart(2,"0")}`;if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(value))throw new Error("Invalid month");return value;}
export function monthKeyInTimeZone(date:Date,timeZone:string){const parts=Object.fromEntries(new Intl.DateTimeFormat("en-US",{timeZone,year:"numeric",month:"2-digit"}).formatToParts(date).map(part=>[part.type,part.value]));return monthKey(`${parts.year}-${parts.month}`)}
export function shiftMonth(period:string,delta:number){const [year,month]=monthKey(period).split("-").map(Number);const date=new Date(Date.UTC(year,month-1+delta,1));return monthKey(date);}
export function formatMonth(period:string,format:"long"|"short"="long"){const [year,month]=monthKey(period).split("-").map(Number);return new Intl.DateTimeFormat("en-US",{month:format,year:"numeric",timeZone:"UTC"}).format(new Date(Date.UTC(year,month-1,1)));}

function confirmedContribution(events:ContributionEvent[],period:string){return events.filter(event=>event.status==="confirmed"&&event.kind==="contribution"&&monthKey(event.occurredOn)===period).reduce((sum,event)=>sum+event.amount,0);}
export function contributionSeries(events:ContributionEvent[],endPeriod:string,count:number){const safeCount=Math.max(1,Math.min(120,Math.floor(count)));return Array.from({length:safeCount},(_,index)=>{const period=shiftMonth(endPeriod,index-safeCount+1),contributed=confirmedContribution(events,period);return {period,contributed,active:contributed>0}})}

export function summarizeRecap(events:ContributionEvent[],period:string):RecapSummary {
  const current=monthKey(period);const previous=shiftMonth(current,-1);
  const confirmed=events.filter(event=>event.status==="confirmed");
  const contributed=confirmedContribution(events,current);
  const previousContributed=confirmedContribution(events,previous);
  const withdrawn=confirmed.filter(event=>event.kind==="withdrawal"&&monthKey(event.occurredOn)===current).reduce((sum,event)=>sum+event.amount,0);
  const lifetimeContributed=confirmed.filter(event=>event.kind==="contribution"&&event.occurredOn.slice(0,7)<=current).reduce((sum,event)=>sum+event.amount,0);
  let streak=0;for(let cursor=current;confirmedContribution(events,cursor)>0;cursor=shiftMonth(cursor,-1))streak++;
  const months=contributionSeries(events,current,6);
  return {period:current,contributed,withdrawn,previousContributed,changeFromPrevious:contributed-previousContributed,lifetimeContributed,streak,pending:events.filter(event=>event.status==="suggested").length,nextMilestone:nextContributionMilestone(lifetimeContributed),months};
}

export function latestContributionMonth(events:ContributionEvent[]){return events.map(event=>monthKey(event.occurredOn)).sort().at(-1)??monthKey(new Date());}
export function isPossibleDuplicate(events:ContributionEvent[],candidate:Pick<ContributionEvent,"amount"|"occurredOn">,ignoreId?:string){const day=Date.parse(`${candidate.occurredOn}T00:00:00Z`);return events.some(event=>event.id!==ignoreId&&event.status!=="deleted"&&Math.abs(event.amount-candidate.amount)<.005&&Math.abs(Date.parse(`${event.occurredOn}T00:00:00Z`)-day)<=2*86400000);}

export function campusConsistencyPercentile(scores:number[],userScore:number,minimum=30){if(scores.length<minimum)return null;const atOrBelow=scores.filter(score=>score<=userScore).length;return Math.round(atOrBelow/scores.length*100);}

export function weekStart(date:string|Date){const value=typeof date==="string"?new Date(date+"T00:00:00Z"):new Date(date);if(Number.isNaN(value.getTime()))throw new Error("Invalid date");const day=value.getUTCDay()||7;value.setUTCDate(value.getUTCDate()-day+1);return value.toISOString().slice(0,10)}
export function progressMessage(summary:RecapSummary){if(summary.contributed>0)return summary.streak>1?`That’s ${summary.streak} months of showing up.`:"You showed up for your future this month.";return "Your recap is still yours—even in a quieter month.";}
