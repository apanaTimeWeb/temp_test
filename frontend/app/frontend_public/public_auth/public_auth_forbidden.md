# Auth Forbidden Patterns

1. Never bundle default or reusable credentials as production defaults or claim synthetic credentials are real accounts.
2. Never prefill a password, OTP, or recovery challenge in production.
3. Never create a base64/unsigned/client-generated value and call it an authenticated access token.
4. Never write auth tokens or user identity to `localStorage` or create session cookies from client-side JavaScript.
5. Never show success for login, recovery, reset, or signup before a valid API response envelope reports `success: true`.
6. Never call `fetch`/`axios` directly from this feature. Network operations must use the host `apiFetch` at `@/lib/api`.
7. Never invent production endpoint paths or response shapes. Each workflow owns its endpoint configuration in its child module.
8. Never send mutation requests without an `Idempotency-Key`; reuse the key for a retry of an unchanged payload.
9. Never treat the selected frontend role as authorization. Server-side auth and permission enforcement are required.
10. Never expose passwords, OTPs, request bodies, or access tokens in logs or URLs.
11. Never use an empty anchor (`href="#"`) for an action or link.
12. Never use inline `style` objects, `dangerouslySetInnerHTML` style injection, raw hex colors, arbitrary CSS-variable Tailwind classes, or non-token color values in this module.
13. Never use gradients for auth CTA or surfaces under the supplied design restriction.
14. All icon-only controls must expose an accessible name; all form fields must have associated labels and error descriptions where present.
15. Respect reduced-motion preferences for non-essential animation.
16. Do not add backend or React Native implementation files to this web frontend module.
17. Do not create role-wide/shared business buckets or duplicate route trees to compensate for incomplete full-repository context.
18. Do not move public-enquiry business behavior back into this auth module; it is owned by `frontend_public/public_enquiry/`.
19. Do not mark API-backed flows production-ready until host endpoints, payloads, session, challenge-binding contracts, and routing have been verified.

## Explicit demo-fill exception — review required

The user's approved repair scope requires a one-click demo-fill control. This is a narrowly scoped exception to the default prohibition on prefilled values: it is visible only when `NODE_ENV !== 'production'` and `NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED === 'true'`, uses module-owned synthetic fixtures only, never auto-submits, never stores/logs values, and leaves ordinary validation and API submission unchanged. Production fields remain empty. Re-review this exception before the next major release and remove it if the testing need has expired.
