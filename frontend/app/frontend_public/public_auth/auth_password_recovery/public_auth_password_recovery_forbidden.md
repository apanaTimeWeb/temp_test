# Password Recovery — Forbidden Patterns

- Do not add request fields beyond the observed `identity` field without an approved backend contract.
- Do not invent an endpoint, resend/cooldown/expiry policy, OTP issue flow, or delivery claim.
- Do not confirm whether an account exists.
- Do not display raw server messages or technical transport details.
- Do not place identity or secrets in URL query/hash state.
- Do not log identities, request payloads, raw responses, or idempotency keys.
- Do not use real user identities in fixtures; use synthetic `.invalid` values.
- Do not create or imply a session, token, or authenticated state from recovery acceptance.
- Do not replace the host-configured endpoint or bypass `apiFetch`.
- Do not claim runtime verification until tested in the host application.


## Demo-fill exception (review gate)

The only permitted demo-fill control is visible when `NODE_ENV !== 'production'` and `NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED === 'true'`. It uses the module-owned synthetic fixture, never submits automatically, never stores or logs values, and still relies on ordinary schema validation and the configured API. Production fields remain empty. Re-review this exception before the next major release and remove it if the explicit product/testing need has expired.
