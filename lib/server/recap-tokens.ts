import "server-only";
import { randomUUID } from "node:crypto";
import { env } from "@/lib/env";
import { createSignedToken,readSignedToken } from "@/lib/signed-token";
type TokenPayload={purpose:"campus"|"unsubscribe";userId:string;domain?:string;nonce:string;exp:number};
function secret(){if(!env.RECAP_SIGNING_SECRET)throw new Error("Recap signing is not configured.");return env.RECAP_SIGNING_SECRET}
export function createRecapToken(payload:Omit<TokenPayload,"nonce">){return createSignedToken({...payload,nonce:randomUUID()},secret())}
export function readRecapToken(token:string,purpose:TokenPayload["purpose"],now=Math.floor(Date.now()/1000)){try{const payload=readSignedToken<TokenPayload>(token,secret(),purpose,now);return payload?.userId&&payload.nonce?payload:null}catch{return null}}
