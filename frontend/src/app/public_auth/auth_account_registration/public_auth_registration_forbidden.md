# Public Auth Account Registration — Forbidden Patterns
- Never store/log credentials or personal data.
- Never invent backend endpoints, fields, response behavior, session creation or account activation.
- Never submit `confirmPassword`.
- Never treat a client-selected role or post-success URL as authorization.
- Never import business code from sibling auth submodules or create a shared/common parent folder.
- Never hardcode colors or bypass semantic theme tokens.
- Never remove any of the six visible fields or alter existing validation/post-success destination without approval.
- Demo values are allowed only through the current explicitly opt-in non-production control documented below; production defaults remain empty.


## Demo-fill exception (review gate)

The only permitted demo-fill control is visible when `NODE_ENV !== 'production'` and `NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED === 'true'`. It uses the module-owned synthetic fixture, never submits automatically, never stores or logs values, and still relies on ordinary schema validation and the configured API. Production fields remain empty. Re-review this exception before the next major release and remove it if the explicit product/testing need has expired.
