export type EntitlementStatus="inactive"|"trialing"|"active"|"past_due"|"canceled"|"unpaid";

export function normalizeEntitlementStatus(status:string|undefined):EntitlementStatus{
  if(status==="trialing"||status==="active"||status==="past_due"||status==="canceled"||status==="unpaid")return status;
  return "inactive";
}

export function hasProEntitlement(status:string|undefined,currentPeriodEnd:string|null|undefined,now=new Date()){
  if(status==="trialing"||status==="active")return !currentPeriodEnd||Date.parse(currentPeriodEnd)>now.getTime();
  return status==="canceled"&&Boolean(currentPeriodEnd)&&Date.parse(currentPeriodEnd!)>now.getTime();
}
