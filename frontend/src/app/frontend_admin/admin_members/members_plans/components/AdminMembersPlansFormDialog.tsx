'use client';

import { AdminMembersPlansPreviewCard } from '@/app/frontend_admin/admin_members/members_plans/components/AdminMembersPlansPreviewCard';
import { AdminMembersPlansShiftRateSection } from '@/app/frontend_admin/admin_members/members_plans/components/AdminMembersPlansShiftRateSection';
import useAdminMembersPlansUnsavedChangesGuard from '@/app/frontend_admin/admin_members/members_plans/hooks/useAdminMembersPlansUnsavedChangesGuard';
import { AdminPlansFormSchema, type AdminPlansFormValues } from '@/app/frontend_admin/admin_members/members_plans/schemas/AdminMembersPlansSchema';
import type { AdminPlansFormDialogProps } from '@/app/frontend_admin/admin_members/members_plans/types/AdminMembersPlansComponentTypes';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Building2, CheckCircle, Clock, Layers, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

const EMPTY: AdminPlansFormValues = {
  name: '',
  price: '',
  duration: '',
  durationDays: '',
  features: '',
  branchApplicability: 'All Branches',
  morningRate: '',
  afternoonRate: '',
  eveningRate: '',
  nightRate: '',
  fullDayRate: '',
  multiShiftDiscount: '10',
};

const TENURE_PRESETS = [
  { label: '1 Month (30d)', duration: '1 Month', days: '30' },
  { label: '3 Months (90d)', duration: '3 Months', days: '90' },
  { label: '6 Months (180d)', duration: '6 Months', days: '180' },
  { label: '1 Year (365d)', duration: '1 Year', days: '365' },
];

const QUICK_FACILITIES = [
  'Reserved Personal Desk',
  'High-Speed Fiber Wi-Fi',
  'Personal Locker Included',
  'AC Silent Study Zone',
  'Dedicated Power Socket',
  'RO Water & Pantry Access',
  'Biometric & 24/7 CCTV Security',
  'Discussion Room Access',
];

export default function AdminMembersPlansFormDialog({ open, editingPlan, onClose, onValidated }: AdminPlansFormDialogProps) {
  const t = useTranslations('ADMIN_PLANS');
  const router = useRouter();
  const { branches, selectedBranch, isAllBranches } = useAdminBranch();
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isDirty, isSubmitting } } = useForm<AdminPlansFormValues>({
    resolver: zodResolver(AdminPlansFormSchema),
    defaultValues: EMPTY,
  });

  const selectedBranchApplicability = watch('branchApplicability') || 'All Branches';
  const watchedName = watch('name');
  const watchedPrice = watch('price');
  const watchedDurationDays = watch('durationDays');
  const watchedFeatures = watch('features') || '';

  const parsedFeatures = useMemo(() => watchedFeatures.split('\n').map((f) => f.trim()).filter(Boolean), [watchedFeatures]);

  const toggleFeatureChip = (facility: string) => {
    const lines = watchedFeatures.split('\n').map((f) => f.trim()).filter(Boolean);
    const next = lines.includes(facility) ? lines.filter((l) => l !== facility) : [...lines, facility];
    setValue('features', next.join('\n'), { shouldDirty: true, shouldValidate: true });
  };

  const handleBlockedNavigation = useCallback((href: string) => { setPendingNavigation(href); setConfirmDiscard(true); }, []);
  useAdminMembersPlansUnsavedChangesGuard(isDirty && open, isSubmitting, handleBlockedNavigation);

  const requestClose = () => { if (isDirty) { setConfirmDiscard(true); return; } onClose(); };
  const discardDraft = () => {
    setConfirmDiscard(false);
    reset(EMPTY);
    const destination = pendingNavigation;
    setPendingNavigation(null);
    if (destination) { router.push(destination); return; }
    onClose();
  };

  const getValidationMessage = (message: string | undefined): string => {
    switch (message) {
      case 'VALIDATION.NAME_TOO_SHORT': return t('VALIDATION.NAME_TOO_SHORT');
      case 'VALIDATION.NAME_TOO_LONG': return t('VALIDATION.NAME_TOO_LONG');
      case 'VALIDATION.PRICE_REQUIRED': return t('VALIDATION.PRICE_REQUIRED');
      case 'VALIDATION.PRICE_INVALID': return t('VALIDATION.PRICE_INVALID');
      case 'VALIDATION.DURATION_REQUIRED': return t('VALIDATION.DURATION_REQUIRED');
      case 'VALIDATION.DURATION_TOO_LONG': return t('VALIDATION.DURATION_TOO_LONG');
      case 'VALIDATION.DURATION_DAYS_REQUIRED': return t('VALIDATION.DURATION_DAYS_REQUIRED');
      case 'VALIDATION.DURATION_DAYS_INVALID': return t('VALIDATION.DURATION_DAYS_INVALID');
      case 'VALIDATION.FEATURES_TOO_LONG': return t('VALIDATION.FEATURES_TOO_LONG');
      default: return t('VALIDATION.UNKNOWN');
    }
  };

  useEffect(() => {
    if (!open) return;
    const initialBranch = editingPlan ? (editingPlan.branchApplicability || 'All Branches') : (!isAllBranches && selectedBranch ? selectedBranch.name : 'All Branches');
    reset(editingPlan ? {
      name: editingPlan.name, price: String(editingPlan.price), duration: editingPlan.duration, durationDays: String(editingPlan.durationDays),
      features: editingPlan.features.join('\n'), branchApplicability: initialBranch, morningRate: '', afternoonRate: '', eveningRate: '', nightRate: '', fullDayRate: '', multiShiftDiscount: '10',
    } : { ...EMPTY, branchApplicability: initialBranch });
  }, [editingPlan, open, reset, isAllBranches, selectedBranch]);

  const branchOptionsList = [
    { value: 'All Branches', title: 'All Branches (Network-Wide)', subtitle: 'Universal across all branches', tag: 'Global', tagColor: 'border-info bg-info-bg text-info-text' },
    ...branches.map((b) => ({
      value: b.name,
      title: b.name,
      subtitle: `${b.code} · ${b.city || 'Campus Branch'}`,
      tag: 'Branch-Exclusive',
      tagColor: b.name.includes('Downtown') ? 'border-success bg-success-bg text-success-text' : b.name.includes('Westside') ? 'border-warning bg-warning-bg text-warning-text' : 'border-border-focus bg-primary-subtle text-primary',
    })),
  ];

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) requestClose(); }}>
      <DialogContent data-testid="admin_plans-AdminMembersPlansMain-control-008" className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-overlay p-6 sm:p-7 text-text-primary shadow-dialog">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <DialogTitle className="text-xl font-bold tracking-tight text-text-primary flex items-center gap-2">
              <Layers size={20} className="text-primary" aria-hidden="true" />
              <span>{editingPlan ? t('EDIT_PLAN') : t('CREATE_NEW_PLAN')}</span>
            </DialogTitle>
            <p className="text-xs text-text-secondary mt-1">Configure pricing tier, branch applicability, and shift rates</p>
          </div>
          <button type="button" onClick={requestClose} className="rounded-xl p-2 text-text-secondary hover:bg-surface-hover hover:text-text-primary motion-safe:transition-colors" aria-label={t('CANCEL')}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onValidated)} noValidate className="mt-5 space-y-5">
          <div>
            <label htmlFor="admin-plan-name" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
              {t('PLAN_NAME')} <span className="text-danger-text">*</span>
            </label>
            <input maxLength={30} id="admin-plan-name" required className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-primary" aria-invalid={Boolean(errors.name)} {...register('name')} placeholder={t('NAME_PLACEHOLDER')} />
            {errors.name && <p className="mt-1 text-xs text-danger-text" role="alert">{getValidationMessage(errors.name.message)}</p>}
          </div>

          <div className="rounded-xl border border-border bg-surface-highlight p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1.5"><Building2 size={14} className="text-primary" aria-hidden="true" /> Target Branch Condition</span>
              <span className="text-[11px] text-text-secondary">Branch-specific pricing</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {branchOptionsList.map((branchOpt) => {
                const isSelected = selectedBranchApplicability === branchOpt.value;
                return (
                  <button key={branchOpt.value} type="button" onClick={() => setValue('branchApplicability', branchOpt.value, { shouldDirty: true })}
                    className={`flex items-start justify-between gap-3 rounded-xl border p-3 text-left motion-safe:transition-colors ${isSelected ? 'border-border-focus bg-primary-subtle shadow-card' : 'border-border bg-card hover:bg-surface-hover'}`}>
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${isSelected ? 'border-primary bg-primary text-on-primary' : 'border-border'}`}>
                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-on-primary" />}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold leading-tight truncate ${isSelected ? 'text-primary' : 'text-text-primary'}`}>{branchOpt.title}</p>
                        <p className="text-[10px] text-text-secondary mt-0.5">{branchOpt.subtitle}</p>
                      </div>
                    </div>
                    <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${branchOpt.tagColor}`}>{branchOpt.tag}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 rounded-lg border border-border bg-card p-3 text-xs flex items-start gap-2.5">
              <Building2 size={16} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-[11px] leading-relaxed text-text-secondary">
                {selectedBranchApplicability === 'All Branches' ? (
                  <span><strong className="text-info-text font-semibold">🌐 Global Network Condition:</strong> This plan will be available across all branches with uniform pricing.</span>
                ) : (
                  <span><strong className="text-success-text font-semibold">📍 Branch-Exclusive Condition:</strong> Customized for <strong className="text-text-primary">{selectedBranchApplicability}</strong>.</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="admin-plan-price" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">{t('PRICE')} (₹ Base/Month) <span className="text-danger-text">*</span></label>
              <input maxLength={30} id="admin-plan-price" required min="0" className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-primary font-mono" type="number" aria-invalid={Boolean(errors.price)} {...register('price')} placeholder={t('PRICE_PLACEHOLDER')} />
              {errors.price && <p className="mt-1 text-xs text-danger-text" role="alert">{getValidationMessage(errors.price.message)}</p>}
            </div>
            <div>
              <label htmlFor="admin-plan-duration-days" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">{t('VALIDITY_DAYS')} <span className="text-danger-text">*</span></label>
              <input maxLength={30} id="admin-plan-duration-days" min="1" required className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-primary font-mono" type="number" aria-invalid={Boolean(errors.durationDays)} {...register('durationDays')} placeholder={t('DAYS_PLACEHOLDER')} />
              {errors.durationDays && <p className="mt-1 text-xs text-danger-text" role="alert">{getValidationMessage(errors.durationDays.message)}</p>}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Quick Validity Presets</span>
              <span className="text-[11px] text-text-secondary">Click to autofill duration</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {TENURE_PRESETS.map((p) => (
                <button key={p.label} type="button" onClick={() => { setValue('duration', p.duration, { shouldDirty: true, shouldValidate: true }); setValue('durationDays', p.days, { shouldDirty: true, shouldValidate: true }); }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-highlight px-3 py-1.5 text-xs font-semibold text-text-primary hover:border-border-focus hover:bg-surface-hover motion-safe:transition-colors">
                  <Clock size={12} className="text-primary" aria-hidden="true" /> {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="admin-plan-duration" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">{t('DURATION')} Label <span className="text-danger-text">*</span></label>
            <input maxLength={30} id="admin-plan-duration" required className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-primary" aria-invalid={Boolean(errors.duration)} {...register('duration')} placeholder={t('DURATION_PLACEHOLDER')} />
            {errors.duration && <p className="mt-1 text-xs text-danger-text" role="alert">{getValidationMessage(errors.duration.message)}</p>}
          </div>

          <AdminMembersPlansShiftRateSection register={register} />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="admin-plan-features" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">{t('FEATURES_HELP')} (One per line)</label>
              <span className="text-[11px] text-text-secondary">Click chips below to add</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {QUICK_FACILITIES.map((facility) => {
                const isSelected = parsedFeatures.includes(facility);
                return (
                  <button key={facility} type="button" onClick={() => toggleFeatureChip(facility)}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium motion-safe:transition-colors border ${isSelected ? 'border-success bg-success-bg text-success-text' : 'border-border bg-surface-highlight text-text-secondary hover:bg-surface-hover hover:text-text-primary'}`}>
                    {isSelected ? <CheckCircle size={11} className="text-success-text" aria-hidden="true" /> : <span>+</span>}
                    {facility}
                  </button>
                );
              })}
            </div>
            <textarea maxLength={1000} id="admin-plan-features" className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs text-text-primary placeholder:text-text-secondary focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-primary resize-none leading-relaxed" aria-invalid={Boolean(errors.features)} {...register('features')} rows={3} placeholder={t('FEATURES_PLACEHOLDER')} />
            {errors.features && <p className="mt-1 text-xs text-danger-text" role="alert">{getValidationMessage(errors.features.message)}</p>}
          </div>

          <AdminMembersPlansPreviewCard name={watchedName} price={watchedPrice} durationDays={watchedDurationDays} branchApplicability={selectedBranchApplicability} parsedFeatures={parsedFeatures} />

          <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
            <button type="button" data-testid="admin_plans-AdminMembersPlansMain-control-009" className="rounded-xl border border-border bg-card px-5 py-2.5 text-xs font-semibold text-text-secondary hover:bg-surface-hover hover:text-text-primary motion-safe:transition-colors" onClick={requestClose}>{t('CANCEL')}</button>
            <button type="submit" data-testid="admin_plans-AdminMembersPlansMain-control-010" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-on-primary shadow-card hover:bg-primary-hover motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <CheckCircle size={16} strokeWidth={2} aria-hidden="true" /> {t('SAVE_PLAN')}
            </button>
          </div>
        </form>

        {confirmDiscard && (
          <div role="alertdialog" aria-modal="true" aria-labelledby="admin-plans-discard-title" className="mt-4 rounded-xl border border-warning bg-warning-bg p-4">
            <h3 id="admin-plans-discard-title" className="text-sm font-bold text-warning-text flex items-center gap-1.5"><AlertTriangle size={16} aria-hidden="true" /> {t('UNSAVED_CHANGES_TITLE')}</h3>
            <p className="mt-1 text-xs text-text-primary">{t('UNSAVED_CHANGES_DESCRIPTION')}</p>
            <div className="mt-3 flex justify-end gap-2">
              <button type="button" className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-surface-hover" onClick={() => { setConfirmDiscard(false); setPendingNavigation(null); }}>{t('KEEP_EDITING')}</button>
              <button type="button" className="rounded-lg bg-danger px-3 py-1.5 text-xs font-semibold text-on-danger hover:opacity-90" onClick={discardDraft}>{t('DISCARD_CHANGES')}</button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export type { AdminPlansFormDialogProps };
