# manager_assets_maintenance — Theme Contract

# manager_assets_maintenance — Theme Contract

# Theme Contract — manager_asset_maintenance

## Semantic token references found in module CSS
The maintenance register currently uses source-observed `fin-*` semantic classes plus standard Tailwind utility classes. No new raw color token was introduced by this batch. The supplied module has no separate CSS file owned by the terminal submodule.

## Required behavior
- Preserve the existing `fin-*` semantic classes and standard responsive utility classes.
- Do not introduce hard-coded hex/rgb colors or inline style objects.
- Keep the maintenance table horizontally scrollable at narrow widths.
- Keep disabled action explanations visible and localized.
- Keep the empty state announced with `role="status"`; its decorative icon must remain `aria-hidden`.
- Verify focus, contrast, responsive layout, keyboard and screen-reader behavior in the host browser.

Visual and accessibility verification status: `DEFERRED_TO_HOST_RUNTIME`.


## Autonomous Submodule Boundary

- Owning terminal submodule: `manager_assets_maintenance/`.
- This document is scoped to the `manager_asset_maintenance` primary route and its current supplied behavior.
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
