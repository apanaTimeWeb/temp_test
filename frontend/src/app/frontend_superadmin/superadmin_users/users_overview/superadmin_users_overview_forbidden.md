# Superadmin Users Overview Forbidden Patterns

## Enforced Invariants
- Direct database writes or mutations from the router boundary are strictly forbidden.
- Fabricating mock responses or circumventing canonical redirection rules is prohibited.
- Hardcoded sensitive tenant credentials or unauthenticated user claims are barred.
- No direct styling or theming tokens outside Next.js error boundary fallback specifications.
