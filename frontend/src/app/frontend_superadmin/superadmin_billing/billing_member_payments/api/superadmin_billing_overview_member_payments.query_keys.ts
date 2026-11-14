// RESPONSIBILITY: Define the typed API/query boundary for billing member payments; it does not invent host endpoints or backend guarantees.
// FLOW: Feature caller -> superadmin_billing/billing_member_payments/api/superadmin_billing_overview_member_payments.query_keys.ts -> canonical URL contract and host transport boundary -> typed result/error handling; live transport is supplied by the host.
/** Resource-scoped query keys for the member payments leaf only. */
export const SUPERADMIN_MEMBER_PAYMENTS_QUERY_KEYS = {
  all: ['superadmin_member_payments'] as const,
  lists: () => [...SUPERADMIN_MEMBER_PAYMENTS_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...SUPERADMIN_MEMBER_PAYMENTS_QUERY_KEYS.lists(), filters] as const,
  details: () => [...SUPERADMIN_MEMBER_PAYMENTS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SUPERADMIN_MEMBER_PAYMENTS_QUERY_KEYS.details(), id] as const,
} as const;
