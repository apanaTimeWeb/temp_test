// mocks/handlers/superadmin_usage_quota_requests.handlers.ts
import {
  MOCK_QUOTA_REQUESTS_LIST,
  MOCK_QUOTA_REQUESTS_KPIS,
} from '../fixtures/superadmin_usage_quota_requests.fixtures';
import type { ApiResponse } from '@/lib/api';
import type {
  QuotaUpgradeRequestRecord,
  QuotaRequestsKpis,
} from '../../types/SuperadminUsageQuotaRequestsTypes';
import type {
  ApproveQuotaRequestFormValues,
  RejectQuotaRequestFormValues,
} from '../../schemas/SuperadminUsageQuotaRequestsSchemas';

let inMemoryRequests: QuotaUpgradeRequestRecord[] = [...MOCK_QUOTA_REQUESTS_LIST];

export function resetMockQuotaRequests() {
  inMemoryRequests = [...MOCK_QUOTA_REQUESTS_LIST];
}

export function getMockQuotaRequestsResponse(
  search = '',
  status = 'ALL',
  resourceType = 'ALL'
): ApiResponse<QuotaUpgradeRequestRecord[]> {
  let list = [...inMemoryRequests];

  if (search.trim()) {
    const q = search.toLowerCase();
    list = list.filter(
      (r) =>
        r.libraryName.toLowerCase().includes(q) ||
        r.businessJustification.toLowerCase().includes(q) ||
        r.submittedBy.name.toLowerCase().includes(q)
    );
  }

  if (status !== 'ALL') {
    list = list.filter((r) => r.status === status);
  }

  if (resourceType !== 'ALL') {
    list = list.filter((r) => r.resourceType === resourceType);
  }

  return {
    success: true,
    data: list,
    message: 'Quota requests loaded',
    requestId: 'req-qr-list',
  };
}

export function getMockQuotaRequestsKpisResponse(): ApiResponse<QuotaRequestsKpis> {
  const pending = inMemoryRequests.filter((r) => r.status === 'PENDING').length;
  const approved = inMemoryRequests.filter((r) => r.status === 'APPROVED').length;
  const rejected = inMemoryRequests.filter((r) => r.status === 'REJECTED').length;
  const branchExp = inMemoryRequests.filter((r) => r.resourceType === 'BRANCH').length;

  return {
    success: true,
    data: {
      totalRequests: inMemoryRequests.length,
      pendingReviewCount: pending,
      approvedCount: approved,
      rejectedCount: rejected,
      branchExpansionRequestsCount: branchExp,
    },
    message: 'KPIs loaded',
    requestId: 'req-qr-kpis',
  };
}

export function handleMockApproveQuotaRequest(
  payload: ApproveQuotaRequestFormValues
): ApiResponse<QuotaUpgradeRequestRecord> {
  const index = inMemoryRequests.findIndex((r) => r.id === payload.requestId);
  if (index === -1) {
    return { success: false, data: null, message: 'Request not found', errorCode: 'NOT_FOUND' };
  }

  const updated: QuotaUpgradeRequestRecord = {
    ...inMemoryRequests[index],
    status: 'APPROVED',
    currentLimit: payload.approvedLimit,
    reviewedBy: 'SuperAdmin (active session)',
    reviewedAt: new Date().toISOString(),
    reviewNotes: payload.reviewNotes || 'Approved by SuperAdmin',
    addonFeeMonthlyInr: payload.addonFeeMonthlyInr,
  };

  inMemoryRequests[index] = updated;
  return { success: true, data: updated, message: 'Quota request approved successfully' };
}

export function handleMockRejectQuotaRequest(
  payload: RejectQuotaRequestFormValues
): ApiResponse<QuotaUpgradeRequestRecord> {
  const index = inMemoryRequests.findIndex((r) => r.id === payload.requestId);
  if (index === -1) {
    return { success: false, data: null, message: 'Request not found', errorCode: 'NOT_FOUND' };
  }

  const updated: QuotaUpgradeRequestRecord = {
    ...inMemoryRequests[index],
    status: 'REJECTED',
    reviewedBy: 'SuperAdmin (active session)',
    reviewedAt: new Date().toISOString(),
    rejectionReason: payload.rejectionReason,
  };

  inMemoryRequests[index] = updated;
  return { success: true, data: updated, message: 'Quota request rejected' };
}
