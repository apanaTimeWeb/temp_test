# Frontend Admin — CSS and Design-Token Integration Contract

This document is the integration reference for the role package. The canonical machine-readable stylesheet is [`globals.css`](./globals.css); the values below are extracted from its current `:root`, `.dark`, and `@theme inline` blocks. If this document and the stylesheet disagree, **the actual source stylesheet is authoritative and this document must be regenerated**. Do not copy these tokens into feature components or invent a parallel theme.

## 1. Required host placement and stylesheet wiring

- Place this role package under `src/app/frontend_admin/` in the host Next.js App Router project, preserving the package's module-relative paths.
- The role entry layout is [`layout.tsx`](./layout.tsx). It imports `./globals.css` and wraps the route subtree in `AdminShellRoute`; the host root layout remains responsible for `<html>`, `<body>`, document language/metadata, and the canonical `next-intl` provider.
- Ensure the host does not import this stylesheet twice. If the host app requires global CSS to be imported only from `src/app/layout.tsx`, move the single import to that host root and remove the role-layout import as one reviewed integration change; do not leave both imports active.
- `globals.css` begins with `@import "tailwindcss";` and `@config "./tailwind.config.ts";`. This package is configured for Tailwind CSS v4 while retaining a local compatibility config for existing semantic class names. Preserve both declarations until the host migration verifies equivalent generated classes.
- The stylesheet's `.dark` class is controlled by the `next-themes` provider configured in `AdminShellRoute`. Do not substitute a different dark-mode selector without updating the provider and verifying all token consumers.
- The role layout loads Inter through `next/font/google`. The host build must have the approved font download/cache strategy; do not add a second font loader.

## 2. Token flow — mandatory

```text
globals.css :root (light values) + .dark (dark values)
                         ↓
              @theme inline semantic mappings
                         ↓
       Tailwind semantic utility classes in TSX
```

- Use semantic classes such as `bg-card`, `bg-page`, `text-primary`, `text-secondary`, `border-border`, `text-danger`, `bg-danger-bg`, `rounded-lg`, `shadow-card`, and `text-body` where the mapping exists.
- For component-specific CSS, consume the existing custom properties directly, e.g. `background: var(--bg-card); color: var(--text-primary);`.
- Do not use raw hex/RGB colors in JSX, arbitrary `bg-[var(...)]` utilities, or undefined CSS variables. Do not duplicate design tokens in a component stylesheet.
- Do not assume every low-level layout measurement is a Tailwind utility. Layout/control measurements may be used directly from CSS variables when there is no corresponding `@theme inline` utility.
- Light and dark themes must define the same token names. Update both blocks together.

## 3. Source-derived light/dark token inventory

| Token | Category | Light (`:root`) | Dark (`.dark`) |
|---|---|---|---|
| `--animate-duration-base` | Motion | `200ms` | `200ms` |
| `--animate-duration-fast` | Motion | `150ms` | `150ms` |
| `--animate-duration-slow` | Motion | `300ms` | `300ms` |
| `--animate-duration-xslow` | Motion | `500ms` | `500ms` |
| `--bg-card` | Surfaces | `#FFFFFF` | `#111111` |
| `--bg-floating` | Surfaces | `#FFFFFF` | `#1A1A1A` |
| `--bg-header` | Surfaces | `#FFFFFF` | `#111111` |
| `--bg-header-translucent` | Surfaces | `rgba(255,255,255,.8)` | `rgba(17,17,17,.8)` |
| `--bg-input` | Surfaces | `#FFFFFF` | `#1A1A1A` |
| `--bg-overlay` | Surfaces | `#FAFAFA` | `#242424` |
| `--bg-page` | Surfaces | `#F4F4F5` | `#050505` |
| `--bg-popover` | Surfaces | `#F4F4F5` | `#2E2E2E` |
| `--bg-sidebar` | Surfaces | `#FAFAFA` | `#050505` |
| `--border` | Borders & focus | `#E4E4E7` | `#27272A` |
| `--border-focus` | Borders & focus | `#A16207` | `#FACC15` |
| `--chart-danger` | Charts | `#DC2626` | `#F87171` |
| `--chart-grid` | Charts | `rgba(0,0,0,.06)` | `rgba(255,255,255,.05)` |
| `--chart-info` | Charts | `#2563EB` | `#60A5FA` |
| `--chart-primary` | Charts | `#EAB308` | `#FACC15` |
| `--chart-secondary` | Charts | `#7C3AED` | `#D8B4FE` |
| `--chart-success` | Charts | `#16A34A` | `#4ADE80` |
| `--chart-tooltip-bg` | Charts | `#FFFFFF` | `#111111` |
| `--chart-warning` | Charts | `#F59E0B` | `#FBBF24` |
| `--control-height` | Controls & accessibility | `40px` | `40px` |
| `--danger` | Status colors | `#B91C1C` | `#B91C1C` |
| `--danger-bg` | Status colors | `#FEE2E2` | `#450A0A` |
| `--danger-text` | Status colors | `#991B1B` | `#F87171` |
| `--drawer-width` | Overlays | `480px` | `480px` |
| `--focus-ring` | Borders & focus | `#A16207` | `#FACC15` |
| `--font-size-badge` | Typography | `11px` | `11px` |
| `--font-size-body` | Typography | `14px` | `14px` |
| `--font-size-caption` | Typography | `12px` | `12px` |
| `--font-size-kpi` | Typography | `28px` | `28px` |
| `--font-size-page-title` | Typography | `22px` | `22px` |
| `--font-size-section-title` | Typography | `16px` | `16px` |
| `--font-size-table-header` | Typography | `12px` | `12px` |
| `--info` | Status colors | `#1D4ED8` | `#1D4ED8` |
| `--info-bg` | Status colors | `#DBEAFE` | `#172554` |
| `--info-text` | Status colors | `#1E40AF` | `#60A5FA` |
| `--layout-content-padding` | Layout | `24px` | `24px` |
| `--layout-header-height` | Layout | `64px` | `64px` |
| `--layout-sidebar-width` | Layout | `240px` | `240px` |
| `--layout-sidebar-width-collapsed` | Layout | `60px` | `60px` |
| `--modal-width` | Overlays | `480px` | `480px` |
| `--overlay-backdrop` | Overlays | `rgba(0,0,0,.6)` | `rgba(0,0,0,.6)` |
| `--pay-bank-bg` | Payments | `#E0F2FE` | `#0C4A6E` |
| `--pay-bank-text` | Payments | `#0369A1` | `#7DD3FC` |
| `--pay-card-bg` | Payments | `#F1F5F9` | `#1E293B` |
| `--pay-card-text` | Payments | `#334155` | `#CBD5E1` |
| `--pay-cash-bg` | Payments | `#CCFBF1` | `#134E4A` |
| `--pay-cash-text` | Payments | `#0F766E` | `#5EEAD4` |
| `--pay-upi-bg` | Payments | `#CFFAFE` | `#164E63` |
| `--pay-upi-text` | Payments | `#0E7490` | `#67E8F9` |
| `--primary` | Brand | `#EAB308` | `#FACC15` |
| `--primary-hover` | Brand | `#CA8A04` | `#EAB308` |
| `--primary-subtle` | Brand | `#FEF9C3` | `rgba(250,204,21,.15)` |
| `--purple-bg` | Status colors | `#EDE9FE` | `#3B0764` |
| `--purple-text` | Status colors | `#7E22CE` | `#D8B4FE` |
| `--radius-full` | Shape | `999px` | `999px` |
| `--radius-lg` | Shape | `12px` | `12px` |
| `--radius-md` | Shape | `8px` | `8px` |
| `--radius-sm` | Shape | `4px` | `4px` |
| `--radius-xl` | Shape | `16px` | `16px` |
| `--shadow-card` | Elevation | `0 1px 3px rgba(0,0,0,.08),0 1px 2px rgba(0,0,0,.04)` | `0 1px 3px rgba(0,0,0,.4)` |
| `--shadow-dialog` | Elevation | `0 20px 60px rgba(0,0,0,.16),0 8px 16px rgba(0,0,0,.08)` | `0 20px 60px rgba(0,0,0,.6)` |
| `--shadow-popover` | Elevation | `0 4px 16px rgba(0,0,0,.12),0 2px 4px rgba(0,0,0,.06)` | `0 4px 16px rgba(0,0,0,.5)` |
| `--shadow-toast` | Elevation | `0 8px 24px rgba(0,0,0,.12)` | `0 8px 24px rgba(0,0,0,.5)` |
| `--skeleton-base` | Loading states | `#E4E4E7` | `#111111` |
| `--skeleton-highlight` | Loading states | `#F4F4F5` | `#1A1A1A` |
| `--success` | Status colors | `#047857` | `#15803D` |
| `--success-bg` | Status colors | `#D1FAE5` | `#064E3B` |
| `--success-text` | Status colors | `#065F46` | `#4ADE80` |
| `--surface-highlight` | Surfaces | `rgba(234,179,8,.05)` | `rgba(250,204,21,.05)` |
| `--surface-hover` | Surfaces | `rgba(234,179,8,.08)` | `rgba(250,204,21,.08)` |
| `--surface-zebra` | Surfaces | `#FAFAFA` | `#141414` |
| `--table-row-height` | Tables | `48px` | `48px` |
| `--table-row-height-compact` | Tables | `32px` | `32px` |
| `--text-disabled` | Text & contrast | `#A1A1AA` | `#52525B` |
| `--text-on-danger` | Text & contrast | `#FFFFFF` | `#FFFFFF` |
| `--text-on-info` | Text & contrast | `#FFFFFF` | `#FFFFFF` |
| `--text-on-primary` | Text & contrast | `#111111` | `#111111` |
| `--text-on-success` | Text & contrast | `#FFFFFF` | `#FFFFFF` |
| `--text-on-warning` | Text & contrast | `#111111` | `#111111` |
| `--text-primary` | Text & contrast | `#000000` | `#FFFFFF` |
| `--text-secondary` | Text & contrast | `#52525B` | `#A1A1AA` |
| `--touch-target-min` | Controls & accessibility | `44px` | `44px` |
| `--warning` | Status colors | `#F59E0B` | `#F59E0B` |
| `--warning-bg` | Status colors | `#FEF3C7` | `#451A03` |
| `--warning-text` | Status colors | `#92400E` | `#FBBF24` |

## 4. Current `@theme inline` mapping inventory

| Tailwind theme variable | Mapping |
|---|---|
| `--animate-duration-base` | `var(--animate-duration-base)` |
| `--animate-duration-fast` | `var(--animate-duration-fast)` |
| `--animate-duration-slow` | `var(--animate-duration-slow)` |
| `--animate-duration-xslow` | `var(--animate-duration-xslow)` |
| `--color-border` | `var(--border)` |
| `--color-border-focus` | `var(--border-focus)` |
| `--color-card` | `var(--bg-card)` |
| `--color-chart-danger` | `var(--chart-danger)` |
| `--color-chart-grid` | `var(--chart-grid)` |
| `--color-chart-info` | `var(--chart-info)` |
| `--color-chart-primary` | `var(--chart-primary)` |
| `--color-chart-secondary` | `var(--chart-secondary)` |
| `--color-chart-success` | `var(--chart-success)` |
| `--color-chart-tooltip-bg` | `var(--chart-tooltip-bg)` |
| `--color-chart-warning` | `var(--chart-warning)` |
| `--color-danger` | `var(--danger)` |
| `--color-danger-bg` | `var(--danger-bg)` |
| `--color-danger-text` | `var(--danger-text)` |
| `--color-floating` | `var(--bg-floating)` |
| `--color-focus-ring` | `var(--focus-ring)` |
| `--color-header` | `var(--bg-header)` |
| `--color-header-translucent` | `var(--bg-header-translucent)` |
| `--color-info` | `var(--info)` |
| `--color-info-bg` | `var(--info-bg)` |
| `--color-info-text` | `var(--info-text)` |
| `--color-input` | `var(--bg-input)` |
| `--color-overlay` | `var(--bg-overlay)` |
| `--color-overlay-backdrop` | `var(--overlay-backdrop)` |
| `--color-page` | `var(--bg-page)` |
| `--color-pay-bank` | `var(--pay-bank-text)` |
| `--color-pay-bank-bg` | `var(--pay-bank-bg)` |
| `--color-pay-card` | `var(--pay-card-text)` |
| `--color-pay-card-bg` | `var(--pay-card-bg)` |
| `--color-pay-cash` | `var(--pay-cash-text)` |
| `--color-pay-cash-bg` | `var(--pay-cash-bg)` |
| `--color-pay-upi` | `var(--pay-upi-text)` |
| `--color-pay-upi-bg` | `var(--pay-upi-bg)` |
| `--color-popover` | `var(--bg-popover)` |
| `--color-primary` | `var(--primary)` |
| `--color-primary-hover` | `var(--primary-hover)` |
| `--color-primary-subtle` | `var(--primary-subtle)` |
| `--color-purple` | `var(--purple-text)` |
| `--color-purple-bg` | `var(--purple-bg)` |
| `--color-sidebar` | `var(--bg-sidebar)` |
| `--color-skeleton-base` | `var(--skeleton-base)` |
| `--color-skeleton-highlight` | `var(--skeleton-highlight)` |
| `--color-success` | `var(--success)` |
| `--color-success-bg` | `var(--success-bg)` |
| `--color-success-text` | `var(--success-text)` |
| `--color-surface-highlight` | `var(--surface-highlight)` |
| `--color-surface-hover` | `var(--surface-hover)` |
| `--color-surface-zebra` | `var(--surface-zebra)` |
| `--color-text-disabled` | `var(--text-disabled)` |
| `--color-text-on-danger` | `var(--text-on-danger)` |
| `--color-text-on-info` | `var(--text-on-info)` |
| `--color-text-on-primary` | `var(--text-on-primary)` |
| `--color-text-on-success` | `var(--text-on-success)` |
| `--color-text-on-warning` | `var(--text-on-warning)` |
| `--color-text-primary` | `var(--text-primary)` |
| `--color-text-secondary` | `var(--text-secondary)` |
| `--color-warning` | `var(--warning)` |
| `--color-warning-bg` | `var(--warning-bg)` |
| `--color-warning-text` | `var(--warning-text)` |
| `--radius-full` | `var(--radius-full)` |
| `--radius-lg` | `var(--radius-lg)` |
| `--radius-md` | `var(--radius-md)` |
| `--radius-sm` | `var(--radius-sm)` |
| `--radius-xl` | `var(--radius-xl)` |
| `--shadow-card` | `var(--shadow-card)` |
| `--shadow-dialog` | `var(--shadow-dialog)` |
| `--shadow-popover` | `var(--shadow-popover)` |
| `--shadow-toast` | `var(--shadow-toast)` |
| `--text-badge` | `var(--font-size-badge)` |
| `--text-body` | `var(--font-size-body)` |
| `--text-caption` | `var(--font-size-caption)` |
| `--text-kpi` | `var(--font-size-kpi)` |
| `--text-micro` | `10px` |
| `--text-page-title` | `var(--font-size-page-title)` |
| `--text-section-title` | `var(--font-size-section-title)` |
| `--text-table-header` | `var(--font-size-table-header)` |
| `--text-ui` | `13px` |

## 5. Automated token-contract gate

Run from `frontend_admin/`:

```bash
npm run check:tokens
```

The checker verifies that `:root` and `.dark` have identical token names, required semantic tokens exist and are mapped through `@theme inline`, mapping references resolve, `tailwind.config.ts` references are defined, and the canonical Tailwind imports remain present. `npm run check:quality` includes this gate. `.husky/pre-commit` runs it before `lint-staged`.

The package cannot create or edit the host repository's CI workflow from this isolated role ZIP. Add `npm run check:tokens` to the host CI job alongside typecheck/lint/test so token drift fails CI. Example step:

```yaml
- name: Verify CSS token contract
  working-directory: src/app/frontend_admin
  run: npm run check:tokens
```

Adjust `working-directory` only to match the actual host placement. Do not change host workflows without review of the host repository.

## 6. Theme-contract obligations for each submodule

Every autonomous submodule's `*_theme_contract.md` must list the semantic tokens it actually consumes and its accessibility/responsive constraints. When changing a token:

1. Update both `:root` and `.dark` values.
2. Update `@theme inline` if the token is intended to be used as a Tailwind utility.
3. Update `tailwind.config.ts` only when the compatibility mapping is required by the current class usage.
4. Run `npm run check:tokens` and the module's tests.
5. Search the source tree for all consumers and update affected submodule theme contracts.
6. Record the migration and any host-only verification in the root `INTEGRATION_GUIDE.md`.

## 7. Integration boundary and known deferrals

This package does not supply the host's root layout, production lockfile, backend, auth/session invalidation contract, live API, or deployment pipeline. Do not invent these contracts. Integrate against the host's approved dependency versions and route/message registry, then run the verification commands in `../INTEGRATION_GUIDE.md`. Browser, build, and host-provider behavior must be reported as deferred until executed in the host application.
