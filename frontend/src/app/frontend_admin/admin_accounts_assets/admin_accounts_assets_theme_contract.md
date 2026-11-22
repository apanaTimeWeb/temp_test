# Admin Accounts Assets — Theme Contract

## Source-derived tokens

The domain layout uses the shared global design-system tokens and semantic Tailwind utilities. It must not define feature business colors or raw hex/RGB values. Active token families are verified in child submodule theme contracts and `globals.css` / `@theme inline`.

## Responsive contract

Secondary navigation is horizontally scrollable and keeps controls at least 44px high; content wrappers use `min-w-0` and must not force horizontal viewport overflow. Verify all child pages at 320px, 375px, 768px, and 1280px where applicable.

## Accessibility contract

Navigation links remain keyboard-focusable, have accessible labels from `ADMIN_NAVIGATION`, expose the current destination through `aria-current="page"`, and retain visible focus indicators and contrast-safe semantic tokens. Route correctness does not constitute a browser accessibility pass.

## Ownership

Global design owns neutral visual primitives; this domain owns only secondary navigation structure; each autonomous submodule owns its business UI and its exact theme contract.
