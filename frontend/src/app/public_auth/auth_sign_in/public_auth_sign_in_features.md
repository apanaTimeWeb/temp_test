# Public Auth Sign In — Feature Contract

## 1. Purpose
Provide the public sign-in form for the `public_auth` domain as an autonomous route-level submodule.

## 2. User Stories
- A visitor can enter email/identity, password, and role context and submit the sign-in form.
- A visitor can navigate to existing signup and password-recovery public URLs.
- Invalid form data is rejected by the existing Zod schema and React Hook Form integration.

## 3. UI Data Requirements
The sign-in page uses the existing labels, validation messages, role options, and API error mapping. Credentials must never be placed in URL state or logs.

## 4. Frozen API Contract
The API client uses the host-provided `NEXT_PUBLIC_AUTH_LOGIN_PATH`. No endpoint is inferred. Request/response shapes are copied from the supplied auth module's existing types and API client. Backend session establishment remains a host contract.

## 5. Permissions
Public sign-in is unauthenticated. The role selector is navigation context only and does not grant authorization.

## 6. State
TanStack Query v5 mutation owns pending/error lifecycle. The form owns transient field state. No credential persistence is added.

## 7. Validation
Use the existing localized Zod schema via React Hook Form. Preserve server validation mapping already supported by the API client.

## 8. Error Handling
Configuration, connection, unexpected-response, and request-rejected failures use safe localized messages. Do not expose raw transport details.

## 9. Accessibility
Retain semantic labels, keyboard operation, visible focus styles, and accessible pending/error announcements from the existing form.

## 10. Security and Privacy
No credentials in URL/query parameters, logs, persistent storage, or demo defaults. Idempotency keys contain no credential material.

## 11. Loading
Keep the submit label readable while pending and prevent duplicate submission through the existing mutation state.

## 12. Empty State
Not applicable to this form; missing input is handled by schema validation.

## 13. Success State
Existing post-login role redirect behavior is preserved. Actual session/cookie establishment is host-owned and not verified in this ZIP.

## 14. Offline Mock Scenarios
Module-owned fixtures and handler factories cover accepted, rejected, connection-failure, and invalid-envelope scenarios at a caller-supplied endpoint. The host test harness must explicitly register handlers; no live MSW startup is claimed.

## 15. API Boundary
Endpoint path is host-configured. No sibling submodule imports are permitted.

## 16. Testing
`tests/PublicAuthSignInPage.test.tsx` covers required fields, role selection, visibility, safe field errors, pending/retry, and gated demo fill. The host Playwright suite covers direct public URL routing; execution is deferred to the host test runner.

## 17. Localization
English/Hindi fragments are module-owned under `locales/`. The host next-intl provider must merge this module fragment with the other three `AUTH` fragments.

## 18. Responsive Behavior
Preserve existing responsive semantic Tailwind classes and host token usage.

## 19. Theme Contract
See `public_auth_sign_in_theme_contract.md`.

## 20. Standalone Run/Mock Harness
`tests/harness/bootstrap.ts` documents the host expectations. This module requires Next.js App Router, React, TanStack Query v5, React Hook Form v7, Zod v3, next-intl, and host `@/lib/api`.

## 21. Portability Guide
Copy this folder under `src/app/frontend_public/public_auth/`; the host must provide the standard `@/* -> src/*` alias, API transport, locale provider, global semantic tokens, and endpoint environment variable.

## 22. Evidence and Unresolved Contracts
Source-derived: form fields, validation, endpoint environment variable, and role redirects. `CONTRACT_MISSING`: server session contract and exact production response semantics.
