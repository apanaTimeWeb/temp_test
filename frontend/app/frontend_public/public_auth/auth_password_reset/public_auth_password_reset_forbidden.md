# Password Reset — Forbidden Patterns

- Do not add a separate OTP verification, resend, expiry, attempt, or cooldown endpoint without an approved backend contract.
- Do not add fields to the reset request beyond the observed `{ otp, newPassword }` payload.
- Do not send `confirmPassword`.
- Do not put OTP/password/challenge values in URL state, logs, local storage, or analytics.
- Do not expose raw server messages or transport details to users.
- Do not invent a response envelope or claim the backend contract is verified.
- Do not remove paste, arrow-key, backspace, labels, validation, pending, retry, or completion behavior.
- Do not use sibling-module business imports.
- Do not treat frontend role/navigation context as authorization.


## Demo-fill exception (review gate)

The only permitted demo-fill control is visible when `NODE_ENV !== 'production'` and `NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED === 'true'`. It uses the module-owned synthetic fixture, never submits automatically, never stores or logs values, and still relies on ordinary schema validation and the configured API. Production fields remain empty. Re-review this exception before the next major release and remove it if the explicit product/testing need has expired.
