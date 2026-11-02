// hooks/useAdminAccountsDailySettlementMutations.ts
'use client';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import {
  approveDailySettlement,
  flagSettlementDiscrepancy,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/api/admin_accounts_daily_settlement.api';
import type {
  ApproveSettlementPayload,
  FlagDiscrepancyPayload,
  DailySettlementRecord,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';

export function useAdminAccountsDailySettlementMutations(
  onRecordUpdated: (id: string, updates: Partial<DailySettlementRecord>) => void
) {
  const t = useTranslations('ADMIN_ACCOUNTS_DAILY_SETTLEMENT');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = useCallback(
    async (payload: ApproveSettlementPayload) => {
      setIsSubmitting(true);
      try {
        if (isFrontendDemoModeEnabled()) {
          onRecordUpdated(payload.settlementId, {
            status: 'APPROVED',
            approvedAt: new Date().toISOString(),
            approvedBy: 'Admin (Demo)',
            adminNotes: payload.adminNotes ?? 'Verified and approved.',
          });
          toast.success(t('MODAL_APPROVE.SUCCESS_TOAST', { id: payload.settlementId }), {
            id: `settlement-approve-${payload.settlementId}`,
          });
          return true;
        }

        const updated = await approveDailySettlement(payload);
        onRecordUpdated(payload.settlementId, updated);
        toast.success(t('MODAL_APPROVE.SUCCESS_TOAST', { id: payload.settlementId }), {
          id: `settlement-approve-${payload.settlementId}`,
        });
        return true;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to approve settlement', {
          id: `settlement-approve-err-${payload.settlementId}`,
        });
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onRecordUpdated, t]
  );

  const handleFlagDiscrepancy = useCallback(
    async (payload: FlagDiscrepancyPayload) => {
      setIsSubmitting(true);
      try {
        if (isFrontendDemoModeEnabled()) {
          onRecordUpdated(payload.settlementId, {
            status: 'DISCREPANCY_FLAGGED',
            adminNotes: `[${payload.discrepancyReason}] ${payload.adminNotes}`,
          });
          toast.success(t('MODAL_FLAG.SUCCESS_TOAST', { id: payload.settlementId }), {
            id: `settlement-flag-${payload.settlementId}`,
          });
          return true;
        }

        const updated = await flagSettlementDiscrepancy(payload);
        onRecordUpdated(payload.settlementId, updated);
        toast.success(t('MODAL_FLAG.SUCCESS_TOAST', { id: payload.settlementId }), {
          id: `settlement-flag-${payload.settlementId}`,
        });
        return true;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to flag discrepancy', {
          id: `settlement-flag-err-${payload.settlementId}`,
        });
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onRecordUpdated, t]
  );

  return {
    isSubmitting,
    handleApprove,
    handleFlagDiscrepancy,
  };
}

