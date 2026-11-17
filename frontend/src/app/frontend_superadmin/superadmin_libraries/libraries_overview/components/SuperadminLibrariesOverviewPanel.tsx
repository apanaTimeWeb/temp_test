'use client';
/** Responsibility: Superadmin Libraries Panel; renders library view/edit details drawer with rich colors, icons, and action buttons. */
import { useSuperadminLibrariesOverviewValidationMessage } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/hooks/useSuperadminLibrariesOverviewValidationMessage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Edit2, X, CheckCircle, ShieldAlert, Mail, Phone, IndianRupee, Building, Users } from 'lucide-react';
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

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<SuperadminLibrariesEditFormValues>({
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
    <div className="fixed inset-0 z-50 flex justify-end" onMouseDown={(event) => { if (event.target === event.currentTarget) requestClose(); }}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" aria-hidden="true" />
      <div
        ref={panelRef}
        className="relative z-10 w-full max-w-lg h-full overflow-y-auto border-l border-indigo-500/25 bg-[#0c0f28]/98 p-6 sm:p-7 shadow-2xl flex flex-col justify-between"
        role="dialog"
        aria-modal="true"
        aria-labelledby="superadmin-libraries-panel-title"
        aria-describedby="superadmin-libraries-panel-description"
        tabIndex={-1}
      >
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-border/80">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 mb-2">
                <span>Facility Details</span>
              </div>
              <h2 id="superadmin-libraries-panel-title" className="text-xl font-bold text-white tracking-tight">{lib.name}</h2>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1.5">
                <MapPin size={13} className="text-indigo-400 shrink-0" aria-hidden="true" />
                <span>{lib.location}</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {!editing && (
                <button
                  type="button"
                  aria-label={t("COPY.EDIT_LIBRARY_DETAILS_IN_PREVIEW")}
                  className="p-2 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 hover:text-white hover:bg-indigo-600/30 transition-all cursor-pointer"
                  onClick={() => setEditing(true)}
                  title="Edit details"
                  data-testid="superadmin-libraries-libraries-edit-library-details-in-preview-1"
                >
                  <Edit2 size={15} aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                aria-label={t("COPY.CLOSE_LIBRARY_DETAILS")}
                className="p-2 rounded-xl border border-border bg-card text-secondary hover:text-white hover:border-indigo-400 transition-all cursor-pointer"
                onClick={requestClose}
                title="Close drawer"
                data-testid="superadmin-libraries-libraries-close-library-details-2"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          </div>

          <p id="superadmin-libraries-panel-description" className="my-3 text-xs text-slate-400 leading-relaxed">
            {t("COPY.SAMPLE_FIXTURE_ONLY_EDITING_AND_STATUS_CHANGES_REMAIN_LOCAL_TO_THIS_PAGE_AND_ARE_NOT_SENT_TO_A_SERVER")}
          </p>
          {saveError && <p className="mb-3 text-xs font-semibold text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/30" role="alert">{saveError}</p>}

          {editing ? (
            <form className="space-y-3.5 mt-4" onSubmit={savePreview} noValidate data-testid="superadmin-superadmin-libraries-overview-panel-form-line-139">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="superadmin-libraries-name" className="sa-label text-xs">{t("COPY.LIBRARY_NAME")}</label>
                  <input
                    ref={firstInputRef}
                    id="superadmin-libraries-name"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-indigo-500/25 bg-input text-white focus:border-indigo-400 outline-none"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'superadmin-libraries-name-error' : undefined}
                    {...register('name')}
                    data-testid="superadmin-libraries-libraries-superadmin-libraries-name-3"
                  />
                  {translateValidationMessage(errors.name?.message) && <p id="superadmin-libraries-name-error" className="text-xs text-rose-400 mt-1" role="alert">{translateValidationMessage(errors.name.message)}</p>}
                </div>
                <div>
                  <label htmlFor="superadmin-libraries-owner" className="sa-label text-xs">{t("COPY.OWNER_NAME")}</label>
                  <input
                    id="superadmin-libraries-owner"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-indigo-500/25 bg-input text-white focus:border-indigo-400 outline-none"
                    aria-invalid={Boolean(errors.owner)}
                    aria-describedby={errors.owner ? 'superadmin-libraries-owner-error' : undefined}
                    {...register('owner')}
                    data-testid="superadmin-libraries-libraries-superadmin-libraries-owner-4"
                  />
                  {translateValidationMessage(errors.owner?.message) && <p id="superadmin-libraries-owner-error" className="text-xs text-rose-400 mt-1" role="alert">{translateValidationMessage(errors.owner.message)}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="superadmin-libraries-email" className="sa-label text-xs">{t("COPY.EMAIL")}</label>
                  <input
                    id="superadmin-libraries-email"
                    type="email"
                    autoComplete="email"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-indigo-500/25 bg-input text-white focus:border-indigo-400 outline-none"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'superadmin-libraries-email-error' : undefined}
                    {...register('email')}
                    data-testid="superadmin-libraries-libraries-superadmin-libraries-email-5"
                  />
                  {translateValidationMessage(errors.email?.message) && <p id="superadmin-libraries-email-error" className="text-xs text-rose-400 mt-1" role="alert">{translateValidationMessage(errors.email.message)}</p>}
                </div>
                <div>
                  <label htmlFor="superadmin-libraries-phone" className="sa-label text-xs">{t("COPY.PHONE")}</label>
                  <input
                    id="superadmin-libraries-phone"
                    type="tel"
                    autoComplete="tel"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-indigo-500/25 bg-input text-white focus:border-indigo-400 outline-none"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'superadmin-libraries-phone-error' : undefined}
                    {...register('phone')}
                    data-testid="superadmin-libraries-libraries-superadmin-libraries-phone-6"
                  />
                  {translateValidationMessage(errors.phone?.message) && <p id="superadmin-libraries-phone-error" className="text-xs text-rose-400 mt-1" role="alert">{translateValidationMessage(errors.phone.message)}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="superadmin-libraries-gst" className="sa-label text-xs">{t("COPY.GST_NUMBER_SAMPLE_IDENTIFIER")}</label>
                <input
                  id="superadmin-libraries-gst"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-indigo-500/25 bg-input text-white focus:border-indigo-400 outline-none"
                  aria-invalid={Boolean(errors.gstNumber)}
                  aria-describedby={errors.gstNumber ? 'superadmin-libraries-gst-error' : undefined}
                  {...register('gstNumber')}
                  data-testid="superadmin-libraries-libraries-superadmin-libraries-gst-7"
                />
                {translateValidationMessage(errors.gstNumber?.message) && <p id="superadmin-libraries-gst-error" className="text-xs text-rose-400 mt-1" role="alert">{translateValidationMessage(errors.gstNumber.message)}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="superadmin-libraries-location" className="sa-label text-xs">{t("COPY.LOCATION")}</label>
                  <input
                    id="superadmin-libraries-location"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-indigo-500/25 bg-input text-white focus:border-indigo-400 outline-none"
                    aria-invalid={Boolean(errors.location)}
                    aria-describedby={errors.location ? 'superadmin-libraries-location-error' : undefined}
                    {...register('location')}
                    data-testid="superadmin-libraries-libraries-superadmin-libraries-location-8"
                  />
                  {translateValidationMessage(errors.location?.message) && <p id="superadmin-libraries-location-error" className="text-xs text-rose-400 mt-1" role="alert">{translateValidationMessage(errors.location.message)}</p>}
                </div>
                <div>
                  <label htmlFor="superadmin-libraries-plan" className="sa-label text-xs">{t("COPY.SAAS_PLAN")}</label>
                  <select
                    id="superadmin-libraries-plan"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-indigo-500/25 bg-card text-white focus:border-indigo-400 outline-none cursor-pointer"
                    aria-invalid={Boolean(errors.plan)}
                    {...register('plan')}
                    data-testid="superadmin-libraries-libraries-superadmin-libraries-plan-9"
                  >
                    {SUPERADMIN_LIBRARIES_PLAN_VALUES.map((plan) => <option key={plan} value={plan}>{plan}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-white cursor-pointer"
                  onClick={requestCancelEdit}
                  data-testid="superadmin-libraries-libraries-cancel-10"
                >
                  {t("COPY.CANCEL")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold shadow-md shadow-emerald-950/50 cursor-pointer disabled:opacity-50"
                  disabled={isSubmitting}
                  data-testid="superadmin-libraries-libraries-applying-preview-11"
                >
                  {isSubmitting ? t('COPY.APPLYING_PREVIEW') : saved ? t('COPY.UPDATE_PREVIEW') : t('COPY.SAVE_PREVIEW')}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 mt-4">
              {/* Revenue Banner */}
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-1">{t("COPY.LIFETIME_REVENUE_SAMPLE")}</p>
                  <p className="text-2xl font-black text-emerald-400 flex items-center gap-1">
                    <IndianRupee size={20} />
                    <span>{SuperadminLibrariesFormatMajorPreviewCurrency(lib.revenue, 'INR', locale)}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{t("COPY.NEXT_RENEWAL")}</p>
                  <p className="text-xs font-bold text-white bg-slate-800/80 px-2.5 py-1 rounded-md border border-border">{lib.nextRenewal}</p>
                </div>
              </div>

              {/* Metric Cells */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-1">
                    <Building size={13} className="text-indigo-400" />
                    <span>{t("COPY.ACTIVE_BRANCHES")}</span>
                  </div>
                  <p className="text-lg font-bold text-white">{lib.branches}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-sky-500/20 bg-sky-500/5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-1">
                    <Users size={13} className="text-sky-400" />
                    <span>{t("COPY.ACTIVE_STUDENTS")}</span>
                  </div>
                  <p className="text-lg font-bold text-white">{lib.students?.toLocaleString() ?? 0}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-purple-500/20 bg-purple-500/5">
                  <div className="text-xs text-slate-300 mb-1">{t("COPY.PLAN_TYPE")}</div>
                  <p className="text-sm font-bold text-purple-300">{lib.plan}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-border bg-card/60">
                  <div className="text-xs text-slate-300 mb-1">{t("COPY.SAMPLE_GST_IDENTIFIER")}</div>
                  <p className="text-xs font-mono font-bold text-slate-300 truncate">{lib.gstNumber}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2.5 border-t border-border/80 pt-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t("COPY.CONTACT_INFORMATION")}</h3>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-indigo-500/20 bg-[#0e122b]/60">
                  <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                    <Mail size={15} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-400">{t("COPY.EMAIL_ADDRESS")}</p>
                    <p className="text-xs font-semibold text-white truncate">{lib.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-500/20 bg-[#091a16]/60">
                  <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <Phone size={15} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-400">{t("COPY.PHONE_NUMBER")}</p>
                    <p className="text-xs font-semibold text-white truncate">{lib.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Toggle Status */}
        {!editing && (
          <div className="pt-6 border-t border-border/80 mt-6">
            <button
              type="button"
              className={`w-full flex items-center justify-center gap-2 p-3 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
                lib.status === 'Active'
                  ? 'text-rose-300 bg-rose-500/15 border-rose-500/30 hover:bg-rose-500/25 shadow-sm shadow-rose-950/40'
                  : 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30 hover:bg-emerald-500/25 shadow-sm shadow-emerald-950/40'
              }`}
              onClick={toggleStatus}
              data-testid="superadmin-libraries-libraries-toggle-status-in-preview-currently-12"
            >
              {lib.status === 'Active' ? <ShieldAlert size={15} className="text-rose-400" /> : <CheckCircle size={15} className="text-emerald-400" />}
              <span>{t("COPY.TOGGLE_STATUS_IN_PREVIEW_CURRENTLY")} ({lib.status === 'Active' ? t('COPY.ACTIVE') : t('COPY.MAINTENANCE')})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
