import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from "plaid";
import { env, integrations } from "@/lib/env";
import { createHash,createPublicKey,verify as verifySignature } from "node:crypto";

const basePath = PlaidEnvironments[env.PLAID_ENV];
const client = new PlaidApi(new Configuration({ basePath, baseOptions: { headers: { "PLAID-CLIENT-ID": env.PLAID_CLIENT_ID, "PLAID-SECRET": env.PLAID_SECRET } } }));

export async function createLinkToken(userId:string){
  if(!integrations.plaid) return { configured:false as const, reason:"Plaid sandbox credentials and a token encryption key are required." };
  const response=await client.linkTokenCreate({user:{client_user_id:userId},client_name:"Cornerstone",products:[Products.Investments],country_codes:[CountryCode.Us],language:"en",webhook:env.PLAID_WEBHOOK_URL||undefined});
  return {configured:true as const,linkToken:response.data.link_token,expiration:response.data.expiration};
}

export async function exchangePublicToken(publicToken:string){if(!integrations.plaid)throw new Error("Plaid is not configured.");const response=await client.itemPublicTokenExchange({public_token:publicToken});return {accessToken:response.data.access_token,itemId:response.data.item_id}}
export async function removePlaidItem(accessToken:string){if(!integrations.plaid)throw new Error("Plaid is not configured.");await client.itemRemove({access_token:accessToken})}
export async function getPlaidHoldings(accessToken:string){if(!integrations.plaid)throw new Error("Plaid is not configured.");return (await client.investmentsHoldingsGet({access_token:accessToken})).data}
export async function getPlaidInvestmentTransactions(accessToken:string,startDate:string,endDate:string){if(!integrations.plaid)throw new Error("Plaid is not configured.");const transactions=[];let offset=0,total=1;while(offset<total){const response=await client.investmentsTransactionsGet({access_token:accessToken,start_date:startDate,end_date:endDate,options:{count:500,offset}});transactions.push(...response.data.investment_transactions);total=response.data.total_investment_transactions;offset+=response.data.investment_transactions.length;if(!response.data.investment_transactions.length)break}return transactions}

function decodePart(value:string){return JSON.parse(Buffer.from(value,"base64url").toString("utf8")) as Record<string,unknown>}
export async function verifyPlaidWebhook(raw:string,jwt:string|null,now=Math.floor(Date.now()/1000)){if(!integrations.plaid||!jwt)return false;try{const [encodedHeader,encodedPayload,encodedSignature]=jwt.split(".");if(!encodedHeader||!encodedPayload||!encodedSignature)return false;const header=decodePart(encodedHeader);const payload=decodePart(encodedPayload);if(header.alg!=="ES256"||typeof header.kid!=="string"||typeof payload.iat!=="number"||Math.abs(now-payload.iat)>300||typeof payload.request_body_sha256!=="string")return false;const response=await client.webhookVerificationKeyGet({key_id:header.kid});const key=response.data.key;if(key.alg!=="ES256"||key.use!=="sig")return false;const publicKey=createPublicKey({key:key as JsonWebKey,format:"jwk"});const valid=verifySignature("sha256",Buffer.from(`${encodedHeader}.${encodedPayload}`),{key:publicKey,dsaEncoding:"ieee-p1363"},Buffer.from(encodedSignature,"base64url"));const digest=createHash("sha256").update(raw).digest("hex");return valid&&digest===payload.request_body_sha256}catch{return false}}
