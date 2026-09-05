import { createHmac, timingSafeEqual } from "node:crypto";

function equalHex(left:string,right:string){
  const a=Buffer.from(left,"utf8");
  const b=Buffer.from(right,"utf8");
  return a.length===b.length&&timingSafeEqual(a,b);
}

export function validStripeSignature(raw:string,header:string|null,secret:string|undefined,now=Math.floor(Date.now()/1000)){
  if(!header||!secret)return false;
  const fields=header.split(",").reduce<Record<string,string[]>>((result,item)=>{const [key,value]=item.split("=",2);if(key&&value)(result[key]??=[]).push(value);return result},{});
  const timestamp=Number(fields.t?.[0]);
  if(!Number.isFinite(timestamp)||Math.abs(now-timestamp)>300||!fields.v1?.length)return false;
  const expected=createHmac("sha256",secret).update(`${timestamp}.${raw}`).digest("hex");
  return fields.v1.some(signature=>equalHex(expected,signature));
}
