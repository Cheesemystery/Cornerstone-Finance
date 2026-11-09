import { expect, it } from "vitest";
import { internalPath } from "./internal-path";
it.each(["https://evil.test", "//evil.test", "/\\evil.test", "/%2fexample.com", "/%252fexample.com", "/%0a/evil.test", "/%", " /learn", undefined, "/%255cevil.test"])("rejects unsafe return path %s", value => expect(internalPath(value)).toBe("/learn"));
it("preserves lesson query and hash",()=>expect(internalPath("/learn/fees-and-time?weekly=1#calculator")).toBe("/learn/fees-and-time?weekly=1#calculator"));
