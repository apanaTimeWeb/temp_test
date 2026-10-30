// DATA FLOW: finance_payments route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchAdminFinancePayments } from '@/app/frontend_admin/admin_finance/finance_payments/api/admin_finance_payments_api';
import { ADMIN_FINANCE_PAYMENTS_QUERY_KEYS } from '@/app/frontend_admin/admin_finance/finance_payments/api/admin_finance_payments.query_keys';

/** Owns the module list query while leaving presentation and local filters in the view. */
export default function useAdminFinancePaymentsQuery() {
  return useQuery({ queryKey: ADMIN_FINANCE_PAYMENTS_QUERY_KEYS.list({ resource: 'payments' }), queryFn: fetchAdminFinancePayments });
}
