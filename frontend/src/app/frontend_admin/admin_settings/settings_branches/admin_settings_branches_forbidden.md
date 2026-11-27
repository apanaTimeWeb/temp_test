# Forbidden Patterns — `admin_settings/settings_branches`

- No cross-submodule imports from `settings_profile`, `settings_security`, or `settings_support`.
- No barrel `index.ts` re-exports.
- No hardcoded raw hex/palette classes in TSX; semantic theme tokens only.
- No un-ID'd `toast()` calls or direct `localStorage`/`sessionStorage` access.
- No nested sub-submodules inside `settings_branches`.
