// RESPONSIBILITY: Define isolated mock handlers for billing member payments; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_billing/billing_member_payments/mocks/handlers/SuperadminBillingOverviewMemberPaymentsMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
import { http, HttpResponse } from 'msw';
import { SUPERADMIN_BILLING_MEMBER_PAYMENTS_API as __SUPERADMIN_BILLING_MEMBER_PAYMENTS_API } from "@/app/frontend_superadmin/superadmin_billing/billing_member_payments/config/superadmin_billing_member_payments.url_config";
import { SUPERADMIN_MEMBER_PAYMENT_FIXTURES } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments/mocks/fixtures/SuperadminBillingOverviewMemberPaymentsReadMockFixtures';

/** Read-only handler for the verified PAYMENTS_LIST contract; financial writes are intentionally absent. */
export const SUPERADMIN_FINANCE_PAYMENTS_MSW_HANDLERS = [
  http.get(__SUPERADMIN_BILLING_MEMBER_PAYMENTS_API.PAYMENTS_LIST, () => HttpResponse.json({ success: true, message: 'Loaded sample payment records.', data: SUPERADMIN_MEMBER_PAYMENT_FIXTURES, meta: { total: SUPERADMIN_MEMBER_PAYMENT_FIXTURES.length, page: 1, limit: Math.max(SUPERADMIN_MEMBER_PAYMENT_FIXTURES.length, 1), totalPages: Math.ceil(SUPERADMIN_MEMBER_PAYMENT_FIXTURES.length / Math.max(SUPERADMIN_MEMBER_PAYMENT_FIXTURES.length, 1)), hasNextPage: false, hasPrevPage: false }, requestId: 'msw-superadmin-payments-list' })),
];
