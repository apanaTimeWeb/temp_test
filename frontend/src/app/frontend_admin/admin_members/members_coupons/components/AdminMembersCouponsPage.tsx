'use client';

import { ADMIN_COUPONS_QUERY_KEYS } from '@/app/frontend_admin/admin_members/members_coupons/api/admin_members_coupons.query_keys';
import { AdminCouponsDialog } from '@/app/frontend_admin/admin_members/members_coupons/components/AdminMembersCouponsDialog';
import AdminCouponsOverviewSection, {
  formatAdminCouponsDate,
  formatAdminCouponsDiscount,
} from '@/app/frontend_admin/admin_members/members_coupons/components/AdminMembersCouponsOverviewSection';
import {
  ADMIN_COUPONS_STATUS_VALUES,
  ADMIN_COUPONS_UNKNOWN_STATUS,
} from '@/app/frontend_admin/admin_members/members_coupons/config/admin_members_coupons.url_config';
import {
  useAdminCouponsListQuery,
  useAdminMembersCouponsState,
} from '@/app/frontend_admin/admin_members/members_coupons/hooks/useAdminMembersCouponsPageHooks';
import type {
  AdminCouponsCoupon,
  AdminCouponsFormOutput,
} from '@/app/frontend_admin/admin_members/members_coupons/schemas/AdminMembersCouponsSchema';
import type {
  AdminCouponsCreateDialogIntent,
  AdminCouponsCreateDialogProps,
} from '@/app/frontend_admin/admin_members/members_coupons/types/AdminMembersCouponsComponentTypes';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import type { DataGridCellParams, DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { displayValue } from '@/lib/display_value';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { useQueryClient } from '@tanstack/react-query';
import { Building2, Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';
import { Toaster, toast } from 'sonner';

export { AdminCouponsDialog };
export type { AdminCouponsCreateDialogProps };

let nextAdminCouponsDemoSequence = 1;

/** Owns the Coupons route query, demo-only mutable list state, and live-mode contract boundary. */
export default function AdminCouponsPage() {
  const t = useTranslations('ADMIN_COUPONS');
  const locale = useLocale();
  const isDemoMode = isFrontendDemoModeEnabled();
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ADMIN_COUPONS_QUERY_KEYS.list({ mode: isDemoMode ? 'demo' : 'live' }), [isDemoMode]);
  const { showForm, setShowForm } = useAdminMembersCouponsState();
  const [dialogIntent, setDialogIntent] = useState<AdminCouponsCreateDialogIntent>('draft');
  const [couponToDelete, setCouponToDelete] = useState<AdminCouponsCoupon | null>(null);
  const couponsQuery = useAdminCouponsListQuery();
  const coupons = couponsQuery.data ?? [];
  const { selectedBranch, isAllBranches } = useAdminBranch();

  const visibleCoupons = useMemo(() => {
    if (isAllBranches || !selectedBranch) return coupons;
    return coupons.filter(
      (c) =>
        !c.branchApplicability ||
        c.branchApplicability.toLowerCase().includes('all') ||
        c.branchApplicability.toLowerCase().includes(selectedBranch.name.toLowerCase()) ||
        selectedBranch.name.toLowerCase().includes(c.branchApplicability.toLowerCase()),
    );
  }, [coupons, isAllBranches, selectedBranch]);

  const handleCreateDemoCoupon = useCallback(
    (values: AdminCouponsFormOutput) => {
      if (!isDemoMode) {
        toast.info(t('MUTATIONS_UNAVAILABLE'), { id: 'admin-coupons-mutations-unavailable' });
        return;
      }
      const nextCoupon: AdminCouponsCoupon = {
        id: `demo-coupon-${Date.now()}-${nextAdminCouponsDemoSequence++}`,
        code: values.code.trim().toUpperCase(),
        discount: values.discount,
        type: values.type,
        usedCount: 0,
        maxUses: values.maxUses,
        expiry: values.expiry,
        branchApplicability: values.branchApplicability || 'All Branches',
        status: 'Active',
      };
      queryClient.setQueryData<AdminCouponsCoupon[]>(queryKey, (current) => [nextCoupon, ...(current ?? [])]);
      toast.success(t('DEMO_COUPON_CREATED', { code: nextCoupon.code }), { id: 'admin-coupons-created' });
    },
    [isDemoMode, queryClient, queryKey, t],
  );

  const confirmDeleteCoupon = useCallback(() => {
    if (!isDemoMode || !couponToDelete) return;
    queryClient.setQueryData<AdminCouponsCoupon[]>(queryKey, (current) => (current ?? []).filter((item) => item.id !== couponToDelete.id));
    toast.success(t('DEMO_COUPON_DELETED', { code: couponToDelete.code }), { id: 'admin-coupons-deleted' });
    setCouponToDelete(null);
  }, [couponToDelete, isDemoMode, queryClient, queryKey, t]);

  const openCreateDialog = () => {
    setDialogIntent('create');
    setShowForm(true);
  };
  const openDraftDialog = () => {
    setDialogIntent('draft');
    setShowForm(true);
  };

  const columns = useMemo<readonly DataGridColumn<AdminCouponsCoupon>[]>(() => [
    { field: 'code', headerName: t('COLUMN_CODE'), flex: 1.5, minWidth: 150, sortable: true },
    {
      field: 'discount',
      headerName: t('COLUMN_DISCOUNT'),
      flex: 1,
      minWidth: 120,
      sortable: true,
      valueFormatter: ({ data }) => formatAdminCouponsDiscount(data, locale, t('DISCOUNT_SUFFIX')),
    },
    {
      field: 'usedCount',
      headerName: t('COLUMN_USAGE'),
      flex: 1,
      minWidth: 120,
      sortable: true,
      valueFormatter: ({ data }) => `${displayValue(data.usedCount)}/${displayValue(data.maxUses)}`,
    },
    {
      field: 'branchApplicability',
      headerName: 'Applicable Branch',
      flex: 1.2,
      minWidth: 150,
      sortable: true,
      cellRenderer: ({ data }) => {
        const branch = data.branchApplicability || 'All Branches';
        const lower = branch.toLowerCase();
        const badgeClass = lower.includes('downtown')
          ? 'border-success bg-success-bg text-success-text'
          : lower.includes('westside')
            ? 'border-warning bg-warning-bg text-warning-text'
            : lower.includes('north')
              ? 'border-border-focus bg-primary-subtle text-primary'
              : 'border-info bg-info-bg text-info-text';
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeClass}`}>
            <Building2 size={12} aria-hidden="true" />
            {branch}
          </span>
        );
      },
    },
    {
      field: 'expiry',
      headerName: t('COLUMN_EXPIRY'),
      flex: 1,
      minWidth: 120,
      sortable: true,
      valueFormatter: ({ data }) => formatAdminCouponsDate(data.expiry, locale),
    },
    {
      field: 'status',
      headerName: t('COLUMN_STATUS'),
      flex: 1,
      minWidth: 120,
      sortable: true,
      cellRenderer: (params: DataGridCellParams<AdminCouponsCoupon>) => {
        const status = ADMIN_COUPONS_STATUS_VALUES.find((candidate) => candidate === params.value) ?? ADMIN_COUPONS_UNKNOWN_STATUS;
        const className =
          status === 'Active'
            ? 'bg-success-bg text-success-text'
            : status === 'Expired'
              ? 'bg-danger-bg text-danger-text'
              : status === 'Exhausted'
                ? 'bg-warning-bg text-warning-text'
                : 'bg-surface-highlight text-text-secondary';
        return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>{t(`STATUS_${status.toUpperCase()}`)}</span>;
      },
    },
    {
      headerName: t('COLUMN_ACTIONS'),
      minWidth: 115,
      sortable: false,
      cellRenderer: ({ data }) => (
        <button
          type="button"
          disabled={!isDemoMode}
          title={isDemoMode ? t('DEMO_DELETE_COUPON_TITLE', { code: data.code }) : t('MUTATIONS_UNAVAILABLE')}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-text-secondary hover:text-danger-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:text-text-disabled"
          aria-describedby="admin-coupons-mutation-note"
          aria-label={isDemoMode ? t('DELETE_DEMO_COUPON_LABEL', { code: data.code }) : t('DELETE_UNAVAILABLE_LABEL', { code: data.code })}
          onClick={() => setCouponToDelete(data)}
        >
          <Trash2 size={18} strokeWidth={2} aria-hidden="true" />
        </button>
      ),
    },
  ], [isDemoMode, locale, t]);

  return (
    <>
      <Toaster position="bottom-right" richColors closeButton />
      <div className="space-y-6">
        <AdminCouponsOverviewSection
          isDemoMode={isDemoMode}
          onCreateCoupon={openCreateDialog}
          onValidateDraft={openDraftDialog}
          coupons={visibleCoupons}
          columns={columns}
          isError={couponsQuery.isError}
          isPending={couponsQuery.isPending}
          onRetry={() => { void couponsQuery.refetch(); }}
        />
      </div>
      <AdminCouponsDialog
        open={showForm}
        isDemoMode={isDemoMode}
        intent={dialogIntent}
        onOpenChange={setShowForm}
        onCreateDemoCoupon={handleCreateDemoCoupon}
        deleteOpen={couponToDelete !== null && isDemoMode}
        couponCode={couponToDelete?.code ?? ''}
        onDeleteOpenChange={(open) => { if (!open) setCouponToDelete(null); }}
        onConfirmDelete={confirmDeleteCoupon}
      />
    </>
  );
}
