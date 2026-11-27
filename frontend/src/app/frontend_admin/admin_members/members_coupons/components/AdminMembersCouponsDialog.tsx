'use client';

import { ADMIN_COUPONS_EMPTY_FORM } from '@/app/frontend_admin/admin_members/members_coupons/config/admin_members_coupons.url_config';
import { createAdminCouponsFormSchema, type AdminCouponsFormValues } from '@/app/frontend_admin/admin_members/members_coupons/schemas/AdminMembersCouponsSchema';
import type { AdminCouponsCreateDialogProps } from '@/app/frontend_admin/admin_members/members_coupons/types/AdminMembersCouponsComponentTypes';
import { getAdminMembersCouponsCurrencySymbol } from '@/app/frontend_admin/admin_members/members_coupons/utils/formatAdminMembersCouponsCurrency';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, CheckCircle } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const COUPON_PRESETS = [
  { label: 'WELCOME50', code: 'WELCOME50', discount: 50, type: 'Percent' as const, maxUses: 100, desc: '50% First Admission' },
  { label: 'FLAT₹500', code: 'FLAT500', discount: 500, type: 'Flat' as const, maxUses: 50, desc: '₹500 Off Desk Plan' },
  { label: 'EXAMBOOST', code: 'EXAMBOOST', discount: 20, type: 'Percent' as const, maxUses: 200, desc: '20% Exam Prep Special' },
  { label: 'WESTSIDE30', code: 'WESTSIDE30', discount: 30, type: 'Percent' as const, maxUses: 80, desc: '30% Westside Launch' },
  { label: 'ANNUAL1000', code: 'ANNUAL1000', discount: 1000, type: 'Flat' as const, maxUses: 30, desc: '₹1000 Long-Term Discount' },
];

const BRANCH_OPTIONS = [
  { value: 'All Branches', label: 'All Branches', code: 'GLOBAL', desc: 'Valid across entire network', badge: 'Global Network' },
  { value: 'Downtown Central', label: 'Downtown Central', code: 'DT-CEN', desc: 'Main City Center Hub Exclusive', badge: 'High-Demand Hub' },
  { value: 'Westside Branch', label: 'Westside Branch', code: 'WS-BR', desc: 'Suburban Hub Exclusive', badge: 'Growth Hub' },
  { value: 'North Hub', label: 'North Hub', code: 'NH-01', desc: 'North Campus Hub Exclusive', badge: 'Campus Hub' },
];

export function AdminCouponsDialog({
  open,
  isDemoMode,
  intent,
  onOpenChange,
  onCreateDemoCoupon,
  deleteOpen = false,
  couponCode = '',
  onDeleteOpenChange = () => undefined,
  onConfirmDelete = () => undefined,
}: AdminCouponsCreateDialogProps) {
  const t = useTranslations('ADMIN_COUPONS');
  const currencySymbol = getAdminMembersCouponsCurrencySymbol(useLocale());
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

  const form = useForm<AdminCouponsFormValues>({
    resolver: zodResolver(schema),
    defaultValues: ADMIN_COUPONS_EMPTY_FORM,
  });

  const { reset, formState: { isDirty, isSubmitting, errors } } = form;

  useEffect(() => {
    if (!isDirty || !open || isSubmitting) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, open, isSubmitting]);

  const requestClose = () => { if (isDirty) { setConfirmDiscard(true); return; } onOpenChange(false); };
  const discardDraft = () => { setConfirmDiscard(false); reset(ADMIN_COUPONS_EMPTY_FORM); onOpenChange(false); };
  const codeRegistration = form.register('code');

  useEffect(() => {
    if (open) {
      const defaultBranch = !isAllBranches && selectedBranch ? selectedBranch.name : 'All Branches';
      reset({ ...ADMIN_COUPONS_EMPTY_FORM, branchApplicability: defaultBranch });
    }
  }, [open, isAllBranches, selectedBranch, reset]);

  const watchedCode = form.watch('code');
  const watchedType = form.watch('type');
  const watchedDiscount = form.watch('discount');
  const watchedMaxUses = form.watch('maxUses');
  const watchedExpiry = form.watch('expiry');
  const watchedBranch = form.watch('branchApplicability') || 'All Branches';

  const applyPreset = (preset: (typeof COUPON_PRESETS)[number]) => {
    form.setValue('code', preset.code, { shouldDirty: true, shouldValidate: true });
    form.setValue('discount', String(preset.discount), { shouldDirty: true, shouldValidate: true });
    form.setValue('type', preset.type, { shouldDirty: true, shouldValidate: true });
    form.setValue('maxUses', String(preset.maxUses), { shouldDirty: true, shouldValidate: true });
  };

  const submit = form.handleSubmit((values) => {
    if (isDemoMode && intent === 'create') {
      onCreateDemoCoupon(schema.parse(values));
      onOpenChange(false);
      return;
    }
    toast.info(t('DRAFT_VALIDATED_NO_PERSISTENCE'), { id: 'admin-coupons-validate-draft' });
  });

  return (
    <>
      <Dialog open={open} onOpenChange={(nextOpen) => { if (nextOpen) onOpenChange(true); else requestClose(); }}>
        <DialogContent className="max-w-2xl rounded-2xl border border-border bg-overlay p-6 text-text-primary shadow-dialog space-y-5 max-h-[90vh] overflow-y-auto">
          <div className="border-b border-border pb-3">
            <DialogTitle className="text-lg font-bold text-text-primary flex items-center gap-2">
              <Building2 size={18} className="text-primary" aria-hidden="true" />
              {intent === 'create' ? t('CREATE_DIALOG_TITLE') : 'Validate Coupon Draft'}
            </DialogTitle>
            <DialogDescription className="text-xs text-text-secondary mt-1">{t('CREATE_DIALOG_DESCRIPTION')}</DialogDescription>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Quick Campaign Presets</span>
              <span className="text-[10px] text-text-secondary">1-click fill code & discount</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {COUPON_PRESETS.map((p) => (
                <button key={p.code} type="button" onClick={() => applyPreset(p)}
                  className="rounded-lg border border-border bg-surface-highlight px-2.5 py-1 text-[11px] font-semibold text-text-primary hover:border-border-focus hover:bg-primary-subtle motion-safe:transition-colors">
                  <span className="font-mono font-bold text-primary">{p.label}</span>
                  <span className="text-text-secondary ml-1.5 font-normal">({p.desc})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-dashed border-border-focus bg-primary-subtle p-4 shadow-card">
            <div className="flex items-center justify-between gap-3 px-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-extrabold tracking-widest text-primary">{watchedCode ? watchedCode.toUpperCase() : 'COUPONCODE'}</span>
                  <span className="rounded-full bg-card border border-border-focus px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
                    {watchedType === 'Percent' ? `${watchedDiscount || 0}% OFF` : `₹${watchedDiscount || 0} OFF`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-text-secondary">
                  <span className="flex items-center gap-1"><Building2 size={11} className="text-primary" aria-hidden="true" /> {watchedBranch}</span>
                  <span>•</span>
                  <span>Max Uses: {watchedMaxUses || '—'}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider text-text-secondary">Expires</div>
                <div className="text-xs font-semibold text-text-primary">{watchedExpiry || 'No Date'}</div>
              </div>
            </div>
          </div>

          <form onSubmit={submit} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary" htmlFor="admin-coupon-code">{t('FIELD_CODE')}</label>
                <span className="text-xs text-danger-text font-bold">*</span>
              </div>
              <input maxLength={30} id="admin-coupon-code" {...codeRegistration} ref={codeRegistration.ref}
                onChange={(e) => { e.target.value = e.target.value.toUpperCase(); void codeRegistration.onChange(e); }}
                className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm font-mono tracking-wider font-bold text-primary uppercase placeholder:text-text-secondary focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="e.g. WELCOME50, DIWALI25" aria-invalid={Boolean(errors.code)} aria-describedby={errors.code ? 'admin-coupon-code-error' : undefined} autoComplete="off" />
              {typeof errors.code?.message === 'string' && <p id="admin-coupon-code-error" role="alert" className="text-xs text-danger-text font-medium">{errors.code.message}</p>}
            </div>

            <div className="rounded-xl border border-border bg-surface-highlight p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('TARGET_BRANCH_TITLE')}</span>
                <span className="text-[11px] text-primary font-medium">{t('ACTIVE_BRANCH_LABEL', { branch: watchedBranch })}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {BRANCH_OPTIONS.map((b) => {
                  const isSelected = watchedBranch === b.value;
                  return (
                    <button key={b.value} type="button" onClick={() => form.setValue('branchApplicability', b.value, { shouldDirty: true })}
                      className={`flex flex-col text-left rounded-lg border p-2.5 motion-safe:transition-colors ${isSelected ? 'border-border-focus bg-primary-subtle text-primary shadow-card' : 'border-border bg-card text-text-primary hover:bg-surface-hover'}`}>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold leading-tight">{b.label}</span>
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-surface-highlight text-text-secondary">{b.code}</span>
                      </div>
                      <span className="text-[10px] text-text-secondary mt-1">{b.desc}</span>
                    </button>
                  );
                })}
              </div>
              <div className="rounded-lg border border-border-focus bg-primary-subtle p-2.5 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-primary text-[11px]"><Building2 size={12} aria-hidden="true" /> <span>{t('BRANCH_POLICY_TITLE')}</span></div>
                <p className="text-text-secondary text-[11px] leading-relaxed mt-1">
                  {watchedBranch === 'All Branches' ? t('BRANCH_POLICY_ALL') : t('BRANCH_POLICY_SINGLE', { branch: watchedBranch })}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary" htmlFor="admin-coupon-type">{t('FIELD_DISCOUNT_TYPE')}</label>
                <select id="admin-coupon-type" {...form.register('type')} className="w-full rounded-xl border border-border bg-input px-3 py-2.5 text-xs text-text-primary focus:border-border-focus focus:outline-none">
                  <option value="Flat">{t('TYPE_FLAT_LABEL')}</option>
                  <option value="Percent">{t('TYPE_PERCENT_LABEL')}</option>
                </select>
                {typeof errors.type?.message === 'string' && <p id="admin-coupon-type-error" role="alert" className="text-xs text-danger-text">{errors.type.message}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary" htmlFor="admin-coupon-discount">{t('FIELD_DISCOUNT_VALUE')}</label>
                  <span className="text-xs text-danger-text font-bold">*</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-text-secondary">{watchedType === 'Percent' ? '%' : currencySymbol}</span>
                  <input maxLength={30} id="admin-coupon-discount" type="number" min="0.01" step="any" {...form.register('discount')}
                    className="w-full rounded-xl border border-border bg-input pl-7 pr-3 py-2.5 text-xs text-text-primary focus:border-border-focus focus:outline-none font-mono"
                    placeholder={watchedType === 'Percent' ? '15' : '500'} aria-invalid={Boolean(errors.discount)} />
                </div>
                {typeof errors.discount?.message === 'string' && <p id="admin-coupon-discount-error" role="alert" className="text-xs text-danger-text">{errors.discount.message}</p>}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary" htmlFor="admin-coupon-max-uses">{t('FIELD_MAX_USES')}</label>
                  <span className="text-xs text-danger-text font-bold">*</span>
                </div>
                <input maxLength={30} id="admin-coupon-max-uses" type="number" min="1" step="1" {...form.register('maxUses')} className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs text-text-primary focus:border-border-focus focus:outline-none font-mono" placeholder="50" aria-invalid={Boolean(errors.maxUses)} />
                {typeof errors.maxUses?.message === 'string' && <p id="admin-coupon-max-uses-error" role="alert" className="text-xs text-danger-text">{errors.maxUses.message}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary" htmlFor="admin-coupon-expiry">{t('FIELD_EXPIRY')}</label>
                  <span className="text-xs text-danger-text font-bold">*</span>
                </div>
                <input maxLength={30} id="admin-coupon-expiry" type="date" {...form.register('expiry')} className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-text-primary focus:border-border-focus focus:outline-none" aria-invalid={Boolean(errors.expiry)} />
                {typeof errors.expiry?.message === 'string' && <p id="admin-coupon-expiry-error" role="alert" className="text-xs text-danger-text">{errors.expiry.message}</p>}
              </div>
            </div>

            <DialogFooter className="border-t border-border pt-4 flex items-center justify-end gap-2.5">
              <button type="button" className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-hover hover:text-text-primary motion-safe:transition-colors" onClick={requestClose}>{t('CANCEL')}</button>
              <button type="submit" aria-label={isDemoMode && intent === 'create' ? t('CREATE_DEMO_COUPON') : t('VALIDATE_DRAFT')} className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-on-primary shadow-card hover:bg-primary-hover motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <CheckCircle size={15} strokeWidth={2} aria-hidden="true" />
                <span>{intent === 'create' ? t('CREATE_COUPON') : t('VALIDATE_DRAFT')}</span>
              </button>
            </DialogFooter>
          </form>

          {confirmDiscard && (
            <div role="alertdialog" aria-modal="true" aria-labelledby="admin-coupon-discard-title" className="rounded-xl border border-warning bg-warning-bg p-4">
              <h3 id="admin-coupon-discard-title" className="text-xs font-bold text-warning-text">{t('UNSAVED_CHANGES_TITLE')}</h3>
              <p className="mt-1 text-xs text-text-primary">{t('UNSAVED_CHANGES_DESCRIPTION')}</p>
              <div className="mt-3 flex justify-end gap-2">
                <button type="button" className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-surface-hover" onClick={() => setConfirmDiscard(false)}>{t('KEEP_EDITING')}</button>
                <button type="button" className="rounded-lg bg-danger px-3 py-1.5 text-xs font-semibold text-on-danger hover:opacity-90" onClick={discardDraft}>{t('DISCARD_CHANGES')}</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={onDeleteOpenChange}>
        <DialogContent className="space-y-5">
          <div className="space-y-2"><DialogTitle>{t('DELETE_DIALOG_TITLE')}</DialogTitle><DialogDescription>{t('DELETE_DIALOG_DESCRIPTION', { code: couponCode })}</DialogDescription></div>
          <DialogFooter className="border-t border-border pt-4">
            <button type="button" className="min-h-11 rounded-md border border-border px-4 py-2 text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => onDeleteOpenChange(false)}>{t('CANCEL')}</button>
            <button type="button" aria-label={t('CONFIRM_DEMO_DELETE')} className="min-h-11 rounded-md bg-danger px-4 py-2 font-medium text-on-danger hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={onConfirmDelete}>
              Delete Coupon
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export type { AdminCouponsCreateDialogProps };
