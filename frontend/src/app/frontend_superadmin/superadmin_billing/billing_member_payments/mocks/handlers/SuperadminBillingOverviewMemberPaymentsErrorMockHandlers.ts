// RESPONSIBILITY: Define isolated mock handlers for billing member payments; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_billing/billing_member_payments/mocks/handlers/SuperadminBillingOverviewMemberPaymentsErrorMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
import { http, HttpResponse } from 'msw';
import { SUPERADMIN_BILLING_MEMBER_PAYMENTS_API as __SUPERADMIN_BILLING_MEMBER_PAYMENTS_API } from "@/app/frontend_superadmin/superadmin_billing/billing_member_payments/config/superadmin_billing_member_payments.url_config";

/** Error-state scenario for the verified PAYMENTS_LIST read contract; no endpoint is added. */
export const SUPERADMIN_FINANCE_PAYMENTS_ERROR_MSW_HANDLERS = [
  http.get(__SUPERADMIN_BILLING_MEMBER_PAYMENTS_API.PAYMENTS_LIST, () => HttpResponse.json({ success: false, message: 'Service temporarily unavailable', data: null, error: 'SERVICE_UNAVAILABLE', errorCode: 'BILLING.PAYMENTS.UNAVAILABLE', statusCode: 503, requestId: 'msw-service-unavailable' }, { status: 503 })),
];
