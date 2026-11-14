'use client';

import { useSuperadminSupportTicketsOverviewConfirm } from '@/app/frontend_superadmin/superadmin_support/support_tickets/hooks/useSuperadminSupportTicketsOverviewConfirm';
/** Responsibility: Superadmin Support Tickets Detail Panel; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSupportTicketsOverviewDetailPanel formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Clock, X, Send, Paperclip, User, HelpCircle, Bug, CreditCard, Lock, Flag } from 'lucide-react';
import type { SuperadminSupportTicketsDetailPanelProps } from '@/app/frontend_superadmin/superadmin_support/support_tickets/types/SuperadminSupportTicketsOverviewTypes';
import { SUPERADMIN_SUPPORT_TICKETS_ASSIGNEE_OPTIONS } from '@/app/frontend_superadmin/superadmin_support/support_tickets/constants/SuperadminSupportTicketsOverviewConstants';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_SUPPORT_TICKETS_DETAIL_PANEL_SELECTOR } from '@/app/frontend_superadmin/superadmin_support/support_tickets/constants/SuperadminSupportTicketsOverviewStaticConstants';


/**
 * Renders the `superadmin_support` view owned by `SuperadminSupportTicketsOverviewDetailPanel`.
 * Owns local UI state for `status`, `assignee`, `replyText`, `isInternalNote`, `operationMessage`.
 * Effect lifecycle boundaries are `[requestClose]`; live dirty state is read through a ref so editing does not restart focus management.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminSupportTicketsOverviewDetailPanel({ tkt, onClose, onSave }: SuperadminSupportTicketsDetailPanelProps) {
  const confirm = useSuperadminSupportTicketsOverviewConfirm();
  const t = useTranslations('SUPERADMIN_SUPPORT_TICKETS');
  const [status, setStatus] = useState(tkt.status);
  const [assignee, setAssignee] = useState(tkt.assignee);
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [operationMessage, setOperationMessage] = useState('');
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const isDirty = status !== tkt.status || assignee !== tkt.assignee || replyText.trim().length > 0 || isInternalNote;
  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;

  const requestClose = useCallback(async () => {
    if (isDirtyRef.current && !await confirm(t('COPY.UNSAVED_CHANGES_WARNING'))) return;
    onClose();
  }, [confirm, onClose, t]);

  // Effect contract: manage keyboard focus, Escape/Tab behavior, and focus restoration for the active SUPERADMIN_SUPPORT_TICKETS_DETAIL_PANEL_DIALOG or drawer; dependency set [requestClose] is the deliberate re-run boundary.
  useEffect(() => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    
    
    const focusableElements = () => Array.from<HTMLElement>(dialogRef.current?.querySelectorAll<HTMLElement>(SUPERADMIN_SUPPORT_TICKETS_DETAIL_PANEL_SELECTOR) ?? []).filter((item) => item.offsetParent !== null);
    focusableElements()[0]?.focus();
    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); requestClose(); return; }
      if (event.key !== 'Tab') return;
      const items = focusableElements();
      if (!items.length) { event.preventDefault(); dialogRef.current?.focus(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', handleDialogKeyDown);
    return () => {
      document.removeEventListener('keydown', handleDialogKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [requestClose]);

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    setOperationMessage(t('COPY.REPLY_UNAVAILABLE_MESSAGE'));
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Billing': return <CreditCard size={12} />;
      case 'Bug': return <Bug size={12} />;
      case 'Account': return <Lock size={12} />;
      default: return <HelpCircle size={12} />;
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-overlay backdrop-blur-sm motion-safe:animate-in motion-safe:fade-in motion-reduce:animate-none" style={{ padding: "max(24px, env(safe-area-inset-top)) max(24px, env(safe-area-inset-right)) max(24px, env(safe-area-inset-bottom)) max(24px, env(safe-area-inset-left))" }} onClick={requestClose} data-testid="superadmin-superadmin-support-tickets-overview-detail-panel-div-line-72">
      <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="superadmin-support-ticket-detail-title" className="bg-page border border-border rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden" style={{ maxHeight: "calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 48px)" }} onClick={e => e.stopPropagation()} data-testid="superadmin-superadmin-support-tickets-overview-detail-panel-div-line-73">
        
        {/* Header */}
        <div className="p-5 border-b border-border flex items-start justify-between bg-surface-highlight">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs text-info bg-info-bg px-2 py-0.5 rounded border border-border">{tkt.id}</span>
              <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                status === 'Resolved' ? 'text-success bg-success-bg' : status === 'Open' ? 'text-danger bg-danger-bg' : 'text-warning bg-warning-bg'
              }`}>
                {status === 'Open' ? t('COPY.STATUS_OPEN') : status === 'In-Progress' ? t('COPY.STATUS_IN_PROGRESS') : t('COPY.STATUS_RESOLVED')}
              </span>
              {tkt.slaBreach && <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full text-danger bg-danger-bg motion-safe:animate-pulse"><Flag size={10}/> {t("COPY.SLA_BREACH")}</span>}
            </div>
            <h2 id="superadmin-support-ticket-detail-title" className="text-xl font-bold text-primary">{tkt.subject}</h2>
            <div className="flex items-center gap-4 mt-2 text-xs text-secondary">
              <span className="flex items-center gap-1"><User size={12} /> {tkt.tenant}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {t("COPY.OPENED")} {tkt.age} {t("COPY.AGO")}</span>
              <span className="flex items-center gap-1">{getCategoryIcon(tkt.category)} {t(`COPY.CATEGORY_${String(tkt.category).toUpperCase()}` as 'COPY.CATEGORY_BILLING' | 'COPY.CATEGORY_BUG' | 'COPY.CATEGORY_ACCOUNT' | 'COPY.CATEGORY_GENERAL' | 'COPY.CATEGORY_SUPPORT')}</span>
            </div>
          </div>
          <button type="button" aria-label={t("COPY.CLOSE_TICKET_DETAILS")} className="text-secondary hover:text-primary p-1 rounded hover:bg-surface-hover motion-safe:transition-colors motion-reduce:transition-none" onClick={requestClose} data-testid="superadmin-support-tickets-support-tickets-detail-close-ticket-details-1"><X size={20} /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Quick Actions & Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-xl bg-surface-hover border border-border">
            <div>
              <p className="text-xs uppercase tracking-wider text-secondary font-semibold mb-1">{t("COPY.ASSIGNEE")}</p>
              <select aria-label={t("COPY.TICKET_ASSIGNEE_LOCAL_PREVIEW_ONLY")} className="bg-transparent text-sm text-primary font-medium outline-none cursor-pointer w-full" value={assignee} onChange={e => setAssignee(e.target.value)} data-testid="superadmin-support-tickets-support-tickets-detail-ticket-assignee-local-preview-only-2">
                {SUPERADMIN_SUPPORT_TICKETS_ASSIGNEE_OPTIONS.map((option) => <option key={option} value={option}>{t(option === 'Unassigned' ? 'COPY.ASSIGNEE_UNASSIGNED' : option === 'Sample Agent A' ? 'COPY.ASSIGNEE_SAMPLE_AGENT_A' : 'COPY.ASSIGNEE_SAMPLE_AGENT_B')}</option>)}
              </select>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-secondary font-semibold mb-1">{t("COPY.PRIORITY")}</p>
              <span className={`text-sm font-bold ${tkt.priority === 'High' ? 'text-danger' : tkt.priority === 'Medium' ? 'text-warning' : 'text-secondary'}`}>{t(tkt.priority === 'High' ? 'COPY.PRIORITY_HIGH' : tkt.priority === 'Medium' ? 'COPY.PRIORITY_MEDIUM' : 'COPY.PRIORITY_LOW')}</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-secondary font-semibold mb-1">{t("COPY.UPDATE_STATUS")}</p>
              <select aria-label={t("COPY.TICKET_STATUS_LOCAL_PREVIEW_ONLY")} className="bg-transparent text-sm text-primary font-medium outline-none cursor-pointer w-full" value={status} onChange={e => setStatus(e.target.value)} data-testid="superadmin-support-tickets-support-tickets-detail-ticket-status-local-preview-only-3">
                <option value="Open">{t("COPY.OPEN")}</option>
                <option value="In-Progress">{t("COPY.IN_PROGRESS")}</option>
                <option value="Resolved">{t("COPY.RESOLVED")}</option>
              </select>
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              className="rounded-lg border border-border bg-surface-hover px-4 py-2 text-sm font-semibold text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              onClick={() => {
                onSave({ ...tkt, status, assignee });
                setOperationMessage(t('COPY.LOCAL_PREVIEW_APPLIED_MESSAGE'));
              }}
             data-testid="superadmin-support-tickets-support-tickets-detail-apply-local-preview-changes-4">
              {t("COPY.APPLY_LOCAL_PREVIEW_CHANGES")}
            </button>
          </div>

          {/* Original Message */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-info-bg flex items-center justify-center shrink-0 border border-border">
              <span className="text-info font-bold text-sm">{tkt.tenant.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <div className="bg-surface-hover border border-border rounded-2xl rounded-tl-none p-4 text-sm text-primary leading-relaxed">
                {tkt.desc}
                {tkt.hasAttachment && (
                  <div className="mt-4 flex items-center gap-2 p-2 rounded-lg bg-floating border border-border w-max">
                    <Paperclip size={14} className="text-info" />
                    <span className="text-xs text-info font-medium">{t("COPY.SAMPLE_ATTACHMENT_ERROR_SCREENSHOT_PNG_DOWNLOAD_UNAVAILABLE")}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-secondary mt-1.5 ml-1">{tkt.age} {t("COPY.AGO")}</p>
            </div>
          </div>

          {/* Thread (Mock) */}
          {tkt.replies > 1 && (
            <div className="flex gap-4 flex-row-reverse">
              <div className="w-10 h-10 rounded-full bg-success-bg flex items-center justify-center shrink-0 border border-border">
                <span className="text-success font-bold text-sm">{t("COPY.S")}</span>
              </div>
              <div className="flex-1 flex flex-col items-end">
                <div className="bg-success-bg border border-border rounded-2xl rounded-tr-none p-4 text-sm text-primary leading-relaxed">
                  {t("COPY.WE_ARE_LOOKING_INTO_THIS_ISSUE_RIGHT_NOW_COULD_YOU_PLEASE_CONFIRM_IF_THIS_HAPPENS_ON_MOBILE_APP_AS_WELL")}
                </div>
                <p className="text-xs text-secondary mt-1.5 mr-1">{t("COPY.SUPPORT_AGENT")} {tkt.age} {t("COPY.AGO")}</p>
              </div>
            </div>
          )}

        </div>

        {/* Reply Box */}
        <div className="p-5 border-t border-border bg-floating">
          {operationMessage && <p className="mb-3 rounded-md border border-border bg-warning-bg p-3 text-sm text-warning" role="alert">{operationMessage}</p>}
          <div className="flex items-center gap-4 mb-3">
            <button type="button" 
              aria-pressed={!isInternalNote} className={`text-xs font-semibold px-3 py-1.5 rounded-full motion-safe:transition-colors motion-reduce:transition-none ${!isInternalNote ? 'bg-info-bg text-info' : 'text-secondary hover:text-primary'}`}
              onClick={() => setIsInternalNote(false)}
             data-testid="superadmin-support-tickets-support-tickets-detail-public-reply-5">
              {t("COPY.PUBLIC_REPLY")}
            </button>
            <button type="button" 
              aria-pressed={isInternalNote} className={`text-xs font-semibold px-3 py-1.5 rounded-full motion-safe:transition-colors motion-reduce:transition-none ${isInternalNote ? 'bg-warning-bg text-warning' : 'text-secondary hover:text-primary'}`}
              onClick={() => setIsInternalNote(true)}
             data-testid="superadmin-support-tickets-support-tickets-detail-internal-note-hidden-6">
              {t("COPY.INTERNAL_NOTE_HIDDEN")}
            </button>
          </div>
          
          <div className={`relative rounded-xl border ${isInternalNote ? 'border-border bg-warning-bg text-warning' : 'border-border bg-info-bg'} p-1`}>
            <label htmlFor="superadmin-support-ticket-reply-text" className="sr-only">{isInternalNote ? t('COPY.INTERNAL_NOTE_TEXT') : t('COPY.PUBLIC_REPLY_TEXT')}</label>
            <textarea id="superadmin-support-ticket-reply-text" maxLength={5000}
              className="w-full bg-transparent text-sm text-primary p-3 outline-none resize-none min-h-25"
              placeholder={isInternalNote ? t('COPY.TYPE_PRIVATE_NOTE_PLACEHOLDER') : t('COPY.TYPE_REPLY_TO_TENANT_PLACEHOLDER')}
              value={replyText}
              onChange={e => { setReplyText(e.target.value); setOperationMessage(''); }}
             data-testid="superadmin-support-tickets-support-tickets-detail-superadmin-support-ticket-reply-text-7"/>
            <div className="flex items-center justify-between p-2">
              <button type="button" disabled aria-label={t("COPY.ATTACH_FILE_UNAVAILABLE")} title={t("COPY.UNAVAILABLE_ATTACHMENT_UPLOAD_IS_NOT_IMPLEMENTED_IN_THE_SUPPLIED_HOST_API_CONTRACT")} className="text-secondary opacity-60 p-2 rounded cursor-not-allowed" data-testid="superadmin-support-tickets-support-tickets-detail-attach-file-unavailable-8"><Paperclip size={16} /></button>
              
              <button type="button" 
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold motion-safe:transition-all motion-reduce:transition-none shadow-lg ${
                  isInternalNote ? 'bg-warning-bg text-warning hover:bg-warning-bg hover:text-warning text-warning' : 'bg-info text-on-info hover:bg-info hover:text-on-info'
                } disabled:opacity-50`}
                onClick={handleSendReply}
                disabled={!replyText.trim()}
               data-testid="superadmin-support-tickets-support-tickets-detail-add-note-9">
                <Send size={16} />
                {isInternalNote ? t('COPY.ADD_NOTE') : t('COPY.SEND_REPLY')}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
