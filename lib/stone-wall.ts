export const WALL_SEEN_KEY = "cornerstone-wall-seen-v1";
export const STONE_LAY_MS = 1200;

export function stoneSeed(id: string) {
  let seed = 2166136261;
  for (const char of id) seed = Math.imul(seed ^ char.charCodeAt(0), 16777619);
  return seed >>> 0;
}

export function stoneAppearance(id: string) {
  const seed = stoneSeed(id);
  const inset = 2 + seed % 3;
  return {
    weight: 80 + seed % 51,
    tint: ["#bdc9b3", "#cbd2c0", "#b7c5af", "#d5d8c9"][seed % 4],
    path: `M${inset} 4 L27 2 L61 3 L96 ${inset} L98 25 L97 57 L72 60 L39 58 L3 60 L1 37 Z`,
  };
}

// Only animation receipts are stored here; the learning store remains authoritative.
let sessionSeen: string[] | null = null;
export function readSeenStones(): string[] | null {
  try {
    const raw = localStorage.getItem(WALL_SEEN_KEY);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every(id => typeof id === "string") ? parsed : null;
  } catch { return sessionSeen; }
}
export function saveSeenStones(ids: string[]) {
  sessionSeen = [...new Set(ids)];
  try { localStorage.setItem(WALL_SEEN_KEY, JSON.stringify(sessionSeen)); } catch { /* Session receipts still prevent repeats during this visit. */ }
}
