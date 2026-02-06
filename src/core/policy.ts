
import type { Budget, ModelSpec } from "./types";

export type Policy = Readonly<{
  allowPaths: string[];
  denyPaths: string[];
  budget: Budget;
  model: ModelSpec;
  strictSchema: true;
  promptInjectionGuard: true;
}>;

export const DefaultPolicy: Policy = {
  allowPaths: ["docs/", "specs/", "src/", "pseudocode/", "math/"],
  denyPaths: [".github/", "secrets/", "configs/", "deploy/"],
  budget: { maxCalls: 6, maxTotalInputTokens: 40_000, maxTotalOutputTokens: 10_000 },
  model: { provider: "stub", model: "stub-model", temperature: 0.2, maxOutputTokens: 1500 },
  strictSchema: true,
  promptInjectionGuard: true,
};

export function isAllowedPath(path: string, p: Policy = DefaultPolicy): boolean {
  if (p.denyPaths.some((d) => path.startsWith(d))) return false;
  return p.allowPaths.some((a) => path.startsWith(a));
}
