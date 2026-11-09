// Treat return destinations as paths only, including after URL decoding.
export function internalPath(value: unknown, fallback = "/learn") {
 if (typeof value !== "string" || value.length > 2048) return fallback;
 try {
  let decoded = value;
  for (let i = 0; i < 3; i++) {
   if (!decoded.startsWith("/") || decoded.startsWith("//") || /[\\\s\u0000-\u001f\u007f]/.test(decoded)) return fallback;
   const next = decodeURIComponent(decoded);
   if (next === decoded) break;
   decoded = next;
  }
  if (!decoded.startsWith("/") || decoded.startsWith("//") || /[\\\s\u0000-\u001f\u007f]/.test(decoded)) return fallback;
  const url = new URL(decoded, "https://cornerstone.invalid");
  if (url.origin !== "https://cornerstone.invalid") return fallback;
  return url.pathname + url.search + url.hash;
 } catch { return fallback; }
}
