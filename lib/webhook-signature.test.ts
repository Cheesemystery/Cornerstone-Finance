import { createHmac } from "node:crypto";
import { describe,expect,it } from "vitest";
import { validStripeSignature } from "./webhook-signature";

const raw='{"id":"evt_123","type":"customer.subscription.updated"}';
const secret="whsec_test_secret";
const now=1_800_000_000;
function header(body=raw,timestamp=now){const signature=createHmac("sha256",secret).update(`${timestamp}.${body}`).digest("hex");return `t=${timestamp},v1=${signature}`}

describe("Stripe webhook signatures",()=>{
  it("accepts the intact payload inside the replay window",()=>{expect(validStripeSignature(raw,header(),secret,now)).toBe(true)});
  it("rejects payload tampering",()=>{expect(validStripeSignature(raw+" ",header(),secret,now)).toBe(false)});
  it("rejects replayed events outside five minutes",()=>{expect(validStripeSignature(raw,header(raw,now-301),secret,now)).toBe(false)});
  it("accepts any valid v1 signature during key rotation",()=>{expect(validStripeSignature(raw,`${header()},v1=bad`,secret,now)).toBe(true)});
});
