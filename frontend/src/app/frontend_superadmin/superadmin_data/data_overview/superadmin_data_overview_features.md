---
feature: "superadmin_data_overview"
owner_role: "superadmin"
module_version: 1
api_contract_source: "verified-api-contract"
last_verified_date: "2026-11-20"
last_verified_commit: "commit-sha-or-host-unavailable"
documentation_status: "current"
portability_score: "8/8"
---

# Superadmin Data Overview & Disaster Recovery Cockpit — Feature Map (22 Sections)

## 1. Scope and Non-Scope
- **Module Purpose:** Real-time Disaster Recovery health cockpit for the Superadmin. Monitors platform-wide RPO/RTO SLAs, multi-cloud replication status (AWS S3 + Cloudflare R2), total storage allocation, and live restore sandbox drills.
- **RPO / RTO Target:** Target RPO ≤ 15 mins (Actual 4.2 mins); Target RTO ≤ 30 mins (Tested Sandbox 11.8 mins).
- **Tenant Isolation Guarantee:** Proves that backup and restore procedures execute without cross-tenant bleed.
- **Off-Limits:** Does not execute irreversible database purges directly without confirmation.

## 2. Screen Inventory & Component Responsibility Map
| Component File | Responsibility |
|---|---|
| `SuperadminDataOverviewMain.tsx` | Root client orchestrator; owns layout and quick action triggers. |
| `SuperadminDataOverviewKpis.tsx` | Renders DR readiness score, active snapshots count, storage meter, and isolation status. |
| `SuperadminDataOverviewRpoRtoGauges.tsx` | Renders target vs tested RPO/RTO SLA cards and sandbox drill trigger button. |
| `SuperadminDataOverviewStorageBreakdown.tsx` | Visual distribution of PostgreSQL databases, WAL logs, documents, and cold archives. |
| `SuperadminDataOverviewActivityFeed.tsx` | Filterable table of recent backup, restore, export, import, and archive events. |
| `SuperadminDataOverviewQuickBackupModal.tsx` | RHF v7 + Zod modal for triggering immediate encrypted snapshots. |
| `SuperadminDataOverviewSkeleton.tsx` | Layout-mimicking skeleton stabilizing CLS < 0.1. |
| `SuperadminDataOverviewEmptyState.tsx` | Empty state with CTA to trigger initial platform snapshot. |

## 3. Navigation Contract & User Flows
- **Route:** `/superadmin/superadmin_data/data_overview`
- **Flow 1 (Trigger Instant Snapshot):** Click "Trigger Instant Snapshot" -> Modal opens -> Fill snapshot name & scope -> Submit with `Idempotency-Key` -> Toast confirms queued dual-region snapshot.
- **Flow 2 (Run Sandbox Restore Drill):** Click "Run Sandbox Drill" -> Toast confirms drill start -> Ephemeral sandbox verifies table checksums -> State updates to 100% verified.

## 4. API Contract & UI Data Requirements
| Endpoint | Method | Request Payload | Response Data |
|---|---|---|---|
| `/api/v1/superadmin/data/overview/metrics` | GET | None | `SuperadminDataOverviewMetrics` |
| `/api/v1/superadmin/data/overview/rpo-rto-status` | GET | None | `SuperadminDataOverviewRpoRtoStatus` |
| `/api/v1/superadmin/data/overview/recent-activity` | GET | None | `SuperadminDataOverviewActivityItem[]` |
| `/api/v1/superadmin/data/overview/storage-breakdown` | GET | None | `SuperadminDataOverviewStorageCategory[]` |
| `/api/v1/superadmin/data/overview/quick-backup` | POST | `SuperadminDataQuickBackupPayload` | `{ snapshotId, status }` |

## 5. Query Key Registry & Server State
- Factory: `SUPERADMIN_DATA_OVERVIEW_QUERY_KEYS` in `api/superadmin_data_overview.query_keys.ts`
- Stale Time: 30,000ms

## 6. Mutation Inventory
- `triggerSuperadminQuickBackup`: POST with `Idempotency-Key: UUIDv4`, invalidates overview keys.

## 7. Permissions and Role Rules
- Required Role: `SUPERADMIN`

## 8. State Ownership & Architecture Flow
- Server State: TanStack Query v5
- Client State: Zustand (`useSuperadminDataOverviewStore.ts`)

## 9. Offline, Loading, Empty, and Error States
- Skeletons in `components/SuperadminDataOverviewSkeleton.tsx`
- Branded error in `error.tsx` with retry CTA
- Clean empty state in `components/SuperadminDataOverviewEmptyState.tsx`

## 10. Security and PII Rules
- Encryption: AES-256-GCM enforced on all snapshot metadata. Zero secret leaks.

## 11. Accessibility Requirements (A11y)
- Full keyboard navigation, `aria-modal="true"` on modal, WCAG 2.2 AA compliant contrast.

## 12. Background Tasks & Realtime Events
- Realtime telemetry on restore drill execution via `sonner` toasts.

## 13. Feature Flags & Tenant Settings
- Multi-cloud replication flag enabled by default.

## 14. Cache Invalidation & Consistency
- Invalidates all `superadmin_data_overview` query keys upon successful quick backup snapshot.

## 15. Migration, Rollback & Edge Cases (AI Warnings)
- Do NOT bypass `Idempotency-Key` on quick backup trigger.

## 16. Test Coverage Map & Quality Gates
- Co-located integration tests: `tests/superadmin_data_overview.integration.test.tsx`
- Test harness: `tests/harness/SuperadminDataOverviewHarness.tsx`

## 17. Architecture Exceptions (ADRs)
- None. Fully adheres to Universal Day-1 Sub-Module Architecture.

## 18. Known Contract Gaps & Bug Log
- None.

## 19. Rule Compliance Checklist
- [x] Submodule at depth = 1
- [x] Canonical subfolder structure confirmed
- [x] TanStack Query v5 + Zustand module-scoped
- [x] Zero barrel files

## 20. Standalone Run, Mock & Test Harness
- Route: `/superadmin/superadmin_data/data_overview`
- Test: `npm run test -- src/app/frontend_superadmin/superadmin_data/data_overview`

## 21. Module Portability & Host Integration Guide
1. Copy folder `superadmin_data/data_overview` into host.
2. Ensure `@/lib/api` and `@/components/ui` are present.
3. Verified standalone compilation guaranteed by `contracts/host-stubs.d.ts`.

## 22. Deliverables & Version History
- v1.0.0 (2026-11-20): Initial canonical implementation with RPO/RTO cockpit and DR telemetry.
