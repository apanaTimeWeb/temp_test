// hooks/useAdminAssetsRegisterMutations.ts
'use client';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import {
  createAdminAsset,
  updateAdminAssetAmc,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/api/admin_assets_register.api';
import type {
  CreateAssetPayload,
  UpdateAmcPayload,
  AdminAssetRecord,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterTypes';

export function useAdminAssetsRegisterMutations(
  onAssetAdded: (asset: AdminAssetRecord) => void,
  onAssetUpdated: (id: string, updates: Partial<AdminAssetRecord>) => void
) {
  const t = useTranslations('ADMIN_ASSETS_REGISTER');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateAsset = useCallback(
    async (payload: CreateAssetPayload) => {
      setIsSubmitting(true);
      try {
        if (isFrontendDemoModeEnabled()) {
          const newAsset: AdminAssetRecord = {
            id: `ast-demo-${Date.now()}`,
            assetCode: payload.assetCode,
            name: payload.name,
            category: payload.category,
            branchId: payload.branchId,
            branchName: payload.branchName,
            locationWithinBranch: payload.locationWithinBranch,
            purchaseDate: payload.purchaseDate,
            purchaseCost: payload.purchaseCost,
            currentBookValue: payload.purchaseCost,
            vendorName: payload.vendorName,
            vendorContact: payload.vendorContact,
            warrantyExpiryDate: payload.warrantyExpiryDate,
            amcStatus: payload.amcStatus,
            amcVendorName: payload.amcVendorName ?? null,
            amcVendorContact: payload.amcVendorContact ?? null,
            amcExpiryDate: payload.amcExpiryDate ?? null,
            lastServiceDate: null,
            nextScheduledServiceDate: null,
            status: 'OPERATIONAL',
            serialNumber: payload.serialNumber ?? null,
            notes: payload.notes ?? null,
          };
          onAssetAdded(newAsset);
          toast.success(t('MODAL_ADD.SUCCESS_TOAST', { code: payload.assetCode }), {
            id: `asset-create-${payload.assetCode}`,
          });
          return true;
        }

        const created = await createAdminAsset(payload);
        onAssetAdded(created);
        toast.success(t('MODAL_ADD.SUCCESS_TOAST', { code: payload.assetCode }), {
          id: `asset-create-${payload.assetCode}`,
        });
        return true;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to register asset', {
          id: `asset-create-err-${payload.assetCode}`,
        });
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onAssetAdded, t]
  );

  const handleUpdateAmc = useCallback(
    async (payload: UpdateAmcPayload) => {
      setIsSubmitting(true);
      try {
        if (isFrontendDemoModeEnabled()) {
          onAssetUpdated(payload.assetId, {
            amcStatus: payload.amcStatus,
            amcVendorName: payload.amcVendorName,
            amcVendorContact: payload.amcVendorContact,
            amcExpiryDate: payload.amcExpiryDate,
            nextScheduledServiceDate: payload.nextScheduledServiceDate ?? null,
            notes: payload.notes,
          });
          toast.success(t('MODAL_AMC.SUCCESS_TOAST', { name: payload.amcVendorName }), {
            id: `asset-amc-${payload.assetId}`,
          });
          return true;
        }

        const updated = await updateAdminAssetAmc(payload);
        onAssetUpdated(payload.assetId, updated);
        toast.success(t('MODAL_AMC.SUCCESS_TOAST', { name: payload.amcVendorName }), {
          id: `asset-amc-${payload.assetId}`,
        });
        return true;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to update AMC contract', {
          id: `asset-amc-err-${payload.assetId}`,
        });
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onAssetUpdated, t]
  );

  return {
    isSubmitting,
    handleCreateAsset,
    handleUpdateAmc,
  };
}

