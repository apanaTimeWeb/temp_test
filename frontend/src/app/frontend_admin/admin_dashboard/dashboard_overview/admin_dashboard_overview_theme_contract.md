# admin_dashboard_dashboard_overview — Theme Contract

## Source-derived tokens

The current page uses the semantic classes `text-primary`, `text-secondary`, `border-border`, `bg-card`, and the approved focus-ring utility `focus-visible:ring-primary`. Remaining Tailwind utilities describe layout, spacing and typography (`mx-auto`, `w-full`, `max-w-7xl`, `space-y-*`, `p-*`, `sm:*`, `lg:*`, `grid`, `gap-*`, `rounded-xl`, `text-xs`, `text-sm`, `text-lg`, `text-2xl`, `font-semibold`, and `leading-6`). The page contains no raw hex color or inline style declaration.

## Responsive contract

Retain the responsive card grid at small/tablet/desktop breakpoints (`sm:grid-cols-2`, `lg:grid-cols-3`) and responsive padding. Destination descriptions must be allowed to wrap without fixed-width overflow. No table or data-grid is present in this leaf.

## Accessibility contract

Retain semantic landmarks and headings, translated accessible section labels, hidden decorative icons, visible text links with a minimum 44px height, focus-visible rings, and the pending-metrics status panel. This is source evidence, not a browser-based WCAG pass.

## Host theme boundary

Use the shared semantic token utilities already consumed by this source. Do not invent tokens, raw hex/RGB values, inline styles, or alternate visual palettes. Dark/light values are controlled by the host global design system.
