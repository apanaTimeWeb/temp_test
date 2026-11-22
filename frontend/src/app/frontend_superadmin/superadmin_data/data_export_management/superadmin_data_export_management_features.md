# Superadmin Data Export Management Feature Specification

## 1. Executive Summary
The **Data Export Management** sub-module (`data_export_management`) delivers comprehensive support for **Feature 4: Tenant Export** (library-specific data export) and **Feature 5: Branch Export** (specific physical branch data extraction). It enforces strict multi-tenant isolation, provides format flexibility (ZIP, JSON, CSV, SQL), and hosts an asynchronous download center with SHA-256 integrity verification.

## 2. Architectural Blueprint & Domain Boundary
- **Module ID:** Module 14 — Sub-Module 4
- **Canonical Route:** `/superadmin/superadmin_data/data_export_management`
- **Internal Path:** `src/app/frontend_superadmin/superadmin_data/data_export_management/`
- **Hierarchy:** Tier 4 Leaf (sub-submodules strictly prohibited).
- **Domain Container:** Resides directly inside `superadmin_data/`.

## 3. Regulatory & Multi-Tenant Isolation Law
"Kisi ek tenant ka backup/restore/export karne se doosre tenant ka data affect ya leak nahi hona chahiye."
- Tenant exports query only the target tenant's database schema partition or tenant foreign key context.
- Zero cross-tenant leakage: books, members, circulation histories, and financial ledgers belonging to another tenant are strictly omitted.
- Branch exports apply an additional relational filter ensuring that only records linked to the specific branch are bundled.

## 4. Tenant Export Capabilities (Feature 4)
- Enables complete library tenant extraction for accreditation audits, compliance reviews, or standalone archival.
- Bundles catalogs, patron profiles, circulation history, and financial ledgers.
- Provides cryptographic SHA-256 checksums to certify archive completeness.

## 5. Branch Export Capabilities (Feature 5)
- Enables physical branch inventory and circulation extraction.
- Useful for branch closures, transfers, or localized audits.
- Scoped strictly within parent tenant hierarchy.

## 6. Export Formats & Security
- **Supported Formats:**
  - Encrypted ZIP Archive (`.zip`)
  - Relational CSV Bundle (`.tar.gz`)
  - Raw JSON Datasets (`.json`)
  - SQL Database Dump (`.sql.gz`)
- Optional password encryption using AES-256 for external file transfer.
- Time-to-Live (TTL): 7 days before automated purge to conserve storage.

## 7. User Flows & Interaction State
1. Operator navigates to `/superadmin/superadmin_data/data_export_management`.
2. Operator selects Tenant or Branch from the quick cards or clicks "Configure Export".
3. In the configuration modal, operator selects scope, format, and entity checkboxes.
4. Operator enters mandatory audit reason and submits.
5. Mutation dispatches with `Idempotency-Key: UUIDv4`.
6. Job appears in the Asynchronous Job Queue with live progress percentage.
7. Upon completion (100%), status changes to `Ready` with a direct secure download link and copyable SHA-256 hash.

## 8. Data Model & Schema Definitions
- `ExportJobRecord`: id, exportNumber, scope, tenantId, tenantName, branchId, branchName, format, entities, sizeBytes, sha256Checksum, downloadUrl, status, progressPercent, createdAt, expiresAt, requestedBy.
- `CreateExportPayload`: scope, tenantId, branchId, format, entities, encryptionPassword, reason.

## 9. State Management Architecture
- Zustand store (`useSuperadminDataExportManagementStore`) manages:
  - `isExportModalOpen`: modal visibility.
  - `preselectedScope`, `preselectedTenantId`, `preselectedBranchId`: context passed into the modal.
  - `filterScope` & `filterStatus`: queue filtering.

## 10. Form Validation & Schema Enforcement
- React Hook Form v7 with Zod v3 resolver (`CreateExportSchema`).
- Conditional refinement requiring `branchId` when `scope === 'BRANCH'`.
- Mandatory audit reason (minimum 5 characters).

## 11. Mocking & Fixtures
- Complete mock fixtures in `mocks/fixtures/superadmin_data_export_management.fixtures.ts`.
- MSW handlers in `mocks/handlers/`.

## 12. Accessibility (a11y) Compliance
- Semantic form elements with explicit labels.
- Keyboard accessible radio selectors and checkboxes.
- ARIA live region support for progress indicator.

## 13. Internationalization (i18n)
- English (`locales/superadmin_data_export_management_en.json`) and Hindi (`locales/superadmin_data_export_management_hi.json`) parity.

## 14. Responsive Layout Breakpoints
- Mobile: Single-column stacked cards and horizontal scroll table.
- Desktop: 2-column quick cards and full table view.

## 15. Error Handling & Boundaries
- Route-level `error.tsx` catches runtime errors.
- In-page error banner when job queue API fails.

## 16. Fallback & Skeleton States
- Dedicated `loading.tsx` and `SuperadminDataExportManagementSkeleton.tsx`.
- Dedicated `SuperadminDataExportManagementEmptyState.tsx`.

## 17. Integration Testing Strategy
- Vitest suite in `tests/superadmin_data_export_management.integration.test.tsx`.
- Verifies Tenant Export card, Branch Export card, and Queue table rendering.

## 18. Audit & Compliance
- Every export logs operator email, target tenant/branch, timestamp, and justification reason.

## 19. Anti-Corruption Layer & Host Stubs
- Isolated `contracts/host-stubs.d.ts` stubs external dependencies.

## 20. Code Metric Limits
- Components ≤ 300 lines.
- Hooks ≤ 150 lines.
- Stores ≤ 180 lines.
- Formatters ≤ 120 lines.

## 21. Theme Token Adherence
- Pure Tailwind CSS utility classes; no hardcoded hex.

## 22. Definition of Done
- All 22 canonical sections implemented and verified against normative rules.
