import { describe,expect,it } from "vitest";
import { createSignedToken,readSignedToken } from "./signed-token";

const secret="a-long-test-secret-that-is-never-production";
describe("recap action tokens",()=>{
  it("reads an unexpired unsubscribe token for its intended action",()=>{const token=createSignedToken({purpose:"unsubscribe",userId:"user-1",exp:200},secret);expect(readSignedToken<{purpose:string;userId:string;exp:number}>(token,secret,"unsubscribe",100)?.userId).toBe("user-1")});
  it("rejects an expired or wrong-purpose token",()=>{const token=createSignedToken({purpose:"unsubscribe",userId:"user-1",exp:200},secret);expect(readSignedToken(token,secret,"unsubscribe",201)).toBeNull();expect(readSignedToken(token,secret,"campus",100)).toBeNull()});
  it("rejects tampering",()=>{const token=createSignedToken({purpose:"unsubscribe",userId:"user-1",exp:200},secret),[value,signed]=token.split("."),tampered=(value.endsWith("A")?value.slice(0,-1)+"B":value.slice(0,-1)+"A")+"."+signed;expect(readSignedToken(tampered,secret,"unsubscribe",100)).toBeNull();expect(readSignedToken(token+".extra",secret,"unsubscribe",100)).toBeNull()});
});
