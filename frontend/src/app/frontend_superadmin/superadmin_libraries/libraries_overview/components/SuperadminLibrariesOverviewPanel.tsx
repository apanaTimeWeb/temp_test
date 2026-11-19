'use client';
/** Responsibility: Superadmin Libraries Center Modal; renders library view/edit details modal popup with solid opaque colors, rich cards, icons, and action controls. */
import { useSuperadminLibrariesOverviewValidationMessage } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/hooks/useSuperadminLibrariesOverviewValidationMessage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  MapPin, Edit2, X, CheckCircle, ShieldAlert, Mail, Phone,
  IndianRupee, Building, Users, Eye, Building2, UserCheck
} from 'lucide-react';
import type { SuperadminLibrariesPanelProps, SuperadminLibrariesLibrary } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/types/SuperadminLibrariesOverviewTypes';
import { SUPERADMIN_LIBRARIES_PLAN_VALUES } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/constants/SuperadminLibrariesOverviewConstants';
import { SUPERADMIN_LIBRARIES_EDIT_SCHEMA, type SuperadminLibrariesEditFormValues } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/schemas/SuperadminLibrariesOverviewSchema';
import { SuperadminLibrariesFormatMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/utils/SuperadminLibrariesOverviewFormattingUtilities';
import { useTranslations, useLocale } from 'next-intl';
import { useSuperadminLibrariesOverviewUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/hooks/useSuperadminLibrariesOverviewUnsavedChangesGuard';

/**
 * Accessible, solid, non-transparent center modal popup for library details & configuration.
 */
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
      await onSave({ ...lib, ...values, plan: values.plan as SuperadminLibrariesLibrary['plan'] });
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
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border border-indigo-500/40 bg-[#0f172a] text-white shadow-2xl shadow-black overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="superadmin-libraries-panel-title"
        aria-describedby="superadmin-libraries-panel-description"
        tabIndex={-1}
      >
        {/* ─── Modal Header ─── */}
        <div className="flex items-center justify-between gap-4 p-5 sm:p-6 bg-[#131b35] border-b border-indigo-500/25 shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-500/35 text-indigo-400 shrink-0">
              <Building2 size={22} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/35">
                  Facility Details
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  lib.status === 'Active'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${lib.status === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  {lib.status}
                </span>
              </div>
              <h2 id="superadmin-libraries-panel-title" className="text-xl font-extrabold text-white tracking-tight truncate">
                {lib.name}
              </h2>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                <MapPin size={12} className="text-indigo-400 shrink-0" aria-hidden="true" />
                <span className="truncate">{lib.location}</span>
              </p>
            </div>
          </div>

          {/* Header Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {!editing ? (
              <button
                type="button"
                aria-label={t("COPY.EDIT_LIBRARY_DETAILS_IN_PREVIEW")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-500/35 bg-indigo-500/20 text-xs font-semibold text-indigo-300 hover:text-white hover:bg-indigo-600/30 transition-all cursor-pointer"
                onClick={() => setEditing(true)}
                title="Edit details"
                data-testid="superadmin-libraries-libraries-edit-library-details-in-preview-1"
              >
                <Edit2 size={13} aria-hidden="true" />
                <span className="hidden sm:inline">Edit</span>
              </button>
            ) : (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
                onClick={requestCancelEdit}
                title="Switch to Overview"
              >
                <Eye size={13} aria-hidden="true" />
                <span className="hidden sm:inline">View</span>
              </button>
            )}
            <button
              type="button"
              aria-label={t("COPY.CLOSE_LIBRARY_DETAILS")}
              className="p-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 hover:border-slate-600 transition-all cursor-pointer"
              onClick={requestClose}
              title="Close drawer"
              data-testid="superadmin-libraries-libraries-close-library-details-2"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* ─── Mode Switcher Tabs ─── */}
        <div className="flex items-center border-b border-indigo-500/20 bg-[#0f172a] px-5 sm:px-6 shrink-0">
          <button
            type="button"
            onClick={() => setEditing(false)}
            className={`inline-flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              !editing
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye size={14} />
            <span>Facility Overview</span>
          </button>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className={`inline-flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              editing
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit2 size={14} />
            <span>Edit Settings</span>
          </button>
        </div>

        {/* ─── Modal Scrollable Content ─── */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-[#0a0f1d]">
          <p id="superadmin-libraries-panel-description" className="text-xs text-slate-400 leading-relaxed">
            {t("COPY.SAMPLE_FIXTURE_ONLY_EDITING_AND_STATUS_CHANGES_REMAIN_LOCAL_TO_THIS_PAGE_AND_ARE_NOT_SENT_TO_A_SERVER")}
          </p>

          {saveError && (
            <p className="text-xs font-semibold text-rose-400 bg-[#280c10] p-3 rounded-xl border border-rose-500/40" role="alert">
              {saveError}
            </p>
          )}

          {editing ? (
            /* ─── Edit Mode Form ─── */
            <form className="space-y-4" onSubmit={savePreview} noValidate data-testid="superadmin-superadmin-libraries-overview-panel-form-line-139">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="superadmin-libraries-name" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t("COPY.LIBRARY_NAME")}
                  </label>
                  <input
                    id="superadmin-libraries-name"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-indigo-500/30 bg-[#131d38] text-white placeholder:text-slate-500 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition-all"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'superadmin-libraries-name-error' : undefined}
                    {...register('name')}
                    ref={(el) => {
                      register('name').ref(el);
                      if (firstInputRef) (firstInputRef as { current: HTMLInputElement | null }).current = el;
                    }}
                    data-testid="superadmin-libraries-libraries-superadmin-libraries-name-3"
                  />
                  {errors.name?.message && (
                    <p id="superadmin-libraries-name-error" className="text-xs text-rose-400 mt-1" role="alert">
                      {translateValidationMessage(errors.name.message)}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="superadmin-libraries-owner" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t("COPY.OWNER_NAME")}
                  </label>
                  <input
                    id="superadmin-libraries-owner"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-indigo-500/30 bg-[#131d38] text-white placeholder:text-slate-500 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition-all"
                    aria-invalid={Boolean(errors.owner)}
                    aria-describedby={errors.owner ? 'superadmin-libraries-owner-error' : undefined}
                    {...register('owner')}
                    data-testid="superadmin-libraries-libraries-superadmin-libraries-owner-4"
                  />
                  {errors.owner?.message && (
                    <p id="superadmin-libraries-owner-error" className="text-xs text-rose-400 mt-1" role="alert">
                      {translateValidationMessage(errors.owner.message)}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="superadmin-libraries-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t("COPY.EMAIL")}
                  </label>
                  <input
                    id="superadmin-libraries-email"
                    type="email"
                    autoComplete="email"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-indigo-500/30 bg-[#131d38] text-white placeholder:text-slate-500 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition-all"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'superadmin-libraries-email-error' : undefined}
                    {...register('email')}
                    data-testid="superadmin-libraries-libraries-superadmin-libraries-email-5"
                  />
                  {errors.email?.message && (
                    <p id="superadmin-libraries-email-error" className="text-xs text-rose-400 mt-1" role="alert">
                      {translateValidationMessage(errors.email.message)}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="superadmin-libraries-phone" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t("COPY.PHONE")}
                  </label>
                  <input
                    id="superadmin-libraries-phone"
                    type="tel"
                    autoComplete="tel"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-indigo-500/30 bg-[#131d38] text-white placeholder:text-slate-500 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition-all"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'superadmin-libraries-phone-error' : undefined}
                    {...register('phone')}
                    data-testid="superadmin-libraries-libraries-superadmin-libraries-phone-6"
                  />
                  {errors.phone?.message && (
                    <p id="superadmin-libraries-phone-error" className="text-xs text-rose-400 mt-1" role="alert">
                      {translateValidationMessage(errors.phone.message)}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="superadmin-libraries-gst" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t("COPY.GST_NUMBER_SAMPLE_IDENTIFIER")}
                </label>
                <input
                  id="superadmin-libraries-gst"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-indigo-500/30 bg-[#131d38] text-white placeholder:text-slate-500 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition-all"
                  aria-invalid={Boolean(errors.gstNumber)}
                  aria-describedby={errors.gstNumber ? 'superadmin-libraries-gst-error' : undefined}
                  {...register('gstNumber')}
                  data-testid="superadmin-libraries-libraries-superadmin-libraries-gst-7"
                />
                {errors.gstNumber?.message && (
                  <p id="superadmin-libraries-gst-error" className="text-xs text-rose-400 mt-1" role="alert">
                    {translateValidationMessage(errors.gstNumber.message)}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="superadmin-libraries-location" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t("COPY.LOCATION")}
                  </label>
                  <input
                    id="superadmin-libraries-location"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-indigo-500/30 bg-[#131d38] text-white placeholder:text-slate-500 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition-all"
                    aria-invalid={Boolean(errors.location)}
                    aria-describedby={errors.location ? 'superadmin-libraries-location-error' : undefined}
                    {...register('location')}
                    data-testid="superadmin-libraries-libraries-superadmin-libraries-location-8"
                  />
                  {errors.location?.message && (
                    <p id="superadmin-libraries-location-error" className="text-xs text-rose-400 mt-1" role="alert">
                      {translateValidationMessage(errors.location.message)}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="superadmin-libraries-plan" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t("COPY.SAAS_PLAN")}
                  </label>
                  <select
                    id="superadmin-libraries-plan"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-indigo-500/30 bg-[#131d38] text-white focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none cursor-pointer"
                    aria-invalid={Boolean(errors.plan)}
                    {...register('plan')}
                    data-testid="superadmin-libraries-libraries-superadmin-libraries-plan-9"
                  >
                    {SUPERADMIN_LIBRARIES_PLAN_VALUES.map((plan) => (
                      <option key={plan} value={plan} className="bg-slate-900 text-white">
                        {plan}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
                  onClick={requestCancelEdit}
                  data-testid="superadmin-libraries-libraries-cancel-10"
                >
                  {t("COPY.CANCEL")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold shadow-md shadow-emerald-950/50 cursor-pointer disabled:opacity-50 transition-all"
                  disabled={isSubmitting}
                  data-testid="superadmin-libraries-libraries-applying-preview-11"
                >
                  {isSubmitting ? t('COPY.APPLYING_PREVIEW') : saved ? t('COPY.UPDATE_PREVIEW') : t('COPY.SAVE_PREVIEW')}
                </button>
              </div>
            </form>
          ) : (
            /* ─── Facility Overview / View Mode ─── */
            <div className="space-y-4">
              {/* Lifetime Revenue & Renewal Banner */}
              <div className="p-4 rounded-xl border border-emerald-500/35 bg-[#06241a] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div>
                  <p className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-1">
                    {t("COPY.LIFETIME_REVENUE_SAMPLE")}
                  </p>
                  <p className="text-2xl font-black text-emerald-400 flex items-center gap-1">
                    <IndianRupee size={22} />
                    <span>{SuperadminLibrariesFormatMajorPreviewCurrency(lib.revenue, 'INR', locale)}</span>
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    {t("COPY.NEXT_RENEWAL")}
                  </p>
                  <span className="inline-block text-xs font-bold text-white bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700">
                    {lib.nextRenewal}
                  </span>
                </div>
              </div>

              {/* 4 KPI Quick Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl border border-indigo-500/25 bg-[#111936]">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-1">
                    <Building size={13} className="text-indigo-400" />
                    <span>{t("COPY.ACTIVE_BRANCHES")}</span>
                  </div>
                  <p className="text-lg font-bold text-white">{lib.branches}</p>
                </div>

                <div className="p-3.5 rounded-xl border border-sky-500/25 bg-[#0c2238]">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-1">
                    <Users size={13} className="text-sky-400" />
                    <span>{t("COPY.ACTIVE_STUDENTS")}</span>
                  </div>
                  <p className="text-lg font-bold text-white">{lib.students?.toLocaleString() ?? 0}</p>
                </div>

                <div className="p-3.5 rounded-xl border border-purple-500/25 bg-[#221338]">
                  <div className="text-xs text-slate-300 mb-1">{t("COPY.PLAN_TYPE")}</div>
                  <p className="text-sm font-bold text-purple-300">{lib.plan}</p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-700 bg-[#161c2e]">
                  <div className="text-xs text-slate-300 mb-1">{t("COPY.SAMPLE_GST_IDENTIFIER")}</div>
                  <p className="text-xs font-mono font-bold text-slate-300 truncate">{lib.gstNumber}</p>
                </div>
              </div>

              {/* Contact Information Cards */}
              <div className="space-y-2.5 border-t border-slate-800 pt-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t("COPY.CONTACT_INFORMATION")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-indigo-500/25 bg-[#111936]">
                    <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/35 shrink-0">
                      <Mail size={15} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-400">{t("COPY.EMAIL_ADDRESS")}</p>
                      <p className="text-xs font-semibold text-white truncate">{lib.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-500/25 bg-[#0a231b]">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/35 shrink-0">
                      <Phone size={15} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-400">{t("COPY.PHONE_NUMBER")}</p>
                      <p className="text-xs font-semibold text-white truncate">{lib.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-700 bg-[#131d38]">
                  <div className="p-2 rounded-lg bg-slate-800 text-indigo-300 border border-slate-700 shrink-0">
                    <UserCheck size={15} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-400">Library Primary Administrator</p>
                    <p className="text-xs font-semibold text-white">{lib.owner}</p>
                  </div>
                </div>
              </div>

              {/* Multi-Branch Infrastructure Breakdown (1 Admin -> N Branches) */}
              <div className="space-y-2.5 border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Building size={13} className="text-indigo-400" />
                    <span>Managed Branches ({lib.branches})</span>
                  </h3>
                  <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-500/20 border border-indigo-500/35 px-2 py-0.5 rounded-full">
                    Multi-Branch Network
                  </span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {Array.from({ length: lib.branches }, (_, idx) => {
                    const branchName = idx === 0 ? `${lib.name} - Central Campus` : `${lib.name} - Branch #${idx + 1}`;
                    const branchCity = idx === 0 ? lib.location : `${lib.location} Zone ${idx + 1}`;
                    const branchSeats = Math.round(lib.students / Math.max(1, lib.branches)) || 120;
                    const managerName = idx === 0 ? `${lib.owner} (Owner)` : `Branch Manager #${idx + 1}`;
                    return (
                      <div key={`br-${lib.id}-${idx}`} className="p-3 rounded-xl border border-slate-800 bg-[#111827] flex items-center justify-between gap-3 hover:border-indigo-500/40 transition-colors">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{branchName}</p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 flex-wrap">
                            <span className="flex items-center gap-1">
                              <MapPin size={10} className="text-indigo-400" /> {branchCity}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Users size={10} className="text-sky-400" /> {branchSeats} Seats
                            </span>
                            <span>•</span>
                            <span className="text-[10px] text-slate-500">{managerName}</span>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                          Active
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── Modal Footer ─── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 sm:p-5 bg-[#131b35] border-t border-indigo-500/25 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all border cursor-pointer ${
                lib.status === 'Active'
                  ? 'text-rose-300 bg-rose-500/15 border-rose-500/35 hover:bg-rose-500/25 shadow-sm shadow-rose-950/40'
                  : 'text-emerald-300 bg-emerald-500/15 border-emerald-500/35 hover:bg-emerald-500/25 shadow-sm shadow-emerald-950/40'
              }`}
              onClick={toggleStatus}
              data-testid="superadmin-libraries-libraries-toggle-status-in-preview-currently-12"
            >
              {lib.status === 'Active' ? <ShieldAlert size={14} className="text-rose-400" /> : <CheckCircle size={14} className="text-emerald-400" />}
              <span>{t("COPY.TOGGLE_STATUS_IN_PREVIEW_CURRENTLY")} ({lib.status === 'Active' ? t('COPY.ACTIVE') : t('COPY.MAINTENANCE')})</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={requestClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
