// RESPONSIBILITY: Define the typed API/query boundary for billing member late fees; it does not invent host endpoints or backend guarantees.
// FLOW: Feature caller -> superadmin_billing/billing_member_late_fees/api/superadmin_billing_overview_member_late_fees.query_keys.ts -> canonical URL contract and host transport boundary -> typed result/error handling; live transport is supplied by the host.
/** Resource-scoped query key registry. This does not imply an API endpoint. */
export const SUPERADMIN_FINANCE_LATE_FEES_QUERY_KEYS = {
  all: ['superadmin_member_late_fees'] as const,
  lists: () => [...SUPERADMIN_FINANCE_LATE_FEES_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...SUPERADMIN_FINANCE_LATE_FEES_QUERY_KEYS.lists(), filters] as const,
  details: () => [...SUPERADMIN_FINANCE_LATE_FEES_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SUPERADMIN_FINANCE_LATE_FEES_QUERY_KEYS.details(), id] as const,
};
