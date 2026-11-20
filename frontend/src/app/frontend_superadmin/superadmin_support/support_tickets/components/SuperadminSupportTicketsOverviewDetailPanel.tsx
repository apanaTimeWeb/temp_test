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

  const tRef = useRef(t);
  tRef.current = t;
  const requestClose = useCallback(async () => {
    if (isDirtyRef.current && !await confirm(tRef.current('COPY.UNSAVED_CHANGES_WARNING'))) return;
    onClose();
  }, [confirm, onClose]);

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
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex justify-center items-start p-3 sm:p-5 pt-4 sm:pt-8 motion-safe:animate-in motion-safe:fade-in motion-reduce:animate-none"
      style={{ padding: "max(24px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(24px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left))" }}
      onClick={requestClose}
      data-testid="superadmin-superadmin-support-tickets-overview-detail-panel-div-line-72"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="superadmin-support-ticket-detail-title"
        className="bg-[#0a0e27] border border-indigo-500/30 rounded-2xl shadow-2xl shadow-indigo-950/80 w-full max-w-3xl flex flex-col overflow-hidden text-slate-100 my-auto sm:my-4"
        style={{ maxHeight: "calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 48px)" }}
        onClick={(e) => e.stopPropagation()}
        data-testid="superadmin-superadmin-support-tickets-overview-detail-panel-div-line-73"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-indigo-500/25 flex items-start justify-between bg-gradient-to-r from-[#10173b] via-[#0d1330] to-[#0a0e27]">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-500/15 px-2.5 py-1 rounded-lg border border-indigo-500/30 shadow-xs">
                {tkt.id}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border shadow-xs ${
                  status === 'Resolved'
                    ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
                    : status === 'Open'
                    ? 'text-rose-300 bg-rose-500/15 border-rose-500/30'
                    : 'text-amber-300 bg-amber-500/15 border-amber-500/30'
                }`}
              >
                {status === 'Open' ? t('COPY.STATUS_OPEN') : status === 'In-Progress' ? t('COPY.STATUS_IN_PROGRESS') : t('COPY.STATUS_RESOLVED')}
              </span>
              {tkt.slaBreach && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full text-rose-300 bg-rose-500/15 border border-rose-500/30 motion-safe:animate-pulse shadow-xs">
                  <Flag size={11} className="text-rose-400" /> {t("COPY.SLA_BREACH")}
                </span>
              )}
            </div>
            <h2 id="superadmin-support-ticket-detail-title" className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight">
              {tkt.subject}
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <User size={13} className="text-indigo-400" /> {tkt.tenant} {tkt.contact ? `(${tkt.contact})` : ''}
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-400">
                <Clock size={13} className="text-indigo-400" /> {t("COPY.OPENED")} {tkt.age} {t("COPY.AGO")}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium text-[11px]">
                {getCategoryIcon(tkt.category)} {t(`COPY.CATEGORY_${String(tkt.category).toUpperCase()}` as 'COPY.CATEGORY_BILLING' | 'COPY.CATEGORY_BUG' | 'COPY.CATEGORY_ACCOUNT' | 'COPY.CATEGORY_GENERAL' | 'COPY.CATEGORY_SUPPORT')}
              </span>
            </div>
          </div>
          <button
            type="button"
            aria-label={t("COPY.CLOSE_TICKET_DETAILS")}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700/80 transition-all cursor-pointer"
            onClick={requestClose}
            data-testid="superadmin-support-tickets-support-tickets-detail-close-ticket-details-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Quick Actions & Meta */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-indigo-500/20 shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                  <User size={12} className="text-indigo-400" />
                  <span>{t("COPY.ASSIGNEE")}</span>
                </p>
                <div className="relative">
                  <select
                    aria-label={t("COPY.TICKET_ASSIGNEE_LOCAL_PREVIEW_ONLY")}
                    className="w-full rounded-xl border border-indigo-500/30 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-200 outline-none hover:border-indigo-400 focus:border-indigo-400 transition-colors cursor-pointer shadow-xs"
                    value={assignee}
                    onChange={e => setAssignee(e.target.value)}
                    data-testid="superadmin-support-tickets-support-tickets-detail-ticket-assignee-local-preview-only-2"
                  >
                    {SUPERADMIN_SUPPORT_TICKETS_ASSIGNEE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {t(option === 'Unassigned' ? 'COPY.ASSIGNEE_UNASSIGNED' : option === 'Sample Agent A' ? 'COPY.ASSIGNEE_SAMPLE_AGENT_A' : 'COPY.ASSIGNEE_SAMPLE_AGENT_B')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                  <Flag size={12} className="text-amber-400" />
                  <span>{t("COPY.PRIORITY")}</span>
                </p>
                <div className="pt-1">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold border shadow-xs ${
                      tkt.priority === 'High'
                        ? 'text-rose-300 bg-rose-500/15 border-rose-500/30'
                        : tkt.priority === 'Medium'
                        ? 'text-amber-300 bg-amber-500/15 border-amber-500/30'
                        : 'text-slate-300 bg-slate-800/80 border-slate-700/80'
                    }`}
                  >
                    {t(tkt.priority === 'High' ? 'COPY.PRIORITY_HIGH' : tkt.priority === 'Medium' ? 'COPY.PRIORITY_MEDIUM' : 'COPY.PRIORITY_LOW')}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                  <Clock size={12} className="text-emerald-400" />
                  <span>{t("COPY.UPDATE_STATUS")}</span>
                </p>
                <div className="relative">
                  <select
                    aria-label={t("COPY.TICKET_STATUS_LOCAL_PREVIEW_ONLY")}
                    className="w-full rounded-xl border border-indigo-500/30 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-200 outline-none hover:border-indigo-400 focus:border-indigo-400 transition-colors cursor-pointer shadow-xs"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    data-testid="superadmin-support-tickets-support-tickets-detail-ticket-status-local-preview-only-3"
                  >
                    <option value="Open">{t("COPY.OPEN")}</option>
                    <option value="In-Progress">{t("COPY.IN_PROGRESS")}</option>
                    <option value="Resolved">{t("COPY.RESOLVED")}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-indigo-500/20 flex justify-end">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-950/40 transition-all cursor-pointer active:scale-95"
                onClick={() => {
                  onSave({ ...tkt, status, assignee });
                  setOperationMessage(t('COPY.LOCAL_PREVIEW_APPLIED_MESSAGE'));
                }}
                data-testid="superadmin-support-tickets-support-tickets-detail-apply-local-preview-changes-4"
              >
                <span>{t("COPY.APPLY_LOCAL_PREVIEW_CHANGES")}</span>
              </button>
            </div>
          </div>

          {/* Original Message */}
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-indigo-500/40 flex items-center justify-center shrink-0 shadow-xs">
              <span className="text-indigo-300 font-bold text-xs">{tkt.tenant.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold text-slate-200">{tkt.tenant}</span>
                <span className="text-[11px] text-slate-400">• {tkt.age} {t("COPY.AGO")}</span>
              </div>
              <div className="bg-slate-900/80 border border-indigo-500/25 rounded-2xl rounded-tl-sm p-4 text-xs sm:text-sm text-slate-200 leading-relaxed shadow-sm">
                <p>{tkt.desc}</p>
                {tkt.hasAttachment && (
                  <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs">
                    <Paperclip size={13} className="text-indigo-400 shrink-0" />
                    <span className="font-medium truncate">{t("COPY.SAMPLE_ATTACHMENT_ERROR_SCREENSHOT_PNG_DOWNLOAD_UNAVAILABLE")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Thread (Mock reply if replies > 1) */}
          {tkt.replies > 1 && (
            <div className="flex items-start gap-3.5 flex-row-reverse">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-xs">
                <span className="text-emerald-300 font-bold text-xs">{t("COPY.S")}</span>
              </div>
              <div className="flex-1 min-w-0 flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-emerald-300">{t("COPY.SUPPORT_AGENT")}</span>
                  <span className="text-[11px] text-slate-400">• {tkt.age} {t("COPY.AGO")}</span>
                </div>
                <div className="bg-emerald-950/25 border border-emerald-500/25 rounded-2xl rounded-tr-sm p-4 text-xs sm:text-sm text-slate-200 leading-relaxed shadow-sm text-right">
                  <p>{t("COPY.WE_ARE_LOOKING_INTO_THIS_ISSUE_RIGHT_NOW_COULD_YOU_PLEASE_CONFIRM_IF_THIS_HAPPENS_ON_MOBILE_APP_AS_WELL")}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reply Box */}
        <div className="p-5 sm:p-6 border-t border-indigo-500/25 bg-gradient-to-b from-[#0b0f2a] to-[#080b1e]">
          {operationMessage && (
            <p className="mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200 flex items-center gap-2" role="alert">
              <span>{operationMessage}</span>
            </p>
          )}
          <div className="flex items-center gap-2 mb-3">
            <button
              type="button" 
              aria-pressed={!isInternalNote}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs ${
                !isInternalNote ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              onClick={() => setIsInternalNote(false)}
              data-testid="superadmin-support-tickets-support-tickets-detail-public-reply-5"
            >
              {t("COPY.PUBLIC_REPLY")}
            </button>
            <button
              type="button" 
              aria-pressed={isInternalNote}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs ${
                isInternalNote ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              onClick={() => setIsInternalNote(true)}
              data-testid="superadmin-support-tickets-support-tickets-detail-internal-note-hidden-6"
            >
              {t("COPY.INTERNAL_NOTE_HIDDEN")}
            </button>
          </div>
          
          <div className={`relative rounded-2xl border ${isInternalNote ? 'border-amber-500/30 bg-amber-950/20 text-amber-200' : 'border-indigo-500/30 bg-slate-950 text-slate-100'} p-3 shadow-inner`}>
            <label htmlFor="superadmin-support-ticket-reply-text" className="sr-only">
              {isInternalNote ? t('COPY.INTERNAL_NOTE_TEXT') : t('COPY.PUBLIC_REPLY_TEXT')}
            </label>
            <textarea
              id="superadmin-support-ticket-reply-text"
              maxLength={5000}
              rows={3}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder:text-slate-400 outline-none resize-none min-h-[75px]"
              placeholder={isInternalNote ? t('COPY.TYPE_PRIVATE_NOTE_PLACEHOLDER') : t('COPY.TYPE_REPLY_TO_TENANT_PLACEHOLDER')}
              value={replyText}
              onChange={e => { setReplyText(e.target.value); setOperationMessage(''); }}
              data-testid="superadmin-support-tickets-support-tickets-detail-superadmin-support-ticket-reply-text-7"
            />
            <div className="flex items-center justify-between pt-2 border-t border-indigo-500/15 mt-2">
              <button
                type="button"
                disabled
                aria-label={t("COPY.ATTACH_FILE_UNAVAILABLE")}
                title={t("COPY.UNAVAILABLE_ATTACHMENT_UPLOAD_IS_NOT_IMPLEMENTED_IN_THE_SUPPLIED_HOST_API_CONTRACT")}
                className="text-slate-400 opacity-60 p-1.5 rounded-lg hover:bg-slate-800 cursor-not-allowed"
                data-testid="superadmin-support-tickets-support-tickets-detail-attach-file-unavailable-8"
              >
                <Paperclip size={15} />
              </button>
              
              <button
                type="button" 
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  isInternalNote ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white'
                }`}
                onClick={handleSendReply}
                disabled={!replyText.trim()}
                data-testid="superadmin-support-tickets-support-tickets-detail-add-note-9"
              >
                <Send size={13} />
                <span>{isInternalNote ? t('COPY.ADD_NOTE') : t('COPY.SEND_REPLY')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
