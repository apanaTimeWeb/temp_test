'use client';

import type { AdminCommunicationNoticeFormValues } from '@/app/frontend_admin/admin_communication/communication_notices/schemas/AdminCommunicationNoticesSchema';
import type { Notice } from '@/app/frontend_admin/admin_communication/communication_notices/types/AdminCommunicationNoticesComponentTypes';
import type { AdminBranchItem } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBranchConstants';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { AlertTriangle,Building2,Mail,MessageSquare,Radio,Send,Sparkles,X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { UseFormReturn } from 'react-hook-form';

export interface AdminCommunicationNoticeModalProps {
  showAdd: boolean;
  showDiscardDialog: boolean;
  editItem: Notice | null;
  noticeForm: UseFormReturn<AdminCommunicationNoticeFormValues>;
  isDemoMode: boolean;
  branches: readonly AdminBranchItem[];
  isEmergencyMode?: boolean;
  onRequestClose: () => void;
  onDiscard: () => void;
  onStay: () => void;
  onSave: (values: AdminCommunicationNoticeFormValues) => void;
}

export function AdminCommunicationNoticeModal({
  showAdd,
  showDiscardDialog,
  editItem,
  noticeForm,
  isDemoMode,
  branches,
  isEmergencyMode = false,
  onRequestClose,
  onDiscard,
  onStay,
  onSave,
}: AdminCommunicationNoticeModalProps) {
  const t = useTranslations('ADMIN_COMMUNICATION');

  if (!showAdd) return null;

  const applyPreset = (preset: 'WEATHER' | 'HOLIDAY' | 'POWER' | 'SECURITY') => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const formatDate = (d: Date) => d.toISOString().slice(0, 10);

    if (preset === 'WEATHER') {
      noticeForm.setValue('title', 'Urgent: All Library Branches Closed Today Due to Heavy Rainfall', { shouldDirty: true });
      noticeForm.setValue('message', 'Dear Students, Due to continuous heavy rainfall, severe waterlogging, and safety guidelines from municipal authorities, all Smart Library branch halls will remain CLOSED today. Digital portal and e-resources remain 24x7 active. Next operational advisory by 8:00 PM.', { shouldDirty: true });
      noticeForm.setValue('validTill', formatDate(tomorrow), { shouldDirty: true });
      noticeForm.setValue('targetBranch', 'All Branches', { shouldDirty: true });
      noticeForm.setValue('sendWhatsApp', true, { shouldDirty: true });
      noticeForm.setValue('sendEmail', true, { shouldDirty: true });
      noticeForm.setValue('sendSms', true, { shouldDirty: true });
      noticeForm.setValue('priority', 'EMERGENCY', { shouldDirty: true });
      noticeForm.setValue('isEmergency', true, { shouldDirty: true });
    } else if (preset === 'HOLIDAY') {
      noticeForm.setValue('title', 'Notice: Library Network Closed for Scheduled Holiday', { shouldDirty: true });
      noticeForm.setValue('message', 'Dear Students, Please be advised that all library study halls across the network will remain closed tomorrow in observance of the public holiday. Study shifts and reserved desks will resume standard schedule from 6:00 AM on the following day.', { shouldDirty: true });
      noticeForm.setValue('validTill', formatDate(tomorrow), { shouldDirty: true });
      noticeForm.setValue('targetBranch', 'All Branches', { shouldDirty: true });
      noticeForm.setValue('sendWhatsApp', true, { shouldDirty: true });
      noticeForm.setValue('sendEmail', true, { shouldDirty: true });
      noticeForm.setValue('sendSms', true, { shouldDirty: true });
      noticeForm.setValue('priority', 'EMERGENCY', { shouldDirty: true });
      noticeForm.setValue('isEmergency', true, { shouldDirty: true });
    } else if (preset === 'POWER') {
      noticeForm.setValue('title', 'Notice: Essential Power Grid & Generator Maintenance', { shouldDirty: true });
      noticeForm.setValue('message', 'Notice: Essential electrical line maintenance and backup generator testing scheduled today between 2:00 PM and 5:00 PM. Reading desk lamps and emergency lighting will remain operational. Silent study continues uninterrupted.', { shouldDirty: true });
      noticeForm.setValue('validTill', formatDate(tomorrow), { shouldDirty: true });
      noticeForm.setValue('targetBranch', 'All Branches', { shouldDirty: true });
      noticeForm.setValue('sendWhatsApp', true, { shouldDirty: true });
      noticeForm.setValue('sendEmail', true, { shouldDirty: true });
      noticeForm.setValue('sendSms', false, { shouldDirty: true });
      noticeForm.setValue('priority', 'URGENT', { shouldDirty: true });
      noticeForm.setValue('isEmergency', true, { shouldDirty: true });
    } else if (preset === 'SECURITY') {
      noticeForm.setValue('title', 'Security Advisory: Mandatory ID Badge & Biometric Inspection', { shouldDirty: true });
      noticeForm.setValue('message', 'Security Alert: Surprise administrative inspection in progress. Carrying digital Smart ID card and barcode pass is strictly mandatory for biometric turnstile entry. Non-registered individuals will be barred.', { shouldDirty: true });
      noticeForm.setValue('validTill', formatDate(nextWeek), { shouldDirty: true });
      noticeForm.setValue('targetBranch', 'All Branches', { shouldDirty: true });
      noticeForm.setValue('sendWhatsApp', true, { shouldDirty: true });
      noticeForm.setValue('sendEmail', true, { shouldDirty: true });
      noticeForm.setValue('sendSms', true, { shouldDirty: true });
      noticeForm.setValue('priority', 'EMERGENCY', { shouldDirty: true });
      noticeForm.setValue('isEmergency', true, { shouldDirty: true });
    }
  };

  const isEmergency = isEmergencyMode || noticeForm.watch('isEmergency');

  return (
    <Dialog open onOpenChange={(nextOpen) => { if (!nextOpen) { if (showDiscardDialog) onStay(); else onRequestClose(); } }}>
      <DialogContent className={`relative w-full overflow-y-auto rounded-xl border p-6 shadow-dialog max-w-[620px] space-y-4 ${isEmergency ? 'border-rose-500/40 bg-slate-900 text-white' : 'border-border bg-overlay text-text-primary'}`}>
        {showDiscardDialog ? (
          <>
            <DialogTitle>{t('UNSAVED_CHANGES_TITLE')}</DialogTitle>
            <DialogDescription>{t('UNSAVED_CHANGES_DESCRIPTION')}</DialogDescription>
            <DialogFooter>
              <button
                type="button"
                className="min-h-11 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={onStay}
              >
                {t('UNSAVED_CHANGES_STAY')}
              </button>
              <button
                type="button"
                className="min-h-11 rounded-md bg-danger px-4 py-2 text-sm font-semibold text-on-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={onDiscard}
              >
                {t('UNSAVED_CHANGES_LEAVE')}
              </button>
            </DialogFooter>
          </>
        ) : (
          <>
            <button
              type="button"
              aria-label={t('NOTICE_ROW_CLOSE_FORM_ARIA')}
              data-testid="admin_communication-page-control-005"
              onClick={onRequestClose}
              className="absolute right-4 top-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md p-1 text-text-secondary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:text-danger-text"
            >
              <X size={18} strokeWidth={2} />
            </button>
            
            <div className="flex items-center gap-2.5 mb-2">
              {isEmergency && (
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0 animate-pulse">
                  <AlertTriangle size={20} />
                </div>
              )}
              <div>
                <DialogTitle className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <span>{editItem ? t('NOTICE_EDIT_DIALOG_TITLE') : isEmergency ? '🚨 Emergency Notice Broadcast (आपातकालीन नोटिस प्रसारण)' : t('NOTICE_CREATE_DIALOG_TITLE')}</span>
                </DialogTitle>
                {isEmergency && (
                  <p className="text-xs text-rose-300 mt-0.5">
                    High-priority blast to all network branches via WhatsApp, SMS & Push Alert
                  </p>
                )}
              </div>
            </div>

            {/* Quick 1-Click Presets for Emergency Announcements */}
            <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3.5 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-rose-400" />
                  Quick Broadcast Presets (1-क्लिक टेम्पलेट्स)
                </span>
                <span className="text-[11px] text-slate-400">Click to autofill notice</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset('WEATHER')}
                  className="rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/25 p-2 text-left transition-colors"
                >
                  <span className="text-xs font-bold text-rose-300 block truncate">🌧️ Rain Closure</span>
                  <span className="text-[10px] text-slate-400 block truncate">भारी बारिश अवकाश</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('HOLIDAY')}
                  className="rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/25 p-2 text-left transition-colors"
                >
                  <span className="text-xs font-bold text-amber-300 block truncate">🎉 Holiday Off</span>
                  <span className="text-[10px] text-slate-400 block truncate">सार्वजनिक अवकाश</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('POWER')}
                  className="rounded-lg border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/25 p-2 text-left transition-colors"
                >
                  <span className="text-xs font-bold text-sky-300 block truncate">⚡ Power Work</span>
                  <span className="text-[10px] text-slate-400 block truncate">विद्युत मेंटेनेंस</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('SECURITY')}
                  className="rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/25 p-2 text-left transition-colors"
                >
                  <span className="text-xs font-bold text-purple-300 block truncate">🛑 ID Checking</span>
                  <span className="text-[10px] text-slate-400 block truncate">सुरक्षा चेकिंग</span>
                </button>
              </div>
            </div>

            <DialogDescription className="sr-only">{t('NOTICE_FORM_DESCRIPTION')}</DialogDescription>
            <form onSubmit={noticeForm.handleSubmit(onSave)} noValidate className="flex flex-col gap-3.5 space-y-4">
              <div>
                <label htmlFor="admin-communication-notice-title" className="uppercase tracking-[0.07em] text-sm font-semibold mb-1 block text-text-primary">
                  {t('NOTICE_TITLE_LABEL')} <span className="text-danger-text">*</span>
                </label>
                <input
                  id="admin-communication-notice-title"
                  className="min-h-11 border-border bg-input text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 py-2 px-3 border rounded w-full"
                  placeholder={t('NOTICE_TITLE_PLACEHOLDER')}
                  aria-invalid={Boolean(noticeForm.formState.errors.title)}
                  aria-describedby={noticeForm.formState.errors.title ? 'admin-communication-notice-title-error' : undefined}
                  {...noticeForm.register('title')}
                />
                {noticeForm.formState.errors.title && (
                  <p id="admin-communication-notice-title-error" className="text-sm text-danger-text" role="alert">
                    {noticeForm.formState.errors.title.message}
                  </p>
                )}
              </div>

              {/* Target Branch Dropdown */}
              <div>
                <label htmlFor="admin-communication-notice-branch" className="uppercase tracking-[0.07em] text-sm font-semibold mb-1 block text-text-primary flex items-center gap-1.5">
                  <Building2 size={14} className="text-primary" />
                  Target Audience / Branch
                </label>
                <select
                  id="admin-communication-notice-branch"
                  className="min-h-11 border-border bg-input text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary py-2 px-3 border rounded w-full"
                  {...noticeForm.register('targetBranch')}
                >
                  <option value="All Branches">All Branches (Network-Wide Notice)</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name} ({b.code})
                    </option>
                  ))}
                </select>
                <span className="mt-1 block text-xs text-text-secondary">
                  Choose specific library branch or broadcast across all network locations.
                </span>
              </div>

              <div>
                <label htmlFor="admin-communication-notice-message" className="uppercase tracking-[0.07em] text-sm font-semibold mb-1 block text-text-primary">
                  {t('NOTICE_MESSAGE_LABEL')} <span className="text-danger-text">*</span>
                </label>
                <textarea
                  id="admin-communication-notice-message"
                  className="min-h-24 resize-y border-border bg-input text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 py-2 px-3 border rounded w-full"
                  rows={5}
                  placeholder={t('NOTICE_MESSAGE_PLACEHOLDER')}
                  aria-invalid={Boolean(noticeForm.formState.errors.message)}
                  aria-describedby={noticeForm.formState.errors.message ? 'admin-communication-notice-message-error' : undefined}
                  {...noticeForm.register('message')}
                />
                {noticeForm.formState.errors.message && (
                  <p id="admin-communication-notice-message-error" className="text-sm text-danger-text" role="alert">
                    {noticeForm.formState.errors.message.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="admin-communication-notice-valid-till" className="uppercase tracking-[0.07em] text-sm font-semibold mb-1 block text-text-primary">
                  {t('NOTICE_VALID_TILL_LABEL')} <span className="text-danger-text">*</span>
                </label>
                <input
                  id="admin-communication-notice-valid-till"
                  type="date"
                  className="min-h-11 border-border bg-input text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 py-2 px-3 border rounded w-full"
                  aria-invalid={Boolean(noticeForm.formState.errors.validTill)}
                  aria-describedby={noticeForm.formState.errors.validTill ? 'admin-communication-notice-valid-till-error' : undefined}
                  {...noticeForm.register('validTill')}
                />
                {noticeForm.formState.errors.validTill && (
                  <p id="admin-communication-notice-valid-till-error" className="text-sm text-danger-text" role="alert">
                    {noticeForm.formState.errors.validTill.message}
                  </p>
                )}
              </div>

              {/* Multi-Channel Broadcast Dispatch */}
              <div className="rounded-xl border border-border bg-card/60 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    Multi-Channel Broadcast Dispatch
                  </span>
                </div>
                <p className="text-xs text-text-secondary">
                  Optionally broadcast this notice directly to enrolled students through external channels upon saving:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <label className="flex items-center gap-2.5 rounded-lg border border-border bg-card p-2.5 cursor-pointer hover:bg-card-hover transition-colors">
                    <input
                      type="checkbox"
                      aria-label="WhatsApp Broadcast"
                      {...noticeForm.register('sendWhatsApp')}
                      className="rounded border-border text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                      <MessageSquare size={13} />
                      <span>WhatsApp</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-2.5 rounded-lg border border-border bg-card p-2.5 cursor-pointer hover:bg-card-hover transition-colors">
                    <input
                      type="checkbox"
                      aria-label="Email Broadcast"
                      {...noticeForm.register('sendEmail')}
                      className="rounded border-border text-sky-600 focus:ring-sky-500 h-4 w-4"
                    />
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-400">
                      <Mail size={13} />
                      <span>Email</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-2.5 rounded-lg border border-border bg-card p-2.5 cursor-pointer hover:bg-card-hover transition-colors">
                    <input
                      type="checkbox"
                      aria-label="SMS Flash Alert"
                      {...noticeForm.register('sendSms')}
                      className="rounded border-border text-amber-600 focus:ring-amber-500 h-4 w-4"
                    />
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                      <Send size={13} />
                      <span>SMS Alert</span>
                    </div>
                  </label>
                </div>
              </div>

              <p className="rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text" role="status">
                {t('NOTICE_PERSISTENCE_BLOCKED')}
              </p>
              <div className="flex-wrap border-border pt-3 mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  data-testid="admin_communication-page-control-006"
                  onClick={onRequestClose}
                  className="min-h-11 px-4 py-2 border border-border text-primary rounded hover:bg-surface-hover motion-safe:transition-colors"
                >
                  {t('NOTICE_CANCEL')}
                </button>
                <button
                  type="submit"
                  data-testid="admin_communication-page-control-007"
                  disabled={!isDemoMode}
                  title={!isDemoMode ? t('NOTICE_PERSISTENCE_BLOCKED') : undefined}
                  className={`min-h-11 px-4 py-2 font-semibold text-white rounded motion-safe:transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${isEmergency ? 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 shadow-lg shadow-rose-600/30' : 'bg-primary text-on-primary hover:bg-primary-hover'}`}
                >
                  {isEmergency ? '🚨 Blast Emergency Broadcast (तत्काल प्रसारण करें)' : editItem ? t('NOTICE_EDIT_UNAVAILABLE') : t('NOTICE_CREATE_UNAVAILABLE')}
                </button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
export default AdminCommunicationNoticeModal;

