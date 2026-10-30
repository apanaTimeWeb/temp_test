// DATA FLOW: finance_refunds route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchAdminFinanceRefunds } from '@/app/frontend_admin/admin_finance/finance_refunds/api/admin_finance_refunds_api';
import { ADMIN_FINANCE_REFUNDS_QUERY_KEYS } from '@/app/frontend_admin/admin_finance/finance_refunds/api/admin_finance_refunds.query_keys';

/** Owns the module list query while leaving presentation and local filters in the view. */
export default function useAdminFinanceRefundsQuery() {
  return useQuery({ queryKey: ADMIN_FINANCE_REFUNDS_QUERY_KEYS.list({ resource: 'refunds' }), queryFn: fetchAdminFinanceRefunds });
}
