# admin_finance_auto_suspend — Theme Contract

## Source-derived semantic tokens
`bg-card`, `bg-overlay`, `bg-surface-highlight`, `bg-surface-hover`, `bg-primary`, `bg-primary-subtle`, `bg-danger-bg`, `bg-success-bg`, `bg-warning-bg`, `text-primary`, `text-on-primary`, `text-text-primary`, `text-text-secondary`, `text-danger-text`, `text-success-text`, `text-warning-text`, `border-border`, `shadow-card`, `shadow-dialog`.

## Responsive contract
- Maintain horizontal table scroll container (`overflow-x-auto`) inside cards so mobile viewports never overflow horizontally.
- Grace period inputs, search controls, and export buttons wrap gracefully at `sm:` and `md:` breakpoints.

## Accessibility contract
- Pair every status color with readable badge text (`Overdue`, `Active`, etc.) — color is never the sole status indicator.
- Maintain `motion-safe:` prefixes on all hover transitions and modal entry animations.
