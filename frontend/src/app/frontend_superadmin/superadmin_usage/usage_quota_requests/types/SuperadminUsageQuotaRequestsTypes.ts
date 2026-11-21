// types/SuperadminUsageQuotaRequestsTypes.ts
// RESPONSIBILITY: Type definitions for SuperAdmin Quota Expansion & Upgrade Requests.

export type QuotaRequestResourceType =
  | 'BRANCH'
  | 'ADMIN'
  | 'STAFF'
  | 'MEMBER'
  | 'STORAGE'
  | 'SMS'
  | 'WHATSAPP'
  | 'API';

export type QuotaRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface QuotaUpgradeRequestRecord {
  id: string;
  libraryId: string;
  libraryName: string;
  planName: string;
  resourceType: QuotaRequestResourceType;
  currentUsage: number;
  currentLimit: number;
  requestedLimit: number;
  unit: string;
  businessJustification: string;
  submittedBy: {
    name: string;
    email: string;
    role: string;
  };
  submittedAt: string;
  status: QuotaRequestStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  addonFeeMonthlyInr?: number;
}

export interface QuotaRequestsKpis {
  totalRequests: number;
  pendingReviewCount: number;
  approvedCount: number;
  rejectedCount: number;
  branchExpansionRequestsCount: number;
}

export interface QuotaRequestsFilterState {
  search: string;
  status: 'ALL' | QuotaRequestStatus;
  resourceType: 'ALL' | QuotaRequestResourceType;
}
