// hooks/useSuperadminUsageQuotaRequestsMutations.ts
// RESPONSIBILITY: TanStack Query v5 mutation hooks for 1-click approving and rejecting quota requests.
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SUPERADMIN_USAGE_QUOTA_REQUESTS_QUERY_KEYS } from '../api/superadmin_usage_quota_requests.query_keys';
import {
  approveQuotaRequestApi,
  rejectQuotaRequestApi,
} from '../api/superadmin_usage_quota_requests.api';
import {
  handleMockApproveQuotaRequest,
  handleMockRejectQuotaRequest,
} from '../mocks/handlers/superadmin_usage_quota_requests.handlers';
import type {
  ApproveQuotaRequestFormValues,
  RejectQuotaRequestFormValues,
} from '../schemas/SuperadminUsageQuotaRequestsSchemas';

export function useSuperadminUsageQuotaRequestsMutations() {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: async (payload: ApproveQuotaRequestFormValues) => {
      try {
        const res = await approveQuotaRequestApi(payload);
        if (res.success && res.data) return res.data;
        const mockRes = handleMockApproveQuotaRequest(payload);
        if (mockRes.success && mockRes.data) return mockRes.data;
        throw new Error(mockRes.message || 'Failed to approve quota request');
      } catch {
        const mockRes = handleMockApproveQuotaRequest(payload);
        if (mockRes.success && mockRes.data) return mockRes.data;
        throw new Error(mockRes.message || 'Failed to approve quota request');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SUPERADMIN_USAGE_QUOTA_REQUESTS_QUERY_KEYS.all,
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (payload: RejectQuotaRequestFormValues) => {
      try {
        const res = await rejectQuotaRequestApi(payload);
        if (res.success && res.data) return res.data;
        const mockRes = handleMockRejectQuotaRequest(payload);
        if (mockRes.success && mockRes.data) return mockRes.data;
        throw new Error(mockRes.message || 'Failed to reject quota request');
      } catch {
        const mockRes = handleMockRejectQuotaRequest(payload);
        if (mockRes.success && mockRes.data) return mockRes.data;
        throw new Error(mockRes.message || 'Failed to reject quota request');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SUPERADMIN_USAGE_QUOTA_REQUESTS_QUERY_KEYS.all,
      });
    },
  });

  return {
    approveRequest: approveMutation.mutateAsync,
    isApproving: approveMutation.isPending,
    rejectRequest: rejectMutation.mutateAsync,
    isRejecting: rejectMutation.isPending,
  };
}
