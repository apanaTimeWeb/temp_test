import { apiFetch } from '@/app/frontend_admin/lib/api';
import { parseApiResponseData } from '@/app/frontend_admin/lib/apiSchema';
import { ADMIN_FINANCE_REFUNDS_API } from '@/app/frontend_admin/admin_finance/finance_refunds/config/admin_finance_refunds.url_config';
import { AdminFinanceRefundsResponseSchema } from '@/app/frontend_admin/admin_finance/finance_refunds/schemas/AdminFinanceRefundsSchema';

export async function fetchAdminFinanceRefunds() {
  const payload = await apiFetch<unknown>(ADMIN_FINANCE_REFUNDS_API.LIST);
  return parseApiResponseData(payload, AdminFinanceRefundsResponseSchema);
}
