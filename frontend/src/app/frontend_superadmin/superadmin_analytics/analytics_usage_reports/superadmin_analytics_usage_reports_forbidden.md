# Forbidden Patterns — Superadmin Analytics Usage Reports

1. **NO RAW FETCH / AXIOS**: All network calls MUST use `apiFetch` from `@/lib/api`.
2. **NO HARDCODED COLORS**: Use Tailwind CSS semantic classes and tokens only.
3. **NO DIRECT BROWSER ALERTS**: Never use `window.alert` or `window.confirm`.
4. **NO BARREL FILES**: Do not create `index.ts` files.
5. **NO CROSS-FEATURE IMPORTS**: Do not import from sibling submodules or other roles.
6. **NO MAGIC NUMBERS**: Storage and call metrics must be handled via formatters.
