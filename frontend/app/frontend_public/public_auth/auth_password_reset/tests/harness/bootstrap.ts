/** Minimal test-harness entry point; test runner setup is host-owned and absent from this archive. */
export const publicAuthPasswordResetHarness = { module: 'auth_password_reset', requiresHostTestRunner: true } as const;
