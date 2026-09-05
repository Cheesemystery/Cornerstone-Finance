import { createHmac,timingSafeEqual } from "node:crypto";

function signature(value:string,secret:string){return createHmac("sha256",secret).update(value).digest("base64url")}
function equal(left:string,right:string){const a=Buffer.from(left),b=Buffer.from(right);return a.length===b.length&&timingSafeEqual(a,b)}

export function createSignedToken(payload:Record<string,unknown>,secret:string){const value=Buffer.from(JSON.stringify(payload)).toString("base64url");return value+"."+signature(value,secret)}
export function readSignedToken<T extends {purpose:string;exp:number}>(token:string,secret:string,purpose:string,now=Math.floor(Date.now()/1000)){try{const [value,signed,...extra]=token.split(".");if(!value||!signed||extra.length||!equal(signature(value,secret),signed))return null;const payload=JSON.parse(Buffer.from(value,"base64url").toString("utf8")) as T;if(payload.purpose!==purpose||!Number.isFinite(payload.exp)||payload.exp<now)return null;return payload}catch{return null}}
