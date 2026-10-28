# Auth Theme Contract

## Global ownership
The auth module consumes the host application's canonical semantic Tailwind tokens. It does not define a local palette or shadow/radius registry. The host `globals.css` and Tailwind v4 `@theme inline` mapping must contain these tokens according to `WEB_FRONTEND_UI_UX_DESIGN.md`.

## Exact tokens consumed by the current source
This inventory is derived from the retained auth TSX source. Token presence, mapping, contrast ratios, and light/dark values are host integration checks and are not claimed as verified.

| Token family | Exact class tokens observed | Purpose |
|---|---|---|
| Surface backgrounds | `bg-page`, `bg-sidebar`, `bg-card`, `bg-input`, `bg-primary`, `bg-primary-subtle`, `bg-danger-bg`, `bg-success-bg`, `bg-surface-hover`, `bg-surface-highlight`, `bg-skeleton-base` | Page, form, card, status, and interaction surfaces |
| Text | `text-primary`, `text-secondary`, `text-disabled`, `text-on-primary`, `text-danger`, `text-success`, `text-warning`, `text-info` | Primary/secondary copy, disabled controls, contrast on primary, and status copy |
| Borders and focus | `border-border`, `border-primary`, `border-danger`, `border-success`, `focus-visible:ring-primary` | Control boundaries, validation state, and keyboard focus |
| Elevation | `shadow-card` | Auth card elevation |
| Primary interaction | `hover:bg-primary-hover`, `disabled:bg-surface-highlight` | Hover and disabled feedback for primary actions |

## Behavioral visual contract
- Primary CTA uses a solid semantic `bg-primary` with `text-on-primary`; no CTA gradient.
- Forms and cards consume semantic surfaces and borders.
- Every interactive control has a visible keyboard focus style and a minimum 44px target where practical.
- Status feedback uses text plus a semantic surface/icon rather than color alone.
- Non-essential animation is guarded with `motion-safe:` or `motion-reduce:` handling.
- Font loading is handled through `next/font/google` Inter in `layout.tsx`; the module has no Google Fonts CSS `@import`.

- Loading, disabled controls, and feedback also use `bg-skeleton-base`, `text-disabled`, `motion-safe:animate-pulse`, `motion-safe:animate-spin`, and `motion-safe:duration-base` as token/utility patterns defined by the supplied global design-system document.

## Host verification required
Actual light/dark values, semantic color definitions, shadows, radius, and token mapping remain owned by the host `globals.css` and Tailwind configuration. Those files were not included in the supplied ZIP. Verify every token above against the canonical host theme, run contrast checks for text/status/focus states, and test both supported themes. Do not invent token values in this module.

## Product identity conflict
The supplied design reference says Smart Gym 360, while the source UI says Library OS. This contract deliberately consumes semantic tokens without imposing a product-specific palette or replacing either brand. An explicit product/design owner decision is required to resolve that document mismatch.
