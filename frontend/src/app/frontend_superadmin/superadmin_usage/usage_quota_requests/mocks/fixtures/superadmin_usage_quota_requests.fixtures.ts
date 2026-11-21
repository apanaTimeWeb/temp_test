// mocks/fixtures/superadmin_usage_quota_requests.fixtures.ts
import type {
  QuotaUpgradeRequestRecord,
  QuotaRequestsKpis,
} from '../../types/SuperadminUsageQuotaRequestsTypes';

export const MOCK_QUOTA_REQUESTS_LIST: QuotaUpgradeRequestRecord[] = [
  {
    id: 'req-nalanda-branch-4',
    libraryId: 'lib-3',
    libraryName: 'Nalanda Digital Study Center',
    planName: 'Enterprise (Tier 1)',
    resourceType: 'BRANCH',
    currentUsage: 3,
    currentLimit: 3,
    requestedLimit: 4,
    unit: 'branches',
    businessJustification:
      'Attempted to provision 4th branch at Vigyan Nagar expansion campus, but creation was blocked due to 3/3 plan limit. Requesting 1 supplemental branch quota.',
    submittedBy: {
      name: 'Rajesh Meena',
      email: 'rajesh@nalandastudy.invalid',
      role: 'Library SuperAdmin',
    },
    submittedAt: '2026-11-21T09:30:00Z',
    status: 'PENDING',
    addonFeeMonthlyInr: 1500,
  },
  {
    id: 'req-patna-branch-4',
    libraryId: 'lib-patna-central',
    libraryName: 'Patna Central Reading Rooms',
    planName: 'Basic Plan',
    resourceType: 'BRANCH',
    currentUsage: 3,
    currentLimit: 3,
    requestedLimit: 4,
    unit: 'branches',
    businessJustification:
      'Opening Bailey Road reading annex for 80 students. Plan has 3 branches max and is fully utilized. Requesting 1 extra branch slot.',
    submittedBy: {
      name: 'Sunil Kumar',
      email: 'sunil@patnacentral.invalid',
      role: 'Managing Director',
    },
    submittedAt: '2026-11-20T16:15:00Z',
    status: 'PENDING',
    addonFeeMonthlyInr: 1500,
  },
  {
    id: 'req-apex-storage-50',
    libraryId: 'lib-apex-group',
    libraryName: 'Apex Study Library Group',
    planName: 'Pro Plan',
    resourceType: 'STORAGE',
    currentUsage: 24,
    currentLimit: 25,
    requestedLimit: 50,
    unit: 'GB',
    businessJustification:
      'Digital student ID badges and verification document uploads reached 24 GB of 25 GB limit. Upgrading cloud document storage ceiling.',
    submittedBy: {
      name: 'Amit Saxena',
      email: 'amit@apexlib.invalid',
      role: 'Chief Operations Officer',
    },
    submittedAt: '2026-11-18T11:00:00Z',
    status: 'APPROVED',
    reviewedBy: 'SuperAdmin System',
    reviewedAt: '2026-11-18T14:20:00Z',
    reviewNotes: 'Approved with standard ₹800/mo storage add-on.',
    addonFeeMonthlyInr: 800,
  },
  {
    id: 'req-gyansagar-sms-10k',
    libraryId: 'lib-2',
    libraryName: 'Gyan Sagar Learning Hub',
    planName: 'Pro Multi-Branch',
    resourceType: 'SMS',
    currentUsage: 4920,
    currentLimit: 5000,
    requestedLimit: 10000,
    unit: 'credits',
    businessJustification:
      'Exam season notification broadcasts exhausted 98% of monthly SMS balance.',
    submittedBy: {
      name: 'Ramesh Gupta',
      email: 'ramesh@gyansagar.invalid',
      role: 'Admin',
    },
    submittedAt: '2026-11-17T08:45:00Z',
    status: 'REJECTED',
    reviewedBy: 'SuperAdmin Compliance',
    reviewedAt: '2026-11-17T12:00:00Z',
    rejectionReason:
      'Please switch to WhatsApp Business API notification templates which are 70% cheaper than SMS broadcasts.',
  },
];

export const MOCK_QUOTA_REQUESTS_KPIS: QuotaRequestsKpis = {
  totalRequests: 4,
  pendingReviewCount: 2,
  approvedCount: 1,
  rejectedCount: 1,
  branchExpansionRequestsCount: 2,
};
