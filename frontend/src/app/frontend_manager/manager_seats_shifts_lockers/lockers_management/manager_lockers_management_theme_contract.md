# manager_lockers_management — Theme Contract

# manager_lockers_management — Theme Contract

# manager_lockers — Theme Portability Contract

## Governing source

Use `WEB_FRONTEND_UI_UX_DESIGN.md` as the visual source of truth and `WEB_FRONTEND_ARCHITECTURE_AND_DEVELOPMENT_RULES_V1.md` as the architecture source. Do not invent token names or colors.

## Current module stylesheet inventory

- `components/manager_lockers_management_styles/ManagerLockersManagementManager_lockers.css`

## Semantic token references found in module CSS

- `--bg-card`
- `--bg-floating`
- `--bg-header`
- `--bg-input`
- `--bg-overlay`
- `--bg-page`
- `--bg-sidebar`
- `--border`
- `--border-focus`
- `--danger`
- `--danger-bg`
- `--danger-text`
- `--info`
- `--info-bg`
- `--info-text`
- `--primary`
- `--primary-hover`
- `--purple-text`
- `--success`
- `--success-bg`
- `--success-text`
- `--surface-zebra`
- `--text-disabled`
- `--text-primary`
- `--text-secondary`
- `--touch-target-min`
- `--warning`
- `--warning-bg`
- `--warning-text`

## Required invariants

- Colors, spacing, radius, shadow, typography, focus, elevation and motion must use tokens defined by the supplied design system or approved Tailwind utilities.
- Do not use inline `style={{...}}`, arbitrary palette values, or locally invented CSS variables.
- Keep responsive behavior, visible focus, keyboard operability and reduced-motion behavior intact.
- Preserve official third-party brand colors only where the integration explicitly requires the brand treatment; document the exact selector and source evidence before allowing an exception.
- Keep module CSS inside `{n}_components/{n}_styles/`; do not import feature styles from role-wide business buckets.
- A static token scan is not visual proof. Browser checks across supported viewport sizes and themes remain `DEFERRED_TO_HOST_RUNTIME` until executed.

## Verification status

- CSS file location: checked by the source inventory.
- Token names: listed from CSS `var()` references only; names are not asserted as valid unless defined in the supplied design system/host tokens.
- Visual/runtime compliance: `DEFERRED_TO_HOST_RUNTIME`.


## Autonomous Submodule Boundary

- Owning terminal submodule: `manager_lockers_management/`.
- This document is scoped to the `manager_lockers` primary route and its current supplied behavior.
- Sibling submodules must not be imported or used as shared runtime dependencies. Duplicate small helpers locally when needed.
- API operations not supported by the supplied contract remain disabled or explicitly blocked; no endpoint is inferred.


## V2.11 Theme Consumption Audit

- Components in this submodule must consume the supplied semantic design tokens/classes and must not introduce unapproved hard-coded palette values.
- Preserve existing layout/spacing and responsive behavior unless a documented design finding requires a change.
- Theme compliance is source-audited; browser visual regression is `DEFERRED_TO_HOST_RUNTIME`.


## V2.11 Theme Consumption Audit

- Components in this submodule must consume the supplied semantic design tokens/classes and must not introduce unapproved hard-coded palette values.
- Preserve existing layout/spacing and responsive behavior unless a documented design finding requires a change.
- Theme compliance is source-audited; browser visual regression is `DEFERRED_TO_HOST_RUNTIME`.


## RBG-76 token ownership update

The owning stylesheet now consumes these canonical global tokens from the supplied web design system: `--font-size-body`, `--font-size-caption`, `--font-size-badge`, `--font-size-page-title`, `--font-size-table-header`, `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-full`, `--layout-header-height`, `--layout-sidebar-width`, and `--modal-width`. Values are sourced from the global theme; no module-local token values are introduced.

Physical CSS units remain only where the global catalog has no equivalent semantic token or where changing the unit would alter geometry, such as responsive breakpoints, 1px borders/hairlines, compact local gaps, and grid dimensions. This source-level token review is not visual runtime proof; viewport/theme checks remain `DEFERRED_TO_HOST_RUNTIME`.
