'use client';
/** Responsibility: Superadmin Libraries Center Modal; renders library view/edit details modal popup with solid opaque colors, rich cards, icons, and action controls. */
import { useSuperadminLibrariesOverviewValidationMessage } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/hooks/useSuperadminLibrariesOverviewValidationMessage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  MapPin, Edit2, X, CheckCircle, ShieldAlert,
  Eye, Building2
} from 'lucide-react';
import type { SuperadminLibrariesPanelProps, SuperadminLibrariesLibrary } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/types/SuperadminLibrariesOverviewTypes';
import { SUPERADMIN_LIBRARIES_EDIT_SCHEMA, type SuperadminLibrariesEditFormValues } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/schemas/SuperadminLibrariesOverviewSchema';
import { useTranslations } from 'next-intl';
import { useSuperadminLibrariesOverviewUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/hooks/useSuperadminLibrariesOverviewUnsavedChangesGuard';
import SuperadminLibrariesOverviewPanelEditForm from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesOverviewPanelEditForm';
import SuperadminLibrariesOverviewPanelViewContent from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesOverviewPanelViewContent';

/**
 * Accessible, solid, non-transparent center modal popup for library details & configuration.
 */
export default function SuperadminLibrariesOverviewPanel({ lib, mode, onClose, onSave, onSuspend }: SuperadminLibrariesPanelProps) {
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
        {/* Modal Header */}
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
                  <span className={`w-1.5 h-1.5 rounded-full ${lib.status === 'Active' ? 'bg-emerald-400 motion-safe:animate-pulse' : 'bg-amber-400'}`} />
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
                aria-label={t('COPY.EDIT_LIBRARY_DETAILS_IN_PREVIEW')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-500/35 bg-indigo-500/20 text-xs font-semibold text-indigo-300 hover:text-white hover:bg-indigo-600/30 motion-safe:transition-all cursor-pointer"
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white motion-safe:transition-all cursor-pointer"
                onClick={requestCancelEdit}
                title="Switch to Overview"
              >
                <Eye size={13} aria-hidden="true" />
                <span className="hidden sm:inline">View</span>
              </button>
            )}
            <button
              type="button"
              aria-label={t('COPY.CLOSE_LIBRARY_DETAILS')}
              className="p-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 hover:border-slate-600 motion-safe:transition-all cursor-pointer"
              onClick={requestClose}
              title="Close drawer"
              data-testid="superadmin-libraries-libraries-close-library-details-2"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center border-b border-indigo-500/20 bg-[#0f172a] px-5 sm:px-6 shrink-0">
          <button
            type="button"
            onClick={() => setEditing(false)}
            className={`inline-flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 motion-safe:transition-all cursor-pointer ${
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
            className={`inline-flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 motion-safe:transition-all cursor-pointer ${
              editing
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit2 size={14} />
            <span>Edit Settings</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-[#0a0f1d]">
          <p id="superadmin-libraries-panel-description" className="text-xs text-slate-400 leading-relaxed">
            {t('COPY.SAMPLE_FIXTURE_ONLY_EDITING_AND_STATUS_CHANGES_REMAIN_LOCAL_TO_THIS_PAGE_AND_ARE_NOT_SENT_TO_A_SERVER')}
          </p>

          {saveError && (
            <p className="text-xs font-semibold text-rose-400 bg-[#280c10] p-3 rounded-xl border border-rose-500/40" role="alert">
              {saveError}
            </p>
          )}

          {editing ? (
            <SuperadminLibrariesOverviewPanelEditForm
              register={register}
              errors={errors}
              isSubmitting={isSubmitting}
              saved={saved}
              firstInputRef={firstInputRef}
              translateValidationMessage={translateValidationMessage}
              onCancel={requestCancelEdit}
              onSubmit={savePreview}
            />
          ) : (
            <SuperadminLibrariesOverviewPanelViewContent lib={lib} />
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 sm:p-5 bg-[#131b35] border-t border-indigo-500/25 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl motion-safe:transition-all border cursor-pointer ${
                lib.status === 'Active'
                  ? 'text-rose-300 bg-rose-500/15 border-rose-500/35 hover:bg-rose-500/25 shadow-sm shadow-rose-950/40'
                  : 'text-emerald-300 bg-emerald-500/15 border-emerald-500/35 hover:bg-emerald-500/25 shadow-sm shadow-emerald-950/40'
              }`}
              onClick={toggleStatus}
              data-testid="superadmin-libraries-libraries-toggle-status-in-preview-currently-12"
            >
              {lib.status === 'Active' ? <ShieldAlert size={14} className="text-rose-400" /> : <CheckCircle size={14} className="text-emerald-400" />}
              <span>{t('COPY.TOGGLE_STATUS_IN_PREVIEW_CURRENTLY')} ({lib.status === 'Active' ? t('COPY.ACTIVE') : t('COPY.MAINTENANCE')})</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={requestClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 motion-safe:transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
