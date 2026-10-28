/** Minimal harness contract: host tests provide React, Testing Library, Vitest, next-intl, and API mocks. */
export const passwordRecoveryHarnessRequirements = [
  'mock next-intl AUTH translations',
  'mock the module-local recovery mutation and idempotency key hook',
  'assert user-visible interactions and the exact identity-only payload',
] as const;
