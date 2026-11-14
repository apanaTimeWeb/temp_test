# subscriptions_active_subscribers — Theme Contract

- Preserve semantic design tokens and existing source styling.
- Preserve keyboard/focus states, accessible names, status semantics, and reduced-motion alternatives.
- Do not introduce raw hex colors or unsupported opacity variants.
- Browser-based contrast, responsive, and assistive-technology verification is deferred to the host runtime.

## Host Token and Runtime Verification

- Use the host's semantic theme tokens; do not introduce raw hex colors or inline styles.
- Contrast, focus visibility, responsive overflow, reduced motion, and direct-refresh behavior require host/browser verification and are not certified by source-only checks.

## Canonical Global Semantic Token Inventory (source-reconciled v21)

The following inventory is derived from production source files under this autonomous leaf. Each source reference is a 1-based line reference. Canonical class-to-variable pairs are copied from `WEB_FRONTEND_UI_UX_DESIGN.md`, Section 1A, “Exact Semantic Token Mapping”. This source inventory does **not** establish that the host stylesheet actually defines or maps those variables.

| Tailwind semantic token | Canonical CSS variable | Exact local production source evidence |
|---|---|---|
| `bg-card` | `--bg-card` | `page.tsx:19`, `not-found.tsx:12`, `hooks/useSuperadminSubscriptionsActiveSubscribersConfirm.ts:71`, `components/SuperadminSubscriptionsActiveSubscribersSemanticTable.tsx:39` |
| `bg-danger` | `--danger` | `hooks/useSuperadminSubscriptionsActiveSubscribersConfirm.ts:76` |
| `bg-danger-bg` | `--danger-bg` | `components/SuperadminSubscriptionsActiveSubscribersErrorFallback.tsx:22` |
| `bg-info-bg` | `--info-bg` | `components/SuperadminSubscriptionsActiveSubscribersPageClient.tsx:108` |
| `bg-input` | `--bg-input` | `components/SuperadminSubscriptionsActiveSubscribersSemanticTable.tsx:37` |
| `bg-overlay` | `--bg-overlay` | `hooks/useSuperadminSubscriptionsActiveSubscribersConfirm.ts:43`, `hooks/useSuperadminSubscriptionsActiveSubscribersConfirm.ts:49`, `hooks/useSuperadminSubscriptionsActiveSubscribersConfirm.ts:102` |
| `bg-primary` | `--primary` | `hooks/useSuperadminSubscriptionsActiveSubscribersConfirm.ts:77` |
| `bg-skeleton-base` | `--skeleton-base` | `components/SuperadminSubscriptionsActiveSubscribersListSkeleton.tsx:19`, `components/SuperadminSubscriptionsActiveSubscribersListSkeleton.tsx:21`, `components/SuperadminSubscriptionsActiveSubscribersListSkeleton.tsx:23`, `components/SuperadminSubscriptionsActiveSubscribersListSkeleton.tsx:25` |
| `bg-surface-hover` | `--surface-hover` | `hooks/useSuperadminSubscriptionsActiveSubscribersConfirm.ts:71`, `components/SuperadminSubscriptionsActiveSubscribersPageClient.tsx:79`, `components/SuperadminSubscriptionsActiveSubscribersPageClient.tsx:109`, `components/SuperadminSubscriptionsActiveSubscribersSemanticTable.tsx:48` |
| `bg-warning-bg` | `--warning-bg` | `components/SuperadminSubscriptionsActiveSubscribersPageClient.tsx:87` |
| `border-border` | `--border` | `page.tsx:19`, `not-found.tsx:12`, `hooks/useSuperadminSubscriptionsActiveSubscribersConfirm.ts:43`, `hooks/useSuperadminSubscriptionsActiveSubscribersConfirm.ts:49`, `hooks/useSuperadminSubscriptionsActiveSubscribersConfirm.ts:71`, `components/SuperadminSubscriptionsActiveSubscribersPageClient.tsx:79`, `components/SuperadminSubscriptionsActiveSubscribersPageClient.tsx:87`, `components/SuperadminSubscriptionsActiveSubscribersPageClient.tsx:100`, `components/SuperadminSubscriptionsActiveSubscribersPageClient.tsx:108`, `components/SuperadminSubscriptionsActiveSubscribersErrorFallback.tsx:22`, `components/SuperadminSubscriptionsActiveSubscribersSemanticTable.tsx:37`, `components/SuperadminSubscriptionsActiveSubscribersSemanticTable.tsx:42`, `components/SuperadminSubscriptionsActiveSubscribersSemanticTable.tsx:48`, `components/SuperadminSubscriptionsActiveSubscribersSemanticTable.tsx:57` |
| `ring-primary` | `--focus-ring` | `hooks/useSuperadminSubscriptionsActiveSubscribersConfirm.ts:71`, `hooks/useSuperadminSubscriptionsActiveSubscribersConfirm.ts:76`, `hooks/useSuperadminSubscriptionsActiveSubscribersConfirm.ts:77` |
| `shadow-card` | `--shadow-card` | `components/SuperadminSubscriptionsActiveSubscribersPageClient.tsx:108` |
| `shadow-dialog` | `--shadow-dialog` | `hooks/useSuperadminSubscriptionsActiveSubscribersConfirm.ts:43`, `hooks/useSuperadminSubscriptionsActiveSubscribersConfirm.ts:49` |
| `text-danger` | `--danger-text` | `hooks/useSuperadminSubscriptionsActiveSubscribersConfirm.ts:57`, `components/SuperadminSubscriptionsActiveSubscribersErrorFallback.tsx:22` |
| `text-on-danger` | `--text-on-danger` | `hooks/useSuperadminSubscriptionsActiveSubscribersConfirm.ts:76` |
| `text-on-primary` | `--text-on-primary` | `hooks/useSuperadminSubscriptionsActiveSubscribersConfirm.ts:77` |
| `text-primary` | `--text-primary` | `not-found.tsx:12`, `hooks/useSuperadminSubscriptionsActiveSubscribersConfirm.ts:43`, `hooks/useSuperadminSubscriptionsActiveSubscribersConfirm.ts:52`, `hooks/useSuperadminSubscriptionsActiveSubscribersConfirm.ts:71`, `hooks/useSuperadminSubscriptionsActiveSubscribersConfirm.ts:102`, `components/SuperadminSubscriptionsActiveSubscribersPageClient.tsx:62`, `components/SuperadminSubscriptionsActiveSubscribersPageClient.tsx:108`, `components/SuperadminSubscriptionsActiveSubscribersPageClient.tsx:109`, `components/SuperadminSubscriptionsActiveSubscribersSemanticTable.tsx:37` |
| `text-secondary` | `--text-secondary` | `page.tsx:19`, `not-found.tsx:14`, `hooks/useSuperadminSubscriptionsActiveSubscribersConfirm.ts:65`, `components/SuperadminSubscriptionsActiveSubscribersPageClient.tsx:63`, `components/SuperadminSubscriptionsActiveSubscribersPageClient.tsx:79`, `components/SuperadminSubscriptionsActiveSubscribersPageClient.tsx:109`, `components/SuperadminSubscriptionsActiveSubscribersSemanticTable.tsx:37`, `components/SuperadminSubscriptionsActiveSubscribersSemanticTable.tsx:39`, `components/SuperadminSubscriptionsActiveSubscribersSemanticTable.tsx:48`, `components/SuperadminSubscriptionsActiveSubscribersSemanticTable.tsx:57`, `components/SuperadminSubscriptionsActiveSubscribersEmptyState.tsx:16` |
| `text-warning` | `--warning-text` | `components/SuperadminSubscriptionsActiveSubscribersPageClient.tsx:87` |

### Unverified semantic-like classes and source-level hazards

The production source scan found no additional color/surface/focus/shadow token-like class requiring a noncanonical token mapping. Generic Tailwind layout and typography utilities (for example `border-b`, `text-sm`, and `text-center`) are not treated as semantic color tokens and are not included in this table.

| Observed semantic-like utility | Status | Evidence |
|---|---|---|
| None observed in the source scan | `NOT_APPLICABLE` — no noncanonical semantic color/surface/focus/shadow utility was found in this leaf's production source. | Production files scanned: `page.tsx`, `not-found.tsx`, `components/*.tsx`, `hooks/*.ts`, and module-owned production utilities. |

- Host token mapping: `NOT_VERIFIED` (host `globals.css` and Tailwind `@theme inline` mapping are outside this role ZIP).

## Active route boundary (preserved in v21)

The immutable local tab is `Active Subscribers`. Sibling workflow actions navigate to their canonical routes; sibling-only render branches are not locally reachable and were removed without changing the active route view. This source-only repair does not establish backend behavior.
