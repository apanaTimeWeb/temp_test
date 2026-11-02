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

## 5. Security & Permission Gates
- Only `SUPER_ADMIN` and `OPERATIONS_ADMIN` roles can register or decommission capital assets.

