'use client';

import useAdminMembersPlansUnsavedChangesGuard from '@/app/frontend_admin/admin_members/members_plans/hooks/useAdminMembersPlansUnsavedChangesGuard';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { CheckCircle, Clock, Percent, Building2, X, AlertTriangle, Layers, Sparkles } from 'lucide-react';
import { AdminPlansFormSchema, type AdminPlansFormValues } from '@/app/frontend_admin/admin_members/members_plans/schemas/AdminMembersPlansSchema';
import type { AdminPlansFormDialogProps } from '@/app/frontend_admin/admin_members/members_plans/types/AdminMembersPlansComponentTypes';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';

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

  const branchOptionsList = [
    { value: 'All Branches', title: 'All Branches', subtitle: 'Global Network-Wide' },
    ...branches.map((b) => ({
      value: b.name,
      title: b.name,
      subtitle: `${b.code} · ${b.city}`,
    })),
  ];

  return (
    <div
      data-testid="admin_plans-AdminMembersPlansMain-control-007"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto"
      onClick={requestClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-plans-form-dialog-title"
        tabIndex={-1}
        data-testid="admin_plans-AdminMembersPlansMain-control-008"
        className="relative my-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-7 text-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 id="admin-plans-form-dialog-title" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles size={20} className="text-indigo-400" />
              {editingPlan ? t('EDIT_PLAN') : t('CREATE_NEW_PLAN')}
            </h2>
            <p className="text-xs text-slate-400 mt-1">Configure pricing tier, branch applicability, and shift rates</p>
          </div>
          <button
            type="button"
            onClick={requestClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onValidated)} noValidate className="mt-5 space-y-5">
          {/* Plan Name */}
          <div>
            <label htmlFor="admin-plan-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              {t('PLAN_NAME')} <span className="text-rose-400">*</span>
            </label>
            <input
              id="admin-plan-name"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              aria-invalid={Boolean(errors.name)}
              {...register('name')}
              placeholder={t('NAME_PLACEHOLDER')}
            />
            {errors.name && <p className="mt-1 text-xs text-rose-400" role="alert">{getValidationMessage(errors.name.message)}</p>}
          </div>

          {/* Branch Selection Cards */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Building2 size={14} className="text-indigo-400" />
                Target Branch Condition
              </label>
              <span className="text-[11px] text-slate-400">Branch-specific pricing</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {branchOptionsList.map((branchOpt) => {
                const isSelected = selectedBranchApplicability === branchOpt.value;
                return (
                  <button
                    key={branchOpt.value}
                    type="button"
                    onClick={() => setValue('branchApplicability', branchOpt.value, { shouldDirty: true })}
                    className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/15 shadow-sm shadow-indigo-500/20'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      isSelected ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-600'
                    }`}>
                      {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-indigo-200' : 'text-slate-200'}`}>
                        {branchOpt.title}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{branchOpt.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              {selectedBranchApplicability === 'All Branches'
                ? '🌐 This plan is available globally across Downtown Central, Westside Branch, and North Hub.'
                : `📍 This plan is exclusive to ${selectedBranchApplicability}. Other branches cannot enroll students in this plan.`}
            </p>
          </div>

          {/* Price & Tenure Presets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="admin-plan-price" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                {t('PRICE')} (₹ Base/Month) <span className="text-rose-400">*</span>
              </label>
              <input
                id="admin-plan-price"
                required
                min="0"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                type="number"
                aria-invalid={Boolean(errors.price)}
                {...register('price')}
                placeholder={t('PRICE_PLACEHOLDER')}
              />
              {errors.price && <p className="mt-1 text-xs text-rose-400" role="alert">{getValidationMessage(errors.price.message)}</p>}
            </div>

            <div>
              <label htmlFor="admin-plan-duration-days" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                {t('VALIDITY_DAYS')} <span className="text-rose-400">*</span>
              </label>
              <input
                id="admin-plan-duration-days"
                min="1"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                type="number"
                aria-invalid={Boolean(errors.durationDays)}
                {...register('durationDays')}
                placeholder={t('DAYS_PLACEHOLDER')}
              />
              {errors.durationDays && <p className="mt-1 text-xs text-rose-400" role="alert">{getValidationMessage(errors.durationDays.message)}</p>}
            </div>
          </div>

          {/* Quick Tenure Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Quick Validity Presets</span>
              <span className="text-[11px] text-slate-500">Click to autofill duration</span>
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
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-indigo-500/50 hover:bg-slate-700 hover:text-white transition-all"
                >
                  <Clock size={12} className="text-indigo-400" /> {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="admin-plan-duration" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              {t('DURATION')} Label <span className="text-rose-400">*</span>
            </label>
            <input
              id="admin-plan-duration"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              aria-invalid={Boolean(errors.duration)}
              {...register('duration')}
              placeholder={t('DURATION_PLACEHOLDER')}
            />
            {errors.duration && <p className="mt-1 text-xs text-rose-400" role="alert">{getValidationMessage(errors.duration.message)}</p>}
          </div>

          {/* Shift-Wise Rate Matrix */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Layers size={14} className="text-cyan-400" />
                Shift-Specific Pricing Engine
              </span>
              <span className="text-[11px] text-slate-400">Used by Manager Admission workflow</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Morning (6A-12P)</label>
                <input
                  type="number"
                  placeholder="₹800"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  {...register('morningRate')}
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Afternoon (12P-5P)</label>
                <input
                  type="number"
                  placeholder="₹700"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  {...register('afternoonRate')}
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Evening (5P-10P)</label>
                <input
                  type="number"
                  placeholder="₹900"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  {...register('eveningRate')}
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Night (10P-6A)</label>
                <input
                  type="number"
                  placeholder="₹1000"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  {...register('nightRate')}
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Full Day (24/7)</label>
                <input
                  type="number"
                  placeholder="₹2000"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  {...register('fullDayRate')}
                />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs border-t border-slate-800/80 pt-2.5">
              <Percent size={13} className="text-amber-400" />
              <span className="text-slate-300">Multi-Shift Discount (% off for 2+ shifts):</span>
              <input
                type="number"
                max="50"
                min="0"
                placeholder="10"
                className="w-20 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                {...register('multiShiftDiscount')}
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <label htmlFor="admin-plan-features" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              {t('FEATURES_HELP')} (One per line)
            </label>
            <textarea
              id="admin-plan-features"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
              aria-invalid={Boolean(errors.features)}
              {...register('features')}
              rows={3}
              placeholder={t('FEATURES_PLACEHOLDER')}
            />
            {errors.features && <p className="mt-1 text-xs text-rose-400" role="alert">{getValidationMessage(errors.features.message)}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              data-testid="admin_plans-AdminMembersPlansMain-control-009"
              className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              onClick={requestClose}
            >
              {t('CANCEL')}
            </button>
            <button
              type="submit"
              data-testid="admin_plans-AdminMembersPlansMain-control-010"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <CheckCircle size={16} strokeWidth={2} />
              {t('SAVE_PLAN')}
            </button>
          </div>
        </form>

        {confirmDiscard && (
          <div role="alertdialog" aria-modal="true" aria-labelledby="admin-plans-discard-title" className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <h3 id="admin-plans-discard-title" className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
              <AlertTriangle size={16} />
              {t('UNSAVED_CHANGES_TITLE')}
            </h3>
            <p className="mt-1 text-xs text-slate-300">{t('UNSAVED_CHANGES_DESCRIPTION')}</p>
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                onClick={() => { setConfirmDiscard(false); setPendingNavigation(null); }}
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
      </div>
    </div>
  );
}

export type { AdminPlansFormDialogProps };
