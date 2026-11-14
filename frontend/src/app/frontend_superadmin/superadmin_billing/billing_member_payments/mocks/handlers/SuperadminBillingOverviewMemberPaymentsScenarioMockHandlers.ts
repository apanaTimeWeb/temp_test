// RESPONSIBILITY: Define isolated mock handlers for billing member payments; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_billing/billing_member_payments/mocks/handlers/SuperadminBillingOverviewMemberPaymentsScenarioMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
import { delay, http, HttpResponse } from 'msw';
import { SUPERADMIN_BILLING_MEMBER_PAYMENTS_API as __API } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments/config/superadmin_billing_member_payments.url_config';

const endpoint = __API.PAYMENTS_LIST;
const paginationMeta = (total: number) => ({
  total,
  page: 1,
  limit: Math.max(total, 1),
  totalPages: Math.ceil(total / Math.max(total, 1)),
  hasNextPage: false,
  hasPrevPage: false,
});
const failure = (statusCode: number, errorCode: string, requestId: string) => ({
  success: false,
  message: statusCode === 401 ? 'Authentication is required.' : statusCode === 403 ? 'Access is forbidden.' : 'The service encountered an internal error.',
  data: null,
  error: statusCode === 401 ? 'UNAUTHORIZED' : statusCode === 403 ? 'FORBIDDEN' : 'INTERNAL_SERVER_ERROR',
  errorCode,
  statusCode,
  requestId,
});

/** Canonical EMPTY_DATA scenario for this verified read-only endpoint. */
export const SUPERADMIN_FINANCE_PAYMENTS_EMPTY_DATA_MSW_HANDLERS = [
  http.get(endpoint, () => HttpResponse.json({ success: true, message: 'No records are available for this scenario.', data: [], meta: paginationMeta(0), requestId: 'msw-empty-data' })),
];
export const SUPERADMIN_FINANCE_PAYMENTS_SERVER_500_MSW_HANDLERS = [
  http.get(endpoint, () => HttpResponse.json(failure(500, 'INTERNAL_SERVER_ERROR', 'msw-server-500'), { status: 500 })),
];
export const SUPERADMIN_FINANCE_PAYMENTS_NETWORK_TIMEOUT_MSW_HANDLERS = [
  http.get(endpoint, async () => {
    await delay(15_000);
    return HttpResponse.error();
  }),
];
export const SUPERADMIN_FINANCE_PAYMENTS_UNAUTHORIZED_401_MSW_HANDLERS = [
  http.get(endpoint, () => HttpResponse.json(failure(401, 'AUTH.UNAUTHORIZED', 'msw-unauthorized-401'), { status: 401 })),
];
export const SUPERADMIN_FINANCE_PAYMENTS_FORBIDDEN_403_MSW_HANDLERS = [
  http.get(endpoint, () => HttpResponse.json(failure(403, 'AUTH.FORBIDDEN', 'msw-forbidden-403'), { status: 403 })),
];
