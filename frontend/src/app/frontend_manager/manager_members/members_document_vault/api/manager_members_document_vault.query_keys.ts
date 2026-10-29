/**
 * Canonical feature-local query-key factory.
 * Keys namespace client cache state only; they do not imply API endpoints,
 * payload schemas, persistence, or authorization contracts.
 */
export const MANAGER_MEMBERS_DOCUMENT_VAULT_QUERY_KEYS = {
  all: ['manager_members', 'members_document_vault'] as const,
  lists: () => ['manager_members', 'members_document_vault', 'list'] as const,
  list: (filters: Readonly<Record<string, string | number | boolean | undefined>>) =>
    ['manager_members', 'members_document_vault', 'list', filters] as const,
  details: () => ['manager_members', 'members_document_vault', 'detail'] as const,
  detail: (id: string) => ['manager_members', 'members_document_vault', 'detail', id] as const,
} as const;
