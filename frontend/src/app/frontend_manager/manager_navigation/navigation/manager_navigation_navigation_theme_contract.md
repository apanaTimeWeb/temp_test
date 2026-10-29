# manager_navigation_navigation — Theme Contract

# Manager Navigation Theme Contract

- Shell styles are owned by this module in `components/ManagerNavigationNavigationManager_navigation.css`.
- Use the established Manager shell semantic classes and the Smart Gym 360 dark/gold design tokens.
- Preserve keyboard access, visible focus, reduced-motion behavior, and responsive sidebar states.
- Do not move feature-specific business styles into this shell stylesheet.


## Exact CSS token dependencies

This inventory is generated from every `theme(...)` token reference in `components/ManagerNavigationNavigationManager_navigation.css`. Definitions are owned by the host theme and must be confirmed during integration.

- `--animate-duration-fast`
- `--animate-duration-slow`
- `--color-border`
- `--color-border-focus`
- `--color-card`
- `--color-danger`
- `--color-danger-bg`
- `--color-danger-text`
- `--color-focus-ring`
- `--color-header`
- `--color-info`
- `--color-info-bg`
- `--color-info-text`
- `--color-input`
- `--color-on-danger`
- `--color-on-primary`
- `--color-overlay`
- `--color-page`
- `--color-primary`
- `--color-primary-hover`
- `--color-primary-subtle`
- `--color-purple-bg`
- `--color-purple-text`
- `--color-sidebar`
- `--color-skeleton-base`
- `--color-success`
- `--color-success-bg`
- `--color-success-text`
- `--color-surface-highlight`
- `--color-surface-hover`
- `--color-surface-zebra`
- `--color-text-disabled`
- `--color-text-primary`
- `--color-text-secondary`
- `--color-warning`
- `--color-warning-bg`
- `--color-warning-text`
- `--radius-full`
- `--radius-md`
- `--shadow-dialog`
- `--spacing`


## Autonomous Submodule Boundary

- Owning terminal submodule: `manager_navigation_navigation/`.
- This document is scoped to the `manager_navigation` primary route and its current supplied behavior.
- Sibling submodules must not be imported or used as shared runtime dependencies. Duplicate small helpers locally when needed.
- API operations not supported by the supplied contract remain disabled or explicitly blocked; no endpoint is inferred.


## V2.11 Theme Consumption Audit

- Components in this submodule must consume the supplied semantic design tokens/classes and must not introduce unapproved hard-coded palette values.
- Preserve existing layout/spacing and responsive behavior unless a documented design finding requires a change.
- Theme compliance is source-audited; browser visual regression is `DEFERRED_TO_HOST_RUNTIME`.


