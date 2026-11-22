# Superadmin Data Archive & Retention Rules Feature Specification

## 1. Executive Summary
The **Data Archive & Retention Rules** sub-module (`data_archive_retention`) manages **Feature 7: Data Archive** (cold storage catalog for closed records, unarchive restoration) and **Feature 8: Retention Rules** (data kitne samay rakha jayega - statutory retention durations, automated purge cron policies, and legal hold exemptions).

## 2. Architectural Blueprint & Domain Boundary
- **Module ID:** Module 14 — Sub-Module 6
- **Canonical Route:** `/superadmin/superadmin_data/data_archive_retention`
- **Internal Path:** `src/app/frontend_superadmin/superadmin_data/data_archive_retention/`
- **Hierarchy:** Tier 4 Leaf (sub-submodules strictly prohibited).
- **Domain Container:** Resides directly inside `superadmin_data/`.

## 3. Regulatory & Multi-Tenant Isolation Law
"Kisi ek tenant ke retention rules ya archiving karne se doosre tenant ka data affect nahi hona chahiye."
- Retention rules evaluate and quarantine records strictly within their tenant schema partition.
- Cold archival preserves tenant metadata isolation: records in S3 or Glacier vaults are partitioned by tenant identifier.
- Applying a legal hold on one tenant's closed patron record never freezes or alters records for other tenants.

## 4. Retention Rules & Auto-Purge Scheduler (Feature 8)
- Configures statutory retention duration in days for specific entity categories:
  - Closed Patrons & Accounts
  - Expired Circulation History Logs
  - Inactive Financial Invoices & Receipts
  - Security & Access Audit Trails
  - Weeded Book Catalogs
- Post-retention actions: `ARCHIVE_TO_COLD_STORAGE`, `HARD_PURGE`, `LEGAL_HOLD`.
- Configurable auto-purge cron schedules (Daily, Weekly, Monthly) with live next-run and last-run timestamps.

## 5. Cold Storage Data Archive Catalog (Feature 7)
- Unified catalog of historical records migrated to Glacier Vaults or S3 Standard tiers.
- Instant search and filtering by entity category and storage tier.
- 1-click unarchive mechanism to restore archived records back to the hot PostgreSQL database.
- Statutory Legal Hold toggle prohibiting automated deletion or unarchival until released.

## 6. Tiered Storage Cost Optimization
- Hot active records reside in primary PostgreSQL.
- Inactive records transition automatically to cold storage (e.g. AWS S3 Glacier), reducing storage costs by over 80%.

## 7. User Flows & Interaction State
1. Operator navigates to `/superadmin/superadmin_data/data_archive_retention`.
2. Inspects active retention policies across entity categories in the upper table.
3. Clicks "Configure" on any policy (e.g. Closed Patrons).
4. Edits retention period (in days) and target storage tier in the modal, then saves.
5. In the lower Cold Storage Catalog, operator reviews archived items.
6. Operator may toggle Legal Hold on sensitive records to freeze scheduled purge.
7. Operator may unarchive a record to return it to active status.

## 8. Data Model & Schema Definitions
- `RetentionRuleRecord`: id, entityType, description, retentionPeriodDays, postRetentionAction, targetStorageTier, isEnabled, legalHoldCount, autoPurgeSchedule, lastRunAt, nextRunAt.
- `ArchivedRecordItem`: id, entityType, tenantId, tenantName, recordIdentifier, summary, archivedAt, storageTier, isLegalHold, sizeBytes, originalCreatedAt, purgeScheduledAt.
- `UpdateRetentionRulePayload`: ruleId, retentionPeriodDays, postRetentionAction, targetStorageTier, isEnabled.

## 9. State Management Architecture
- Zustand store (`useSuperadminDataArchiveRetentionStore`) manages:
  - `selectedRule`: rule selected for configuration.
  - `isRuleModalOpen`: modal visibility.
  - `filterEntityType` & `filterTier`: catalog filters.

## 10. Form Validation & Schema Enforcement
- React Hook Form v7 with Zod v3 resolver (`UpdateRetentionRuleSchema`, `LegalHoldToggleSchema`).
- Retention days constrained between 30 and 3650 days (10 years).

## 11. Mocking & Fixtures
- Realistic fixtures in `mocks/fixtures/superadmin_data_archive_retention.fixtures.ts`.
- MSW handlers in `mocks/handlers/`.

## 12. Accessibility (a11y) Compliance
- Form inputs have associated labels and validation error messages.
- Clear status badges with high contrast.
- Modal dialog with `role="dialog"` and `aria-modal="true"`.

## 13. Internationalization (i18n)
- English (`locales/superadmin_data_archive_retention_en.json`) and Hindi (`locales/superadmin_data_archive_retention_hi.json`) parity.

## 14. Responsive Layout Breakpoints
- Mobile: Responsive tables with horizontal scroll.
- Desktop: Full multi-column view with action buttons.

## 15. Error Handling & Boundaries
- Route-level `error.tsx` catches runtime exceptions.
- In-page banner on API failures.

## 16. Fallback & Skeleton States
- Dedicated `loading.tsx` and `SuperadminDataArchiveRetentionSkeleton.tsx`.
- Dedicated `SuperadminDataArchiveRetentionEmptyState.tsx`.

## 17. Integration Testing Strategy
- Vitest suite in `tests/superadmin_data_archive_retention.integration.test.tsx`.
- Verifies Retention Rules table and Archive Catalog rendering.

## 18. Audit & Compliance
- Every policy modification, unarchive, or legal hold toggle creates an immutable audit record.

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
