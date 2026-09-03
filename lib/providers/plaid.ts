import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from "plaid";
import { env, integrations } from "@/lib/env";

const basePath = PlaidEnvironments[env.PLAID_ENV];
const client = new PlaidApi(new Configuration({ basePath, baseOptions: { headers: { "PLAID-CLIENT-ID": env.PLAID_CLIENT_ID, "PLAID-SECRET": env.PLAID_SECRET } } }));

export async function createLinkToken(userId:string){
  if(!integrations.plaid) return { configured:false as const, reason:"Plaid sandbox credentials and a token encryption key are required." };
  const response=await client.linkTokenCreate({user:{client_user_id:userId},client_name:"Cornerstone",products:[Products.Investments],country_codes:[CountryCode.Us],language:"en"});
  return {configured:true as const,linkToken:response.data.link_token,expiration:response.data.expiration};
}
