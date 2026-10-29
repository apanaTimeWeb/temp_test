# Public Auth Sign In — Theme Contract

Canonical source: `WEB_FRONTEND_UI_UX_DESIGN.md`.

Semantic utilities consumed by the existing sign-in view include page/card/input surfaces, primary and secondary text, borders, focus treatment, and status/error colors. Host `globals.css` owns the token-to-Tailwind mapping and is outside this archive's scope.

Requirements: no hardcoded hex colors or inline style overrides; preserve responsive layout, visible keyboard focus, semantic labels, accessible error messaging, and minimum touch target guidance. Any unavailable host token mapping is `OUTSIDE_SUPPLIED_SCOPE`, not a reason to invent CSS variables.
