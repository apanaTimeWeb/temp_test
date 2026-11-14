// RESPONSIBILITY: Define the typed API/query boundary for accounting expenses; it does not invent host endpoints or backend guarantees.
// FLOW: Feature caller -> superadmin_accounting/accounting_expenses/api/superadmin_accounting_expenses_add.query_keys.ts -> canonical URL contract and host transport boundary -> typed result/error handling; live transport is supplied by the host.
/** Resource-scoped query key registry. This does not imply an API endpoint. */
export const SUPERADMIN_ACCOUNTING_EXPENSES_ADD_QUERY_KEYS = {
  all: ['superadmin_accounting_expenses_add'] as const,
  lists: () => [...SUPERADMIN_ACCOUNTING_EXPENSES_ADD_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...SUPERADMIN_ACCOUNTING_EXPENSES_ADD_QUERY_KEYS.lists(), filters] as const,
  details: () => [...SUPERADMIN_ACCOUNTING_EXPENSES_ADD_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SUPERADMIN_ACCOUNTING_EXPENSES_ADD_QUERY_KEYS.details(), id] as const,
};
