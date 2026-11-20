// mocks/scenarios/superadmin_analytics_billing_reports.scenarios.ts
// Standard 5-scenario registry for Billing Reports

import { MOCK_BILLING_REPORTS_OVERVIEW } from '../fixtures/superadmin_analytics_billing_reports.fixtures';

export const SUPERADMIN_BILLING_REPORTS_SCENARIOS = {
  ACTIVE_RECORDS: {
    status: 200,
    envelope: {
      success: true,
      message: 'Billing reports data retrieved successfully',
      data: MOCK_BILLING_REPORTS_OVERVIEW,
      requestId: 'req-billing-rep-active-001',
    },
  },
  EMPTY_DATA: {
    status: 200,
    envelope: {
      success: true,
      message: 'No billing records match the selected criteria',
      data: {
        ...MOCK_BILLING_REPORTS_OVERVIEW,
        kpis: {
          totalRevenueMinor: 0,
          mrrMinor: 0,
          yrrMinor: 0,
          pendingInvoicesCount: 0,
          pendingAmountMinor: 0,
          failedPaymentsCount: 0,
          failedAmountMinor: 0,
          refundsCount: 0,
          refundAmountMinor: 0,
          planWiseIncome: [],
        },
        revenueTrend: [],
        items: [],
        totalCount: 0,
      },
      requestId: 'req-billing-rep-empty-002',
    },
  },
  SERVER_500_ERROR: {
    status: 500,
    envelope: {
      success: false,
      message: 'Failed to aggregate financial reports from billing ledger',
      data: null,
      errorCode: 'BILLING.REPORTS.LEDGER_FAULT',
      statusCode: 500,
      requestId: 'req-billing-rep-500-003',
    },
  },
  NETWORK_TIMEOUT: {
    delayMs: 15000,
    status: 504,
    envelope: {
      success: false,
      message: 'Billing reporting ledger query timed out',
      data: null,
      errorCode: 'BILLING.REPORTS.TIMEOUT',
      statusCode: 504,
      requestId: 'req-billing-rep-504-004',
    },
  },
  UNAUTHORIZED_401: {
    status: 401,
    envelope: {
      success: false,
      message: 'SuperAdmin billing access authorization expired',
      data: null,
      errorCode: 'AUTH.SUPERADMIN.UNAUTHORIZED',
      statusCode: 401,
      requestId: 'req-billing-rep-401-005',
    },
  },
} as const;
