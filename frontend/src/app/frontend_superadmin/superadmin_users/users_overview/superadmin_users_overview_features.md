# Superadmin Users Overview Features

## Purpose & Responsibility
Canonical router and query dispatcher for the Superadmin Users domain. Directs navigation queries (`view=member_referrals`, `view=member_trust_score`) to their designated autonomous sub-surfaces or cascades to the primary `users_directory` console.

## Capabilities
- Dispatches URL search parameters to dedicated member referral and trust score views.
- Canonical fallback routing to `users_directory`.
- Clean Next.js server-side redirection with zero client hydration overhead.
- Non-generic error boundaries and not-found lifecycles.
