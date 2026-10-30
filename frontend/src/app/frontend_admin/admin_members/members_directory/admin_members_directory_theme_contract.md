# admin_members_directory — Theme Contract

## Source-derived tokens
bg-card, bg-overlay, bg-overlay-backdrop, bg-popover, bg-surface-highlight, bg-surface-hover, bg-warning-bg, border-2, border-b, border-border, border-primary, border-t, border-warning-bg, outline-none, ring-2, ring-primary, shadow-card, shadow-popover, text-caption, text-center, text-danger, text-disabled, text-left, text-lg, text-primary, text-purple, text-right, text-secondary, text-section-title, text-sm, text-success, text-text-primary, text-text-secondary, text-warning, text-xl, text-xs

## Responsive contract
- Preserve the existing responsive classes and breakpoints in the local component closure.
- Tables/data grids must retain their existing small-screen overflow or card-stack behavior; do not introduce horizontal page overflow.
- Keep translated strings able to wrap; no fixed-width assumptions are added by this move.

## Accessibility contract
- Preserve programmatic labels, keyboard navigation, focus restoration, accessible status/error messages, and reduced-motion safeguards present in the source.
- Color must not be the sole indicator of state.

## Host theme boundary
- Use the shared semantic design tokens already consumed by this source. Do not invent colors, raw hex values, or new token names.

## V42 Additional Semantic Tokens (RBG16–20)

Current leaf source references: `bg-card`, `bg-floating`, `bg-overlay`, `bg-popover`, `bg-primary`, `bg-primary-subtle`, `bg-surface-highlight`, `bg-warning-bg`, `border-border`, `shadow-card`, `shadow-popover`, `text-danger`, `text-on-primary`, `text-primary`, `text-purple`, `text-secondary`, `text-success`, `text-warning`. These names are consumed as semantic Tailwind classes and resolve through the canonical global theme mapping; the list records usage and does not redefine token values. No feature-owned CSS rule is required for these utilities.
