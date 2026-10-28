# Public Auth Domain — Feature Map

## Purpose and ownership

This domain owns the public authentication UI for sign-in, account registration, password recovery, and password reset. Each workflow is an autonomous child route with its own form, API boundary, schema, types, config, hooks, mocks, tests, host stubs, run-harness note, locale fragments, and documentation trio. Shared business folders and cross-module imports are prohibited; small auth-specific UI is duplicated locally where needed.

## Physical structure

```text
frontend_public/public_auth/
├── layout.tsx
├── page.tsx                         # route-only compatibility redirect shell
├── public_auth_features.md
├── public_auth_forbidden.md
├── public_auth_theme_contract.md
├── auth_sign_in/
├── auth_account_registration/
├── auth_password_recovery/
└── auth_password_reset/
```

The root `page.tsx` is not a form dispatcher. It allowlists the four existing `?view=` values and redirects them to their child routes; omitted/empty values default to sign-in and unknown values render the localized safe unavailable state. The lookup checks own allowlisted keys to reject prototype-named values such as `constructor` and `__proto__`. The legacy `PublicAuthMain` dispatcher and flat implementation folders are absent from the supplied archive; the audit removed no additional files because no other obsolete candidate was proven. Route mapping still depends on host rewrites described in `INTEGRATION_GUIDE.md`.

## Child route inventory

| Child module | Workflow | Frozen request behavior | Existing public path |
|---|---|---|---|
| `auth_sign_in/` | Sign in and role navigation context | `{ email, password, role }`; configured `NEXT_PUBLIC_AUTH_LOGIN_PATH` | `/auth/login` |
| `auth_account_registration/` | Account registration | `ownerName`, `libraryName`, `email`, `phone`, `password`; `confirmPassword` remains client-only | `/auth/signup` |
| `auth_password_recovery/` | Request password recovery | `{ identity }` only; configured `NEXT_PUBLIC_AUTH_FORGOT_PASSWORD_PATH` | `/auth/forgot-password` |
| `auth_password_reset/` | Six-digit OTP and password reset | `{ otp, newPassword }`; `confirmPassword` remains client-only | `/auth/reset-password` |

No separate OTP route or API is created because the supplied source only submits OTP with the reset mutation. The login role selector is navigation context, not authorization. Server-side session, CSRF, and RBAC remain host/server responsibilities.

## API and security boundaries

All four modules use the host `apiFetch` transport and preserve the observed environment-variable endpoint names. Request keys are generated per workflow and sent using `Idempotency-Key`. Error messages are localized and do not display untrusted server text. No credentials, identity, OTP, or request payload is placed in URL state, local storage, or logs.

The exact production response envelope/request ID, login email-versus-phone semantics, OTP lifecycle policy, and session behavior remain documented contract gaps; this source does not invent those contracts.

## Forms and interaction behavior

- Sign-in preserves password visibility controls, role selector pressed state, field-level errors, pending lock, retry behavior, and role-based navigation destinations.
- Registration preserves all six visible fields, validation, password visibility/strength feedback, pending/error behavior, and `/superadmin/superadmin_setup-wizard` post-success navigation.
- Recovery preserves the single identity field, generic accepted state, and safe error/retry behavior without claiming message delivery or account existence.
- Reset preserves six-digit numeric input, paste distribution, arrow/backspace focus, aggregate hidden OTP synchronization, password confirmation, safe errors, and accepted completion state.

## Demo-fill exception

Each form includes a one-click demo-fill control only when `NODE_ENV !== 'production'` and `NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED === 'true'`. Synthetic values come from the module-owned fixture, do not submit automatically, do not bypass schema validation, and are never stored or logged. The default flag is off. See each child `_forbidden.md` equivalent and `INTEGRATION_GUIDE.md` for the review gate.

## Localization and design

Each child owns English and Hindi `AUTH` locale fragments under `locales/`. The host next-intl provider must merge all four fragments into a single `AUTH` namespace. UI uses semantic host Tailwind tokens only; actual token mappings and contrast checks remain host integration responsibilities because `globals.css` and Tailwind config are not included.

## Tests and runtime verification

Each module owns component tests, synthetic fixtures, and MSW handler factories for accepted, rejected, connection-failure, and invalid-envelope scenarios. The host Playwright smoke suite is `public_auth_e2e/PublicAuthRoutes.spec.ts`. This source-only package lacks the host `package.json`, lockfile, `tsconfig.json`, Vitest/Playwright configuration, and Next.js rewrite config, so no host build or browser run is claimed. Exact verification status is recorded in `RE_AUDIT_CHECKLIST_RESULT.md`.
