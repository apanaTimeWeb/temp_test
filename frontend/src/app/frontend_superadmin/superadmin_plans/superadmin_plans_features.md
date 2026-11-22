---
feature: "superadmin_plans"
owner_role: "superadmin"
module_version: 1
api_contract_source: "supplied-scope"
last_verified_date: "2026-10-29"
last_verified_commit: "commit-sha-or-host-unavailable"
documentation_status: "current"
portability_score: "NOT_VERIFIED"
---

# superadmin_plans — Master Domain Feature Map

## Purpose and boundary

Plan/pricing catalogue and promotion configuration. Promo ownership remains contract-bound.

## Canonical directory

`frontend_superadmin/superadmin_plans/` is the domain container. Every executable feature remains isolated inside one of its direct leaf submodules. No sub-submodules or sibling business imports are introduced by this reorganisation.

## Canonical leaf inventory

| Leaf submodule | Canonical route | Ownership note |
|---|---|---|
| `plans_pricing_catalog` | `/superadmin/superadmin_plans/plans_pricing_catalog` | Leaf-local documentation trio and local implementation remain authoritative. |
| `plans_promotions` | `/superadmin/superadmin_plans/plans_promotions` | Leaf-local documentation trio and local implementation remain authoritative. |

## API and data contracts

No API endpoint, payload field, mutation capability, permission, or backend behavior is added by this folder reorganisation. Each leaf-local feature document, URL config, schema, type, and fixture is the source evidence for that leaf. Unverified external ownership remains `CONTRACT_MISSING`.

## Route migration

The domain root is a legacy/query adapter. Canonical capability routes are listed above. Direct pre-reorganisation leaf URLs are recorded in `superadmin_route_preservation_matrix.md`; preserving public legacy paths requires the host rewrite/redirect integration described in `INTEGRATION_GUIDE.md`.

## Scope safety

This change moves/renames existing leaf packages only. Action/detail leaf packages are retained intact in this folder-only pass to avoid feature eviction. Where the reviewed blueprint recommends internalizing them into an owning leaf, that consolidation remains an explicit follow-up rather than an undocumented feature deletion.

## Scope and Non-Scope

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Screen Inventory

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Navigation Contract

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## API Contract

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Query Key Registry

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Mutation Inventory

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Permissions and Role Rules

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## State Ownership

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Offline and Reconnect Behavior

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Security and PII Rules

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Accessibility Requirements

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Background Tasks

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Feature Flags

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Cache Invalidation

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Migration and Rollback

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Known Contract Gaps

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Architecture Exceptions

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Standalone Run, Mock & Test Harness

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Test Coverage Map (source inventory; not execution evidence)

| Test file | Verification status |
| --- | --- |
| *No test file currently found* | Coverage gap; a PASS is not claimed |


Host test execution and browser coverage remain `DEFERRED_TO_HOST_RUNTIME` unless accompanied by actual runner output.
## Module Portability & Host Integration Guide

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.

## Rule Compliance Checklist

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.
- [ ] Rule 0A.2: Autonomous leaf is at the canonical one-level depth under its domain container
- [ ] Rule 1: Production components, hooks, API services, stores, schemas and utilities stay within their hard line ceilings
- [ ] Rule 2: No cross-role business import is present
- [ ] Rule 3: Every owned source filename follows the role/submodule prefix convention
- [ ] Rule 4: JSX uses documented semantic theme tokens and contains no hardcoded color values
- [ ] Rule 5: TanStack Query owns server state and the module-scoped Zustand store owns UI state where applicable
- [ ] Rule 6: Reusable side-effect and stateful logic is extracted into leaf-local hooks
- [ ] Rule 7: Domain types are owned by the canonical types/schemas folders
- [ ] Rule 8: Next.js server/client boundaries and use-client directives are valid
- [ ] Rule 9: Loading, error and not-found route states are implemented and non-generic
- [ ] Rule 11: All owned routes and API endpoints are represented by the leaf URL config
- [ ] Rule 13: Feature documentation reflects the actual source and makes no unsupported backend claims
- [ ] Rule 14: User-facing strings are localized and browser alerts are not used for business flows
- [ ] Rule 15A: Hook/utility/component tests are co-located and source paths resolve
- [ ] Rule 15B: Forms use React Hook Form v7 and Zod where a form exists
- [ ] Rule 15C: State ownership follows the approved server/client state decision
- [ ] Rule 15D: No secret is exposed through public environment variables or client source
- [ ] Rule 15E: Critical error reporting uses only the verified host monitoring adapter
- [ ] Rule 19: Interactive rows and click affordances have the required pointer/keyboard semantics
- [ ] Rule 26: Async action buttons preserve pending/disabled state and stable width
- [ ] Rule 30: Table sort, filter and pagination affordances match the implemented behavior
- [ ] Rule 32: No index.ts barrel or re-export facade exists in the leaf
- [ ] Rule 40: The leaf forbidden-pattern document exists and names concrete boundaries
- [ ] Rule 43: Sensitive values are masked before rendering or exporting where applicable
- [ ] Rule 44: Production code contains no console logging of user or tenant data
- [ ] Rule 48: Entity list surfaces have explicit empty and filtered-empty states where applicable
- [ ] Rule 55: Mapped lists use stable entity keys, not array indexes
- [ ] Rule 64: Responsive layouts support the defined breakpoints and reduced-motion preferences
- [ ] Rule 68: Rendered table column definitions align with header and row data
- [ ] Rule 71: Destructive actions are protected by the leaf confirmation contract
- [ ] Rule 72: API function names follow the canonical operation naming contract
- [ ] Rule 73: Type-only imports use import type where appropriate
- [ ] Rule 74: Security/dependency scan results are recorded rather than presumed
- [ ] Rule 75: MSW handlers and mock scenarios are owned by this leaf
- [ ] Rule 75D: Mock fixtures cover each field and displayed state used by this leaf
- [ ] Rule 76: Security-critical paths are covered by verified human CODEOWNERS mapping or explicitly deferred to host scope
- [ ] Rule 78: Nullable values use displayValue() or another explicitly approved empty-value contract
- [ ] Rule 79: Dirty forms and route-leave actions use the approved unsaved-changes guard
- [ ] Rule 80: Currency is formatted by a leaf-local formatter and raw toFixed() is absent from JSX
- [ ] Rule 81: Pending buttons reserve minimum width to avoid layout shift
- [ ] Rule 82: Toast/message emissions use stable deduplication identifiers
- [ ] Mutation Safety: Every enabled state-changing request uses Idempotency-Key: UUIDv4
- [ ] Debounced Search: Live search requests are debounced by at least 300 ms
- [ ] API Envelope: API responses use the canonical discriminated ApiResponse<T> envelope
- [ ] Contract Integrity: No endpoint, payload field, permission, or write behavior is invented
- [ ] Dialog Accessibility: Confirmation/dialog paths preserve focus, keyboard dismissal and background-state cleanup
- [ ] Localization Parity: All source-referenced English/Hindi keys and value types match across locale pairs
- [ ] Token Provenance: Theme-token inventory entries cite exact local source paths and line numbers
- [ ] Portability Evidence: Standalone compilation, mock tests and host wiring are reported separately
- [ ] Runtime Honesty: Unavailable host checks are marked DEFERRED_TO_HOST_RUNTIME, not passed

> **Portability evidence status:** `NOT_VERIFIED`. The canonical 8/8 score is not claimed because host package/build/test/runtime evidence is not supplied in this isolated role archive.

## Deliverables & Version History

- Evidence status: see the source paths and verification report for this leaf. Do not infer host/runtime behavior or unprovided API contracts.
