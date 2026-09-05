import type { ContributionEvent } from "./recap";

export const sampleContributions:ContributionEvent[]=[
 {id:"sample-feb",occurredOn:"2026-02-12",amount:80,currency:"USD",kind:"contribution",status:"confirmed",source:"sample",accountName:"Sample brokerage"},
 {id:"sample-mar",occurredOn:"2026-03-11",amount:120,currency:"USD",kind:"contribution",status:"confirmed",source:"sample",accountName:"Sample brokerage"},
 {id:"sample-may",occurredOn:"2026-05-08",amount:150,currency:"USD",kind:"contribution",status:"confirmed",source:"sample",accountName:"Sample brokerage"},
 {id:"sample-jul",occurredOn:"2026-07-09",amount:180,currency:"USD",kind:"contribution",status:"confirmed",source:"sample",accountName:"Sample brokerage"},
 {id:"sample-aug",occurredOn:"2026-08-13",amount:200,currency:"USD",kind:"contribution",status:"confirmed",source:"sample",accountName:"Sample brokerage"},
 {id:"sample-aug-withdrawal",occurredOn:"2026-08-25",amount:40,currency:"USD",kind:"withdrawal",status:"confirmed",source:"sample",accountName:"Sample brokerage"},
 {id:"sample-sep",occurredOn:"2026-09-03",amount:240,currency:"USD",kind:"contribution",status:"confirmed",source:"sample",accountName:"Sample brokerage"},
 {id:"sample-suggestion",occurredOn:"2026-09-04",amount:75,currency:"USD",kind:"contribution",status:"suggested",source:"plaid",accountName:"Sample brokerage",confidence:.98}
];
