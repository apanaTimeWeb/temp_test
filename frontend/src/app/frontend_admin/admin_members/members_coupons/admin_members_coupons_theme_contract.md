# admin_coupons_main — Theme Contract

## Source-derived tokens
bg-card, bg-danger-bg, bg-input, bg-primary, bg-primary-hover, bg-primary-subtle, bg-skeleton-base, bg-skeleton-highlight, bg-success-bg, bg-surface-highlight, bg-surface-hover, bg-warning-bg, border-border, border-danger-text, border-dashed, border-t, border-warning-bg, outline-none, ring-2, ring-primary, shadow-card, text-caption, text-center, text-danger, text-disabled, text-kpi, text-on-primary, text-page-title, text-primary, text-secondary, text-sm, text-success, text-warning, text-xs

## Responsive contract
- Preserve the existing responsive classes and breakpoints in the local component closure.
- Tables/data grids must retain their existing small-screen overflow or card-stack behavior; do not introduce horizontal page overflow.
- Keep translated strings able to wrap; no fixed-width assumptions are added by this move.

## Accessibility contract
- Preserve programmatic labels, keyboard navigation, focus restoration, accessible status/error messages, and reduced-motion safeguards present in the source.
- Color must not be the sole indicator of state.

## Host theme boundary
- Use the shared semantic design tokens already consumed by this source. Do not invent colors, raw hex values, or new token names.
