'use client';
/** Responsibility: Superadmin Libraries Panel; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminLibrariesOverviewPanel formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */

import { useSuperadminLibrariesOverviewValidationMessage } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/hooks/useSuperadminLibrariesOverviewValidationMessage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Edit2, X, CheckCircle, ShieldAlert, Mail, Phone } from 'lucide-react';
import type { SuperadminLibrariesPanelProps } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/types/SuperadminLibrariesOverviewTypes';
import { SUPERADMIN_LIBRARIES_PLAN_VALUES } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/constants/SuperadminLibrariesOverviewConstants';
import { SUPERADMIN_LIBRARIES_EDIT_SCHEMA, type SuperadminLibrariesEditFormValues } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/schemas/SuperadminLibrariesOverviewSchema';
import { SuperadminLibrariesFormatMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/utils/SuperadminLibrariesOverviewFormattingUtilities';
import { useTranslations, useLocale } from 'next-intl';
import { useSuperadminLibrariesOverviewUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/hooks/useSuperadminLibrariesOverviewUnsavedChangesGuard';


/** Accessible feature-owned details drawer. All changes remain local preview state until a verified API contract exists. */
export default function SuperadminLibrariesOverviewPanel({ lib, mode, onClose, onSave, onSuspend }: SuperadminLibrariesPanelProps) {
  const locale = useLocale();
  const t = useTranslations('SUPERADMIN_LIBRARIES');
  const translateValidationMessage = useSuperadminLibrariesOverviewValidationMessage();
  const [editing, setEditing] = useState(mode === 'edit');
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting , isDirty} } = useForm<SuperadminLibrariesEditFormValues>({
    resolver: zodResolver(SUPERADMIN_LIBRARIES_EDIT_SCHEMA),
    defaultValues: {
      name: lib.name,
      owner: lib.owner,
      email: lib.email,
      phone: lib.phone,
      gstNumber: lib.gstNumber,
      location: lib.location,
      plan: lib.plan,
    },
    mode: 'onBlur',
  });
  const { confirmLeave } = useSuperadminLibrariesOverviewUnsavedChangesGuard(isDirty, t('COPY.UNSAVED_CHANGES_WARNING'));
  const requestClose = useCallback(async () => {
    if (!(await confirmLeave())) return;
    reset({ name: lib.name, owner: lib.owner, email: lib.email, phone: lib.phone, gstNumber: lib.gstNumber, location: lib.location, plan: lib.plan });
    onCloseRef.current();
  }, [confirmLeave, lib, reset]);
  const requestCancelEdit = useCallback(async () => {
    if (!(await confirmLeave())) return;
    reset({ name: lib.name, owner: lib.owner, email: lib.email, phone: lib.phone, gstNumber: lib.gstNumber, location: lib.location, plan: lib.plan });
    setEditing(false);
  }, [confirmLeave, lib, reset]);

  // Effect contract: synchronize the effect-owned state or browser subscription with its explicit reactive dependencies; dependency set [lib, mode, reset] is the deliberate re-run boundary.
  useEffect(() => {
    reset({
      name: lib.name,
      owner: lib.owner,
      email: lib.email,
      phone: lib.phone,
      gstNumber: lib.gstNumber,
      location: lib.location,
      plan: lib.plan,
    });
    setEditing(mode === 'edit');
    setSaveError('');
  }, [lib, mode, reset]);

  // Effect contract: attach keyboard handling for the active interactive surface and remove it during cleanup; dependency set [editing] is the deliberate re-run boundary.
  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = window.requestAnimationFrame(() => {
      if (editing) firstInputRef.current?.focus();
      else panelRef.current?.querySelector<HTMLElement>('button:not([disabled])')?.focus();
    });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        requestClose();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const elements = Array.from<HTMLElement>(panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ));
      if (!elements.length) { event.preventDefault(); panelRef.current.focus(); return; }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [editing, requestClose]);

  const savePreview = handleSubmit(async (values) => {
    setSaveError('');
    try {
      await onSave({ ...lib, ...values });
      setSaved(true);
      setEditing(false);
    } catch {
      setSaveError('The sample changes could not be applied. No server data was changed.');
    }
  });

  const toggleStatus = async () => {
    setSaveError('');
    try {
      await onSuspend(lib.id);
    } catch {
      setSaveError('The sample status could not be changed. No server data was changed.');
    }
  };

  return (
    <div className="sa-panel-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) requestClose(); }}>
      <div className="sa-panel-backdrop" aria-hidden="true" />
      <div ref={panelRef} className="sa-panel-drawer" role="dialog" aria-modal="true" aria-labelledby="superadmin-libraries-panel-title" aria-describedby="superadmin-libraries-panel-description" tabIndex={-1}>
        <div className="flex items-start justify-between">
          <div>
            <h2 id="superadmin-libraries-panel-title" className="text-lg font-bold text-primary">{lib.name}</h2>
            <p className="text-sm text-secondary flex items-center gap-1 mt-1"><MapPin size={12} aria-hidden="true" />{lib.location}</p>
          </div>
          <div className="flex items-center gap-1">
            {!editing && <button type="button" aria-label={t("COPY.EDIT_LIBRARY_DETAILS_IN_PREVIEW")} className="sa-btn-icon" onClick={() => setEditing(true)} data-testid="superadmin-libraries-libraries-edit-library-details-in-preview-1"><Edit2 size={15} aria-hidden="true" /></button>}
            <button type="button" aria-label={t("COPY.CLOSE_LIBRARY_DETAILS")} className="sa-btn-icon" onClick={requestClose} data-testid="superadmin-libraries-libraries-close-library-details-2"><X size={16} aria-hidden="true" /></button>
          </div>
        </div>
        <p id="superadmin-libraries-panel-description" className="mb-4 mt-2 text-sm text-secondary">{t("COPY.SAMPLE_FIXTURE_ONLY_EDITING_AND_STATUS_CHANGES_REMAIN_LOCAL_TO_THIS_PAGE_AND_ARE_NOT_SENT_TO_A_SERVER")}</p>
        {saveError && <p className="mb-3 text-sm text-danger" role="alert">{saveError}</p>}

        {editing ? (
          <form className="space-y-3" onSubmit={savePreview} noValidate data-testid="superadmin-superadmin-libraries-overview-panel-form-line-139">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="superadmin-libraries-name" className="sa-label">{t("COPY.LIBRARY_NAME")}</label>
                <input ref={firstInputRef} id="superadmin-libraries-name" className="sa-input w-full" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'superadmin-libraries-name-error' : undefined} {...register('name')}  data-testid="superadmin-libraries-libraries-superadmin-libraries-name-3"/>
                {translateValidationMessage(errors.name?.message) && <p id="superadmin-libraries-name-error" className="text-xs text-danger" role="alert">{translateValidationMessage(errors.name.message)}</p>}
              </div>
              <div>
                <label htmlFor="superadmin-libraries-owner" className="sa-label">{t("COPY.OWNER_NAME")}</label>
                <input id="superadmin-libraries-owner" className="sa-input w-full" aria-invalid={Boolean(errors.owner)} aria-describedby={errors.owner ? 'superadmin-libraries-owner-error' : undefined} {...register('owner')}  data-testid="superadmin-libraries-libraries-superadmin-libraries-owner-4"/>
                {translateValidationMessage(errors.owner?.message) && <p id="superadmin-libraries-owner-error" className="text-xs text-danger" role="alert">{translateValidationMessage(errors.owner.message)}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="superadmin-libraries-email" className="sa-label">{t("COPY.EMAIL")}</label>
                <input id="superadmin-libraries-email" type="email" autoComplete="email" className="sa-input w-full" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'superadmin-libraries-email-error' : undefined} {...register('email')}  data-testid="superadmin-libraries-libraries-superadmin-libraries-email-5"/>
                {translateValidationMessage(errors.email?.message) && <p id="superadmin-libraries-email-error" className="text-xs text-danger" role="alert">{translateValidationMessage(errors.email.message)}</p>}
              </div>
              <div>
                <label htmlFor="superadmin-libraries-phone" className="sa-label">{t("COPY.PHONE")}</label>
                <input id="superadmin-libraries-phone" type="tel" autoComplete="tel" className="sa-input w-full" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'superadmin-libraries-phone-error' : undefined} {...register('phone')}  data-testid="superadmin-libraries-libraries-superadmin-libraries-phone-6"/>
                {translateValidationMessage(errors.phone?.message) && <p id="superadmin-libraries-phone-error" className="text-xs text-danger" role="alert">{translateValidationMessage(errors.phone.message)}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="superadmin-libraries-gst" className="sa-label">{t("COPY.GST_NUMBER_SAMPLE_IDENTIFIER")}</label>
              <input id="superadmin-libraries-gst" className="sa-input w-full" aria-invalid={Boolean(errors.gstNumber)} aria-describedby={errors.gstNumber ? 'superadmin-libraries-gst-error' : undefined} {...register('gstNumber')}  data-testid="superadmin-libraries-libraries-superadmin-libraries-gst-7"/>
              {translateValidationMessage(errors.gstNumber?.message) && <p id="superadmin-libraries-gst-error" className="text-xs text-danger" role="alert">{translateValidationMessage(errors.gstNumber.message)}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="superadmin-libraries-location" className="sa-label">{t("COPY.LOCATION")}</label>
                <input id="superadmin-libraries-location" className="sa-input w-full" aria-invalid={Boolean(errors.location)} aria-describedby={errors.location ? 'superadmin-libraries-location-error' : undefined} {...register('location')}  data-testid="superadmin-libraries-libraries-superadmin-libraries-location-8"/>
                {translateValidationMessage(errors.location?.message) && <p id="superadmin-libraries-location-error" className="text-xs text-danger" role="alert">{translateValidationMessage(errors.location.message)}</p>}
              </div>
              <div>
                <label htmlFor="superadmin-libraries-plan" className="sa-label">{t("COPY.SAAS_PLAN")}</label>
                <select id="superadmin-libraries-plan" className="sa-input appearance-none w-full" aria-invalid={Boolean(errors.plan)} {...register('plan')} data-testid="superadmin-libraries-libraries-superadmin-libraries-plan-9">
                  {SUPERADMIN_LIBRARIES_PLAN_VALUES.map((plan) => <option key={plan} value={plan}>{plan}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <button type="button" className="sa-btn-ghost" onClick={requestCancelEdit} data-testid="superadmin-libraries-libraries-cancel-10">{t("COPY.CANCEL")}</button>
              <button type="submit" className="sa-btn-primary" disabled={isSubmitting} data-testid="superadmin-libraries-libraries-applying-preview-11">{isSubmitting ? t('COPY.APPLYING_PREVIEW') : saved ? t('COPY.UPDATE_PREVIEW') : t('COPY.SAVE_PREVIEW')}</button>
            </div>
          </form>
        ) : (
          <>
            <div className="sa-card p-4 flex flex-col gap-4 border-border bg-success-bg">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="sa-label mb-1">{t("COPY.LIFETIME_REVENUE_SAMPLE")}</p>
                  <p className="text-2xl font-black text-success">{SuperadminLibrariesFormatMajorPreviewCurrency(lib.revenue, 'INR', locale)}</p>
                </div>
                <div className="text-right">
                  <p className="sa-label mb-1">{t("COPY.NEXT_RENEWAL")}</p>
                  <p className="text-sm font-bold text-primary">{lib.nextRenewal}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="sa-panel-info-cell"><p className="sa-panel-info-label">{t("COPY.ACTIVE_BRANCHES")}</p><p className="sa-panel-info-value">{lib.branches}</p></div>
              <div className="sa-panel-info-cell"><p className="sa-panel-info-label">{t("COPY.ACTIVE_STUDENTS")}</p><p className="sa-panel-info-value">{lib.students}</p></div>
              <div className="sa-panel-info-cell"><p className="sa-panel-info-label">{t("COPY.PLAN_TYPE")}</p><p className="sa-panel-info-value text-info">{lib.plan}</p></div>
              <div className="sa-panel-info-cell"><p className="sa-panel-info-label">{t("COPY.SAMPLE_GST_IDENTIFIER")}</p><p className="sa-panel-info-value sa-panel-info-value--mono">{lib.gstNumber}</p></div>
            </div>
            <div className="space-y-3 mt-4 border-t border-border pt-4">
              <h3 className="text-xs font-bold text-secondary uppercase tracking-widest">{t("COPY.CONTACT_INFORMATION")}</h3>
              <div className="flex items-center gap-3 p-3 bg-surface-hover rounded-lg border border-border"><Mail size={16} aria-hidden="true" className="text-secondary" /><div><p className="text-xs text-secondary">{t("COPY.EMAIL_ADDRESS")}</p><p className="text-sm font-medium text-primary">{lib.email}</p></div></div>
              <div className="flex items-center gap-3 p-3 bg-surface-hover rounded-lg border border-border"><Phone size={16} aria-hidden="true" className="text-secondary" /><div><p className="text-xs text-secondary">{t("COPY.PHONE_NUMBER")}</p><p className="text-sm font-medium text-primary">{lib.phone}</p></div></div>
            </div>
            <div className="mt-auto pt-6 flex flex-col gap-3">
              <button type="button" className={`w-full flex items-center justify-center gap-2 p-3 text-sm font-bold rounded-xl motion-safe:transition-colors motion-reduce:transition-none border border-border ${lib.status === 'Active' ? 'text-danger bg-danger-bg hover:bg-danger-bg' : 'text-success bg-success-bg hover:bg-success-bg'}`} onClick={toggleStatus} data-testid="superadmin-libraries-libraries-toggle-status-in-preview-currently-12">
                {lib.status === 'Active' ? <ShieldAlert size={16} aria-hidden="true" /> : <CheckCircle size={16} aria-hidden="true" />}
                {t("COPY.TOGGLE_STATUS_IN_PREVIEW_CURRENTLY")} {t(lib.status === 'Active' ? 'COPY.ACTIVE' : 'COPY.MAINTENANCE')})
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
