import { getPhase1ConfigStatus } from "@/lib/server/env";

export function getStartupWarnings(): string[] {
  const status = getPhase1ConfigStatus();
  if (status.configured) {
    return [];
  }

  return [
    "Phase 1 environment setup is incomplete.",
    `Missing: ${status.missingKeys.join(", ")}`,
  ];
}
