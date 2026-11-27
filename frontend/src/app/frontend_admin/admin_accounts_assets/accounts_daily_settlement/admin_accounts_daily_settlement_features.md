---
feature: "admin_accounts_daily_settlement"
owner_role: "admin"
module_version: 1
api_contract_source: "VERIFIED_V1 — daily settlement approval & audit contract"
last_verified_date: "2026-11-01"
documentation_status: "authoritative"
portability_score: "HIGH — self-contained autonomous submodule"
---

# Admin Accounts Daily Settlement & Handover Audit — Submodule Specification

## 1. Scope and Non-Scope
This autonomous sub-module owns the admin daily settlement approval and manager handover audit screen, KPI summary metrics, multi-branch filtering, drawer variance calculations, cash clearance approval modal, and discrepancy flagging audit workflows.
It does NOT own manager shift drawer operations (which are owned by `frontend_manager/manager_accounts_assets/accounts_daily_settlement`).

## 2. Screen Inventory
- Canonical route entry: `page.tsx`
- Canonical UI route: `/admin/admin_accounts_assets/accounts_daily_settlement`
- Components:
  - `AdminAccountsDailySettlementPage.tsx`: Primary orchestrator
  - `AdminAccountsDailySettlementKpis.tsx`: 4 KPI summary cards
  - `AdminAccountsDailySettlementTable.tsx`: Full responsive data table
  - `AdminAccountsDailySettlementApprovalModal.tsx`: Cash clearance verification modal
  - `AdminAccountsDailySettlementDiscrepancyModal.tsx`: Discrepancy flagging and audit logging modal
  - `AdminAccountsDailySettlementEmptyState.tsx`: Accessible zero-state component

## 3. Navigation Contract
- UI Route: `/admin/admin_accounts_assets/accounts_daily_settlement`
- Config: `config/admin_accounts_daily_settlement.url_config.ts` exporting `ADMIN_ACCOUNTS_DAILY_SETTLEMENT_ROUTES` and `ADMIN_ACCOUNTS_DAILY_SETTLEMENT_API`
- Secondary Tab: `Daily Settlement` tab in `admin_accounts_assets/layout.tsx`
- Sidebar Entry: `accounts_assets.daily_settlement` in `admin_navigation_sidebar_navigation_constants.ts`

## 4. API Contract & Data Mapping
All monetary amounts are represented in integer minor units (paise: ₹1.00 = 100 paise) to prevent floating-point rounding errors.
- `GET /api/v1/admin/accounts/daily-settlements`: Fetches list with query params (`branchId`, `status`, `startDate`, `endDate`, `search`).
- `GET /api/v1/admin/accounts/daily-settlements/kpis`: Aggregated statistics.
- `POST /api/v1/admin/accounts/daily-settlements/:id/approve`: Approves handover with `verifiedCashAmount` and optional `adminNotes`. Idempotency key attached.
- `POST /api/v1/admin/accounts/daily-settlements/:id/flag-discrepancy`: Flags discrepancy with `discrepancyReason` and mandatory `adminNotes`.

## 5. Query Key Registry
- Canonical registry: `api/admin_accounts_daily_settlement.query_keys.ts` (`ADMIN_ACCOUNTS_DAILY_SETTLEMENT_QUERY_KEYS`).

## 6. Mutation Inventory
- `POST /api/v1/admin/accounts/daily-settlements/:id/approve` (idempotent approval with verified amount & notes).
- `POST /api/v1/admin/accounts/daily-settlements/:id/flag-discrepancy` (discrepancy resolution strategy + mandatory audit notes).
- Local CSV/Excel export & printable A4 voucher summary.

## 7. Permissions and Role Rules
- Only `SUPER_ADMIN` and `FINANCE_ADMIN` roles can approve handovers or clear drawers.
- Discrepancy flagging locks the record into an immutable audit trail requiring resolution before shift closing.

## 8. State Ownership
- Filter criteria, date range, and modal dialogs belong in local component/hook state; server ledger queries belong to TanStack Query.

## 9. Offline and Reconnect Behavior
- In demo mode (`isFrontendDemoModeEnabled()`), initial state loads from `ADMIN_DAILY_SETTLEMENT_FIXTURES`.
- Mutations update local state and display confirmation toasts via Sonner (deduplicated with `{ id }`); failed network calls preserve user inputs and avoid background mutation retry loops.

## 10. Security and PII Rules
- All CSV exports sanitize spreadsheet formula characters (`=`, `+`, `-`, `@`); manager audit notes exclude credentials/tokens.

## 11. Accessibility Requirements
- Labeled modal inputs, keyboard `Escape` closing via shared Radix `Dialog`, ARIA roles on status badges, and high-contrast semantic tokens.

## 12. Background Tasks
- None; no polling timers or WebSocket listeners are spawned.

## 13. Feature Flags
- Honors `isFrontendDemoModeEnabled()`.

## 14. Cache Invalidation
- Approval and discrepancy mutations invalidate only `ADMIN_ACCOUNTS_DAILY_SETTLEMENT_QUERY_KEYS.lists()`.

## 15. Migration and Rollback
- Canonical route `/admin/admin_accounts_assets/accounts_daily_settlement` remains stable with zero route aliasing or breaking schema changes.

## 16. Test Coverage Map
- `tests/AdminAccountsDailySettlementControls.test.tsx`
- `tests/AdminAccountsDailySettlementApiAndSchema.test.ts`
- `tests/harness/AdminAccountsDailySettlementHarness.test.tsx`

## 17. Architecture Exceptions
- Bounded under `admin_accounts_assets` container per domain ADR; maintains full WET sibling isolation with local export helpers.

## 18. Known Contract Gaps
- Live payroll auto-deduction webhook synchronization when `DEDUCT_SALARY` is selected remains `CONTRACT_MISSING` outside demo mode.

## 19. Rule Compliance Checklist
- [x] Domain-prefixed autonomous submodule structure.
- [x] Full 22-section specification, `_forbidden.md`, and `_theme_contract.md`.
- [x] Idempotent mutation payloads and minor-unit (`paise`) math.

## 20. Standalone Run, Mock & Test Harness
- `tests/harness/AdminAccountsDailySettlementHarness.tsx` and `mocks/scenarios/` provide deterministic testing (`ACTIVE`, `EMPTY`, `SERVER_500`, `TIMEOUT`, `UNAUTHORIZED`).

## 21. Module Portability & Host Integration Guide
- Copy `admin_accounts_assets/accounts_daily_settlement/` alongside host `next-intl` namespace `ADMIN_ACCOUNTS_DAILY_SETTLEMENT` and semantic theme tokens.

## 22. Deliverables & Version History
- V1.1 (2026-11-27): Expanded specification to full 22-section architecture compliance; relocated unit/control tests inside submodule `tests/`.

