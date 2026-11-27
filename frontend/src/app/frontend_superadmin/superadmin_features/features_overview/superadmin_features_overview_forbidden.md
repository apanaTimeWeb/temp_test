# Feature & Module Control - Forbidden Practices

1. Never bypass the 3-level governance hierarchy: Platform Killswitch (Level 1) overrides Plan Entitlements (Level 2), which in turn default over Tenant/Branch Custom Overrides (Level 3).
2. Never hardcode permission checks or feature access directly in leaf UI components without using `computeEffectiveAccess`.
3. Never mutate global platform defaults without confirmation and audit reason logging.
4. Never disable a platform-level module without warning that all tenants will be blocked immediately.
5. Never allow custom override creation without an explicit justification audit trail.
6. Never write raw SQL or bypass repository queries when persisting feature overrides.
7. Never exceed the strict 300-line ceiling for React component files or 150-line ceiling for utilities and schemas.
