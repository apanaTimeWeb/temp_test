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

## 5. Security & Permission Gates
- Only `SUPER_ADMIN` and `FINANCE_ADMIN` roles can approve handovers or clear drawers.
- Discrepancy flagging locks the record into an immutable audit trail requiring resolution before shift closing.

## 6. Offline & Demonstration Behavior
- In demo mode (`isFrontendDemoModeEnabled()`), initial state loads from `ADMIN_DAILY_SETTLEMENT_FIXTURES`.
- Mutations update local state and display confirmation toasts via Sonner.

## 7. Standalone Harness
- `tests/harness/AdminAccountsDailySettlementHarness.tsx` provides deterministic scenario testing (`ACTIVE`, `EMPTY`, `SERVER_500`, `TIMEOUT`, `UNAUTHORIZED`).

