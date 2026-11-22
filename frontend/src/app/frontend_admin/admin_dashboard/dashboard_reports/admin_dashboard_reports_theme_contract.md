# Admin Dashboard Reports — Theme Contract

## Ownership

The global web design system owns the semantic token definitions and zero-business primitives. This submodule owns report labels, analytics display states, chart semantics, and the visual composition of the dashboard reports experience. It must not introduce global tokens or business-aware global components.

## Source-derived tokens

bg-card
bg-danger-bg
bg-info-bg
bg-primary
bg-primary-subtle
bg-skeleton-base
bg-success-bg
bg-surface-highlight
bg-surface-hover
bg-warning-bg
border-border
border-info-bg
border-primary
border-warning-bg
ring-primary
text-body
text-caption
text-danger
text-info
text-kpi
text-on-primary
text-page-title
text-primary
text-secondary
text-section-title
text-success
text-warning
bg-chart-primary

## Responsive contract

View selector and filters wrap on narrow widths. KPI and chart grids must collapse to one column on mobile before widening at approved breakpoints. Charts are container-aware and cannot force horizontal page overflow. Preserve a usable screen-reader and keyboard path when charts are rendered; chart colors are not the sole differentiator.

## Accessibility contract

Maintain labeled button group, `aria-pressed`, labeled search field, visible focus indicators, semantic headings and live status messages for empty/pending states. Buttons must meet minimum touch target requirements, retain accessible names, and work without pointer-only interaction. Reduced-motion preferences and text wrapping must be honored.

## Theme change path

Canonical source: `globals.css` and its Tailwind v4 `@theme inline` mapping. Components consume semantic utility classes; this module must not define local replacement palette tokens or embed raw style colors. Any unavoidable CSS-variable chart option must refer to a globally defined canonical chart token.
