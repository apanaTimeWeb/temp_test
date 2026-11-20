// mocks/handlers/superadmin_usage_overview.handlers.ts
import { SUPERADMIN_USAGE_OVERVIEW_SCENARIOS } from '../scenarios/superadmin_usage_overview.scenarios';
import { MOCK_LIBRARY_USAGE_LIST, MOCK_SYSTEM_USAGE_SUMMARY } from '../fixtures/superadmin_usage_overview.fixtures';
import type { ApiResponse } from '@/lib/api';
import type { LibraryUsageRecord, SystemUsageAggregates } from '../../types/SuperadminUsageOverviewTypes';

export function getMockUsageOverviewResponse(
  scenario: keyof typeof SUPERADMIN_USAGE_OVERVIEW_SCENARIOS = 'ACTIVE',
  search = '',
  planTier = 'ALL'
): ApiResponse<LibraryUsageRecord[]> {
  const chosen = SUPERADMIN_USAGE_OVERVIEW_SCENARIOS[scenario];
  if (!chosen.envelope.success) {
    return chosen.envelope as ApiResponse<LibraryUsageRecord[]>;
  }

  let list = [...MOCK_LIBRARY_USAGE_LIST];
  if (search.trim()) {
    const q = search.toLowerCase();
    list = list.filter((item) => item.name.toLowerCase().includes(q) || item.planName.toLowerCase().includes(q));
  }
  if (planTier && planTier !== 'ALL') {
    list = list.filter((item) => item.planName.toLowerCase().includes(planTier.toLowerCase()));
  }

  return {
    success: true,
    message: chosen.envelope.message,
    data: list,
    requestId: chosen.envelope.requestId,
  };
}

export function getMockSystemSummaryResponse(): ApiResponse<SystemUsageAggregates> {
  return {
    success: true,
    message: 'System usage summary loaded',
    data: MOCK_SYSTEM_USAGE_SUMMARY,
    requestId: 'req-usage-summary-001',
  };
}

export function getMockLibraryDetailResponse(id: string): ApiResponse<LibraryUsageRecord> {
  const match = MOCK_LIBRARY_USAGE_LIST.find((item) => item.id === id);
  if (!match) {
    return {
      success: false,
      message: `Library with ID ${id} not found`,
      data: null,
      errorCode: 'ERR_USAGE_LIBRARY_NOT_FOUND',
      statusCode: 404,
      requestId: 'req-usage-404',
    };
  }
  return {
    success: true,
    message: 'Library usage detail loaded',
    data: match,
    requestId: 'req-usage-detail-001',
  };
}
