// RESPONSIBILITY: Define isolated mock handlers for billing member refunds; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_billing/billing_member_refunds/mocks/handlers/SuperadminBillingOverviewMemberRefundsErrorMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
import { http, HttpResponse } from 'msw';
import { SUPERADMIN_BILLING_MEMBER_REFUNDS_API as __SUPERADMIN_BILLING_MEMBER_REFUNDS_API } from "@/app/frontend_superadmin/superadmin_billing/billing_member_refunds/config/billing_member_refunds.url_config";

/** Error-state scenario for the verified REFUNDS_LIST read contract; no endpoint is added. */
export const SUPERADMIN_FINANCE_REFUNDS_ERROR_MSW_HANDLERS = [
  http.get(__SUPERADMIN_BILLING_MEMBER_REFUNDS_API.REFUNDS_LIST, () => HttpResponse.json({ success: false, message: 'Service temporarily unavailable', data: null, error: 'SERVICE_UNAVAILABLE', errorCode: 'BILLING.REFUNDS.UNAVAILABLE', statusCode: 503, requestId: 'msw-service-unavailable' }, { status: 503 })),
];
