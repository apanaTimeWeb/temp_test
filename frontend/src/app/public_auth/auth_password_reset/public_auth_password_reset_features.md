# Public Auth Password Reset — Feature Contract

## 1. Purpose
Provide password reset with the existing six-digit OTP interaction and password confirmation.
## 2. User Stories
A visitor can enter a six-digit code, choose a new password, confirm it, and submit the existing reset request.
## 3. UI Data Requirements
Visible OTP slots, hidden aggregate OTP value, new password, and confirmation remain synchronized.
## 4. Frozen API Contract
Submit exactly `{ otp, newPassword }` to `NEXT_PUBLIC_AUTH_RESET_PASSWORD_PATH`; `confirmPassword` is client-only.
## 5. Permissions
This is a public unauthenticated route and must not create a session.
## 6. State
React Hook Form owns the request fields; TanStack Query mutation owns pending and request lifecycle; the OTP component owns focus and digit state.
## 7. Validation
The existing Zod schema validates six digits, password requirements, and confirmation matching.
## 8. Error Handling
Safe localized configuration, connection, invalid-response, and request-rejected messages; no raw server text.
## 9. Accessibility
Every digit input has an accessible label, shared validation association, keyboard focus behavior, and visible focus styles.
## 10. Security and Privacy
Never place OTP/password values in URLs, logs, local storage, or analytics; do not locally verify the challenge.
## 11. Loading
Lock all OTP/password controls during submission and preserve the submitting state.
## 12. Empty State
Missing OTP/password fields are handled by schema validation; no separate empty list applies.
## 13. Success State
Show the existing completion state only after the configured reset mutation is accepted.
## 14. Offline Mock Scenarios
The local handler supports accepted, rejected, connection-failure, and malformed-envelope scenarios at a host-supplied endpoint.
## 15. API Boundary
OTP remains part of the existing reset POST. No separate verify, resend, expiry, attempt-limit, or cooldown contract is introduced.
## 16. Testing
`tests/PublicAuthPasswordResetPage.test.tsx` covers required fields, aggregate OTP sync, accessible errors, pending/retry, and opt-in demo fill. Host browser execution is deferred.
## 17. Localization
English and Hindi fragments live under `locales/`; the host next-intl provider must merge module fragments into the `AUTH` namespace.
## 18. Responsive Behavior
Preserve responsive semantic Tailwind classes and touch targets from the existing form.
## 19. Theme Contract
See `public_auth_password_reset_theme_contract.md` for consumed semantic tokens.
## 20. Standalone Run/Mock Harness
`tests/harness/bootstrap.ts` documents required host providers and test-runner wiring without pretending those dependencies exist in this archive.
## 21. Portability Guide
Copy the child folder under `src/app/frontend_public/public_auth/`; provide the `@/*` alias, App Router, React Query, RHF/Zod, next-intl, MSW, and the host API transport.
## 22. Evidence and Unresolved Contracts
Source-derived: six-digit OTP interaction, reset payload, endpoint env var, and UI states. Backend OTP policy, exact response envelope, session behavior, and live route rewrites remain host/server contracts.
