# Security Audit Logs Forbidden Actions

## Prohibited Behaviors
1. **No direct mutation**: Audit logs are strictly immutable and append-only.
2. **No deletion**: Logs must never be expunged or altered through client-side workflows.
3. **No cross-leaf state imports**: Do not import mutable states or private models from sibling leaves.
4. **No inline styles or uncontracted colors**: Adhere to the established CSS variables and theme tokens.
