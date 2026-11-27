---
feature: "manager_settings_security"
owner_role: "manager"
module_version: 1
api_contract_source: "local-settings-ui"
last_verified_date: "2026-11-27"
documentation_status: "current"
portability_score: "VERIFIED_STANDALONE_LEAF"
---
# manager_settings_security — Feature Contract

## 1. Scope and Non-Scope

Manager security and authentication workspace (`settings_security`). Owns password updates, two-factor authentication (TOTP 2FA setup, QR rendering, verification, emergency backup codes, disable flow), active signed-in device session management, and login audit trail inspection. Non-scope: backend token issuance, persistent session revocation across devices, and server-side TOTP verification remain host backend responsibilities.

## 2. Screen Inventory

- Canonical route entry: `page.tsx` (with `loading.tsx`, `error.tsx`, and `not-found.tsx`).
- URL builder: `config/manager_settings_security.url_config.ts` (`password`, `2fa`, `sessions`, `history`).
- Components: `ManagerSettingsSecurityMain`, `ManagerSettingsSecurityHeader`, `ManagerSettingsSecurityTabs`, `ManagerSettingsSecurityPasswordForm`, `ManagerSettingsSecurityPasswordRules`, `ManagerSettingsSecurityTwoFactorPanel`, `ManagerSettingsSecurityTwoFactorSetup`, `ManagerSettingsSecurityActiveSessionsPanel`, `ManagerSettingsSecurityLoginHistoryPanel`.

## 3. Navigation Contract

- **Owning leaf:** `frontend_manager/manager_settings/settings_security/`.
- **Canonical route:** `/frontend_manager/manager_settings/settings_security`.
- Tab deep links supported via `?tab=password | 2fa | sessions | history`.

## 4. API Contract

- Local client-only security workspace; no unverified backend endpoint mutations are invented.

## 5. Query Key Registry

- No server query registry required while security controls operate on module-owned local state.

## 6. Mutation Inventory

- Client-validated password change, local 2FA enable/disable/backup-code regeneration, and local session list revocation feedback.

## 7. Permissions and Role Rules

- Scoped exclusively to manager account security within `manager_settings`.

## 8. State Ownership

- `ManagerSettingsSecurityMain` owns active tab state, 2FA config state, and active device sessions list; password form owns field/checklist state via Zod validation.

## 9. Offline and Reconnect Behavior

- UI operates cleanly with local state and explicit status alerts (`role="alert"`, `role="status"`).

## 10. Security and PII Rules

- Passwords masked by default with explicit toggle buttons; 2FA secret key & backup codes rendered only during setup/enabled state with clipboard copy feedback.

## 11. Accessibility Requirements

- Tabs declare `aria-label="Security Tabs"` and `aria-current="page"`; forms include semantic `label htmlFor`, `aria-label` visibility toggles, and alert status regions.

## 12. Background Tasks

- No background polling workers or daemon tasks.

## 13. Feature Flags

- No feature flags required.

## 14. Cache Invalidation

- Local React state updates reflect changes synchronously without external cache invalidation.

## 15. Migration and Rollback

- Self-contained leaf under `frontend_manager/manager_settings/settings_security/`; zero cross-submodule runtime dependencies.

## 16. Test Coverage Map

- Integration suite: `tests/ManagerSettingsSecurityPage.test.tsx`.

## 17. Architecture Exceptions

- None.

## 18. Known Contract Gaps

- Backend auth endpoints for persistent password hashing, TOTP enrollment confirmation, and cross-session revocation remain to be wired when backend contracts are connected.

## 19. Rule Compliance Checklist

- Terminal leaf ownership, zero cross-submodule imports (local QR SVG utility), absolute `@/` imports, toast deduplication IDs, `<= 300` line TSX ceiling, accessible modal/form controls, `contracts/host-stubs.d.ts`, `error.tsx`, `loading.tsx`, and `not-found.tsx`.

## 20. Standalone Run, Mock & Test Harness

- Execute `npx vitest run src/app/frontend_manager/manager_settings/settings_security/tests/ManagerSettingsSecurityPage.test.tsx`.

## 21. Module Portability & Host Integration Guide

- Import prefix: `@/app/frontend_manager/manager_settings/settings_security/`.

## 22. Deliverables & Version History

- Full rules compliance update applied 2026-11-27 with local QR utilities, component decomposition, CSS surface extraction, and 22-section contract documentation.
