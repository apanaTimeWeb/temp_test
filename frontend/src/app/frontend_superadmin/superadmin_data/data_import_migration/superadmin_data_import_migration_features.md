# Superadmin Data Import & Migration Feature Specification

## 1. Executive Summary
The **Data Import & Migration Management** sub-module (`data_import_migration`) powers **Feature 9: Import Management** (existing library data migration), **Feature 10: Import Validation** (pre-flight duplicate & invalid record detection), and **Feature 11: Import History** (migration tracking, error CSV download, and instantaneous rollback snapshot recovery).

## 2. Architectural Blueprint & Domain Boundary
- **Module ID:** Module 14 — Sub-Module 5
- **Canonical Route:** `/superadmin/superadmin_data/data_import_migration`
- **Internal Path:** `src/app/frontend_superadmin/superadmin_data/data_import_migration/`
- **Hierarchy:** Tier 4 Leaf (sub-submodules strictly prohibited).
- **Domain Container:** Resides directly inside `superadmin_data/`.

## 3. Regulatory & Multi-Tenant Isolation Law
"Kisi ek tenant ka data import ya rollback karne se doosre tenant ka data affect nahi hona chahiye."
- Ingestion runs strictly target the specified tenant schema partition.
- Duplicate detection cross-references only the target tenant's existing barcodes, ISBNs, and member IDs.
- Rollback operations restore only the target tenant's point-in-time snapshot, leaving sibling tenants untouched.

## 4. Import Management Capabilities (Feature 9)
- Multi-format ingestion: Excel (`.xlsx`), CSV, JSON, and Koha MARC21 (`.mrc`).
- Supports core library entity categories: Books & Resource Catalogs, Patrons & Memberships, Historical Circulations, Fines & Fees.
- Configurable duplicate resolution strategies (`SKIP`, `OVERWRITE`, `ERROR`).

## 5. Pre-flight Validation & Dry Run (Feature 10)
- Executes an in-memory simulation against schema constraints before modifying live tables.
- Categorizes rows into: Total, Valid, Invalid (format errors), and Duplicate (existing primary/unique keys).
- Detailed issue breakdown previewing row number, target field, error severity, and offending value.

## 6. Migration History & Instant Rollback (Feature 11)
- Comprehensive batch tracking recording total records, success counts, failed counts, and duplicate counts.
- Generates downloadable Error CSV logs pinpointing rejection reasons for every invalid row.
- Automated rollback snapshots allow 1-click restoration to the exact pre-migration state.

## 7. User Flows & Interaction State
1. Operator navigates to `/superadmin/superadmin_data/data_import_migration`.
2. Selects destination tenant, entity category, duplicate strategy, and uploads migration file.
3. Clicks "Run Pre-flight Dry Run".
4. Validation Card displays row breakdowns (Valid vs Invalid vs Duplicates) and issue table.
5. Operator inspects warnings and clicks "Commit Ingestion with Rollback Snapshot".
6. Mutation commits data, logs batch in Migration History table, and closes preflight preview.
7. If data anomalies appear later, operator clicks "Rollback" on the batch row to revert all changes.

## 8. Data Model & Schema Definitions
- `PreflightValidationResult`: preflightId, fileName, totalRows, validRows, invalidRows, duplicateRows, issues, canProceed.
- `ImportBatchRecord`: id, batchNumber, tenantId, tenantName, entityType, originalFileName, totalRecords, importedRecords, failedRecords, duplicateRecords, status, rollbackSnapshotId.
- `CommitImportPayload`: preflightId, tenantId, entityType, duplicateStrategy, takeRollbackSnapshot.

## 9. State Management Architecture
- Zustand store (`useSuperadminDataImportMigrationStore`) manages:
  - `activePreflightResult`: active dry-run state.
  - `filterStatus` & `filterTenant`: history table filters.

## 10. Form Validation & Schema Enforcement
- React Hook Form v7 with Zod v3 resolver (`PreflightValidateSchema`, `CommitImportSchema`).

## 11. Mocking & Fixtures
- Realistic fixtures in `mocks/fixtures/superadmin_data_import_migration.fixtures.ts`.
- MSW handlers in `mocks/handlers/`.

## 12. Accessibility (a11y) Compliance
- File input has visible drag/drop cues and screen-reader accessibility.
- Contrast compliant status badges.

## 13. Internationalization (i18n)
- English (`locales/superadmin_data_import_migration_en.json`) and Hindi (`locales/superadmin_data_import_migration_hi.json`) parity.

## 14. Responsive Layout Breakpoints
- Mobile: Stacked inputs and horizontal scrolling tables.
- Desktop: 3-column input grid and 4-column metric cards.

## 15. Error Handling & Boundaries
- Route-level `error.tsx` catches runtime errors.
- In-page error banner when batch API fails.

## 16. Fallback & Skeleton States
- Dedicated `loading.tsx` and `SuperadminDataImportMigrationSkeleton.tsx`.
- Dedicated `SuperadminDataImportMigrationEmptyState.tsx`.

## 17. Integration Testing Strategy
- Vitest suite in `tests/superadmin_data_import_migration.integration.test.tsx`.
- Verifies Upload Wizard and History Table rendering.

## 18. Audit & Compliance
- Every migration batch and rollback logs operator identity and target tenant scope.

## 19. Anti-Corruption Layer & Host Stubs
- Isolated `contracts/host-stubs.d.ts` stubs external dependencies.

## 20. Code Metric Limits
- Components ≤ 300 lines.
- Hooks ≤ 150 lines.
- Stores ≤ 180 lines.
- Formatters ≤ 120 lines.

## 21. Theme Token Adherence
- Semantic Tailwind tokens; no hardcoded hex.

## 22. Definition of Done
- All 22 canonical sections implemented and verified against normative rules.
