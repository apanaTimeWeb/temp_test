'use client';

import React, { useMemo } from 'react';
import type { SemanticColumnDef, SemanticCellParams } from '@/app/frontend_superadmin/superadmin_support/support_tickets/components/SuperadminSupportTicketsOverviewSemanticTable';
import type { SuperadminSupportTicket } from '@/app/frontend_superadmin/superadmin_support/support_tickets/types/SuperadminSupportTicketsOverviewTypes';
import { AlertTriangle, Clock, Eye, Mail, MessageSquare, Paperclip, Tag, User } from 'lucide-react';

function getSuperadminInteractiveTestIdSuffix(value: unknown): string {
  const record = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  for (const field of ['id', 'uuid', 'recordId', 'userId', 'assetId', 'libraryId', 'planId', 'subscriptionId', 'transactionId', 'invoiceId', 'refundId', 'requestId', 'ruleId', 'messageId', 'noticeId', 'complaintId', 'entryId', 'backupId', 'enquiryId', 'studentId', 'memberId', 'branchId', 'scheduleId', 'logId', 'smartId', 'receiptNumber', 'ticketId', 'lockerId', 'seatNo', 'code', 'slug', 'key', 'name']) {
    const candidate = record[field];
    if (typeof candidate === 'string' || typeof candidate === 'number') return String(candidate);
  }
  return 'missing-domain-id';
}

interface UseSupportTicketsColumnsParams {
  t: (key: string, values?: Record<string, string | number>) => string;
  setSelected: (ticket: SuperadminSupportTicket) => void;
  showToast: (msg: string) => void;
}

export function useSupportTicketsColumns({ t, setSelected, showToast }: UseSupportTicketsColumnsParams) {
  return useMemo<SemanticColumnDef<SuperadminSupportTicket>[]>(
    () => [
      {
        headerName: t('COPY.TABLE_COLUMN_SUBJECT_ID'),
        field: 'subject',
        flex: 2,
        minWidth: 200,
        cellRenderer: (p: SemanticCellParams<SuperadminSupportTicket>) => (
          <div className="py-1 min-w-0 max-w-[260px] 2xl:max-w-[340px]">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[11px] font-mono font-bold text-indigo-300 bg-indigo-500/15 px-1.5 py-0.5 rounded border border-indigo-500/30 shrink-0">
                {p.data?.id}
              </span>
              {p.data?.slaBreach && p.data?.status !== 'Resolved' && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0" title="SLA Breached">
                  <AlertTriangle size={10} className="mr-0.5 text-rose-400" /> SLA
                </span>
              )}
              <button
                type="button"
                className="text-xs sm:text-sm font-semibold text-slate-100 hover:text-indigo-300 transition-colors text-left truncate cursor-pointer block min-w-0 flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  if (p.data) setSelected(p.data);
                }}
                title={p.data?.subject}
                data-testid="superadmin-support_tickets-support_tickets-button-1"
              >
                {p.data?.subject}
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 font-medium truncate max-w-[150px]">
                <Tag size={10} className="text-indigo-400 shrink-0" />
                <span className="truncate">{p.data?.category}</span>
              </span>
              {p.data?.hasAttachment && (
                <span className="inline-flex items-center text-slate-400 shrink-0" title="Has Attachment">
                  <Paperclip size={10} />
                </span>
              )}
            </div>
          </div>
        ),
      },
      {
        headerName: t('COPY.TABLE_COLUMN_TENANT'),
        field: 'tenant',
        flex: 1.2,
        minWidth: 130,
        cellRenderer: (p: SemanticCellParams<SuperadminSupportTicket>) => (
          <div className="flex items-center gap-2 min-w-0 max-w-[150px]">
            <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-300 shrink-0">
              {String(p.value ?? '').charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-100 truncate" title={String(p.value ?? '')}>
                {p.value}
              </p>
              {p.data?.contact && (
                <p className="text-[11px] text-slate-400 truncate flex items-center gap-1" title={p.data.contact}>
                  <User size={10} className="text-slate-500 shrink-0" />
                  <span className="truncate">{p.data.contact}</span>
                </p>
              )}
            </div>
          </div>
        ),
      },
      {
        headerName: t('COPY.TABLE_COLUMN_ASSIGNEE'),
        field: 'assignee',
        flex: 0.9,
        minWidth: 110,
        cellRenderer: (p: SemanticCellParams<SuperadminSupportTicket>) => {
          const isUnassigned = p.value === 'Unassigned';
          const label = isUnassigned
            ? t('COPY.ASSIGNEE_UNASSIGNED')
            : p.value === 'Sample Agent A'
            ? t('COPY.ASSIGNEE_SAMPLE_AGENT_A')
            : t('COPY.ASSIGNEE_SAMPLE_AGENT_B');
          return (
            <div className="flex items-center gap-1.5 min-w-0 max-w-[120px]" title={label}>
              <span className={`w-1.5 h-1.5 rounded-full ${isUnassigned ? 'bg-amber-400 motion-safe:animate-pulse' : 'bg-emerald-400'} shrink-0`} />
              <span className={`text-xs font-medium truncate ${isUnassigned ? 'text-amber-300/80 italic' : 'text-slate-200'}`}>
                {label}
              </span>
            </div>
          );
        },
      },
      {
        headerName: t('COPY.TABLE_COLUMN_STATUS'),
        field: 'status',
        flex: 0.8,
        minWidth: 95,
        cellClass: 'text-center',
        cellRenderer: (p: SemanticCellParams<SuperadminSupportTicket>) => {
          const val = p.value;
          const style =
            val === 'Resolved'
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              : val === 'Escalated'
              ? 'bg-red-500/20 text-red-300 border-red-500/40 motion-safe:animate-pulse'
              : val === 'Reopened'
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
              : val === 'Open'
              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
              : 'bg-amber-500/15 text-amber-300 border-amber-500/30';
          return (
            <div className="flex justify-center">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${style}`}>
                {val === 'Open' ? t('COPY.STATUS_OPEN') : val === 'In-Progress' ? t('COPY.STATUS_IN_PROGRESS') : val === 'Resolved' ? t('COPY.STATUS_RESOLVED') : val}
              </span>
            </div>
          );
        },
      },
      {
        headerName: t('COPY.TABLE_COLUMN_PRIORITY'),
        field: 'priority',
        flex: 0.7,
        minWidth: 85,
        cellClass: 'text-center',
        cellRenderer: (p: SemanticCellParams<SuperadminSupportTicket>) => {
          const prio = p.data?.priority;
          const style =
            prio === 'Urgent'
              ? 'bg-red-500/25 text-red-300 border-red-500/50'
              : prio === 'High'
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              : prio === 'Medium'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              : 'bg-slate-500/20 text-slate-300 border-slate-500/30';
          return (
            <div className="flex justify-center">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${style}`}>
                {prio === 'Urgent' ? t('COPY.PRIORITY_URGENT') : prio === 'High' ? t('COPY.PRIORITY_HIGH') : prio === 'Medium' ? t('COPY.PRIORITY_MEDIUM') : t('COPY.PRIORITY_LOW')}
              </span>
            </div>
          );
        },
      },
      {
        headerName: t('COPY.TABLE_COLUMN_AGE'),
        field: 'age',
        flex: 0.6,
        minWidth: 70,
        cellClass: 'text-center',
        cellRenderer: (p: SemanticCellParams<SuperadminSupportTicket>) => (
          <div className="flex items-center justify-center gap-1 text-xs text-slate-400 font-medium whitespace-nowrap">
            <Clock size={11} className="text-slate-500 shrink-0" />
            <span>{p.value}</span>
          </div>
        ),
      },
      {
        headerName: 'Actions',
        field: 'actions',
        flex: 1.1,
        minWidth: 125,
        sortable: false,
        filter: false,
        cellClass: 'text-right',
        cellRenderer: (p: SemanticCellParams<SuperadminSupportTicket>) => {
          if (!p.data) return null;
          const tkt = p.data;
          const testIdSuffix = getSuperadminInteractiveTestIdSuffix(p.data);
          const rawPhone = tkt.phone || '9876543210';
          let digits = rawPhone.replace(/\D/g, '');
          if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
          const waPhone = digits.length === 10 ? `91${digits}` : digits;
          const waMsg = `Hello ${tkt.contact || tkt.tenant}, regarding your Support Ticket ${tkt.id} ("${tkt.subject}") on Smart Library SaaS.`;

          return (
            <div className="flex items-center justify-end gap-1 flex-nowrap whitespace-nowrap">
              <button
                type="button"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/35 text-indigo-300 hover:bg-indigo-600/30 hover:border-indigo-400 hover:text-white text-xs font-semibold motion-safe:transition-all motion-safe:duration-150 cursor-pointer shadow-xs shrink-0 whitespace-nowrap active:scale-[0.97] group"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(tkt);
                }}
                aria-label={t('COPY.OPEN_TICKET_ARIA_LABEL', { id: tkt.id ?? t('COPY.UNKNOWN') })}
                title={t('COPY.OPEN_TICKET')}
                data-testid={`superadmin-support-tickets-support-tickets-overview-open-ticket-aria-label-1-${testIdSuffix}`}
              >
                <Eye size={12} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                <span>View</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const popup = window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(waMsg)}`, '_blank', 'noopener,noreferrer');
                  if (popup) popup.opener = null;
                  showToast(`Opened WhatsApp for Ticket ${tkt.id}`);
                }}
                className="inline-flex h-6 w-6 items-center justify-center rounded-lg border border-emerald-500/35 bg-emerald-500/15 text-emerald-300 hover:text-white hover:bg-emerald-600/30 hover:border-emerald-400 motion-safe:transition-all motion-safe:duration-150 shadow-xs cursor-pointer shrink-0 active:scale-[0.97]"
                title={`WhatsApp reply to ${tkt.tenant}`}
                aria-label={`WhatsApp for ticket ${tkt.id}`}
              >
                <MessageSquare size={11} className="text-emerald-400" />
              </button>

              {tkt.email && (
                <a
                  href={`mailto:${tkt.email}?subject=${encodeURIComponent(`[Ticket ${tkt.id}] ${tkt.subject}`)}&body=${encodeURIComponent(`Dear ${tkt.contact || tkt.tenant},\n\nRegarding your ticket "${tkt.subject}" (${tkt.id}):\n\n`)}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-lg border border-purple-500/35 bg-purple-500/15 text-purple-300 hover:text-white hover:bg-purple-600/30 hover:border-purple-400 motion-safe:transition-all motion-safe:duration-150 shadow-xs cursor-pointer shrink-0 active:scale-[0.97]"
                  title={`Email reply to ${tkt.tenant}`}
                  aria-label={`Email for ticket ${tkt.id}`}
                >
                  <Mail size={11} className="text-purple-400" />
                </a>
              )}
            </div>
          );
        },
      },
    ],
    [t, setSelected, showToast]
  );
}
