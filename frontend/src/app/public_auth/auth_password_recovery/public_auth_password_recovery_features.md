# Public Auth Password Recovery — Feature Contract

## 1. Purpose
Provide an autonomous public recovery-request route using the existing identity field.
## 2. User Stories
A visitor can submit the identity already supported by the source and receive safe generic confirmation feedback.
## 3. UI Data Requirements
The only recovery input is `identity`; no account lookup result is exposed.
## 4. Frozen API Contract
Submit only `{ identity }` to `NEXT_PUBLIC_AUTH_FORGOT_PASSWORD_PATH`; no resend or OTP-issue endpoint is defined.
## 5. Permissions
This route is public and must not establish a session.
## 6. State
React Hook Form owns transient input; TanStack Query mutation owns pending and request lifecycle.
## 7. Validation
The existing Zod schema requires the identity field; message text is localized.
## 8. Error Handling
Configuration, connection, malformed response, and rejected-request states use safe module messages; raw server text is not displayed.
## 9. Accessibility
Keep a programmatic label, field error association, keyboard operation, focus styles, and live state announcements.
## 10. Security and Privacy
Never put identity in URL state, logs, local storage, or analytics; use synthetic `.invalid` fixtures only.
## 11. Loading
Disable duplicate submission while pending and expose the existing submitting label.
## 12. Empty State
No list empty state applies; the empty identity is rejected by the schema.
## 13. Success State
Use generic accepted-request wording. The frontend cannot prove whether an account exists or whether delivery occurred.
## 14. Offline Mock Scenarios
The local handler supports accepted, rejected, connection-failure, and invalid-envelope scenarios for an explicitly supplied test endpoint.
## 15. API Boundary
The endpoint remains host-configured; no endpoint path is invented and the request shape remains identity-only.
## 16. Testing
`tests/PublicAuthPasswordRecoveryPage.test.tsx` covers required input, safe acceptance, retry behavior, and opt-in demo fill.
## 17. Localization
English and Hindi fragments are owned under `locales/`; the host next-intl provider must merge module fragments into the `AUTH` namespace.
## 18. Responsive Behavior
Retain responsive semantic Tailwind classes and the supplied host design tokens.
## 19. Theme Contract
See `public_auth_password_recovery_theme_contract.md` for the semantic classes consumed by this module.
## 20. Standalone Run/Mock Harness
`tests/harness/bootstrap.ts` records the expected host provider, API transport, and test-runner integration; no host bootstrap is fabricated.
## 21. Portability Guide
Copy the child folder under `src/app/frontend_public/public_auth/`; provide the `@/*` alias, Next.js App Router, React Query, RHF/Zod, next-intl, MSW, and host `apiFetch` integration.
## 22. Evidence and Unresolved Contracts
Source-derived: identity-only payload, existing configured endpoint, and safe UI wording. Backend anti-enumeration, delivery, and rate-limiting behavior require server evidence.
