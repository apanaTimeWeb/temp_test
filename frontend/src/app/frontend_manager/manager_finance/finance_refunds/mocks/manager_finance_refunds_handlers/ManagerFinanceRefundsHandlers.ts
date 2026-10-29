import { http, HttpResponse } from 'msw';
import { managerFinanceRefundResponseSchema } from '@/app/frontend_manager/manager_finance/finance_refunds/schemas/ManagerFinanceRefundsSchema';
import { MANAGER_FINANCE_API_REFUND_FIXTURES, MANAGER_FINANCE_EMPTY_REFUND_FIXTURE } from '@/app/frontend_manager/manager_finance/finance_refunds/mocks/manager_finance_refunds_fixtures/ManagerFinanceRefundsApiFixtures';

export const MANAGER_FINANCE_REFUNDS_TEST_ONLY_PATH = '/__test__/manager-finance-refunds';
const TEST_REQUEST_ID = 'msw-manager-finance-refunds';

export function managerRefundsTestResponse<T>(request: Request, populated: T, empty: T) {
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

  return HttpResponse.json({
    success: true,
    message: 'Refunds loaded.',
    data: mode === 'empty' ? empty : populated,
    requestId: TEST_REQUEST_ID,
  });
}

const validRefunds = managerFinanceRefundResponseSchema.parse(MANAGER_FINANCE_API_REFUND_FIXTURES);
const emptyRefunds = managerFinanceRefundResponseSchema.parse(MANAGER_FINANCE_EMPTY_REFUND_FIXTURE);
export const managerRefundsHandlers = [http.get(MANAGER_FINANCE_REFUNDS_TEST_ONLY_PATH, ({ request }) => managerRefundsTestResponse(request, validRefunds, emptyRefunds))];
export function validateManagerRefundsApiFixtures() { managerFinanceRefundResponseSchema.parse(validRefunds); managerFinanceRefundResponseSchema.parse(emptyRefunds); }
