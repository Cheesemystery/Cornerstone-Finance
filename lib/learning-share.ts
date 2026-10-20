export function learningShareSvg({
  lessons,
  total,
  xp,
  reflections,
  includeLearning,
  includePractice,
}: {
  lessons: number;
  total: number;
  xp: number;
  reflections: number;
  includeLearning: boolean;
  includePractice: boolean;
}) {
  const learning = includeLearning
    ? `${lessons} of ${total} lessons complete · ${xp} learning XP`
    : "Learning at my own pace.";
  const practice = includePractice
    ? `${reflections} fictional-money reflections`
    : "Small steps. More understanding.";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" rx="32" fill="#183d2d"/><circle cx="1080" cy="100" r="210" fill="#244d39"/><text x="70" y="95" fill="#d6f58d" font-size="32" font-family="Georgia,serif">Cornerstone.</text><text x="70" y="240" fill="#fff" font-size="64" font-family="Arial,sans-serif" font-weight="700">A little wiser with money.</text><text x="70" y="335" fill="#d6f58d" font-size="36" font-family="Arial,sans-serif">${learning}</text><text x="70" y="405" fill="#e6eee5" font-size="30" font-family="Arial,sans-serif">${practice}</text><text x="70" y="550" fill="#c1d2c5" font-size="24" font-family="Arial,sans-serif">Learning and fictional practice. No financial results shared.</text></svg>`;
}
