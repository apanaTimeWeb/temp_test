'use client';
import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Trash2, CheckCircle } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { DataGrid } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { DataGridCellParams, DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { AdminCouponsCoupon } from '@/app/frontend_admin/admin_members/members_coupons/schemas/AdminMembersCouponsSchema';

import { ADMIN_COUPONS_QUERY_KEYS } from '@/app/frontend_admin/admin_members/members_coupons/api/admin_members_coupons.query_keys';
import { ADMIN_COUPONS_STATUS_VALUES, ADMIN_COUPONS_UNKNOWN_STATUS, ADMIN_COUPONS_EMPTY_FORM } from '@/app/frontend_admin/admin_members/members_coupons/config/admin_members_coupons.url_config';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { useAdminMembersCouponsState, useAdminCouponsListQuery } from '@/app/frontend_admin/admin_members/members_coupons/hooks/useAdminMembersCouponsPageHooks';
import AdminCouponsOverviewSection, { formatAdminCouponsDiscount, formatAdminCouponsDate } from '@/app/frontend_admin/admin_members/members_coupons/components/AdminMembersCouponsOverviewSection';
import { displayValue } from '@/lib/display_value';
import type { AdminCouponsCreateDialogIntent, AdminCouponsCreateDialogProps } from '@/app/frontend_admin/admin_members/members_coupons/types/AdminMembersCouponsComponentTypes';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { z } from 'zod';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { createAdminCouponsFormSchema, type AdminCouponsFormOutput } from '@/app/frontend_admin/admin_members/members_coupons/schemas/AdminMembersCouponsSchema';

// Responsibility: AdminCouponsPage presentation component owned by admin_coupons; responsibility folder: admin_coupons_components_views.

// RESPONSIBILITY: Orchestrates the Coupons read query, table, KPI summary and draft validation dialog.

let nextAdminCouponsDemoSequence = 1;

/**
 * @description Owns the Coupons route query, demo-only mutable list state, and live-mode contract boundary.
 * @dependencies Uses the feature API/query-key contract and module-owned presentation components.
 * @edge-case Live mutations remain blocked until an authoritative create/delete API contract is supplied.
 */
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

  const handleCreateDemoCoupon = useCallback((values: AdminCouponsFormOutput) => {
    if (!isDemoMode) {
      toast.info(t('MUTATIONS_UNAVAILABLE'), { id: 'admin_members-members_coupons-components-AdminMembersCouponsPage-toast-50-1' });
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
      status: 'Active',
    };
    queryClient.setQueryData<AdminCouponsCoupon[]>(queryKey, (current) => [nextCoupon, ...(current ?? [])]);
    toast.success(t('DEMO_COUPON_CREATED', { code: nextCoupon.code }));
  }, [coupons.length, isDemoMode, queryClient, queryKey, t]);

  const confirmDeleteCoupon = useCallback(() => {
    if (!isDemoMode || !couponToDelete) return;
    queryClient.setQueryData<AdminCouponsCoupon[]>(queryKey, (current) => (current ?? []).filter((item) => item.id !== couponToDelete.id));
    toast.success(t('DEMO_COUPON_DELETED', { code: couponToDelete.code }));
    setCouponToDelete(null);
  }, [couponToDelete, isDemoMode, queryClient, queryKey, t]);

  const openCreateDialog = () => { setDialogIntent('create'); setShowForm(true); };
  const openDraftDialog = () => { setDialogIntent('draft'); setShowForm(true); };

  const columns = useMemo<readonly DataGridColumn<AdminCouponsCoupon>[]>(() => [
    { field: 'code', headerName: t('COLUMN_CODE'), flex: 1.5, minWidth: 150 },
    {
      field: 'discount',
      headerName: t('COLUMN_DISCOUNT'),
      flex: 1,
      minWidth: 120,
      valueFormatter: ({ data }) => formatAdminCouponsDiscount(data, locale, t('DISCOUNT_SUFFIX')),
    },
    { field: 'usedCount', headerName: t('COLUMN_USAGE'), flex: 1, minWidth: 120, valueFormatter: ({ data }) => `${displayValue(data.usedCount)}/${displayValue(data.maxUses)}` },
    { field: 'expiry', headerName: t('COLUMN_EXPIRY'), flex: 1, minWidth: 120, valueFormatter: ({ data }) => formatAdminCouponsDate(data.expiry, locale) },
    { field: 'status', headerName: t('COLUMN_STATUS'), flex: 1, minWidth: 120, cellRenderer: (params: DataGridCellParams<AdminCouponsCoupon>) => {
      const status = ADMIN_COUPONS_STATUS_VALUES.find((candidate) => candidate === params.value) ?? ADMIN_COUPONS_UNKNOWN_STATUS;
      const className = status === 'Active'
        ? 'bg-success-bg text-success-text'
        : status === 'Expired'
          ? 'bg-danger-bg text-danger-text'
          : status === 'Exhausted'
            ? 'bg-warning-bg text-warning-text'
            : 'bg-surface-highlight text-text-secondary';
      return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>{t(`STATUS_${status.toUpperCase()}`)}</span>;
    } },
    {
      headerName: t('COLUMN_ACTIONS'),
      minWidth: 115,
      sortable: false,
      cellRenderer: ({ data }) => (
        <button
          type="button"
          disabled={!isDemoMode}
          title={isDemoMode ? t('DEMO_DELETE_COUPON_TITLE', { code: data.code }) : t('MUTATIONS_UNAVAILABLE')}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:text-text-disabled"
          aria-describedby="admin-coupons-mutation-note"
          aria-label={isDemoMode ? t('DELETE_DEMO_COUPON_LABEL', { code: data.code }) : t('DELETE_UNAVAILABLE_LABEL', { code: data.code })}
          onClick={() => setCouponToDelete(data)}
        >
          <Trash2 size={18} strokeWidth={2} />
        </button>
      ),
    },
  ], [isDemoMode, locale, setCouponToDelete, t]);

  return (
    <>
      <Toaster position="bottom-right" richColors closeButton />
      <div className="space-y-6">
        <AdminCouponsOverviewSection
          isDemoMode={isDemoMode}
          onCreateCoupon={openCreateDialog}
          onValidateDraft={openDraftDialog}
          coupons={coupons}
          columns={columns}
          isError={couponsQuery.isError}
          isPending={couponsQuery.isPending}
          onRetry={() => { void couponsQuery.refetch(); }}
        />
      </div>
      <AdminCouponsDialog open={showForm} isDemoMode={isDemoMode} intent={dialogIntent} onOpenChange={setShowForm} onCreateDemoCoupon={handleCreateDemoCoupon} deleteOpen={couponToDelete !== null && isDemoMode} couponCode={couponToDelete?.code ?? ''} onDeleteOpenChange={(open) => { if (!open) setCouponToDelete(null); }} onConfirmDelete={confirmDeleteCoupon} />
    </>
  );
}

// Responsibility: AdminCouponsCreateDialog component owned by admin_coupons; responsibility folder: admin_coupons_create_dialog.

// RESPONSIBILITY: Validates a coupon draft in a shared focus-managed dialog without persisting a record.

/**
 * @description Creates a mutable in-memory coupon only in explicit demo mode; production mode validates a draft without pretending that a backend mutation occurred.
 * @dependencies Requires the ADMIN_COUPONS locale namespace and shared focus-managed dialog primitive.
 * @edge-case Live create remains unavailable until an authoritative API mutation contract is supplied.
 */
export function AdminCouponsDialog({ open, isDemoMode, intent, onOpenChange, onCreateDemoCoupon, deleteOpen = false, couponCode = '', onDeleteOpenChange = () => undefined, onConfirmDelete = () => undefined }: AdminCouponsCreateDialogProps) {
  const t = useTranslations('ADMIN_COUPONS');
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const schema = useMemo(() => createAdminCouponsFormSchema({
    codeRequired: t('VALIDATION_CODE_REQUIRED'),
    discountPositive: t('VALIDATION_DISCOUNT_POSITIVE'),
    discountPercentMax: t('VALIDATION_DISCOUNT_PERCENT_MAX'),
    typeRequired: t('VALIDATION_TYPE_REQUIRED'),
    maxUsesPositive: t('VALIDATION_MAX_USES_POSITIVE'),
    expiryRequired: t('VALIDATION_EXPIRY_REQUIRED'),
    expiryInvalid: t('VALIDATION_EXPIRY_INVALID'),
  }), [t]);
  const form = useForm<any, unknown, AdminCouponsFormOutput>({
    resolver: zodResolver(schema),
    defaultValues: ADMIN_COUPONS_EMPTY_FORM,
  });
  const { reset } = form;
  const isDirty = form.formState.isDirty;
  useEffect(() => {
    if (!isDirty || !open || form.formState.isSubmitting) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, open, form.formState.isSubmitting]);
  const requestClose = () => { if (isDirty) { setConfirmDiscard(true); return; } onOpenChange(false); };
  const discardDraft = () => { setConfirmDiscard(false); reset(ADMIN_COUPONS_EMPTY_FORM); onOpenChange(false); };
  const codeRegistration = form.register('code');

  const hasResetRef = useRef(false);
  useEffect(() => {
    if (open && !hasResetRef.current) {
      reset(ADMIN_COUPONS_EMPTY_FORM);
      hasResetRef.current = true;
    } else if (!open) {
      hasResetRef.current = false;
    }
  }, [open, reset]);

  const submit = form.handleSubmit((values) => {
    if (isDemoMode && intent === 'create') {
      onCreateDemoCoupon(values);
      onOpenChange(false);
      return;
    }
    toast.info(t('DRAFT_VALIDATED_NO_PERSISTENCE'));
  });

  return (
    <>
    <Dialog open={open} onOpenChange={(nextOpen) => { if (nextOpen) onOpenChange(true); else requestClose(); }}>
      <DialogContent className="space-y-5">
        <div className="space-y-2">
          <DialogTitle>{isDemoMode && intent === 'create' ? t('CREATE_DEMO_DIALOG_TITLE') : t('CREATE_DIALOG_TITLE')}</DialogTitle>
          <DialogDescription>{isDemoMode && intent === 'create' ? t('CREATE_DEMO_DIALOG_DESCRIPTION') : t('CREATE_DIALOG_DESCRIPTION')}</DialogDescription>
        </div>
        <form onSubmit={submit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-text-secondary" htmlFor="admin-coupon-code">{t('FIELD_CODE')}</label>
            <input id="admin-coupon-code" {...codeRegistration} ref={codeRegistration.ref} className="min-h-11 w-full rounded-md border border-border bg-input px-3 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-invalid={Boolean(form.formState.errors.code)} aria-describedby={form.formState.errors.code ? 'admin-coupon-code-error' : undefined} autoComplete="off" />
            {form.formState.errors.code?.message && <p id="admin-coupon-code-error" role="alert" className="text-caption text-danger-text">{String(form.formState.errors.code.message)}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-text-secondary" htmlFor="admin-coupon-type">{t('FIELD_DISCOUNT_TYPE')}</label>
            <select id="admin-coupon-type" {...form.register('type')} className="min-h-11 w-full rounded-md border border-border bg-input px-3 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <option value="Flat">{t('TYPE_FLAT')}</option>
              <option value="Percent">{t('TYPE_PERCENT')}</option>
            </select>
            {form.formState.errors.type?.message && <p id="admin-coupon-type-error" role="alert" className="text-caption text-danger-text">{String(form.formState.errors.type.message)}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-text-secondary" htmlFor="admin-coupon-discount">{t('FIELD_DISCOUNT_VALUE')}</label>
              <input id="admin-coupon-discount" type="number" min="0.01" step="any" {...form.register('discount')} className="min-h-11 w-full rounded-md border border-border bg-input px-3 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-invalid={Boolean(form.formState.errors.discount)} aria-describedby={form.formState.errors.discount ? 'admin-coupon-discount-error' : undefined} />
              {form.formState.errors.discount?.message && <p id="admin-coupon-discount-error" role="alert" className="text-caption text-danger-text">{String(form.formState.errors.discount.message)}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-text-secondary" htmlFor="admin-coupon-max-uses">{t('FIELD_MAX_USES')}</label>
              <input id="admin-coupon-max-uses" type="number" min="1" step="1" {...form.register('maxUses')} className="min-h-11 w-full rounded-md border border-border bg-input px-3 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-invalid={Boolean(form.formState.errors.maxUses)} aria-describedby={form.formState.errors.maxUses ? 'admin-coupon-max-uses-error' : undefined} />
              {form.formState.errors.maxUses?.message && <p id="admin-coupon-max-uses-error" role="alert" className="text-caption text-danger-text">{String(form.formState.errors.maxUses.message)}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-text-secondary" htmlFor="admin-coupon-expiry">{t('FIELD_EXPIRY')}</label>
            <input id="admin-coupon-expiry" type="date" {...form.register('expiry')} className="min-h-11 w-full rounded-md border border-border bg-input px-3 text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-invalid={Boolean(form.formState.errors.expiry)} aria-describedby={form.formState.errors.expiry ? 'admin-coupon-expiry-error' : undefined} />
            {form.formState.errors.expiry?.message && <p id="admin-coupon-expiry-error" role="alert" className="text-caption text-danger-text">{String(form.formState.errors.expiry.message)}</p>}
          </div>
          <DialogFooter className="border-t border-border pt-4">
            <button type="button" className="min-h-11 rounded-md border border-border px-4 py-2 text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={requestClose}>{t('CANCEL')}</button>
            <button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-on-primary hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <CheckCircle size={18} strokeWidth={2}/>{isDemoMode && intent === 'create' ? t('CREATE_DEMO_COUPON') : t('VALIDATE_DRAFT')}
            </button>
          </DialogFooter>
        </form>
        {confirmDiscard && <div role="alertdialog" aria-modal="true" aria-labelledby="admin-coupon-discard-title" className="rounded-lg border border-warning-bg bg-card p-4"><h3 id="admin-coupon-discard-title" className="font-semibold text-text-primary">{t('UNSAVED_CHANGES_TITLE')}</h3><p className="mt-2 text-text-secondary">{t('UNSAVED_CHANGES_DESCRIPTION')}</p><div className="mt-4 flex justify-end gap-2"><button type="button" className="min-h-11 rounded-md border border-border px-4 py-2 text-primary" onClick={() => setConfirmDiscard(false)}>{t('KEEP_EDITING')}</button><button type="button" className="min-h-11 rounded-md bg-danger px-4 py-2 text-on-danger" onClick={discardDraft}>{t('DISCARD_CHANGES')}</button></div></div>}
      </DialogContent>
    </Dialog>
    <Dialog open={deleteOpen} onOpenChange={onDeleteOpenChange}>
      <DialogContent className="space-y-5"><div className="space-y-2"><DialogTitle>{t('DELETE_DIALOG_TITLE')}</DialogTitle><DialogDescription>{t('DELETE_DIALOG_DESCRIPTION', { code: couponCode })}</DialogDescription></div>
        <DialogFooter className="border-t border-border pt-4"><button type="button" className="min-h-11 rounded-md border border-border px-4 py-2 text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => onDeleteOpenChange(false)}>{t('CANCEL')}</button><button type="button" className="min-h-11 rounded-md bg-danger px-4 py-2 font-medium text-on-danger hover:bg-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={onConfirmDelete}>{t('CONFIRM_DEMO_DELETE')}</button></DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}

export type { AdminCouponsCreateDialogProps };
