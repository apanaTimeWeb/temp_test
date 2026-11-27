---
feature: "admin_assets_register"
owner_role: "admin"
module_version: 1
api_contract_source: "VERIFIED_V1 — capital asset register & AMC governance contract"
last_verified_date: "2026-11-01"
documentation_status: "authoritative"
portability_score: "HIGH — self-contained autonomous submodule"
---

# Admin Asset Register & AMC Maintenance Lifecycle — Submodule Specification

## 1. Scope and Non-Scope
This autonomous sub-module owns the admin capital expenditure (CapEx) asset inventory, warranty expiration alerting, Annual Maintenance Contract (AMC) vendor governance, preventative servicing dates, and multi-branch infrastructure tracking.
It does NOT own manager daily operational complaint tickets (owned by `frontend_manager/manager_accounts_assets`).

## 2. Screen Inventory
- Canonical route entry: `page.tsx`
- Canonical UI route: `/admin/admin_accounts_assets/assets_register`
- Components:
  - `AdminAssetsRegisterPage.tsx`: Root orchestrator
  - `AdminAssetsRegisterKpis.tsx`: 4 KPI summary cards (Total Assets, Total CapEx, Active AMC, Warranty Expiring)
  - `AdminAssetsRegisterTable.tsx`: Full responsive data table with status badges and AMC indicators
  - `AdminAssetsRegisterAddModal.tsx`: Capital asset registration dialog
  - `AdminAssetsRegisterAmcModal.tsx`: AMC contract & service lifecycle update dialog
  - `AdminAssetsRegisterEmptyState.tsx`: Zero-state fallback

## 3. Navigation Contract
- UI Route: `/admin/admin_accounts_assets/assets_register`
- Config: `config/admin_assets_register.url_config.ts` exporting `ADMIN_ASSETS_REGISTER_ROUTES` and `ADMIN_ASSETS_REGISTER_API`
- Secondary Tab: `Assets Register` tab in `admin_accounts_assets/layout.tsx`
- Sidebar Entry: `accounts_assets.assets_register` in `admin_navigation_sidebar_navigation_constants.ts`

## 4. API Contract & Data Mapping
All monetary amounts (purchase cost, current book value) are integer minor units (paise).
- `GET /api/v1/admin/assets`: List query with `branchId`, `category`, `amcStatus`, `search`.
- `GET /api/v1/admin/assets/kpis`: Aggregated statistics.
- `POST /api/v1/admin/assets`: Registers new asset with idempotency key.
- `PATCH /api/v1/admin/assets/:id/amc`: Updates AMC contract, vendor contact, and service dates.

## 5. Query Key Registry
- Canonical registry: `api/admin_assets_register.query_keys.ts` (`ADMIN_ASSETS_REGISTER_QUERY_KEYS`).

## 6. Mutation Inventory
- `POST /api/v1/admin/assets` (register new capital asset with `Idempotency-Key`).
- `PATCH /api/v1/admin/assets/:id/amc` (update AMC vendor contract and service dates).
- Local CSV & formatted Excel (`.xls`) register export.

## 7. Permissions and Role Rules
- Only `SUPER_ADMIN` and `OPERATIONS_ADMIN` roles can register or decommission capital assets.

## 8. State Ownership
- Branch selection via `useAdminBranch()`, local filter/search state in `AdminAssetsRegisterPage`, and asset records via local query/demo state.

## 9. Offline and Reconnect Behavior
- Displays accessible retry/error state when live requests fail; demo fixtures load seamlessly when `isFrontendDemoModeEnabled()` is active.

## 10. Security and PII Rules
- Vendor phone numbers are treated as business contact metadata only and sanitized during CSV/Excel generation.

## 11. Accessibility Requirements
- Accessible modal dialogs, keyboard-navigable table controls, `title`/`aria-label` attributes on export actions, and contrast-safe status badges.

## 12. Background Tasks
- None; warranty expiry calculations run deterministically on render without background timers.

## 13. Feature Flags
- Honors `isFrontendDemoModeEnabled()`.

## 14. Cache Invalidation
- Asset registration and AMC updates invalidate only the local `ADMIN_ASSETS_REGISTER_QUERY_KEYS` namespace.

## 15. Migration and Rollback
- Canonical route `/admin/admin_accounts_assets/assets_register` requires no route or DB migration.

## 16. Test Coverage Map
- `tests/AdminAssetsRegisterControls.test.tsx`
- `tests/AdminAssetsRegisterComponents.test.tsx`
- `tests/harness/AdminAssetsRegisterHarness.test.tsx`

## 17. Architecture Exceptions
- Resides in `admin_accounts_assets` per bounded-context ADR while staying strictly isolated from `accounts_*` siblings.

## 18. Known Contract Gaps
- Invoice attachment binary upload storage signed-URL flow awaits backend host endpoint confirmation.

## 19. Rule Compliance Checklist
- [x] Domain-prefixed autonomous submodule structure.
- [x] Full 22-section specification, `_forbidden.md`, and `_theme_contract.md`.

## 20. Standalone Run, Mock & Test Harness
- `mocks/scenarios/` and `tests/harness/AdminAssetsRegisterHarness.tsx`.

## 21. Module Portability & Host Integration Guide
- Portable autonomous unit under `admin_accounts_assets/assets_register/`.

## 22. Deliverables & Version History
- V1.1 (2026-11-27): Expanded specification to full 22 sections and relocated submodule control tests.

