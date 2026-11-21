// tests/harness/bootstrap.ts
// Bootstrap environment setup for isolated testing of Superadmin Security Reports

export function bootstrapTestEnvironment() {
  if (typeof window !== 'undefined') {
    window.print = window.print || (() => {});
  }
}
