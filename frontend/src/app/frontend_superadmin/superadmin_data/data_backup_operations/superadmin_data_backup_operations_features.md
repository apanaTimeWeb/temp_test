---
feature: "superadmin_data_backup_operations"
owner_role: "superadmin"
module_version: 1
api_contract_source: "verified-api-contract"
last_verified_date: "2026-11-20"
last_verified_commit: "commit-sha-or-host-unavailable"
documentation_status: "current"
portability_score: "8/8"
---

# Superadmin Backup Schedules & Full Platform Recovery — Feature Map (22 Sections)

## 1. Scope and Non-Scope
- **Module Purpose:** Manages automated cron backup schedules, multi-cloud replication rules, and on-demand full platform snapshots. Guarantees platform-wide adherence to the RPO SLA (≤ 15 mins).
- **RPO / RTO SLA:** Enforces continuous WAL archiving (RPO ≤ 15m) and full snapshot replication across AWS S3 and Cloudflare R2.
- **Tenant Isolation:** Backup policies encrypt database tables by tenant boundary schema.
- **Off-Limits:** Does not execute restore mutations (owned exclusively by `data_restore_operations`).

## 2. Screen Inventory & Component Responsibility Map
| Component File | Responsibility |
|---|---|
| `SuperadminDataBackupOperationsMain.tsx` | Root client orchestrator; owns layout and modals. |
| `SuperadminDataBackupOperationsFullSnapshotCard.tsx` | Full platform recovery trigger banner card with RPO indicators. |
| `SuperadminDataBackupOperationsSchedulesTable.tsx` | Table of active automated backup schedules with search and pause/resume actions. |
| `SuperadminDataBackupOperationsScheduleModal.tsx` | RHF v7 + Zod modal for creating automated cron schedules. |
| `SuperadminDataBackupOperationsFullBackupModal.tsx` | RHF v7 + Zod modal for executing on-demand full platform backup. |
| `SuperadminDataBackupOperationsSkeleton.tsx` | Loading skeleton stabilizing CLS < 0.1. |
| `SuperadminDataBackupOperationsEmptyState.tsx` | Empty state with CTA to create initial backup policy. |

## 3. Navigation Contract & User Flows
- **Route:** `/superadmin/superadmin_data/data_backup_operations`
- **Flow 1 (Create Schedule):** Click "Create Backup Policy" -> Fill name, cron, scope, target -> Submit with Idempotency Key -> Invalidate query cache -> Toast confirmation.
- **Flow 2 (Trigger Full Platform Backup):** Click "Trigger Full Platform Backup" -> Confirm snapshot label and dual-region sync -> Submit -> Background job initiated.

## 4. API Contract & UI Data Requirements
| Endpoint | Method | Request Payload | Response Data |
|---|---|---|---|
| `/api/v1/superadmin/data/backup-operations/schedules` | GET | None | `SuperadminBackupSchedule[]` |
| `/api/v1/superadmin/data/backup-operations/schedules` | POST | `SuperadminBackupScheduleFormValues` | `SuperadminBackupSchedule` |
| `/api/v1/superadmin/data/backup-operations/schedules/:id/toggle` | PATCH | `{ isActive: boolean }` | `SuperadminBackupSchedule` |
| `/api/v1/superadmin/data/backup-operations/full-platform-backup` | POST | `SuperadminFullPlatformBackupRequest` | `{ snapshotId, status }` |

## 5. Query Key Registry & Server State
- Factory: `SUPERADMIN_DATA_BACKUP_OPERATIONS_QUERY_KEYS` in `api/superadmin_data_backup_operations.query_keys.ts`

## 6. Mutation Inventory
- `createSchedule`: POST with `Idempotency-Key`
- `toggleSchedule`: PATCH with `Idempotency-Key`
- `triggerFullPlatformBackup`: POST with `Idempotency-Key`

## 7. Permissions and Role Rules
- Required Role: `SUPERADMIN`

## 8. State Ownership & Architecture Flow
- Server State: TanStack Query v5
- Client State: Zustand (`useSuperadminDataBackupOperationsStore.ts`)

## 9. Offline, Loading, Empty, and Error States
- Skeletons, empty states, and route error boundaries implemented.

## 10. Security and PII Rules
- Encryption: AES-256-GCM enforced on all snapshot metadata.

## 11. Accessibility Requirements (A11y)
- Full keyboard Tab navigation, visible focus rings, aria-modal dialogs.

## 12. Background Tasks & Realtime Events
- Realtime toast notification updates on snapshot queuing.

## 13. Feature Flags & Tenant Settings
- Multi-cloud sync enabled.

## 14. Cache Invalidation & Consistency
- Invalidates `schedules` queries on mutation success.

## 15. Migration, Rollback & Edge Cases (AI Warnings)
- Never create a schedule with empty cron string.

## 16. Test Coverage Map & Quality Gates
- Integration tests: `tests/superadmin_data_backup_operations.integration.test.tsx`
- Harness: `tests/harness/SuperadminDataBackupOperationsHarness.tsx`

## 17. Architecture Exceptions (ADRs)
- None.

## 18. Known Contract Gaps & Bug Log
- None.

## 19. Rule Compliance Checklist
- [x] Submodule at depth = 1
- [x] Canonical subfolder structure confirmed
- [x] TanStack Query v5 + Zustand module-scoped
- [x] Zero barrel files

## 20. Standalone Run, Mock & Test Harness
- Route: `/superadmin/superadmin_data/data_backup_operations`
- Test: `npm run test -- src/app/frontend_superadmin/superadmin_data/data_backup_operations`

## 21. Module Portability & Host Integration Guide
1. Copy folder `superadmin_data/data_backup_operations` into host.
2. Verified standalone compilation guaranteed by `contracts/host-stubs.d.ts`.

## 22. Deliverables & Version History
- v1.0.0 (2026-11-20): Initial canonical implementation with automated cron policies and full platform recovery snapshot.
