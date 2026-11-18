'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Trash2, CheckCircle, Building2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { DataGrid } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { DataGridCellParams, DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { AdminCouponsCoupon } from '@/app/frontend_admin/admin_members/members_coupons/schemas/AdminMembersCouponsSchema';

import { ADMIN_COUPONS_QUERY_KEYS } from '@/app/frontend_admin/admin_members/members_coupons/api/admin_members_coupons.query_keys';
import { ADMIN_COUPONS_STATUS_VALUES, ADMIN_COUPONS_UNKNOWN_STATUS, ADMIN_COUPONS_EMPTY_FORM } from '@/app/frontend_admin/admin_members/members_coupons/config/admin_members_coupons.url_config';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
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
  const { selectedBranch, isAllBranches } = useAdminBranch();

  const visibleCoupons = useMemo(() => {
    if (isAllBranches || !selectedBranch) return coupons;
    return coupons.filter((c) =>
      !c.branchApplicability ||
      c.branchApplicability.toLowerCase().includes('all') ||
      c.branchApplicability.toLowerCase().includes(selectedBranch.name.toLowerCase()) ||
      selectedBranch.name.toLowerCase().includes(c.branchApplicability.toLowerCase())
    );
  }, [coupons, isAllBranches, selectedBranch]);

  const handleCreateDemoCoupon = useCallback((values: AdminCouponsFormOutput) => {
    if (!isDemoMode) {
      toast.info(t('MUTATIONS_UNAVAILABLE'));
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
    { field: 'code', headerName: t('COLUMN_CODE'), flex: 1.5, minWidth: 150, sortable: true },
    {
      field: 'discount',
      headerName: t('COLUMN_DISCOUNT'),
      flex: 1,
      minWidth: 120,
      sortable: true,
      valueFormatter: ({ data }) => formatAdminCouponsDiscount(data, locale, t('DISCOUNT_SUFFIX')),
    },
    { field: 'usedCount', headerName: t('COLUMN_USAGE'), flex: 1, minWidth: 120, sortable: true, valueFormatter: ({ data }) => `${displayValue(data.usedCount)}/${displayValue(data.maxUses)}` },
    {
      field: 'branchApplicability',
      headerName: 'Applicable Branch',
      flex: 1.2,
      minWidth: 150,
      sortable: true,
      cellRenderer: ({ data }) => {
        const branch = data.branchApplicability || 'All Branches';
        const isDowntown = branch.toLowerCase().includes('downtown');
        const isWestside = branch.toLowerCase().includes('westside');
        const isNorth = branch.toLowerCase().includes('north');
        const badgeClass = isDowntown
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
          : isWestside
            ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
            : isNorth
              ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400'
              : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400';
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeClass}`}>
            <Building2 size={12} />
            {branch}
          </span>
        );
      },
    },
    { field: 'expiry', headerName: t('COLUMN_EXPIRY'), flex: 1, minWidth: 120, sortable: true, valueFormatter: ({ data }) => formatAdminCouponsDate(data.expiry, locale) },
    {
      field: 'status', headerName: t('COLUMN_STATUS'), flex: 1, minWidth: 120, sortable: true, cellRenderer: (params: DataGridCellParams<AdminCouponsCoupon>) => {
        const status = ADMIN_COUPONS_STATUS_VALUES.find((candidate) => candidate === params.value) ?? ADMIN_COUPONS_UNKNOWN_STATUS;
        const className = status === 'Active'
          ? 'bg-success-bg text-success-text'
          : status === 'Expired'
            ? 'bg-danger-bg text-danger-text'
            : status === 'Exhausted'
              ? 'bg-warning-bg text-warning-text'
              : 'bg-surface-highlight text-text-secondary';
        return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>{t(`STATUS_${status.toUpperCase()}`)}</span>;
      }
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
          coupons={visibleCoupons}
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
const COUPON_PRESETS = [
  { label: 'WELCOME50', code: 'WELCOME50', discount: 50, type: 'Percent' as const, maxUses: 100, desc: '50% First Admission' },
  { label: 'FLAT₹500', code: 'FLAT500', discount: 500, type: 'Flat' as const, maxUses: 50, desc: '₹500 Off Desk Plan' },
  { label: 'EXAMBOOST', code: 'EXAMBOOST', discount: 20, type: 'Percent' as const, maxUses: 200, desc: '20% Exam Prep Special' },
  { label: 'WESTSIDE30', code: 'WESTSIDE30', discount: 30, type: 'Percent' as const, maxUses: 80, desc: '30% Westside Launch' },
  { label: 'ANNUAL1000', code: 'ANNUAL1000', discount: 1000, type: 'Flat' as const, maxUses: 30, desc: '₹1000 Long-Term Discount' },
];

const BRANCH_OPTIONS = [
  { value: 'All Branches', label: 'All Branches', code: 'GLOBAL', desc: 'Valid across entire 3-branch network', badge: 'Global Network' },
  { value: 'Downtown Central', label: 'Downtown Central', code: 'DT-CEN', desc: 'Main City Center Hub Exclusive', badge: 'High-Demand Hub' },
  { value: 'Westside Branch', label: 'Westside Branch', code: 'WS-BR', desc: 'Suburban Hub Exclusive (Promotion)', badge: 'Growth Hub' },
  { value: 'North Hub', label: 'North Hub', code: 'NH-01', desc: 'North Campus Hub Exclusive', badge: 'Campus Hub' },
];

export function AdminCouponsDialog({ open, isDemoMode, intent, onOpenChange, onCreateDemoCoupon, deleteOpen = false, couponCode = '', onDeleteOpenChange = () => undefined, onConfirmDelete = () => undefined }: AdminCouponsCreateDialogProps) {
  const t = useTranslations('ADMIN_COUPONS');
  const { selectedBranch, isAllBranches } = useAdminBranch();
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

  useEffect(() => {
    if (open) {
      const defaultBranch = !isAllBranches && selectedBranch ? selectedBranch.name : 'All Branches';
      reset({
        ...ADMIN_COUPONS_EMPTY_FORM,
        branchApplicability: defaultBranch,
      });
    }
  }, [open, isAllBranches, selectedBranch, reset]);

  const watchedCode = form.watch('code');
  const watchedType = form.watch('type');
  const watchedDiscount = form.watch('discount');
  const watchedMaxUses = form.watch('maxUses');
  const watchedExpiry = form.watch('expiry');
  const watchedBranch = form.watch('branchApplicability') || 'All Branches';

  const applyPreset = (preset: typeof COUPON_PRESETS[0]) => {
    form.setValue('code', preset.code, { shouldDirty: true, shouldValidate: true });
    form.setValue('discount', String(preset.discount) as any, { shouldDirty: true, shouldValidate: true });
    form.setValue('type', preset.type, { shouldDirty: true, shouldValidate: true });
    form.setValue('maxUses', String(preset.maxUses) as any, { shouldDirty: true, shouldValidate: true });
  };

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
        <DialogContent className="max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
          <div className="border-b border-slate-800 pb-3">
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 size={18} className="text-indigo-400" />
              {intent === 'create' ? t('CREATE_DIALOG_TITLE') : 'Validate Coupon Draft'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 mt-1">
              {t('CREATE_DIALOG_DESCRIPTION')}
            </DialogDescription>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Quick Campaign Presets</span>
              <span className="text-[10px] text-slate-500">1-click fill code & discount</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {COUPON_PRESETS.map((p) => (
                <button
                  key={p.code}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="rounded-lg border border-slate-700/60 bg-slate-800/60 px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300 transition-colors"
                >
                  <span className="font-mono font-bold text-indigo-400">{p.label}</span>
                  <span className="text-slate-400 ml-1.5 font-normal">({p.desc})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Coupon Voucher Card Preview */}
          <div className="relative overflow-hidden rounded-2xl border border-dashed border-indigo-500/40 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/60 p-4 shadow-lg">
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-slate-900 border border-indigo-500/40" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-slate-900 border border-indigo-500/40" />
            <div className="flex items-center justify-between gap-3 px-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-extrabold tracking-widest text-indigo-300">
                    {watchedCode ? watchedCode.toUpperCase() : 'COUPONCODE'}
                  </span>
                  <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-bold text-indigo-300 uppercase">
                    {watchedType === 'Percent' ? `${watchedDiscount || 0}% OFF` : `₹${watchedDiscount || 0} OFF`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Building2 size={11} className="text-indigo-400" />
                    {watchedBranch}
                  </span>
                  <span>•</span>
                  <span>Max Uses: {watchedMaxUses || '—'}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider text-slate-500">Expires</div>
                <div className="text-xs font-semibold text-slate-300">
                  {watchedExpiry || 'No Date'}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={submit} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="admin-coupon-code">
                  {t('FIELD_CODE')}
                </label>
                <span className="text-xs text-rose-400 font-bold">*</span>
              </div>
              <input
                id="admin-coupon-code"
                {...codeRegistration}
                ref={codeRegistration.ref}
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                  codeRegistration.onChange(e);
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-sm font-mono tracking-wider font-bold text-indigo-300 uppercase placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. WELCOME50, DIWALI25"
                aria-invalid={Boolean(form.formState.errors.code)}
                aria-describedby={form.formState.errors.code ? 'admin-coupon-code-error' : undefined}
                autoComplete="off"
              />
              {typeof form.formState.errors.code?.message === 'string' && (
                <p id="admin-coupon-code-error" role="alert" className="text-xs text-rose-400 font-medium">
                  {form.formState.errors.code.message}
                </p>
              )}
            </div>

            {/* Branch Applicability Condition */}
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Target Branch Condition
                </label>
                <span className="text-[11px] text-indigo-400 font-medium">
                  Active: {watchedBranch}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {BRANCH_OPTIONS.map((b) => {
                  const isSelected = watchedBranch === b.value;
                  return (
                    <button
                      key={b.value}
                      type="button"
                      onClick={() => form.setValue('branchApplicability', b.value, { shouldDirty: true })}
                      className={`flex flex-col text-left rounded-lg border p-2.5 transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500/20 text-indigo-200 shadow-sm shadow-indigo-500/20'
                          : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold leading-tight">{b.label}</span>
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{b.code}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1">{b.desc}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Branch Condition Explanation Box */}
              <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-2.5 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-indigo-300 text-[11px]">
                  <Building2 size={12} />
                  <span>Branch Condition Policy</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed mt-1">
                  {watchedBranch === 'All Branches'
                    ? '🌐 Global Network: This coupon can be redeemed across all 3 library branches (Downtown Central, Westside Branch, and North Hub) for any student seat or plan checkout.'
                    : `📍 Branch-Exclusive: This coupon code is strictly restricted to "${watchedBranch}". Students enrolling or renewing seats at other branches cannot apply this code.`}
                </p>
              </div>
            </div>

            {/* Discount Type & Value */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="admin-coupon-type">
                  {t('FIELD_DISCOUNT_TYPE')}
                </label>
                <select
                  id="admin-coupon-type"
                  {...form.register('type')}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Flat">Flat Discount (₹ Amount Off)</option>
                  <option value="Percent">Percentage (% Off)</option>
                </select>
                {typeof form.formState.errors.type?.message === 'string' && (
                  <p id="admin-coupon-type-error" role="alert" className="text-xs text-rose-400">
                    {form.formState.errors.type.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="admin-coupon-discount">
                    {t('FIELD_DISCOUNT_VALUE')}
                  </label>
                  <span className="text-xs text-rose-400 font-bold">*</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">
                    {form.watch('type') === 'Percent' ? '%' : '₹'}
                  </span>
                  <input
                    id="admin-coupon-discount"
                    type="number"
                    min="0.01"
                    step="any"
                    {...form.register('discount')}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 pl-7 pr-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
                    placeholder={form.watch('type') === 'Percent' ? '15' : '500'}
                    aria-invalid={Boolean(form.formState.errors.discount)}
                  />
                </div>
                {typeof form.formState.errors.discount?.message === 'string' && (
                  <p id="admin-coupon-discount-error" role="alert" className="text-xs text-rose-400">
                    {form.formState.errors.discount.message}
                  </p>
                )}
              </div>
            </div>

            {/* Max Uses & Expiry */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="admin-coupon-max-uses">
                    {t('FIELD_MAX_USES')}
                  </label>
                  <span className="text-xs text-rose-400 font-bold">*</span>
                </div>
                <input
                  id="admin-coupon-max-uses"
                  type="number"
                  min="1"
                  step="1"
                  {...form.register('maxUses')}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
                  placeholder="50"
                  aria-invalid={Boolean(form.formState.errors.maxUses)}
                />
                {typeof form.formState.errors.maxUses?.message === 'string' && (
                  <p id="admin-coupon-max-uses-error" role="alert" className="text-xs text-rose-400">
                    {form.formState.errors.maxUses.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="admin-coupon-expiry">
                    {t('FIELD_EXPIRY')}
                  </label>
                  <span className="text-xs text-rose-400 font-bold">*</span>
                </div>
                <input
                  id="admin-coupon-expiry"
                  type="date"
                  {...form.register('expiry')}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  aria-invalid={Boolean(form.formState.errors.expiry)}
                />
                {typeof form.formState.errors.expiry?.message === 'string' && (
                  <p id="admin-coupon-expiry-error" role="alert" className="text-xs text-rose-400">
                    {form.formState.errors.expiry.message}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="border-t border-slate-800 pt-4 flex items-center justify-end gap-2.5">
              <button
                type="button"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                onClick={requestClose}
              >
                {t('CANCEL')}
              </button>
              <button
                type="submit"
                aria-label={isDemoMode && intent === 'create' ? t('CREATE_DEMO_COUPON') : t('VALIDATE_DRAFT')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <CheckCircle size={15} strokeWidth={2} />
                <span>{intent === 'create' ? t('CREATE_COUPON') : t('VALIDATE_DRAFT')}</span>
              </button>
            </DialogFooter>
          </form>

          {confirmDiscard && (
            <div role="alertdialog" aria-modal="true" aria-labelledby="admin-coupon-discard-title" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <h3 id="admin-coupon-discard-title" className="text-xs font-bold text-amber-300">
                {t('UNSAVED_CHANGES_TITLE')}
              </h3>
              <p className="mt-1 text-xs text-slate-300">{t('UNSAVED_CHANGES_DESCRIPTION')}</p>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                  onClick={() => setConfirmDiscard(false)}
                >
                  {t('KEEP_EDITING')}
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500"
                  onClick={discardDraft}
                >
                  {t('DISCARD_CHANGES')}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={deleteOpen} onOpenChange={onDeleteOpenChange}>
        <DialogContent className="space-y-5"><div className="space-y-2"><DialogTitle>{t('DELETE_DIALOG_TITLE')}</DialogTitle><DialogDescription>{t('DELETE_DIALOG_DESCRIPTION', { code: couponCode })}</DialogDescription></div>
          <DialogFooter className="border-t border-border pt-4">
            <button type="button" className="min-h-11 rounded-md border border-border px-4 py-2 text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => onDeleteOpenChange(false)}>{t('CANCEL')}</button>
            <button
              type="button"
              aria-label={t('CONFIRM_DEMO_DELETE')}
              className="min-h-11 rounded-md bg-danger px-4 py-2 font-medium text-on-danger hover:bg-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={onConfirmDelete}
            >
              Delete Coupon
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export type { AdminCouponsCreateDialogProps };
