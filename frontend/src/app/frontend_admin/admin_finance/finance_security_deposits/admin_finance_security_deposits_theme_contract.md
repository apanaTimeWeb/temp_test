# admin_finance_security_deposits — Theme Contract

## Source-derived semantic tokens
`bg-card`, `bg-overlay`, `bg-surface-highlight`, `bg-surface-hover`, `bg-primary`, `bg-primary-subtle`, `bg-success-bg`, `bg-warning-bg`, `bg-danger-bg`, `text-primary`, `text-on-primary`, `text-text-primary`, `text-text-secondary`, `text-success-text`, `text-warning-text`, `text-danger-text`, `border-border`, `shadow-card`, `shadow-dialog`.

## Responsive contract
- Data tables retain `overflow-x-auto` wrappers for narrow viewports; KPI grids collapse cleanly across `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`.
- Time-horizon preset bar wraps without overflowing horizontally.

## Accessibility contract
- All action buttons (`Refund`, `Deduct`, `Export`) include accessible text/labels, visible keyboard focus rings, and `motion-safe:` transitions.
