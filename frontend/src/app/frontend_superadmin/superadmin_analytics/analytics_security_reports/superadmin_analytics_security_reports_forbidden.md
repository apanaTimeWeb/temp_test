# Superadmin Analytics — Security Reports: Forbidden Patterns

1. **Zero Raw Fetch**: All API calls must route through `apiFetch` from `@/lib/api`. Raw `fetch()` or `axios` calls are strictly forbidden.
2. **Zero `window.alert` / `window.prompt` / `window.confirm`**: Only custom UI modals or Sonner toasts are permitted.
3. **Zero `console.log`**: Production code must use `@/lib/logger` or omit logging statements.
4. **Zero Cross-Submodule Imports**: Imports from other submodules are strictly prohibited; shared dependencies belong in ambient contracts or `@/lib`.
5. **Zero Unsupported Chart Hydration**: No heavy unhydrated client charting libraries that crash SSR; visualizations must use pure CSS/SVG flex layouts or resilient wrappers.
6. **Zero Any**: All contracts must be strongly typed with Zod validation.
