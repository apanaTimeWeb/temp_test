# manager_communication_complaints — Theme Contract

# manager_communication_complaints — Theme Contract

# manager_complaints — Theme Portability Contract

## Governing source

Use `WEB_FRONTEND_UI_UX_DESIGN.md` as the visual source of truth and `WEB_FRONTEND_ARCHITECTURE_AND_DEVELOPMENT_RULES_V1.md` as the architecture source. Do not invent token names or colors.

## Current module stylesheet inventory

- `components/manager_communication_complaints_styles/ManagerCommunicationComplaintsManager_complaints.css`

## Semantic token references found in module CSS

- `--bg-card`
- `--bg-header`
- `--bg-input`
- `--bg-page`
- `--border`
- `--border-focus`
- `--danger`
- `--danger-bg`
- `--danger-text`
- `--info`
- `--info-bg`
- `--info-text`
- `--overlay-backdrop`
- `--primary`
- `--purple`
- `--purple-bg`
- `--shadow-dialog`
- `--success`
- `--success-bg`
- `--success-text`
- `--surface-hover`
- `--text-disabled`
- `--text-on-danger`
- `--text-on-primary`
- `--text-on-success`
- `--text-primary`
- `--text-secondary`
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

- Owning terminal submodule: `manager_communication_complaints/`.
- This document is scoped to the `manager_complaints` primary route and its current supplied behavior.
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
