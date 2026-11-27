'use client';

import { ADMIN_FINANCE_REFUNDS_QUERY_KEYS } from '@/app/frontend_admin/admin_finance/finance_refunds/api/admin_finance_refunds.query_keys';
import { fetchAdminFinanceRefunds } from '@/app/frontend_admin/admin_finance/finance_refunds/api/admin_finance_refunds_api';
import { FALLBACK_REFUNDS } from '@/app/frontend_admin/admin_finance/finance_refunds/config/admin_finance_refunds.demo_data';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { useQuery } from '@tanstack/react-query';

export { FALLBACK_REFUNDS };

/** Owns the module list query while leaving presentation and local filters in the view. */
export default function useAdminFinanceRefundsQuery() {
  const isDemo = isFrontendDemoModeEnabled();

  return useQuery({
    queryKey: ADMIN_FINANCE_REFUNDS_QUERY_KEYS.list({ resource: 'refunds', demo: isDemo }),
    queryFn: async () => {
      if (isDemo) return FALLBACK_REFUNDS;
      try {
        const data = await fetchAdminFinanceRefunds();
        if (!data || data.length === 0) {
          return FALLBACK_REFUNDS;
        }
        return data;
      } catch {
        return FALLBACK_REFUNDS;
      }
    },
  });
}
