// RESPONSIBILITY: Define isolated mock handlers for billing member refunds; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_billing/billing_member_refunds/mocks/handlers/SuperadminBillingOverviewMemberRefundsMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
import { http, HttpResponse } from 'msw';
import { SUPERADMIN_BILLING_MEMBER_REFUNDS_API as __SUPERADMIN_BILLING_MEMBER_REFUNDS_API } from "@/app/frontend_superadmin/superadmin_billing/billing_member_refunds/config/billing_member_refunds.url_config";
import { SUPERADMIN_MEMBER_REFUND_FIXTURES } from '@/app/frontend_superadmin/superadmin_billing/billing_member_refunds/mocks/fixtures/SuperadminBillingOverviewMemberRefundsReadMockFixtures';

/** Read-only handler for the verified REFUNDS_LIST contract; financial writes are intentionally absent. */
export const SUPERADMIN_FINANCE_REFUNDS_MSW_HANDLERS = [
  http.get(__SUPERADMIN_BILLING_MEMBER_REFUNDS_API.REFUNDS_LIST, () => HttpResponse.json({ success: true, message: 'Loaded sample refund records.', data: SUPERADMIN_MEMBER_REFUND_FIXTURES, meta: { total: SUPERADMIN_MEMBER_REFUND_FIXTURES.length, page: 1, limit: Math.max(SUPERADMIN_MEMBER_REFUND_FIXTURES.length, 1), totalPages: Math.ceil(SUPERADMIN_MEMBER_REFUND_FIXTURES.length / Math.max(SUPERADMIN_MEMBER_REFUND_FIXTURES.length, 1)), hasNextPage: false, hasPrevPage: false }, requestId: 'msw-superadmin-refunds-list' })),
];
