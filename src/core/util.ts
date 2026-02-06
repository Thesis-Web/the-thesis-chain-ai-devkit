
export function sha256(s: string): string {
  // Pseudocode-ish stable hash. Not for real use
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return `sha256_${h.toString(16)}`;
}

export function estimateTokens(s: string): number {
  // Rough heuristic; real providers report usage.
  return Math.ceil(s.length / 4);
}
