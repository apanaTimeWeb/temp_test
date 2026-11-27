'use client';

import { ADMIN_FINANCE_PAYMENTS_QUERY_KEYS } from '@/app/frontend_admin/admin_finance/finance_payments/api/admin_finance_payments.query_keys';
import { fetchAdminFinancePayments } from '@/app/frontend_admin/admin_finance/finance_payments/api/admin_finance_payments_api';
import { FALLBACK_PAYMENTS } from '@/app/frontend_admin/admin_finance/finance_payments/config/admin_finance_payments.demo_data';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { useQuery } from '@tanstack/react-query';

export { FALLBACK_PAYMENTS };

/** Owns the module list query while leaving presentation and local filters in the view. */
export default function useAdminFinancePaymentsQuery() {
  const isDemo = isFrontendDemoModeEnabled();

  return useQuery({
    queryKey: ADMIN_FINANCE_PAYMENTS_QUERY_KEYS.list({ resource: 'payments', demo: isDemo }),
    queryFn: async () => {
      if (isDemo) return FALLBACK_PAYMENTS;
      try {
        return await fetchAdminFinancePayments();
      } catch {
        return FALLBACK_PAYMENTS;
      }
    },
  });
}
