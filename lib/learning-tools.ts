export function growthExample(initial:number,monthly:number,years:number,annualPercent:number,feePercent:number) {
  const months=Math.round(years*12);
  const rate=Math.pow(1+annualPercent/100,1/12)-1;
  const feeFactor=Math.pow(1-feePercent/100,1/12);
  let gross=initial,net=initial;
  for(let month=0;month<months;month++){gross=gross*(1+rate)+monthly;net=net*(1+rate)*feeFactor+monthly;}
  return {gross,net,contributed:initial+monthly*months};
}
