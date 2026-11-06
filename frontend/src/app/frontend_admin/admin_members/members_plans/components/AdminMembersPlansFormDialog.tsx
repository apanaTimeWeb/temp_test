'use client';
// RESPONSIBILITY: AdminPlansFormDialog component owned by admin_plans; responsibility folder: admin_plans_form_dialog.

import useAdminMembersPlansUnsavedChangesGuard from '@/app/frontend_admin/admin_members/members_plans/hooks/useAdminMembersPlansUnsavedChangesGuard';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { CheckCircle, Clock, Percent } from 'lucide-react';
import { AdminPlansFormSchema, type AdminPlansFormValues } from '@/app/frontend_admin/admin_members/members_plans/schemas/AdminMembersPlansSchema';
import type { AdminPlansFormDialogProps } from '@/app/frontend_admin/admin_members/members_plans/types/AdminMembersPlansComponentTypes';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { SearchableCombobox, type ComboboxOption } from '@/components/ui/combobox/SearchableCombobox';

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

export default function AdminMembersPlansFormDialog({ open, editingPlan, onClose, onValidated }: AdminPlansFormDialogProps) {
  const t = useTranslations('ADMIN_PLANS');
  const router = useRouter();
  const { branches } = useAdminBranch();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  const branchOptions: ComboboxOption[] = useMemo(() => {
    return [
      { value: 'All Branches', label: 'All Branches (Global Network Pricing)' },
      ...branches.map((b) => ({
        value: b.name,
        label: b.name,
        subLabel: b.city ? `${b.code} · ${b.city}` : b.code,
      })),
    ];
  }, [branches]);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isDirty, isSubmitting } } = useForm<AdminPlansFormValues>({
    resolver: zodResolver(AdminPlansFormSchema),
    defaultValues: EMPTY,
  });

  const selectedBranchApplicability = watch('branchApplicability') || 'All Branches';

  const handleBlockedNavigation = useCallback((href: string) => { setPendingNavigation(href); setConfirmDiscard(true); }, []);
  useAdminMembersPlansUnsavedChangesGuard(isDirty && open, isSubmitting, handleBlockedNavigation);

  const requestClose = () => { if (isDirty) { setConfirmDiscard(true); return; } onClose(); };
  const discardDraft = () => { setConfirmDiscard(false); reset(EMPTY); const destination = pendingNavigation; setPendingNavigation(null); if (destination) { router.push(destination); return; } onClose(); };

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
    reset(editingPlan ? {
      name: editingPlan.name,
      price: String(editingPlan.price),
      duration: editingPlan.duration,
      durationDays: String(editingPlan.durationDays),
      features: editingPlan.features.join('\n'),
      branchApplicability: editingPlan.branchApplicability || 'All Branches',
      morningRate: '',
      afternoonRate: '',
      eveningRate: '',
      nightRate: '',
      fullDayRate: '',
      multiShiftDiscount: '10',
    } : EMPTY);
  }, [editingPlan, open, reset]);

  if (!open) return null;

  return (
    <div data-testid="admin_plans-AdminMembersPlansMain-control-007" className="admin-modal-overlay" onClick={requestClose}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="admin-plans-form-dialog-title" tabIndex={-1} data-testid="admin_plans-AdminMembersPlansMain-control-008" className="admin-modal max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(event) => event.stopPropagation()}>
        <h2 id="admin-plans-form-dialog-title" className="admin-modal-title">{editingPlan ? t('EDIT_PLAN') : t('CREATE_NEW_PLAN')}</h2>
        <form onSubmit={handleSubmit(onValidated)} noValidate>
          <div className="admin-form-grid">
            <div className="admin-form-field admin-form-field-full">
              <label htmlFor="admin-plan-name" className="admin-label admin-label-required">{t('PLAN_NAME')}</label>
              <input id="admin-plan-name" required className="admin-input" aria-invalid={Boolean(errors.name)} {...register('name')} placeholder={t('NAME_PLACEHOLDER')} />
              {errors.name && <p className="text-sm text-danger-text" role="alert">{getValidationMessage(errors.name.message)}</p>}
            </div>

            <div className="admin-form-field">
              <label htmlFor="admin-plan-price" className="admin-label admin-label-required">{t('PRICE')} (₹ Base/Month)</label>
              <input id="admin-plan-price" required min="0" className="admin-input" type="number" aria-invalid={Boolean(errors.price)} {...register('price')} placeholder={t('PRICE_PLACEHOLDER')} />
              {errors.price && <p className="text-sm text-danger-text" role="alert">{getValidationMessage(errors.price.message)}</p>}
            </div>

            <div className="admin-form-field">
              <label className="admin-label">Branch Pricing & Scope</label>
              <SearchableCombobox
                options={branchOptions}
                value={selectedBranchApplicability}
                onChange={(val) => setValue('branchApplicability', val, { shouldDirty: true })}
                placeholder="Select applicability..."
              />
            </div>

            {/* Tenure Presets */}
            <div className="admin-form-field admin-form-field-full">
              <div className="flex items-center justify-between mb-1">
                <label className="admin-label">Tenure Duration Presets</label>
                <span className="text-[11px] text-text-secondary">Click to auto-populate duration</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {TENURE_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setValue('duration', p.duration, { shouldDirty: true, shouldValidate: true });
                      setValue('durationDays', p.days, { shouldDirty: true, shouldValidate: true });
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-highlight px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-hover hover:border-primary"
                  >
                    <Clock size={12} className="text-primary" /> {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="admin-form-field">
              <label htmlFor="admin-plan-duration" className="admin-label admin-label-required">{t('DURATION')}</label>
              <input id="admin-plan-duration" required className="admin-input" aria-invalid={Boolean(errors.duration)} {...register('duration')} placeholder={t('DURATION_PLACEHOLDER')} />
              {errors.duration && <p className="text-sm text-danger-text" role="alert">{getValidationMessage(errors.duration.message)}</p>}
            </div>

            <div className="admin-form-field">
              <label htmlFor="admin-plan-duration-days" className="admin-label admin-label-required">{t('VALIDITY_DAYS')}</label>
              <input id="admin-plan-duration-days" min="1" required className="admin-input" type="number" aria-invalid={Boolean(errors.durationDays)} {...register('durationDays')} placeholder={t('DAYS_PLACEHOLDER')} />
              {errors.durationDays && <p className="text-sm text-danger-text" role="alert">{getValidationMessage(errors.durationDays.message)}</p>}
            </div>

            {/* Shift-Wise Rate Matrix */}
            <div className="admin-form-field admin-form-field-full rounded-xl border border-border bg-surface-highlight p-3.5 my-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-text-primary">Shift-Based Pricing Engine</span>
                <span className="text-[11px] text-text-secondary">Used by Manager Admission auto-calculation</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                <div>
                  <label className="text-[11px] text-text-secondary block mb-1">Morning (6A-12P)</label>
                  <input type="number" placeholder="₹800" className="admin-input text-xs" {...register('morningRate')} />
                </div>
                <div>
                  <label className="text-[11px] text-text-secondary block mb-1">Afternoon (12P-5P)</label>
                  <input type="number" placeholder="₹700" className="admin-input text-xs" {...register('afternoonRate')} />
                </div>
                <div>
                  <label className="text-[11px] text-text-secondary block mb-1">Evening (5P-10P)</label>
                  <input type="number" placeholder="₹900" className="admin-input text-xs" {...register('eveningRate')} />
                </div>
                <div>
                  <label className="text-[11px] text-text-secondary block mb-1">Night (10P-6A)</label>
                  <input type="number" placeholder="₹1000" className="admin-input text-xs" {...register('nightRate')} />
                </div>
                <div>
                  <label className="text-[11px] text-text-secondary block mb-1">Full Day 24/7</label>
                  <input type="number" placeholder="₹2000" className="admin-input text-xs" {...register('fullDayRate')} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs">
                <Percent size={13} className="text-primary" />
                <span className="text-text-secondary">Multi-Shift Discount (% off for 2+ shifts):</span>
                <input type="number" max="50" min="0" placeholder="10" className="admin-input w-20 text-xs py-1" {...register('multiShiftDiscount')} />
              </div>
            </div>

            <div className="admin-form-field admin-form-field-full">
              <label htmlFor="admin-plan-features" className="admin-label">{t('FEATURES_HELP')}</label>
              <textarea id="admin-plan-features" className="admin-textarea admin-shared-textarea-no-resize" aria-invalid={Boolean(errors.features)} {...register('features')} rows={3} placeholder={t('FEATURES_PLACEHOLDER')} />
              {errors.features && <p className="text-sm text-danger-text" role="alert">{getValidationMessage(errors.features.message)}</p>}
            </div>
          </div>

          <div className="admin-modal-footer">
            <button type="button" data-testid="admin_plans-AdminMembersPlansMain-control-009" className="admin-btn-ghost" onClick={requestClose}>{t('CANCEL')}</button>
            <button type="submit" data-testid="admin_plans-AdminMembersPlansMain-control-010" className="admin-btn-primary"><CheckCircle size={18} strokeWidth={2} /> {t('SAVE_PLAN')}</button>
          </div>
        </form>

        {confirmDiscard && (
          <div role="alertdialog" aria-modal="true" aria-labelledby="admin-plans-discard-title" className="mt-4 rounded-lg border border-warning-bg bg-card p-4">
            <h3 id="admin-plans-discard-title" className="font-semibold text-text-primary">{t('UNSAVED_CHANGES_TITLE')}</h3>
            <p className="mt-2 text-text-secondary">{t('UNSAVED_CHANGES_DESCRIPTION')}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="admin-btn-ghost min-h-11" onClick={() => { setConfirmDiscard(false); setPendingNavigation(null); }}>{t('KEEP_EDITING')}</button>
              <button type="button" className="admin-btn-danger min-h-11" onClick={discardDraft}>{t('DISCARD_CHANGES')}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export type { AdminPlansFormDialogProps };
