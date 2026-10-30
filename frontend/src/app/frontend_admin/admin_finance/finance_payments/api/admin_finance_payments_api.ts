import { apiFetch } from '@/app/frontend_admin/lib/api';
import { parseApiResponseData } from '@/app/frontend_admin/lib/apiSchema';
import { ADMIN_FINANCE_PAYMENTS_API } from '@/app/frontend_admin/admin_finance/finance_payments/config/admin_finance_payments.url_config';
import { AdminFinancePaymentsResponseSchema } from '@/app/frontend_admin/admin_finance/finance_payments/schemas/AdminFinancePaymentsSchema';

export async function fetchAdminFinancePayments() {
  const payload = await apiFetch<unknown>(ADMIN_FINANCE_PAYMENTS_API.LIST);
  return parseApiResponseData(payload, AdminFinancePaymentsResponseSchema);
}
