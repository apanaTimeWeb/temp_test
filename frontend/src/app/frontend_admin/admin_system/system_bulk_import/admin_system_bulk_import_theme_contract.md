# admin_system_bulk_import — Theme Contract

## Source-derived tokens
bg-border, bg-card, bg-danger-bg, bg-info-bg, bg-primary, bg-primary-subtle, bg-success-bg, bg-surface-highlight, bg-surface-hover, bg-warning-bg, border-2, border-b, border-border, border-danger, border-dashed, border-info-bg, border-primary, border-success-text, border-warning-bg, outline-none, ring-2, ring-offset-2, ring-offset-page, ring-primary, text-2xl, text-4xl, text-5xl, text-base, text-center, text-danger, text-info, text-left, text-on-primary, text-page-title, text-primary, text-secondary, text-sm, text-success, text-ui, text-warning, text-xl, text-xs

## Responsive contract
- Preserve the existing responsive classes and breakpoints in the local component closure.
- Tables/data grids must retain their existing small-screen overflow or card-stack behavior; do not introduce horizontal page overflow.
- Keep translated strings able to wrap; no fixed-width assumptions are added by this move.

## Accessibility contract
- Preserve programmatic labels, keyboard navigation, focus restoration, accessible status/error messages, and reduced-motion safeguards present in the source.
- Color must not be the sole indicator of state.

## Host theme boundary
- Use the shared semantic design tokens already consumed by this source. Do not invent colors, raw hex values, or new token names.
