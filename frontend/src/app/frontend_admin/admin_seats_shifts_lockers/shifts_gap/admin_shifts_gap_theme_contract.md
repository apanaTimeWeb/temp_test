# admin_shifts_gap — Theme Contract

## Source-derived tokens
bg-card, border-warning-bg, text-caption, text-primary, text-secondary, text-section-title, text-sm, text-warning

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

Current leaf source references: `bg-card`, `bg-info-bg`, `bg-input`, `bg-primary`, `bg-surface-highlight`, `bg-warning-bg`, `border-border`, `border-warning-text`, `shadow-card`, `text-info`, `text-on-primary`, `text-primary`, `text-secondary`, `text-warning`. These names are consumed as semantic Tailwind classes and resolve through the canonical global theme mapping; the list records usage and does not redefine token values. No feature-owned CSS rule is required for these utilities.
