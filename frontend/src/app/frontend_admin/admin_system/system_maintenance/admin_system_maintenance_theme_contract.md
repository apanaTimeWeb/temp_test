# admin_system_maintenance — Theme Contract

## Source-derived tokens
bg-card, bg-surface-highlight, bg-surface-hover, bg-warning-bg, border-b, border-border, border-danger, border-warning-bg, text-2xl, text-center, text-danger, text-left, text-page-title, text-primary, text-secondary, text-sm, text-ui, text-warning, text-xs

## Responsive contract
- Preserve the existing responsive classes and breakpoints in the local component closure.
- Tables/data grids must retain their existing small-screen overflow or card-stack behavior; do not introduce horizontal page overflow.
- Keep translated strings able to wrap; no fixed-width assumptions are added by this move.

## Accessibility contract
- Preserve programmatic labels, keyboard navigation, focus restoration, accessible status/error messages, and reduced-motion safeguards present in the source.
- Color must not be the sole indicator of state.

## Host theme boundary
- Use the shared semantic design tokens already consumed by this source. Do not invent colors, raw hex values, or new token names.
