---
feature: "admin_settings_branches"
owner_role: "admin"
module_version: 1
api_contract_source: "mega-submodule-split-5gate"
last_verified_date: "2026-11-27"
last_verified_commit: "verified-local-tree"
documentation_status: "current"
portability_score: "HIGH"
---

# Admin Settings Branches — Autonomous Submodule Specification

## 1. Scope and Non-Scope
Owns Admin library branch registry, branch metadata editing, status toggle (active/inactive), sorting, searching, and mobile/desktop views under `admin_settings/settings_branches/`. Extracted from `settings_profile` under the 5-Gate Decision Matrix (`Branch` lifecycle vs `AdminUserProfile`).

## 2. Screen Inventory
- Route: `page.tsx` (`/admin/admin_settings/settings_branches`)
- Main: `AdminSettingsBranchesMain.tsx` -> `AdminSettingsBranchesPanel.tsx` -> `AdminSettingsBranchesTable.tsx` / `AdminSettingsBranchesMobileList.tsx` + `AdminSettingsBranchesEditModal.tsx`

## 3. Navigation Contract
Canonical route `/admin/admin_settings/settings_branches` (`ADMIN_SETTINGS_BRANCHES_ROUTES.ROOT`).

## 4. API Contract
No backend mutation endpoint verified yet (`ADMIN_SETTINGS_BRANCHES_API.CONTRACT_MISSING = null`). Demo catalogue comes from config fixtures.

## 5. State Management
Local React hook state inside `AdminSettingsBranchesPanel.tsx` for search, sorting, pagination, and optimistic demo edits/toggles.

## 6. Forms and Validation
`AdminSettingsBranchesEditModal.tsx` uses `react-hook-form` + `zodResolver` (`BranchEditSchema`) + `beforeunload` unsaved changes protection.

## 7. Security & Tenant Isolation
Enforces branch-level tenant scoping when backend APIs connect; no cross-submodule imports.

## 8. Error Handling & Recovery
Route-level `error.tsx` boundary reports to `reportAdminError` with localized Retry control.

## 9. Loading & Empty States
Route-level `loading.tsx` uses `AdminPageLoader`; empty search shows accessible empty state card.

## 10. Notifications & Feedback
Deduplicated `toast.success(..., { id })` on save and status toggle.

## 11. Internationalization & Localization
Uses `ADMIN_BRANCHES` namespace across `admin_settings_branches_en.json` and `admin_settings_branches_hi.json`.

## 12. Styling & Theme Tokens
Uses semantic tokens (`bg-card`, `bg-overlay`, `bg-success-bg`, `text-success-text`, `bg-danger-bg`, `text-danger-text`, `border-border`).

## 13. Motion & Accessibility
`motion-safe:*` utilities, semantic `<table>`, `scope="col"`, `aria-sort`, `<Dialog>` modal focus management.

## 14. Responsive Design
Desktop semantic table (`hidden md:block`) + Mobile stacked cards (`md:hidden`).

## 15. Performance & Memoization
`useMemo` for filter, sort, pagination slice, active/inactive KPI counters.

## 16. Testing Strategy
Unit tests (`AdminSettingsBranchesControls.test.tsx`), standalone harness (`AdminSettingsBranchesHarness.test.tsx`), and Playwright E2E (`settings_branches.spec.ts`).

## 17. Environment Variables
No custom environment variables required; uses host `isFrontendDemoModeEnabled()`.

## 18. Data Privacy & PII
Masks or limits admin contact emails/phones cleanly inside branch rows without logging PII.

## 19. Auditability
Branch save and status activation/deactivation actions have deterministic toast IDs and UI state transitions.

## 20. Standalone Harness
`tests/harness/AdminSettingsBranchesHarness.tsx` renders all `AdminSettingsBranchesScenarios` states independently.

## 21. Portability Guide
Self-contained folder with `contracts/host-stubs.d.ts`, no relative imports, no barrel files, and local config/types/locales.

## 22. Known Limitations & Roadmap
Connect `ADMIN_SETTINGS_BRANCHES_API` CRUD endpoints when backend branch patch API is supplied.
