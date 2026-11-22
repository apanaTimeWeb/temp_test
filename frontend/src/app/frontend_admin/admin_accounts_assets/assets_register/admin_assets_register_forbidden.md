# Forbidden Rules — Admin Assets Register

1. ZERO cross-submodule imports: Never import directly from sibling submodules like `accounts_expenses`, `accounts_daily_settlement`, etc.
2. ZERO barrel files: No `index.ts` files allowed. Import concrete files directly.
3. ZERO floating-point currency representation: All amounts in models, schemas, and API payloads must be in integer minor units (paise).
4. ZERO unformatted currency display: Raw `.toFixed(2)` is forbidden. Must use `formatPaiseToRupees`.
5. ZERO unhandled nulls: All nullable text fields must pass through `displayValue(val)`.
6. ZERO hardcoded hex color codes: All UI colors must use Tailwind design tokens (`bg-card`, `text-primary`, `bg-warning-bg`, `text-destructive`).
7. NO unsafeguarded animations: Always prefix animations with `motion-safe:`.

