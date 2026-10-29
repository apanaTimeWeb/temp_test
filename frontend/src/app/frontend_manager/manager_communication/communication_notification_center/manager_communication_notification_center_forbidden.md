# manager_communication_notification_center — Forbidden Rules

# manager_communication_notification_center — Forbidden Rules

# manager_notification_center — Forbidden Patterns and AI Repair Guardrails

## Module boundary

- Keep all communication-owned components, hooks, API clients, types, schemas, constants, stores, utilities, locales, fixtures, handlers and tests inside `manager_notification_center/`.
- Do not put communication-specific behavior in `manager_navigation/`, a sibling module, or a role-wide `manager_*` business bucket.
- Do not create generic child folders such as `components/`, `hooks/`, `constants/`, `api/`, `types/`, `schemas/`, `store/`, `utils/`, `mocks/`, `tests/` or `locales/`.
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

- `components/ManagerCommunicationNotificationCenterMain.tsx`
- `components/manager_communication_notification_center_forms/ManagerCommunicationNotificationCenterNotificationDraftForm.tsx`
- `components/manager_communication_notification_center_sections/ManagerCommunicationNotificationCenterMyNotificationsSection.tsx`
- `components/manager_communication_notification_center_sections/ManagerCommunicationNotificationCenterNotificationHistorySection.tsx`
- `components/manager_communication_notification_center_table_parts/ManagerCommunicationNotificationCenterNativeTable.tsx`
- `components/manager_communication_notification_center_views/ManagerCommunicationNotificationCenterPage.tsx`

## Verification prohibitions

- Never claim host build, semantic TypeScript, Vitest, Playwright, API, keyboard or visual runtime checks passed without executing them.
- Never use `TODO`, ellipsis truncation, fake imports, fake CSS variables, invented APIs or fabricated test results in delivered source.
- If the contract is missing, document `BLOCKED BY SUPPLIED SCOPE` for the product decision and continue every source-level repair that does not require that decision.


## Autonomous Submodule Boundary

- Owning terminal submodule: `manager_communication_notification_center/`.
- This document is scoped to the `manager_notification_center` primary route and its current supplied behavior.
- Sibling submodules must not be imported or used as shared runtime dependencies. Duplicate small helpers locally when needed.
- API operations not supported by the supplied contract remain disabled or explicitly blocked; no endpoint is inferred.


## V2.11 Terminal Boundary

- Do not place business implementation at `manager_notification_center/` root.
- Do not import sibling business components, hooks, stores, schemas, fixtures or tests.
- Do not invent API endpoints, request/response fields, persistence or backend authorization guarantees.
- Do not treat mock/sample repositories as live backend data.
- Do not enable unverified finance, payment, refund, admission or messaging writes.
- Do not remove a legacy view until its screen/API contract parity and canonical owner are evidenced.
- Do not claim semantic typecheck, lint, unit tests, production build, browser E2E or accessibility runtime checks passed unless executed.


## V2.11 Terminal Boundary

- Do not place business implementation at `manager_notification_center/` root.
- Do not import sibling business components, hooks, stores, schemas, fixtures or tests.
- Do not invent API endpoints, request/response fields, persistence or backend authorization guarantees.
- Do not treat mock/sample repositories as live backend data.
- Do not enable unverified finance, payment, refund, admission or messaging writes.
- Do not remove a legacy view until its screen/API contract parity and canonical owner are evidenced.
- Do not claim semantic typecheck, lint, unit tests, production build, browser E2E or accessibility runtime checks passed unless executed.
