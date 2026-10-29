# Public Auth Sign In — Forbidden Patterns

- Do not import code from sibling auth submodules.
- Do not store credentials in URLs, localStorage, sessionStorage, logs, or analytics.
- Do not infer or hardcode API endpoint paths.
- Do not treat the role selector as authorization.
- Do not expose raw server/transport errors.
- Do not add default credentials or prefilled password values; the only allowed exception is the current explicitly opt-in non-production demo-fill control documented below.
- Do not introduce `alert()`, placeholder handlers, fake sessions, or automatic submission.
- Do not add a nested child feature folder beneath `auth_sign_in/`.


## Demo-fill exception (review gate)

The only permitted demo-fill control is visible when `NODE_ENV !== 'production'` and `NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED === 'true'`. It uses the module-owned synthetic fixture, never submits automatically, never stores or logs values, and still relies on ordinary schema validation and the configured API. Production fields remain empty. Re-review this exception before the next major release and remove it if the explicit product/testing need has expired.
