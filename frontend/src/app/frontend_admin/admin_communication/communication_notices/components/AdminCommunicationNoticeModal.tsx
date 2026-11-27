'use client';

import { applyNoticePreset, type NoticePresetType } from '@/app/frontend_admin/admin_communication/communication_notices/components/AdminCommunicationNoticePresets';
import type { AdminCommunicationNoticeFormValues } from '@/app/frontend_admin/admin_communication/communication_notices/schemas/AdminCommunicationNoticesSchema';
import type { Notice } from '@/app/frontend_admin/admin_communication/communication_notices/types/AdminCommunicationNoticesComponentTypes';
import type { AdminBranchItem } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBranchConstants';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { AlertTriangle, Building2, Mail, MessageSquare, Radio, Send, ShieldAlert, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { UseFormReturn } from 'react-hook-form';

const NOTICE_QUICK_PRESETS: ReadonlyArray<{
  preset: NoticePresetType;
  label: string;
  hindi: string;
  boxClass: string;
  titleClass: string;
}> = [
  { preset: 'WEATHER', label: '🌧️ Rain Closure', hindi: 'भारी बारिश अवकाश', boxClass: 'border-danger bg-danger-bg hover:opacity-90', titleClass: 'text-danger-text' },
  { preset: 'HOLIDAY', label: '🎉 Holiday Off', hindi: 'सार्वजनिक अवकाश', boxClass: 'border-warning bg-warning-bg hover:opacity-90', titleClass: 'text-warning-text' },
  { preset: 'POWER', label: '⚡ Power Work', hindi: 'विद्युत मेंटेनेंस', boxClass: 'border-info bg-info-bg hover:opacity-90', titleClass: 'text-info-text' },
  { preset: 'SECURITY', label: '🛑 ID Checking', hindi: 'सुरक्षा चेकिंग', boxClass: 'border-purple-text bg-purple-bg hover:opacity-90', titleClass: 'text-purple-text' },
];

const BROADCAST_CHANNELS = [
  { name: 'sendWhatsApp' as const, label: 'WhatsApp', aria: 'WhatsApp Broadcast', color: 'text-success-text', Icon: MessageSquare },
  { name: 'sendEmail' as const, label: 'Email', aria: 'Email Broadcast', color: 'text-info-text', Icon: Mail },
  { name: 'sendSms' as const, label: 'SMS Alert', aria: 'SMS Flash Alert', color: 'text-warning-text', Icon: Send },
] as const;

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

  const isEmergency = isEmergencyMode || noticeForm.watch('isEmergency');

  return (
    <Dialog open onOpenChange={(nextOpen) => { if (!nextOpen) { if (showDiscardDialog) onStay(); else onRequestClose(); } }}>
      <DialogContent className={`relative w-full overflow-y-auto rounded-xl border p-6 shadow-dialog max-w-[620px] space-y-4 bg-overlay text-text-primary ${isEmergency ? 'border-danger' : 'border-border'}`}>
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
                className="min-h-11 rounded-md bg-danger px-4 py-2 text-sm font-semibold text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
                <div className="p-2 rounded-xl bg-danger-bg text-danger-text border border-danger shrink-0 motion-safe:animate-pulse">
                  <AlertTriangle size={20} />
                </div>
              )}
              <div>
                <DialogTitle className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <span>{editItem ? t('NOTICE_EDIT_DIALOG_TITLE') : isEmergency ? '🚨 Emergency Notice Broadcast (आपातकालीन नोटिस प्रसारण)' : t('NOTICE_CREATE_DIALOG_TITLE')}</span>
                </DialogTitle>
                {isEmergency && (
                  <p className="text-xs text-danger-text mt-0.5">
                    High-priority blast to all network branches via WhatsApp, SMS & Push Alert
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-danger bg-danger-bg p-3.5 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-danger-text flex items-center gap-1.5">
                  <AlertTriangle size={13} className="text-danger-text" />
                  Quick Broadcast Presets (1-क्लिक टेम्पलेट्स)
                </span>
                <span className="text-[11px] text-text-secondary">Click to autofill notice</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {NOTICE_QUICK_PRESETS.map((item) => (
                  <button
                    key={item.preset}
                    type="button"
                    onClick={() => applyNoticePreset(item.preset, noticeForm)}
                    className={`rounded-lg border p-2 text-left motion-safe:transition-colors ${item.boxClass}`}
                  >
                    <span className={`text-xs font-bold block truncate ${item.titleClass}`}>{item.label}</span>
                    <span className="text-[10px] text-text-secondary block truncate">{item.hindi}</span>
                  </button>
                ))}
              </div>
            </div>

            <DialogDescription className="sr-only">{t('NOTICE_FORM_DESCRIPTION')}</DialogDescription>
            <form onSubmit={noticeForm.handleSubmit(onSave)} noValidate className="flex flex-col gap-3.5 space-y-4">
              <div>
                <label htmlFor="admin-communication-notice-title" className="uppercase tracking-[0.07em] text-sm font-semibold mb-1 block text-text-primary">
                  {t('NOTICE_TITLE_LABEL')} <span className="text-danger-text">*</span>
                </label>
                <input
                  maxLength={30}
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

              <div>
                <label htmlFor="admin-communication-notice-branch" className="uppercase tracking-[0.07em] text-sm font-semibold mb-1 text-text-primary flex items-center gap-1.5">
                  <Building2 size={14} className="text-primary-text" />
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
                  maxLength={1000}
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
                  maxLength={30}
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

              <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Radio className="h-4 w-4 text-primary-text" />
                  <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    Multi-Channel Broadcast Dispatch
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  {BROADCAST_CHANNELS.map(({ name, label, aria, color, Icon }) => (
                    <label key={name} className="flex items-center gap-2.5 rounded-lg border border-border bg-surface p-2.5 cursor-pointer hover:bg-card-hover motion-safe:transition-colors">
                      <input type="checkbox" aria-label={aria} {...noticeForm.register(name)} className={`rounded border-border ${color} focus:ring-primary h-4 w-4`} />
                      <span className={`flex items-center gap-1.5 text-xs font-semibold ${color}`}>
                        <Icon size={13} />
                        <span>{label}</span>
                      </span>
                    </label>
                  ))}
                </div>
                <div className="rounded-lg bg-warning-bg border border-warning px-3 py-2 text-[11px] text-warning-text flex items-start gap-1.5">
                  <ShieldAlert size={14} className="shrink-0 text-warning-text mt-0.5" />
                  <span><strong>Cost Protection Notice:</strong> SMS Flash Alert consumes paid Server API credits. WhatsApp Web and Push Broadcast are recommended for routine notices to keep operational billing minimal.</span>
                </div>
              </div>

              <p className="rounded-md border border-warning bg-warning-bg p-3 text-warning-text" role="status">
                {t('NOTICE_PERSISTENCE_BLOCKED')}
              </p>
              <div className="flex-wrap border-border pt-3 mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  data-testid="admin_communication-page-control-006"
                  onClick={onRequestClose}
                  className="min-h-11 px-4 py-2 border border-border text-text-primary rounded hover:bg-surface-hover motion-safe:transition-colors"
                >
                  {t('NOTICE_CANCEL')}
                </button>
                <button
                  type="submit"
                  data-testid="admin_communication-page-control-007"
                  disabled={!isDemoMode}
                  title={!isDemoMode ? t('NOTICE_PERSISTENCE_BLOCKED') : undefined}
                  className={`min-h-11 px-4 py-2 font-semibold rounded motion-safe:transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${isEmergency ? 'bg-danger text-on-primary hover:opacity-90 shadow-lg' : 'bg-primary text-on-primary hover:bg-primary-hover'}`}
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
