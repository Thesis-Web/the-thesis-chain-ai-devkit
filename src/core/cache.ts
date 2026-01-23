// TARGET: aidev src/core/cache.ts

import type { LLMResponse } from "./types";

export interface CacheStore {
  get(key: string): Promise<LLMResponse | null>;
  set(key: string, value: LLMResponse, ttlSeconds: number): Promise<void>;
}

// In-memory reference cache (safe for demos, not production)
export function createMemoryCache(): CacheStore {
  const m = new Map<string, { v: LLMResponse; exp: number }>();

  return {
    async get(key: string) {
      const now = Date.now();
      const hit = m.get(key);
      if (!hit) return null;
      if (hit.exp < now) {
        m.delete(key);
        return null;
      }
      return hit.v;
    },
    async set(key: string, value: LLMResponse, ttlSeconds: number) {
      const exp = Date.now() + ttlSeconds * 1000;
      m.set(key, { v: value, exp });
    },
  };
}
