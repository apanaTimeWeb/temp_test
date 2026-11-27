'use client';

import React from 'react';
import {
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Key,
  Lock,
  RotateCcw,
  ShieldCheck,
  Timer,
  User,
  X,
  Zap,
} from 'lucide-react';
import type {
  SuperadminSupportTicket,
  SuperadminSupportTicketPriority,
  SuperadminSupportTicketStatus,
  SuperadminSupportTimeLimitedAccess,
} from '@/app/frontend_superadmin/superadmin_support/support_tickets/types/SuperadminSupportTicketsOverviewTypes';
import { SUPERADMIN_SUPPORT_TICKETS_ASSIGNEE_OPTIONS } from '@/app/frontend_superadmin/superadmin_support/support_tickets/constants/SuperadminSupportTicketsOverviewConstants';
import { SuperadminSupportTicketsCategoryIcon } from '@/app/frontend_superadmin/superadmin_support/support_tickets/components/SuperadminSupportTicketsCategoryIcon';

interface SuperadminSupportTicketsDetailHeaderProps {
  tkt: SuperadminSupportTicket;
  status: SuperadminSupportTicketStatus;
  setStatus: (status: SuperadminSupportTicketStatus) => void;
  priority: SuperadminSupportTicketPriority;
  setPriority: (prio: SuperadminSupportTicketPriority) => void;
  assignee: string;
  setAssignee: (assignee: string) => void;
  timeLimitedAccess: SuperadminSupportTimeLimitedAccess;
  onOpenEscalate: () => void;
  onOpenResolve: () => void;
  onOpenReopen: () => void;
  onOpenGrantAccess: () => void;
  onRevokeAccess: () => void;
  onClose: () => void;
  onSavePreview: () => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}

export default function SuperadminSupportTicketsDetailHeader({
  tkt,
  status,
  setStatus,
  priority,
  setPriority,
  assignee,
  setAssignee,
  timeLimitedAccess,
  onOpenEscalate,
  onOpenResolve,
  onOpenReopen,
  onOpenGrantAccess,
  onRevokeAccess,
  onClose,
  onSavePreview,
  t,
}: SuperadminSupportTicketsDetailHeaderProps) {
  return (
    <>
      {/* Header - Compact & Sleek Top Bar (Fixed) */}
      <div className="p-3.5 sm:p-4 border-b border-indigo-500/20 bg-gradient-to-r from-[#11173d] via-[#0d1330] to-[#0a0e27] shrink-0 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded-lg border border-indigo-500/30 shadow-xs">
              {tkt.id}
            </span>

            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border shadow-xs ${
                status === 'Resolved'
                  ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
                  : status === 'Escalated'
                  ? 'text-red-300 bg-red-500/20 border-red-500/40 motion-safe:animate-pulse'
                  : status === 'Reopened'
                  ? 'text-purple-300 bg-purple-500/20 border-purple-500/40'
                  : status === 'Open'
                  ? 'text-rose-300 bg-rose-500/15 border-rose-500/30'
                  : 'text-amber-300 bg-amber-500/15 border-amber-500/30'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status === 'Resolved' ? 'bg-emerald-400' : status === 'Escalated' ? 'bg-red-400' : status === 'Open' ? 'bg-rose-400' : 'bg-amber-400 motion-safe:animate-pulse'}`} />
              {status}
            </span>

            <select
              aria-label={t('COPY.PRIORITY')}
              value={priority}
              onChange={(e) => setPriority(e.target.value as SuperadminSupportTicketPriority)}
              className={`text-xs font-bold px-2 py-0.5 rounded-full border shadow-xs bg-slate-900 cursor-pointer outline-none ${
                priority === 'Urgent'
                  ? 'text-red-300 border-red-500/40'
                  : priority === 'High'
                  ? 'text-rose-300 border-rose-500/30'
                  : priority === 'Medium'
                  ? 'text-amber-300 border-amber-500/30'
                  : 'text-slate-300 border-slate-700/80'
              }`}
            >
              <option value="Urgent">Urgent Priority</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium text-xs">
              <SuperadminSupportTicketsCategoryIcon category={tkt.category} />
              <span>{tkt.category}</span>
            </span>

            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border shadow-xs ${
                tkt.slaBreach ? 'text-rose-300 bg-rose-500/15 border-rose-500/30 motion-safe:animate-pulse' : 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25'
              }`}
            >
              <Timer size={12} className={tkt.slaBreach ? 'text-rose-400' : 'text-emerald-400'} />
              <span>{tkt.slaBreach ? 'SLA Breached' : `SLA: ${tkt.slaTargetHours || 4}h (${tkt.slaRemaining || 'On Track'})`}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {status !== 'Resolved' && status !== 'Closed' && (
              <button
                type="button"
                onClick={onOpenEscalate}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-red-500/40 bg-red-500/15 hover:bg-red-500/25 text-red-300 text-xs font-bold motion-safe:transition-all shadow-xs cursor-pointer active:scale-[0.97]"
                title={t('COPY.ESCALATE_TICKET')}
              >
                <Zap size={12} className="text-red-400" />
                <span className="hidden sm:inline">{t('COPY.ESCALATE_TICKET')}</span>
              </button>
            )}

            {status === 'Resolved' || status === 'Closed' ? (
              <button
                type="button"
                onClick={onOpenReopen}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-purple-500/40 bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-xs font-bold motion-safe:transition-all shadow-xs cursor-pointer active:scale-[0.97]"
                title={t('COPY.REOPEN_TICKET')}
              >
                <RotateCcw size={12} className="text-purple-400" />
                <span>{t('COPY.REOPEN_TICKET')}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenResolve}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-bold motion-safe:transition-all shadow-xs cursor-pointer active:scale-[0.97]"
                title={t('COPY.RESOLVE_TICKET')}
              >
                <CheckCircle2 size={12} className="text-emerald-400" />
                <span>{t('COPY.RESOLVE_TICKET')}</span>
              </button>
            )}

            <button
              type="button"
              aria-label={t('COPY.CLOSE_TICKET_DETAILS')}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer"
              onClick={onClose}
              data-testid="superadmin-support-tickets-support-tickets-detail-close-ticket-details-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Title & Tenant Metadata Row */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pt-0.5">
          <h2 id="superadmin-support-ticket-detail-title" className="text-base sm:text-lg font-bold text-slate-100 tracking-tight leading-snug truncate" title={tkt.subject}>
            {tkt.subject}
          </h2>
          <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
            <span className="flex items-center gap-1 font-medium text-slate-300">
              <Building2 size={12} className="text-indigo-400" />
              <strong>{tkt.tenant}</strong>
              {tkt.contact && <span className="text-slate-400">({tkt.contact})</span>}
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock size={12} className="text-indigo-400" />
              <span>{t('COPY.OPENED')} {tkt.age} {t('COPY.AGO')}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Quick Controls & Privacy Shield Toolbar */}
      <div className="px-3.5 sm:px-4 py-2 bg-[#080c21] border-b border-indigo-500/20 shrink-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 items-center">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold shrink-0 flex items-center gap-1">
              <User size={12} className="text-indigo-400" />
              <span>{t('COPY.ASSIGNEE')}:</span>
            </span>
            <select
              aria-label={t('COPY.TICKET_ASSIGNEE_LOCAL_PREVIEW_ONLY')}
              className="flex-1 rounded-xl border border-indigo-500/30 bg-[#0a0f2c] px-2.5 py-1 text-xs font-semibold text-slate-200 outline-none hover:border-indigo-400 focus:border-indigo-400 transition-colors cursor-pointer shadow-xs"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              data-testid="superadmin-support-tickets-support-tickets-detail-ticket-assignee-local-preview-only-2"
            >
              {SUPERADMIN_SUPPORT_TICKETS_ASSIGNEE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold shrink-0 flex items-center gap-1">
              <Clock size={12} className="text-emerald-400" />
              <span>{t('COPY.UPDATE_STATUS')}:</span>
            </span>
            <select
              aria-label={t('COPY.TICKET_STATUS_LOCAL_PREVIEW_ONLY')}
              className="flex-1 rounded-xl border border-indigo-500/30 bg-[#0a0f2c] px-2.5 py-1 text-xs font-semibold text-slate-200 outline-none hover:border-indigo-400 focus:border-indigo-400 transition-colors cursor-pointer shadow-xs"
              value={status}
              onChange={(e) => setStatus(e.target.value as SuperadminSupportTicketStatus)}
              data-testid="superadmin-support-tickets-support-tickets-detail-ticket-status-local-preview-only-3"
            >
              <option value="Open">{t('COPY.OPEN')}</option>
              <option value="In-Progress">{t('COPY.IN_PROGRESS')}</option>
              <option value="Escalated">Escalated</option>
              <option value="Resolved">{t('COPY.RESOLVED')}</option>
              <option value="Closed">Closed</option>
              <option value="Reopened">Reopened</option>
            </select>
          </div>

          <div className="flex items-center justify-between sm:justify-start lg:justify-end gap-2">
            <div className="flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  timeLimitedAccess.hasActiveAccess
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                }`}
                title={timeLimitedAccess.hasActiveAccess ? `Elevated Access Active (${timeLimitedAccess.expiresAt})` : 'Zero-Trust Shield Enforced'}
              >
                <ShieldCheck size={11} className={timeLimitedAccess.hasActiveAccess ? 'text-emerald-400' : 'text-indigo-400'} />
                <span>{timeLimitedAccess.hasActiveAccess ? 'Elevated Active' : 'Privacy Shield'}</span>
              </span>
              {timeLimitedAccess.hasActiveAccess ? (
                <button
                  type="button"
                  onClick={onRevokeAccess}
                  className="p-1 rounded-lg border border-red-500/40 bg-red-500/15 hover:bg-red-500/25 text-red-300 text-[11px] font-bold cursor-pointer"
                  title={t('COPY.REVOKE_ACCESS')}
                >
                  <Lock size={11} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenGrantAccess}
                  className="p-1 rounded-lg border border-indigo-500/40 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 text-[11px] font-bold cursor-pointer"
                  title={t('COPY.TIME_LIMITED_ACCESS')}
                >
                  <Key size={11} className="text-indigo-400" />
                </button>
              )}
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-md shadow-indigo-950/40 motion-safe:transition-all cursor-pointer active:scale-[0.97] shrink-0"
              onClick={onSavePreview}
              data-testid="superadmin-support-tickets-support-tickets-detail-apply-local-preview-changes-4"
            >
              <Check size={13} />
              <span>{t('COPY.APPLY_LOCAL_PREVIEW_CHANGES')}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
