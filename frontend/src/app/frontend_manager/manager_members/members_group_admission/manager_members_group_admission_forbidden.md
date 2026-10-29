# manager_members_group_admission — Forbidden Rules and AI Repair Guardrails

## Module boundary

- Keep all students-owned components, hooks, API clients, types, schemas, constants, stores, utilities, locales, fixtures, handlers and tests inside `members_group_admission/`.
- Do not put students-specific behavior in `frontend_manager/manager_navigation/navigation/`, a sibling module, or a role-wide `manager_*` business bucket.
- Do not create arbitrary shared/common/misc dumping folders. Keep executable feature code inside the canonical module-owned folders (`components/`, `hooks/`, `api/`, `state/`, `types/`, `schemas/`, `utils/`, `mocks/`, `tests/`, `contracts/` and `locales/` where applicable); do not place business code at the module root.
- Keep the single `components/*Main.tsx` orchestrator at the components root; group all other component files into module-prefixed logical subfolders. Do not flatten page, form, dialog, chart, table or state components into the root.
- Do not create a second/nested `page.tsx`; route subviews must use the module's existing view-dispatch and URL config.

## Contract and data traps specific to this module

- Do not infer a write endpoint from a UI button, route name, fixture, or sample-data label.
- Do not describe mock/sample data as persisted backend data.
- Do not silently change resource IDs, query keys, URL parameters, or route rewrite targets.
- Do not add schema fields that are not supported by the current module types, form fields or approved API contract.
- Do not report disabled actions as functional; retain visible explanation until an authoritative contract exists.
- Do not remove `loading.tsx` or `error.tsx` just because the static archive cannot execute the host application.

## Source-discovered feature vocabulary

The following component paths exist in the current source tree. This list is an inventory only; it does not imply every component is runtime-mounted.

- `components/ManagerMembersGroupAdmissionMain.tsx`
- `components/manager_members_group_admission_error_boundary/ManagerMembersGroupAdmissionErrorFallback.tsx`
- `components/manager_members_group_admission_forms/ManagerMembersGroupAdmissionAdmissionForm.tsx`
- `components/manager_members_group_admission_sections/ManagerMembersGroupAdmissionAdmissionEnrollmentSection.tsx`
- `components/manager_members_group_admission_sections/ManagerMembersGroupAdmissionAdmissionPaymentSection.tsx`
- `components/manager_members_group_admission_sections/ManagerMembersGroupAdmissionAdmissionPersonalSection.tsx`
- `components/manager_members_group_admission_sections/ManagerMembersGroupAdmissionAdmissionSummary.tsx`
- `components/manager_members_group_admission_states/ManagerMembersGroupAdmissionErrorBoundary.tsx`
- `components/manager_members_group_admission_views/ManagerMembersGroupAdmissionGroupPage.tsx`

## Verification prohibitions

- Never claim host build, semantic TypeScript, Vitest, Playwright, API, keyboard or visual runtime checks passed without executing them.
- Never use `TODO`, ellipsis truncation, fake imports, fake CSS variables, invented APIs or fabricated test results in delivered source.
- If the contract is missing, document `BLOCKED BY SUPPLIED SCOPE` for the product decision and continue every source-level repair that does not require that decision.


## Autonomous Submodule Boundary

- Owning terminal submodule: `members_group_admission/`.
- This document is scoped to the `members_group_admission` primary route and its current supplied behavior.
- Sibling submodules must not be imported or used as shared runtime dependencies. Duplicate small helpers locally when needed.
- API operations not supported by the supplied contract remain disabled or explicitly blocked; no endpoint is inferred.


## V2.11 Terminal Boundary

- Canonical architecture requirements are defined by `WEB_FRONTEND_ARCHITECTURE_AND_DEVELOPMENT_RULES_V1.md` (Critical Frontend Structure Gate, Complete Module Self-Containment Contract, and the applicable API/state/security rules); this file does not redefine them.
- The owning terminal sub-module is `members_group_admission/`; keep executable business code in its canonical category folders and do not import sibling business implementation.
- Do not infer endpoints, request/response fields, persistence, permissions or tenant guarantees. Unverified write-like actions remain disabled or explicitly blocked until a verified contract exists.
- Report host-dependent validation as `DEFERRED_TO_HOST_RUNTIME` unless it was actually executed.
