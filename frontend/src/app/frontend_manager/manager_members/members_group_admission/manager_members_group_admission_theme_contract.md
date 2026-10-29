# manager_members_group_admission — Theme Contract

## Governing source

Use `WEB_FRONTEND_UI_UX_DESIGN.md` as the visual source of truth and `WEB_FRONTEND_ARCHITECTURE_AND_DEVELOPMENT_RULES_V1.md` as the architecture source. Do not invent token names or colors.

## Current module stylesheet inventory

- `components/manager_members_group_admission_styles/ManagerMembersGroupAdmissionManager_group_admission.css`

## Semantic token references found in module CSS

- `--animate-duration-base`
- `--animate-duration-fast`
- `--animate-duration-slow`
- `--bg-card`
- `--bg-input`
- `--bg-page`
- `--border`
- `--danger`
- `--danger-bg`
- `--info`
- `--info-text`
- `--overlay-backdrop`
- `--primary`
- `--primary-subtle`
- `--purple-text`
- `--radius-lg`
- `--success`
- `--success-bg`
- `--success-text`
- `--surface-highlight`
- `--text-disabled`
- `--text-on-primary`
- `--text-primary`
- `--text-secondary`
- `--warning-text`

## Required invariants

- Colors, spacing, radius, shadow, typography, focus, elevation and motion must use tokens defined by the supplied design system or approved Tailwind utilities.
- Do not use inline `style={{...}}`, arbitrary palette values, or locally invented CSS variables.
- Keep responsive behavior, visible focus, keyboard operability and reduced-motion behavior intact.
- Preserve official third-party brand colors only where the integration explicitly requires the brand treatment; document the exact selector and source evidence before allowing an exception.
- Keep module CSS inside `components/manager_members_group_admission_styles/`; do not import feature styles from role-wide business buckets. This is a module-local placement rule; naming, isolation and token semantics follow the canonical architecture and design-system documents.
- A static token scan is not visual proof. Browser checks across supported viewport sizes and themes remain `DEFERRED_TO_HOST_RUNTIME` until executed.

## Verification status

- CSS file location: checked by the source inventory.
- Token names: listed from CSS `var()` references only; names are not asserted as valid unless defined in the supplied design system/host tokens.
- Visual/runtime compliance: `DEFERRED_TO_HOST_RUNTIME`.


## Autonomous Submodule Boundary

- Owning terminal submodule: `members_group_admission/`.
- This document is scoped to the `members_group_admission` primary route and its current supplied behavior.
- Sibling submodules must not be imported or used as shared runtime dependencies. Duplicate small helpers locally when needed.
- API operations not supported by the supplied contract remain disabled or explicitly blocked; no endpoint is inferred.


## V2.11 Theme Consumption Audit

- Canonical visual/token requirements are defined by `WEB_FRONTEND_UI_UX_DESIGN.md` (Color Palette, Theme Implementation Architecture, Exact Semantic Token Mapping, Typography, and Accessibility); architectural ownership follows `WEB_FRONTEND_ARCHITECTURE_AND_DEVELOPMENT_RULES_V1.md`. This module contract records only its current token consumption and stylesheet ownership.
- Do not invent or redefine global tokens in this file. Preserve responsive geometry and reduced-motion behavior while consuming existing tokens.
- Source token inventory is not proof of browser rendering; visual, contrast and viewport verification remain `DEFERRED_TO_HOST_RUNTIME` until executed.

## Approved brand-color exception

- `#25D366`, `rgba(37,211,102,0.18)`, and `rgba(37,211,102,0.6)` are retained only for WhatsApp-branded actions in this module’s CSS. This is an explicit third-party brand treatment, not a general UI palette. Do not reuse these values for non-WhatsApp UI.
