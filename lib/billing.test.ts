import { describe,expect,it } from "vitest";
import { hasProEntitlement,normalizeEntitlementStatus } from "./billing";

describe("Pro entitlements",()=>{
  it("maps unsupported Stripe states to inactive",()=>{expect(normalizeEntitlementStatus("incomplete")).toBe("inactive");expect(normalizeEntitlementStatus("paused")).toBe("inactive")});
  it("keeps canceled access through the paid period",()=>{const now=new Date("2026-09-04T12:00:00Z");expect(hasProEntitlement("canceled","2026-09-30T00:00:00Z",now)).toBe(true);expect(hasProEntitlement("canceled","2026-09-01T00:00:00Z",now)).toBe(false)});
  it("expires active access when its period is over",()=>{expect(hasProEntitlement("active","2026-09-01T00:00:00Z",new Date("2026-09-04T12:00:00Z"))).toBe(false)});
});
