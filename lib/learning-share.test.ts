import { describe, expect, it } from "vitest";
import { learningShareSvg } from "./learning-share";
describe("selected learning share contents", () => {
  it("excludes unselected counts and all financial information", () => {
    const svg = learningShareSvg({
      lessons: 4,
      total: 6,
      xp: 85,
      reflections: 9,
      includeLearning: false,
      includePractice: false,
    });
    expect(svg).not.toContain("85");
    expect(svg).not.toContain("9 fictional");
    expect(svg).not.toContain("$");
  });
  it("includes only selected learning and reflection counts", () => {
    const svg = learningShareSvg({
      lessons: 2,
      total: 6,
      xp: 45,
      reflections: 3,
      includeLearning: true,
      includePractice: true,
    });
    expect(svg).toContain("2 of 6");
    expect(svg).toContain("45 learning XP");
    expect(svg).toContain("3 fictional-money reflections");
  });
});
