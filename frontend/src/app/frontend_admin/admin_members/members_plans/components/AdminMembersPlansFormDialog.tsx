// RESPONSIBILITY: AdminPlansFormDialog component owned by admin_plans; responsibility folder: admin_plans_form_dialog.
"use client";

import useAdminMembersPlansUnsavedChangesGuard from '@/app/frontend_admin/admin_members/members_plans/hooks/useAdminMembersPlansUnsavedChangesGuard';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { CheckCircle } from 'lucide-react';
import { AdminPlansFormSchema, type AdminPlansFormValues } from '@/app/frontend_admin/admin_members/members_plans/schemas/AdminMembersPlansSchema';
import type { AdminPlansPlan } from '@/app/frontend_admin/admin_members/members_plans/schemas/AdminMembersPlansSchema';
import type { AdminPlansFormDialogProps } from '@/app/frontend_admin/admin_members/members_plans/types/AdminMembersPlansComponentTypes';


const EMPTY: AdminPlansFormValues = { name: '', price: '', duration: '', durationDays: '', features: '' };

export default function AdminPlansFormDialog({ open, editingPlan, onClose, onValidated }: AdminPlansFormDialogProps) {
  const t = useTranslations('ADMIN_PLANS');
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isDirty, isSubmitting } } = useForm<AdminPlansFormValues>({ resolver: zodResolver(AdminPlansFormSchema), defaultValues: EMPTY });
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
    } : EMPTY);
  }, [editingPlan, open, reset]);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    const focusable = () => Array.from(dialog?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])') ?? []);
    focusable()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); requestClose(); return; }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (items.length === 0) { event.preventDefault(); dialog?.focus(); return; }
      if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items[items.length - 1]?.focus(); }
      else if (!event.shiftKey && document.activeElement === items[items.length - 1]) { event.preventDefault(); items[0]?.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('keydown', onKeyDown); previousFocus?.focus(); };
  }, [onClose, open, isDirty]);

  if (!open) return null;
  return (
    <div data-testid="admin_plans-AdminMembersPlansMain-control-007" className="admin-modal-overlay" onClick={requestClose}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="admin-plans-form-dialog-title" tabIndex={-1} data-testid="admin_plans-AdminMembersPlansMain-control-008" className="admin-modal" onClick={(event) => event.stopPropagation()}>
        <h2 id="admin-plans-form-dialog-title" className="admin-modal-title">{editingPlan ? t('EDIT_PLAN') : t('CREATE_NEW_PLAN')}</h2>
        <form onSubmit={handleSubmit(onValidated)} noValidate>
          <div className="admin-form-grid">
            <div className="admin-form-field admin-form-field-full">
              <label htmlFor="admin-plan-name" className="admin-label admin-label-required">{t('PLAN_NAME')}</label>
              <input id="admin-plan-name" required className="admin-input" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'admin-plan-name-error' : undefined} {...register('name')} placeholder={t('NAME_PLACEHOLDER')} />
              {errors.name ? <p id="admin-plan-name-error" className="text-sm text-danger-text" role="alert">{getValidationMessage(errors.name.message)}</p> : null}
            </div>
            <div className="admin-form-field">
              <label htmlFor="admin-plan-price" className="admin-label admin-label-required">{t('PRICE')}</label>
              <input id="admin-plan-price" required min="0" className="admin-input" type="number" aria-invalid={Boolean(errors.price)} aria-describedby={errors.price ? 'admin-plan-price-error' : undefined} {...register('price')} placeholder={t('PRICE_PLACEHOLDER')} />
              {errors.price ? <p id="admin-plan-price-error" className="text-sm text-danger-text" role="alert">{getValidationMessage(errors.price.message)}</p> : null}
            </div>
            <div className="admin-form-field">
              <label htmlFor="admin-plan-duration" className="admin-label admin-label-required">{t('DURATION')}</label>
              <input id="admin-plan-duration" required className="admin-input" aria-invalid={Boolean(errors.duration)} aria-describedby={errors.duration ? 'admin-plan-duration-error' : undefined} {...register('duration')} placeholder={t('DURATION_PLACEHOLDER')} />
              {errors.duration ? <p id="admin-plan-duration-error" className="text-sm text-danger-text" role="alert">{getValidationMessage(errors.duration.message)}</p> : null}
            </div>
            <div className="admin-form-field admin-form-field-full">
              <label htmlFor="admin-plan-duration-days" className="admin-label admin-label-required">{t('VALIDITY_DAYS')}</label>
              <input id="admin-plan-duration-days" min="1" required className="admin-input" type="number" aria-invalid={Boolean(errors.durationDays)} aria-describedby={errors.durationDays ? 'admin-plan-duration-days-error' : undefined} {...register('durationDays')} placeholder={t('DAYS_PLACEHOLDER')} />
              {errors.durationDays ? <p id="admin-plan-duration-days-error" className="text-sm text-danger-text" role="alert">{getValidationMessage(errors.durationDays.message)}</p> : null}
            </div>
            <div className="admin-form-field admin-form-field-full">
              <label htmlFor="admin-plan-features" className="admin-label">{t('FEATURES_HELP')}</label>
              <textarea id="admin-plan-features" className="admin-textarea admin-shared-textarea-no-resize" aria-invalid={Boolean(errors.features)} aria-describedby={errors.features ? 'admin-plan-features-error' : undefined} {...register('features')} rows={4}  placeholder={t('FEATURES_PLACEHOLDER')} />
              {errors.features ? <p id="admin-plan-features-error" className="text-sm text-danger-text" role="alert">{getValidationMessage(errors.features.message)}</p> : null}
            </div>
          </div>
          <div className="admin-modal-footer">
            <button type="button" data-testid="admin_plans-AdminMembersPlansMain-control-009" className="admin-btn-ghost" onClick={requestClose}>{t('CANCEL')}</button>
            <button type="submit" data-testid="admin_plans-AdminMembersPlansMain-control-010" className="admin-btn-primary"><CheckCircle size={18} strokeWidth={2} /> {t('SAVE_PLAN')}</button>
          </div>
        </form>
        {confirmDiscard && <div role="alertdialog" aria-modal="true" aria-labelledby="admin-plans-discard-title" className="mt-4 rounded-lg border border-warning-bg bg-card p-4"><h3 id="admin-plans-discard-title" className="font-semibold text-text-primary">{t('UNSAVED_CHANGES_TITLE')}</h3><p className="mt-2 text-text-secondary">{t('UNSAVED_CHANGES_DESCRIPTION')}</p><div className="mt-4 flex justify-end gap-2"><button type="button" className="admin-btn-ghost min-h-11" onClick={() => { setConfirmDiscard(false); setPendingNavigation(null); }}>{t('KEEP_EDITING')}</button><button type="button" className="admin-btn-danger min-h-11" onClick={discardDraft}>{t('DISCARD_CHANGES')}</button></div></div>}
      </div>
    </div>
  );
}



export type { AdminPlansFormDialogProps };
