'use client';

import { useSuperadminSupportTicketsOverviewConfirm } from '@/app/frontend_superadmin/superadmin_support/support_tickets/hooks/useSuperadminSupportTicketsOverviewConfirm';
/** Responsibility: Superadmin Support Tickets Detail Panel; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSupportTicketsOverviewDetailPanel formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Clock,
  X,
  Send,
  Paperclip,
  User,
  HelpCircle,
  Bug,
  CreditCard,
  Lock,
  Flag,
  Check,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
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
      className="fixed inset-0 z-[70] overflow-y-auto bg-black/80 backdrop-blur-md flex justify-center items-start px-3 sm:px-6 motion-safe:animate-in motion-safe:fade-in motion-reduce:animate-none"
      style={{
        paddingTop: 'calc(var(--layout-header-height, 64px) + 20px)',
        paddingBottom: '32px',
      }}
      onClick={requestClose}
      data-testid="superadmin-superadmin-support-tickets-overview-detail-panel-div-line-72"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="superadmin-support-ticket-detail-title"
        className="bg-[#0b0f24] border border-indigo-500/30 rounded-2xl shadow-2xl shadow-black/80 w-full max-w-4xl flex flex-col overflow-hidden text-slate-100 my-auto"
        style={{ maxHeight: 'calc(100dvh - 120px)' }}
        onClick={(e) => e.stopPropagation()}
        data-testid="superadmin-superadmin-support-tickets-overview-detail-panel-div-line-73"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-indigo-500/20 bg-gradient-to-r from-[#11173d] via-[#0d1330] to-[#0b0f24] flex items-start justify-between gap-4">
          <div className="space-y-2.5 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-500/15 px-2.5 py-1 rounded-lg border border-indigo-500/30 shadow-xs">
                {tkt.id}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border shadow-xs ${
                  status === 'Resolved'
                    ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
                    : status === 'Open'
                    ? 'text-rose-300 bg-rose-500/15 border-rose-500/30'
                    : 'text-amber-300 bg-amber-500/15 border-amber-500/30'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${status === 'Resolved' ? 'bg-emerald-400' : status === 'Open' ? 'bg-rose-400' : 'bg-amber-400 animate-pulse'}`} />
                {status === 'Open' ? t('COPY.STATUS_OPEN') : status === 'In-Progress' ? t('COPY.STATUS_IN_PROGRESS') : t('COPY.STATUS_RESOLVED')}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border shadow-xs ${
                  tkt.priority === 'High'
                    ? 'text-rose-300 bg-rose-500/15 border-rose-500/30'
                    : tkt.priority === 'Medium'
                    ? 'text-amber-300 bg-amber-500/15 border-amber-500/30'
                    : 'text-slate-300 bg-slate-800/80 border-slate-700/80'
                }`}
              >
                <Flag size={11} className={tkt.priority === 'High' ? 'text-rose-400' : tkt.priority === 'Medium' ? 'text-amber-400' : 'text-slate-400'} />
                {t(tkt.priority === 'High' ? 'COPY.PRIORITY_HIGH' : tkt.priority === 'Medium' ? 'COPY.PRIORITY_MEDIUM' : 'COPY.PRIORITY_LOW')}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium text-xs">
                {getCategoryIcon(tkt.category)} {t(`COPY.CATEGORY_${String(tkt.category).toUpperCase()}` as 'COPY.CATEGORY_BILLING' | 'COPY.CATEGORY_BUG' | 'COPY.CATEGORY_ACCOUNT' | 'COPY.CATEGORY_GENERAL' | 'COPY.CATEGORY_SUPPORT')}
              </span>
              {tkt.slaBreach && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full text-rose-300 bg-rose-500/15 border border-rose-500/30 motion-safe:animate-pulse shadow-xs">
                  <Flag size={11} className="text-rose-400" /> {t("COPY.SLA_BREACH")}
                </span>
              )}
            </div>

            <h2 id="superadmin-support-ticket-detail-title" className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight leading-snug">
              {tkt.subject}
            </h2>

            <div className="flex items-center gap-3 sm:gap-4 text-xs text-slate-400 flex-wrap pt-0.5">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <User size={13} className="text-indigo-400 shrink-0" />
                <span className="text-slate-400">Tenant:</span>
                <strong className="text-slate-200">{tkt.tenant}</strong>
                {tkt.contact && <span className="text-slate-400">({tkt.contact})</span>}
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 font-medium text-slate-400">
                <Clock size={13} className="text-indigo-400 shrink-0" />
                <span>{t("COPY.OPENED")} {tkt.age} {t("COPY.AGO")}</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            aria-label={t("COPY.CLOSE_TICKET_DETAILS")}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700/80 transition-all cursor-pointer shrink-0"
            onClick={requestClose}
            data-testid="superadmin-support-tickets-support-tickets-detail-close-ticket-details-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Controls Bar (Responsive 3-column toolbar: satisfying contract) */}
        <div className="px-5 sm:px-6 py-3 bg-[#080c21]/90 border-b border-indigo-500/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-center">
            {/* Column 1: Assignee */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold shrink-0 flex items-center gap-1">
                <User size={12} className="text-indigo-400" />
                <span>{t("COPY.ASSIGNEE")}:</span>
              </span>
              <select
                aria-label={t("COPY.TICKET_ASSIGNEE_LOCAL_PREVIEW_ONLY")}
                className="flex-1 rounded-xl border border-indigo-500/30 bg-[#0a0f2c] px-3 py-1.5 text-xs font-semibold text-slate-200 outline-none hover:border-indigo-400 focus:border-indigo-400 transition-colors cursor-pointer shadow-xs"
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

            {/* Column 2: Status */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold shrink-0 flex items-center gap-1">
                <Clock size={12} className="text-emerald-400" />
                <span>{t("COPY.UPDATE_STATUS")}:</span>
              </span>
              <select
                aria-label={t("COPY.TICKET_STATUS_LOCAL_PREVIEW_ONLY")}
                className="flex-1 rounded-xl border border-indigo-500/30 bg-[#0a0f2c] px-3 py-1.5 text-xs font-semibold text-slate-200 outline-none hover:border-indigo-400 focus:border-indigo-400 transition-colors cursor-pointer shadow-xs"
                value={status}
                onChange={e => setStatus(e.target.value as 'Open' | 'In-Progress' | 'Resolved')}
                data-testid="superadmin-support-tickets-support-tickets-detail-ticket-status-local-preview-only-3"
              >
                <option value="Open">{t("COPY.OPEN")}</option>
                <option value="In-Progress">{t("COPY.IN_PROGRESS")}</option>
                <option value="Resolved">{t("COPY.RESOLVED")}</option>
              </select>
            </div>

            {/* Column 3: Save button */}
            <div className="flex items-center justify-end sm:justify-start lg:justify-end gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-950/40 transition-all cursor-pointer active:scale-95"
                onClick={() => {
                  onSave({ ...tkt, status, assignee });
                  setOperationMessage(t('COPY.LOCAL_PREVIEW_APPLIED_MESSAGE'));
                }}
                data-testid="superadmin-support-tickets-support-tickets-detail-apply-local-preview-changes-4"
              >
                <Check size={13} />
                <span>{t("COPY.APPLY_LOCAL_PREVIEW_CHANGES")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Body: Dedicated Chat & Conversation Thread */}
        <div className="flex-1 overflow-hidden flex flex-col p-5 sm:p-6 bg-[#070a1e]/60 min-h-0">
          {/* Section Banner */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-indigo-500/15 shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare size={14} className="text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Conversation Thread</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                {tkt.replies > 1 ? '2 messages' : '1 message'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-400" /> SaaS Support Helpdesk Thread
            </span>
          </div>

          {/* Scrollable Chat Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2" style={{ maxHeight: '340px' }}>
            {/* Tenant Inbound Query Message */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-indigo-500/40 flex items-center justify-center shrink-0 shadow-sm text-indigo-300 font-bold text-xs">
                {tkt.tenant.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-200">{tkt.tenant}</span>
                    <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      Tenant Admin
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium shrink-0">
                    {tkt.age} {t("COPY.AGO")}
                  </span>
                </div>
                
                <div className="bg-[#0e1538] border border-indigo-500/25 rounded-2xl rounded-tl-sm p-4 text-xs sm:text-sm text-slate-200 leading-relaxed shadow-sm space-y-3">
                  <p>{tkt.desc}</p>
                  
                  {tkt.hasAttachment && (
                    <div className="pt-2 border-t border-indigo-500/15">
                      <div className="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-200 text-xs hover:bg-indigo-500/15 transition-colors">
                        <Paperclip size={14} className="text-indigo-400 shrink-0" />
                        <span className="font-medium truncate max-w-xs">{t("COPY.SAMPLE_ATTACHMENT_ERROR_SCREENSHOT_PNG_DOWNLOAD_UNAVAILABLE")}</span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">1.4 MB</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Support Agent Outbound Reply */}
            {tkt.replies > 1 && (
              <div className="flex items-start gap-3.5 flex-row-reverse">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-sm text-emerald-300 font-bold text-xs">
                  {t("COPY.S")}
                </div>
                <div className="flex-1 min-w-0 flex flex-col items-end">
                  <div className="flex items-center justify-between w-full mb-1.5 flex-row-reverse">
                    <div className="flex items-center gap-2 flex-wrap flex-row-reverse">
                      <span className="text-xs font-bold text-emerald-300">{t("COPY.SUPPORT_AGENT")}</span>
                      <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        Staff Responder
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium shrink-0">
                      {tkt.age} {t("COPY.AGO")}
                    </span>
                  </div>
                  <div className="bg-[#082218]/90 border border-emerald-500/30 rounded-2xl rounded-tr-sm p-4 text-xs sm:text-sm text-slate-100 leading-relaxed shadow-sm w-full">
                    <p>{t("COPY.WE_ARE_LOOKING_INTO_THIS_ISSUE_RIGHT_NOW_COULD_YOU_PLEASE_CONFIRM_IF_THIS_HAPPENS_ON_MOBILE_APP_AS_WELL")}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reply / Note Composer (Pinned at Bottom) */}
        <div className="p-4 sm:p-5 border-t border-indigo-500/25 bg-gradient-to-b from-[#0b0f2a] to-[#080b1e] shrink-0">
          {operationMessage && (
            <div className="mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200 flex items-center gap-2" role="alert">
              <span>{operationMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-indigo-500/20">
              <button
                type="button" 
                aria-pressed={!isInternalNote}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  !isInternalNote ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                onClick={() => setIsInternalNote(false)}
                data-testid="superadmin-support-tickets-support-tickets-detail-public-reply-5"
              >
                <Send size={12} />
                <span>{t("COPY.PUBLIC_REPLY")}</span>
              </button>
              <button
                type="button" 
                aria-pressed={isInternalNote}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  isInternalNote ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                onClick={() => setIsInternalNote(true)}
                data-testid="superadmin-support-tickets-support-tickets-detail-internal-note-hidden-6"
              >
                <Lock size={12} />
                <span>{t("COPY.INTERNAL_NOTE_HIDDEN")}</span>
              </button>
            </div>

            <span className="text-[11px] text-slate-400 hidden sm:inline">
              {isInternalNote ? '🔒 Visible only to platform team' : '✉️ Visible to tenant admin'}
            </span>
          </div>
          
          <div className={`relative rounded-xl border transition-colors ${isInternalNote ? 'border-amber-500/40 bg-amber-950/20 text-amber-200' : 'border-indigo-500/30 bg-[#070b22] text-slate-100'} p-3 shadow-inner`}>
            <label htmlFor="superadmin-support-ticket-reply-text" className="sr-only">
              {isInternalNote ? t('COPY.INTERNAL_NOTE_TEXT') : t('COPY.PUBLIC_REPLY_TEXT')}
            </label>
            <textarea
              id="superadmin-support-ticket-reply-text"
              maxLength={5000}
              rows={3}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 outline-none resize-none min-h-[65px]"
              placeholder={isInternalNote ? t('COPY.TYPE_PRIVATE_NOTE_PLACEHOLDER') : t('COPY.TYPE_REPLY_TO_TENANT_PLACEHOLDER')}
              value={replyText}
              onChange={e => { setReplyText(e.target.value); setOperationMessage(''); }}
              data-testid="superadmin-support-tickets-support-tickets-detail-superadmin-support-ticket-reply-text-7"
            />
            <div className="flex items-center justify-between pt-2 border-t border-indigo-500/15 mt-1.5">
              <button
                type="button"
                disabled
                aria-label={t("COPY.ATTACH_FILE_UNAVAILABLE")}
                title={t("COPY.UNAVAILABLE_ATTACHMENT_UPLOAD_IS_NOT_IMPLEMENTED_IN_THE_SUPPLIED_HOST_API_CONTRACT")}
                className="text-slate-500 opacity-60 p-1.5 rounded-lg hover:bg-slate-800 cursor-not-allowed flex items-center gap-1 text-xs"
                data-testid="superadmin-support-tickets-support-tickets-detail-attach-file-unavailable-8"
              >
                <Paperclip size={14} />
                <span className="text-[11px] hidden sm:inline">Attach file</span>
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
