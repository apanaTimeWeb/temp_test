/** Canonical UI route contract for admin_finance_collect_fee. No backend endpoint is declared because the supplied source contains no verified collection API contract. */
export const ADMIN_FINANCE_COLLECT_FEE_ROUTES = {
  route: '/admin/admin_finance/finance_collect_fee',
  ROOT: '/admin/admin_finance/finance_collect_fee',
  SUBSCRIPTIONS: '/admin/admin_finance/finance_subscriptions',
  RENEWALS: '/admin/admin_finance/finance_renewals',
} as const;

/** Compatibility alias for the verified canonical root route. */
export const ADMIN_FINANCE_COLLECT_FEE_CANONICAL_ROUTE = ADMIN_FINANCE_COLLECT_FEE_ROUTES.ROOT;

/** No verified backend endpoint exists in the supplied collect-fee source scope. */
export const ADMIN_FINANCE_COLLECT_FEE_API = {} as const;

