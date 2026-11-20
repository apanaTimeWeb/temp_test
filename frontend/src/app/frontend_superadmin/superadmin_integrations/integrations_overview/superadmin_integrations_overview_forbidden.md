# SuperAdmin Integrations Overview — Forbidden Patterns

Under the normative rules of `WEB_FRONTEND_ARCHITECTURE_AND_DEVELOPMENT_RULES_V1.md`, the following patterns are **STRICTLY PROHIBITED** in this sub-module:

1. **Zero Cross-Submodule Imports:**
   - Do NOT import any components, hooks, stores, types, or utilities from sibling submodules or other domains.
2. **Zero Parent Shared Business Folders:**
   - Do NOT create `superadmin_integrations/common/` or `superadmin_integrations/components/`. All business code belongs inside `integrations_overview/`.
3. **No Plain-Text Secret Storage:**
   - Plain-text API secrets or webhook HMAC keys MUST NEVER be stored in state, localStorage, or displayed in UI tables. Masking is mandatory.
4. **No Single-Click Destructive Actions:**
   - Key revocation and webhook deletion MUST use `useSuperadminIntegrationsOverviewConfirm()` double-verification modal. Raw `window.confirm()` or single-click execution is strictly forbidden.
5. **No Direct `fetch` or `axios` in Components:**
   - All network traffic must go through `superadmin_integrations_overview.api.ts` wrapping `apiFetch` with `ApiResponse<T>`.
6. **No Arbitrary CSS Brackets:**
   - Do not use `bg-[#...]` or `bg-[var(...)]`. All styling must use semantic design tokens (`bg-card`, `bg-purple-bg`, `text-purple-text`, `bg-primary`, `text-on-primary`, etc.).
7. **No Opacity Modifiers on Semantic Tokens:**
   - Never write `bg-success/10` or `bg-danger/5`. Use semantic variant tokens like `bg-success-bg` and `bg-danger-bg`.
8. **No Barrel Files:**
   - Do not create `index.ts` files. Use direct absolute imports (`@/...`).
9. **No Hardcoded API or Navigation URLs in Components:**
   - All route and endpoint strings must come from `config/superadmin_integrations_overview.url_config.ts`.
