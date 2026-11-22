// frontend/src/app/frontend_superadmin/superadmin_data/data_archive_retention/hooks/useSuperadminDataArchiveRetention.ts
/**
 * @file useSuperadminDataArchiveRetention.ts
 * @description Hook managing data queries and mutations for Retention Policies (Feature 8)
 * and Data Archive Catalog (Feature 7).
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { superadminDataArchiveRetentionKeys } from '../api/superadmin_data_archive_retention.query_keys';
import {
  fetchArchiveOverview,
  fetchRetentionRules,
  updateRetentionRule,
  fetchArchivedRecords,
  unarchiveRecord,
  toggleLegalHold,
} from '../api/superadmin_data_archive_retention.api';
import { useSuperadminDataArchiveRetentionStore } from '../state/useSuperadminDataArchiveRetentionStore';
import type { UpdateRetentionRulePayload } from '../types/superadmin_data_archive_retention.types';

export function useSuperadminDataArchiveRetention() {
  const queryClient = useQueryClient();
  const {
    selectedRule,
    isRuleModalOpen,
    filterEntityType,
    filterTier,
    openRuleModal,
    closeRuleModal,
    setFilterEntityType,
    setFilterTier,
    resetFilters,
  } = useSuperadminDataArchiveRetentionStore();

  const overviewQuery = useQuery({
    queryKey: superadminDataArchiveRetentionKeys.overview(),
    queryFn: fetchArchiveOverview,
    staleTime: 60 * 1000,
  });

  const rulesQuery = useQuery({
    queryKey: superadminDataArchiveRetentionKeys.rules(),
    queryFn: fetchRetentionRules,
    staleTime: 30 * 1000,
  });

  const recordsQuery = useQuery({
    queryKey: superadminDataArchiveRetentionKeys.records({ entityType: filterEntityType, storageTier: filterTier }),
    queryFn: () => fetchArchivedRecords({ entityType: filterEntityType, storageTier: filterTier }),
    staleTime: 30 * 1000,
  });

  const updateRuleMutation = useMutation({
    mutationFn: (payload: UpdateRetentionRulePayload) => updateRetentionRule(payload),
    onSuccess: () => {
      closeRuleModal();
      queryClient.invalidateQueries({ queryKey: superadminDataArchiveRetentionKeys.rules() });
      queryClient.invalidateQueries({ queryKey: superadminDataArchiveRetentionKeys.overview() });
    },
  });

  const unarchiveMutation = useMutation({
    mutationFn: (id: string) => unarchiveRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: superadminDataArchiveRetentionKeys.records() });
      queryClient.invalidateQueries({ queryKey: superadminDataArchiveRetentionKeys.overview() });
    },
  });

  const legalHoldMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      toggleLegalHold(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: superadminDataArchiveRetentionKeys.records() });
      queryClient.invalidateQueries({ queryKey: superadminDataArchiveRetentionKeys.overview() });
      queryClient.invalidateQueries({ queryKey: superadminDataArchiveRetentionKeys.rules() });
    },
  });

  return {
    overview: overviewQuery.data,
    isOverviewPending: overviewQuery.isPending,
    overviewError: overviewQuery.error,

    rules: rulesQuery.data ?? [],
    isRulesPending: rulesQuery.isPending,
    rulesError: rulesQuery.error,

    records: recordsQuery.data ?? [],
    isRecordsPending: recordsQuery.isPending,
    recordsError: recordsQuery.error,

    updateRule: updateRuleMutation.mutate,
    isUpdatingRule: updateRuleMutation.isPending,
    updateRuleError: updateRuleMutation.error,

    unarchiveRecord: unarchiveMutation.mutate,
    isUnarchiving: unarchiveMutation.isPending,

    toggleLegalHold: legalHoldMutation.mutate,
    isTogglingLegalHold: legalHoldMutation.isPending,

    // Store state & controls
    selectedRule,
    isRuleModalOpen,
    filterEntityType,
    filterTier,
    openRuleModal,
    closeRuleModal,
    setFilterEntityType,
    setFilterTier,
    resetFilters,
  };
}
