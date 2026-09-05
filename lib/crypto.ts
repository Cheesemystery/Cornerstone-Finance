import "server-only";
import { createCipheriv,createDecipheriv,createHash,randomBytes,timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env";
function key(){if(!env.PLAID_TOKEN_ENCRYPTION_KEY)throw new Error("Token encryption is not configured.");return createHash("sha256").update(env.PLAID_TOKEN_ENCRYPTION_KEY).digest()}
export function encryptSecret(value:string){const iv=randomBytes(12);const cipher=createCipheriv("aes-256-gcm",key(),iv);const encrypted=Buffer.concat([cipher.update(value,"utf8"),cipher.final()]);return ["v1",iv.toString("base64url"),cipher.getAuthTag().toString("base64url"),encrypted.toString("base64url")].join(".")}
export function decryptSecret(value:string){const [version,iv,tag,data]=value.split(".");if(version!=="v1"||!iv||!tag||!data)throw new Error("Encrypted token is invalid.");const decipher=createDecipheriv("aes-256-gcm",key(),Buffer.from(iv,"base64url"));decipher.setAuthTag(Buffer.from(tag,"base64url"));return Buffer.concat([decipher.update(Buffer.from(data,"base64url")),decipher.final()]).toString("utf8")}
export function sha256(value:string){return createHash("sha256").update(value).digest("hex")}
export function safeEqual(a:string,b:string){const left=Buffer.from(a);const right=Buffer.from(b);return left.length===right.length&&timingSafeEqual(left,right)}
