# settings_general — Forbidden Patterns & Architectural Anti-Patterns

## Hard Structural & Architectural Constraints
- **NO Barrel Files**: Never create `index.ts` files or barrel re-export facades within `settings_general` (Rule 32).
- **Line Length Hard Limits**: 
  - React components must never exceed **300 lines** (Rule 1).
  - Custom hooks must never exceed **150 lines** (Rule 1).
  - Zustand stores must never exceed **180 lines** (Rule 1).
- **Zero Cross-Role / Cross-Domain Imports**: Never import business components, schemas, or state across roles or sibling leaf modules (Strict WET, Rule 2).
- **Zero Hardcoded Colors**: Raw hex (`#fff`), RGB, or Tailwind raw colors (`bg-blue-500`, `text-black`) are strictly forbidden in JSX. Use semantic tokens only (`sa-card`, `bg-primary-subtle`, `text-primary`, `border-border`) (Rule 4).
- **No Barrel Imports**: All imports must target the direct canonical file path with `@/...` (Rule 32).

## State and Transport Boundaries
- **Server State vs. UI State Separation**: TanStack Query v5 owns server-fetched configuration; Zustand exclusively owns transient UI/filter state (Rule 5).
- **No Direct Mutation without Idempotency**: State-changing requests must supply a unique `Idempotency-Key: UUIDv4` header to prevent double submission (Rule 152).
- **No Silent Dropping of Form Dirtiness**: Unsaved changes must be guarded before leaving or destructive resets (`useSuperadminSettingsGeneralUnsavedChangesGuard`) (Rule 79).
- **No Undiscriminated API Envelopes**: All API responses must follow the canonical `ApiResponse<T>` envelope format.

## Host and Backend Boundaries
- Do not invent backend endpoints, write schemas, permission grants, or persistence behavior absent a verified host contract.
- Keep preview/local state visibly distinct from durable server success.
- Do not log secrets, API keys, emergency bypass secrets, or personal data to the browser console (Rule 44).
- Maintain 100% backward compatibility with pre-existing canonical route and active-branch test contracts.
