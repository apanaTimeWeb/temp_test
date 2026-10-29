import { http, HttpResponse } from 'msw';
import { managerFinancePaymentResponseSchema } from '@/app/frontend_manager/manager_finance/finance_payments/schemas/ManagerFinancePaymentsSchema';
import { MANAGER_FINANCE_API_PAYMENT_FIXTURES, MANAGER_FINANCE_EMPTY_PAYMENT_FIXTURE } from '@/app/frontend_manager/manager_finance/finance_payments/mocks/manager_finance_payments_fixtures/ManagerFinancePaymentsApiFixtures';

export const MANAGER_FINANCE_PAYMENTS_TEST_ONLY_PATH = '/__test__/manager-finance-payments';
const TEST_REQUEST_ID = 'msw-manager-finance-payments';

export function managerPaymentsTestResponse<T>(request: Request, populated: T, empty: T) {
  const mode = new URL(request.url).searchParams.get('__testMode');
  if (mode === 'error') {
    return HttpResponse.json({
      success: false,
      message: 'Synthetic test API error',
      data: null,
      error: 'Synthetic test API error',
      errorCode: 'SYNTHETIC_TEST_ERROR',
      statusCode: 503,
      requestId: TEST_REQUEST_ID,
    }, { status: 503 });
  }

  return HttpResponse.json((mode === 'empty' ? empty : populated) as any);
}

const validPayments = managerFinancePaymentResponseSchema.parse(MANAGER_FINANCE_API_PAYMENT_FIXTURES);
const emptyPayments = managerFinancePaymentResponseSchema.parse(MANAGER_FINANCE_EMPTY_PAYMENT_FIXTURE);
export const managerPaymentsHandlers = [http.get(`*${MANAGER_FINANCE_PAYMENTS_TEST_ONLY_PATH}`, ({ request }) => managerPaymentsTestResponse(request, validPayments, emptyPayments))];
export function validateManagerPaymentsApiFixtures() { managerFinancePaymentResponseSchema.parse(validPayments); managerFinancePaymentResponseSchema.parse(emptyPayments); }
