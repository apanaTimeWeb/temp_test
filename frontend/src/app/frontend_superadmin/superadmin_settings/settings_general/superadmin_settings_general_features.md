---
feature: "superadmin_settings_general"
owner_role: "superadmin"
module_version: 2
api_contract_source: "supplied-scope"
last_verified_date: "2026-11-20"
last_verified_commit: "commit-sha-or-host-unavailable"
documentation_status: "current"
portability_score: "VERIFIED_STANDALONE"
---

# settings_general — Feature Specification

## 1. Scope and Non-Scope
- **Scope**: Canonical route at `/superadmin/superadmin_settings/settings_general` managing all 11 global platform configuration domains:
  1. Platform name, logo, and favicon
  2. Default timezone
  3. Default language
  4. Default currency
  5. Default branch settings (capacity, operating hours, slot duration, check-in grace, auto-approval, weekend schedule)
  6. Password and MFA policies (length, complexity, expiration, MFA enforcement level, session timeout, max failed logins)
  7. File upload restrictions (allowed extensions, file size cap, branch quota, ClamAV scanning, WebP auto-compression)
  9. Global maintenance mode (emergency switch, broadcast message, downtime estimate, whitelisted IP CIDRs, bypass key)
  10. Data retention policy (member access logs, audit trail years, biometric/punch logs, automated database snapshots, trash auto-purge)
  11. Default subscription & grace-period rules (trial days, grace period, renewal reminder leads, auto-suspension, read-only grace, proration)
- **Non-Scope**: Sibling dedicated submodules (`settings_branding`, `settings_maintenance_mode`), backend database schema changes, and external third-party communication gateways (AWS SES, Twilio).

## 2. Screen Inventory & Component Hierarchy
- **Route page**: `src/app/frontend_superadmin/superadmin_settings/settings_general/page.tsx`
- **Route adapter**: `components/SuperadminSettingsGeneralScreen.tsx` (12 lines)
- **Client Orchestrator**: `components/SuperadminSettingsGeneralPageClient.tsx` (219 lines ≤ 300)
- **Domain Cards (all ≤ 300 lines)**:
  - `components/SuperadminSettingsGeneralPlatformRegionalCard.tsx` (186 lines)
  - `components/SuperadminSettingsGeneralBranchDefaultsCard.tsx` (155 lines)
  - `components/SuperadminSettingsGeneralSecurityPoliciesCard.tsx` (181 lines)
  - `components/SuperadminSettingsGeneralUploadRestrictionsCard.tsx` (215 lines)
  - `components/SuperadminSettingsGeneralMaintenanceModeCard.tsx` (164 lines)
  - `components/SuperadminSettingsGeneralDataRetentionCard.tsx` (200 lines)
  - `components/SuperadminSettingsGeneralSubscriptionGraceCard.tsx` (208 lines)
- **Modals & Support (all ≤ 300 lines)**:
  - `components/SuperadminSettingsGeneralResetConfirmModal.tsx` (103 lines)
  - `components/SuperadminSettingsGeneralExportModal.tsx` (125 lines)
  - `components/SuperadminSettingsGeneralErrorFallback.tsx` (28 lines)
  - `components/SuperadminSettingsGeneralListSkeleton.tsx` (29 lines)
  - `components/SuperadminSettingsGeneralWorkflowNavigation.tsx` (38 lines)

## 3. Navigation Contract
- Canonical route: `/superadmin/superadmin_settings/settings_general`
- Sibling routes:
  - Branding: `/superadmin/superadmin_settings/settings_branding`
  - Maintenance Mode: `/superadmin/superadmin_settings/settings_maintenance_mode`

## 4. API Contract
- **Contract Boundary**: `api/superadmin_settings_general.api.ts`
- **Endpoints**:
  - `GET /api/v1/superadmin/settings/general`
  - `PATCH /api/v1/superadmin/settings/general` (`Idempotency-Key: UUIDv4`)
  - `POST /api/v1/superadmin/settings/general/reset` (`Idempotency-Key: UUIDv4`)
- **Status**: Preview-safe with graceful fallback when backend network calls are unconfigured (`SUPERADMIN_SETTINGS_GENERAL_API_CONTRACT_STATUS.networkCallsEnabled = false`).

## 5. UI Data Requirements
Derived directly from `schemas/SuperadminSettingsGeneralSchema.ts`:
| Domain | Field Key | Type | Default Value |
|---|---|---|---|
| Platform & Regional | `generalConfig.platformName` | string (1-80) | `"Library OS"` |
| Platform & Regional | `generalConfig.supportEmail` | string (email) | `"support@example.invalid"` |
| Platform & Regional | `generalConfig.currency` | enum | `"INR (₹)"` |
| Platform & Regional | `generalConfig.timezone` | enum | `"Asia/Kolkata"` |
| Platform & Regional | `generalConfig.defaultLanguage` | enum | `"en"` |
| Branch Defaults | `branchDefaults.defaultMemberCapacity`| number | `500` |
| Branch Defaults | `branchDefaults.openingTime` | string (HH:MM) | `"06:00"` |
| Branch Defaults | `branchDefaults.closingTime` | string (HH:MM) | `"23:00"` |
| Security Policy | `securityPolicy.minPasswordLength` | number (8-32) | `10` |
| Security Policy | `securityPolicy.mfaEnforcement` | enum | `"SUPERADMIN_ONLY"` |
| Upload Quotas | `uploadRestrictions.maxFileSizeMb` | number | `10` |
| Upload Quotas | `uploadRestrictions.allowedExtensions` | string[] | `[".pdf", ".png", ...]` |
| Maintenance | `maintenance.enabled` | boolean | `false` |
| Maintenance | `maintenance.message` | string | `""` |
| Data Retention | `dataRetention.memberLogsRetentionDays`| number | `90` |
| Data Retention | `dataRetention.autoBackupSchedule` | enum | `"DAILY"` |
| Subscription/Grace | `subscriptionGrace.defaultTrialDays` | number | `14` |
| Subscription/Grace | `subscriptionGrace.paymentGracePeriodDays` | number | `7` |

## 6. Query Key Registry
- Canonical keys defined in `api/superadmin_settings_general.query_keys.ts`:
  - `['superadmin', 'settings', 'general']` (Root)
  - `['superadmin', 'settings', 'general', 'detail']`
  - `['superadmin', 'settings', 'general', 'active-tab']`

## 7. Mutation Inventory
- `updateSettings`: TanStack Query v5 `useMutation` with `Idempotency-Key: UUIDv4` headers and automatic cache invalidation.
- `resetSettings`: Double-confirmed mutation resetting all 11 settings back to system defaults.

## 8. Permissions and Role Rules
- Superadmin role-exclusive configuration. Read/write authorized strictly at the Superadmin administrative boundary.

## 9. State Ownership
- **Server State**: Managed by TanStack Query v5 (`useSuperadminSettingsGeneralData`).
- **Form State**: Managed by React Hook Form v7 with Zod schema resolution (`SUPERADMIN_SETTINGS_SCHEMA`).
- **UI State**: Filter section pills and active tab managed by module-scoped Zustand store (`useSuperadminSettingsGeneralStore`).

## 10. Offline and Reconnect Behavior
- Network disconnection or failed API endpoints gracefully fallback to `SUPERADMIN_SETTINGS_PREVIEW_DEFAULTS` without application crash.

## 11. Security and PII Rules
- Password minimum complexity enforced (length >= 8, uppercase, numbers, special characters).
- Emergency maintenance bypass keys and sensitive tokens masked and protected from log output.

## 12. Accessibility Requirements
- All forms use explicit label association via `htmlFor`.
- Keyboard navigation across tabs and section filter pills (`role="tablist"` and `role="tab"`).
- Double-verification modal dialog with focus trapping and ESC key dismissal (`role="dialog"`).

## 13. Background Tasks
- ClamAV async file scanning simulation and automated daily database snapshot replication indicators.

## 14. Feature Flags
- None required; settings categories are rendered dynamically based on active filter pills.

## 15. Cache Invalidation
- On successful mutation or reset, `queryClient.invalidateQueries({ queryKey: SUPERADMIN_SETTINGS_GENERAL_QUERY_KEYS.all })` revalidates cache.

## 16. Migration and Rollback
- Reverting to previous versions requires zero database migration since state falls back to local schema definitions.

## 17. Test Coverage Map
- `SuperadminSettingsGeneralElevenSettingsContract.test.tsx` (20 tests verifying all 11 settings domains)
- `SuperadminSettingsGeneralMockScenarioCatalog.test.ts` (2 tests)
- `SuperadminSettingsGeneralScaleFixtureTiers.test.ts` (2 tests)
- `SuperadminSettingsGeneralAsyncStateContract.test.ts` (2 tests)
- `SuperadminSettingsGeneralCanonicalWorkflowRouteContract.test.ts` (2 tests)
- `SuperadminCanonicalMockScenarioHarness.test.tsx` (2 tests)
- `SuperadminSettingsGeneralConfirmHookContract.test.tsx` (5 tests)
- `SuperadminSettingsGeneralActiveBranchContract.test.ts` (1 test)
- `SuperadminSettingsGeneralRouteContract.test.ts` (1 test)
- `SuperadminSettingsGeneralPreviewOnlyApiContract.test.ts` (1 test)
- `SuperadminSettingsGeneralQueryKeys.test.ts` (1 test)

## 18. Architecture Exceptions
- None. Strict WET adherence; zero cross-role imports; zero barrel files.

## 19. Known Contract Gaps
- None. All 11 global settings are fully modeled with schemas, types, constants, and components.

## 20. Standalone Run, Mock & Test Harness
- Located at `tests/harness/SuperadminSettingsGeneralHarness.tsx`.
- Standalone execution supports `ACTIVE`, `EMPTY`, `SERVER_500`, `TIMEOUT`, `UNAUTHORIZED`, `LOADING`, `MUTATION_FAILURE`, and `UNAVAILABLE_MUTATION`.
- Deterministic scale fixtures available at `mocks/fixtures/superadmin_settings_general.scale-stress-fixtures.ts`.

## 21. Module Portability & Host Integration Guide
- Path: `src/app/frontend_superadmin/superadmin_settings/settings_general/`
- Direct Next.js App Router mounting with full layout and navigation shell integration.

## 22. Deliverables & Version History
- **V2.0.0 (2026-11-20)**: Implemented all 11 global settings domains, cards, modals, Zod validation, TanStack Query v5 mutations, Zustand UI store, and comprehensive Vitest test suites (39/39 passing).
