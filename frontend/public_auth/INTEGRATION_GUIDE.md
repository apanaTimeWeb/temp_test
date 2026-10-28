# Public Auth Module — Host Integration Guide

## 1. Package scope and current structure

This ZIP contains the `frontend_public/public_auth/` domain and a host Playwright smoke suite at `public_auth_e2e/PublicAuthRoutes.spec.ts`. The domain root contains only `layout.tsx`, the compatibility `page.tsx`, and the domain documentation trio, plus four autonomous route submodules:

- `auth_sign_in/`
- `auth_account_registration/`
- `auth_password_recovery/`
- `auth_password_reset/`

The legacy `PublicAuthMain` dispatcher and flat auth implementation buckets are absent from this archive; no additional deletion was made during the current repair pass because no further obsolete target was proven. The domain root page is a route-only compatibility shell: it maps the existing allowlisted `?view=` values to child routes and preserves the safe unknown-view screen. The route lookup only accepts own allowlisted keys, so prototype-named values such as `constructor`, `toString`, and `__proto__` are treated as unknown. It does not render or own the four forms.

## 2. Public route preservation matrix

The supplied source describes the following existing host rewrite contract. The host `next.config.*` was not included, so these rewrites are **documented requirements, not verified live configuration**.

| Public source URL | Preserve host rewrite destination | Compatibility-shell destination |
|---|---|---|
| `/auth/login` | `/frontend_public/public_auth?view=login` | `/frontend_public/public_auth/auth_sign_in` |
| `/auth/signup` | `/frontend_public/public_auth?view=signup` | `/frontend_public/public_auth/auth_account_registration` |
| `/auth/forgot-password` | `/frontend_public/public_auth?view=forgot-password` | `/frontend_public/public_auth/auth_password_recovery` |
| `/auth/reset-password` | `/frontend_public/public_auth?view=reset-password` | `/frontend_public/public_auth/auth_password_reset` |
| Omitted or empty `view` | `/frontend_public/public_auth` or `?view=` | `/frontend_public/public_auth/auth_sign_in` |
| Unknown `view` | e.g. `/frontend_public/public_auth?view=unknown` | No redirect; localized safe unavailable state with a link to `/auth/login` |

Merge the exact rewrite entries into the existing host `rewrites()` configuration without replacing unrelated rewrites, middleware, locale routing, base path, or trailing-slash settings. Verify direct navigation, browser refresh, back navigation, locale routing, and unknown `view` values in the actual host app. The E2E suite assumes the host `baseURL` and rewrite configuration are configured. Its source now covers all four legacy `view` aliases, omitted/empty default behavior, unknown values, and prototype-named unknown values; actual navigation remains `DEFERRED_TO_HOST_RUNTIME` until run against the host.

## 3. Host-owned API endpoint configuration

All four API paths remain host-configured; no endpoint URL was invented:

| Workflow | Environment variable | Source owner |
|---|---|---|
| Sign in | `NEXT_PUBLIC_AUTH_LOGIN_PATH` | `auth_sign_in/config/public_auth_sign_in_url_config.ts` |
| Registration | `NEXT_PUBLIC_AUTH_SIGNUP_PATH` | `auth_account_registration/config/public_auth_registration_url_config.ts` |
| Recovery | `NEXT_PUBLIC_AUTH_FORGOT_PASSWORD_PATH` | `auth_password_recovery/config/public_auth_password_recovery_url_config.ts` |
| Reset | `NEXT_PUBLIC_AUTH_RESET_PASSWORD_PATH` | `auth_password_reset/config/public_auth_password_reset_url_config.ts` |

Values must be approved root-relative API paths. Missing or malformed values fail closed. All mutation requests use the host `apiFetch` transport and an `Idempotency-Key`. Confirm actual request/response examples against the backend OpenAPI or API-owner-approved contract before deployment.

## 4. Frozen request behavior

- Sign-in preserves the observed `{ email, password, role }` frontend payload. Whether `email` accepts phone numbers is unresolved; do not silently change the field or wire payload.
- Registration preserves the six visible fields. The API payload contains `ownerName`, `libraryName`, `email`, `phone`, and `password`; `confirmPassword` remains client-only. The success destination remains `/superadmin/superadmin_setup-wizard`.
- Recovery submits only `{ identity }`. Accepted UI feedback remains generic and does not claim that a message was delivered or that an account exists.
- Reset submits only `{ otp, newPassword }`. The six OTP slots support digit filtering, paste distribution, left/right arrow navigation, and backspace focus behavior. No separate OTP verification, resend, expiry, attempt-limit, or cooldown endpoint is defined by the supplied source.
- Frontend role selection is navigation context only. Session establishment, cookie/CSRF policy, server-side role authorization, and route guards remain host/server responsibilities.

## 5. Locale integration

English and Hindi fragments now live inside each submodule's `locales/public_auth_en.json` and `locales/public_auth_hi.json`. Each fragment exports an `AUTH` object with that module's required keys. The host `next-intl` provider must merge the four `AUTH` objects into one namespace (merge nested objects, not overwrite the full `AUTH` object with the last fragment). EN/HI key parity is verified per module. The host provider configuration was not in this ZIP, so the merge must be completed and checked in the host repository.

## 6. Opt-in demo-fill controls

Every form has a **Fill demo data** control that is visible only when both conditions hold:

- `NODE_ENV !== 'production'`
- `NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED === 'true'`

The default is off. Values come from module-owned synthetic fixtures, including the reserved `.invalid` email. The reset OTP fixture is test-only. A click fills fields only: it does not submit, create a session, bypass Zod validation, install mock transport, store values, or log credentials. MSW handler factories are module-owned and require explicit registration by the host test harness; they are not auto-installed into the production transport. Review or remove this exception before the next major release if no longer needed.

## 7. Mock and test coverage

Each module owns synthetic fixtures and accepted/rejected/connection-failure/invalid-envelope handler scenarios. Module-local component tests cover field requirements, visible interactions, safe messaging, pending/retry behavior, and demo-fill controls. The Playwright smoke suite is `public_auth_e2e/PublicAuthRoutes.spec.ts` and checks the four public URLs plus the compatibility shell's alias/default/unknown-view behavior. The suite source is present, but runtime execution remains deferred without host wiring.

This isolated ZIP does not include `package.json`, lockfile, `tsconfig.json`, Vitest config, Playwright config, host `next.config.*`, or the host `apiFetch` implementation. Consequently, this environment cannot run the host TypeScript build, lint, Vitest, Next.js build, or Playwright browser suite. In the host repository, run its approved typecheck/lint/unit-test/build scripts and configure Playwright to run the included E2E file. Do not interpret the source-only checks in this ZIP as runtime verification.

## 8. Required host dependencies and wiring

The host must supply the existing Next.js App Router, React, `next-intl`, `next/font` setup, React Hook Form, Zod, `@hookform/resolvers`, TanStack Query, `lucide-react`, `@/lib/api`, semantic Tailwind tokens, and test dependencies including Testing Library, Vitest, MSW, and Playwright. `contracts/host-stubs.d.ts` and `tests/harness/bootstrap.ts` are portability declarations and harness notes, not substitutes for the real host packages.

## 9. Unresolved contracts and runtime gates

| Item | Status | Safe interim behavior / evidence needed |
|---|---|---|
| Exact backend response envelope and request ID | `CONTRACT_MISSING` | Current source validates the observed frontend envelope; backend OpenAPI or approved examples are required before asserting server compatibility. No request ID field is invented. |
| Login email-versus-phone identifier semantics | `CONTRACT_AMBIGUOUS` | Preserve the existing field and payload until API owner confirms accepted identifiers. |
| OTP resend/expiry/attempt/cooldown policy | `CONTRACT_MISSING` | No extra endpoint or client policy added. Backend contract required. |
| Session, CSRF, and RBAC | `DEFERRED_TO_HOST_RUNTIME` | Verify the real host API client, cookie/session establishment, server authorization, and redirects. |
| Public URL rewrites and route refresh | `DEFERRED_TO_HOST_RUNTIME` | Host `next.config.*`, middleware, and browser E2E are not supplied. |
| Locale provider composition | `DEFERRED_TO_HOST_RUNTIME` | Merge the module-owned locale fragments in the host next-intl provider. |
| Theme token values and contrast | `OUTSIDE_SUPPLIED_SCOPE` | Verify host `globals.css`, Tailwind mapping, light/dark variants, and WCAG contrast in the host app. |
| Brand decision | `EXTERNAL_PRODUCT_DECISION_BLOCKED` | Source UI says Library OS while the design reference says Smart Gym 360. Preserve current UI copy pending product-owner decision. |
| Build/lint/unit/E2E execution | `DEFERRED_TO_HOST_RUNTIME` | No package/test-runner/browser configuration is included in this archive. |

## 10. Integration completion checklist

- [ ] Merge the four public rewrites into the existing host Next.js config and test all four public URLs.
- [ ] Merge all four module locale fragments into the host `AUTH` namespace.
- [ ] Verify the four configured API endpoints and actual server response envelopes.
- [ ] Verify session establishment, CSRF, role enforcement, and unauthenticated redirects in the host.
- [ ] Run typecheck, lint, module tests, Next.js build, and `public_auth_e2e/PublicAuthRoutes.spec.ts`.
- [ ] Verify theme token mappings, contrast, responsive viewports, keyboard navigation, and screen-reader announcements.
- [ ] Confirm whether the demo-fill flag should remain enabled in non-production builds.
