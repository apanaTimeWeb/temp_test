# SuperAdmin Integrations — Domain Forbidden Rules

Under the normative rules of `WEB_FRONTEND_ARCHITECTURE_AND_DEVELOPMENT_RULES_V1.md`:

1. **Domain Root Quarantine:**
   - The domain root (`superadmin_integrations/`) contains ONLY `layout.tsx`, `page.tsx`, and master domain documentation (`_features.md`, `_forbidden.md`, `_theme_contract.md`).
   - Creating loose `components/`, `hooks/`, `api/`, `mocks/`, or `utils/` at the domain root is STRICTLY FORBIDDEN.
2. **Sub-Module Self-Containment:**
   - 100% of executable source code, state, types, and mocks live inside child autonomous sub-modules.
3. **No Sibling Business Imports:**
   - No sub-module may import business logic from any sibling sub-module or sibling domain container.
